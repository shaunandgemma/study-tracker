import {
  LEARNER_PROGRESS_TYPES,
  learnerItemProgressService
} from './learnerItemProgressService.js';
import { createEmptyTroubleshootingProgress } from '../features/troubleshooting/troubleshootingProgress.js';

const BLOCK_REASONS = Object.freeze({
  BROWSER_IMPORT_REQUIRED: 'browser_import_required',
  CONTENT_CONFLICT: 'content_conflict',
  INVALID_ACCOUNT_ROW: 'invalid_account_row'
});

const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
}

export function toTroubleshootingProgressData(progress = {}) {
  const normalized = { ...createEmptyTroubleshootingProgress(), ...progress };
  return {
    observations: String(normalized.observations || ''),
    hypothesis: String(normalized.hypothesis || ''),
    actions: String(normalized.actions || ''),
    pinned_evidence_ids: Array.isArray(normalized.pinnedEvidence)
      ? normalized.pinnedEvidence.filter(value => typeof value === 'string')
      : [],
    revealed_hints: Number.isInteger(normalized.revealedHints) && normalized.revealedHints >= 0
      ? normalized.revealedHints
      : 0,
    answers: isPlainObject(normalized.answers) ? normalized.answers : {},
    completed: normalized.completed === true,
    solution_revealed: normalized.solutionRevealed === true,
    score: typeof normalized.score === 'number' && Number.isFinite(normalized.score)
      ? normalized.score
      : null
  };
}

export function fromTroubleshootingProgressRow(row) {
  const data = row?.progress_data;
  if (!isPlainObject(data)) return null;
  if (
    typeof data.observations !== 'string'
    || typeof data.hypothesis !== 'string'
    || typeof data.actions !== 'string'
    || !Array.isArray(data.pinned_evidence_ids)
    || data.pinned_evidence_ids.some(value => typeof value !== 'string')
    || !Number.isInteger(data.revealed_hints)
    || data.revealed_hints < 0
    || !isPlainObject(data.answers)
    || typeof data.completed !== 'boolean'
    || typeof data.solution_revealed !== 'boolean'
    || (data.score !== null && (
      typeof data.score !== 'number'
      || !Number.isFinite(data.score)
      || data.score < 0
      || data.score > 100
    ))
  ) return null;

  return {
    observations: data.observations,
    hypothesis: data.hypothesis,
    actions: data.actions,
    pinnedEvidence: [...data.pinned_evidence_ids],
    revealedHints: data.revealed_hints,
    answers: structuredClone(data.answers),
    completed: data.completed,
    solutionRevealed: data.solution_revealed,
    score: data.score,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null
  };
}

export function hasMeaningfulTroubleshootingProgress(progress) {
  if (!progress) return false;
  const data = toTroubleshootingProgressData(progress);
  return Boolean(
    data.observations.trim()
    || data.hypothesis.trim()
    || data.actions.trim()
    || data.pinned_evidence_ids.length
    || data.revealed_hints
    || Object.keys(data.answers).length
    || data.completed
    || data.solution_revealed
    || data.score !== null
  );
}

export function troubleshootingProgressMatches(left, right) {
  return JSON.stringify(canonicalize(toTroubleshootingProgressData(left)))
    === JSON.stringify(canonicalize(toTroubleshootingProgressData(right)));
}

export function reconcileTroubleshootingProgress({
  browserProgress = {},
  examId,
  challengeIds = [],
  rows = []
}) {
  const allowedChallengeIds = new Set(challengeIds);
  const progress = { ...browserProgress };
  const blocked = {};
  const accountChallengeIds = [];
  let loadedAccountRows = 0;
  let ignoredRows = 0;

  for (const row of Array.isArray(rows) ? rows : []) {
    if (
      row?.exam_id !== examId
      || row?.progress_type !== LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE
      || typeof row?.content_id !== 'string'
    ) continue;

    const challengeId = row.content_id;
    if (!allowedChallengeIds.has(challengeId)) {
      ignoredRows += 1;
      continue;
    }

    const accountProgress = fromTroubleshootingProgressRow(row);
    if (!accountProgress) {
      blocked[challengeId] = BLOCK_REASONS.INVALID_ACCOUNT_ROW;
      ignoredRows += 1;
      continue;
    }

    accountChallengeIds.push(challengeId);
    const browserEntry = browserProgress[challengeId];
    if (hasMeaningfulTroubleshootingProgress(browserEntry)) {
      if (!troubleshootingProgressMatches(browserEntry, accountProgress)) {
        blocked[challengeId] = BLOCK_REASONS.CONTENT_CONFLICT;
      }
      continue;
    }

    if (hasMeaningfulTroubleshootingProgress(accountProgress)) {
      progress[challengeId] = accountProgress;
      loadedAccountRows += 1;
    }
  }

  for (const challengeId of challengeIds) {
    if (
      hasMeaningfulTroubleshootingProgress(browserProgress[challengeId])
      && !accountChallengeIds.includes(challengeId)
    ) {
      blocked[challengeId] = BLOCK_REASONS.BROWSER_IMPORT_REQUIRED;
    }
  }

  return {
    progress,
    blocked,
    loadedAccountRows,
    ignoredRows
  };
}

export function createLearnerTroubleshootingProgress(options = {}) {
  const service = options.service || learnerItemProgressService;

  return Object.freeze({
    loadExamProgress: ({ userId, examId }) => service.loadExamProgress({ userId, examId }),
    saveChallenge: ({ userId, examId, challengeId, progress }) => service.saveProgress({
      userId,
      examId,
      progressType: LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE,
      contentId: String(challengeId),
      progressData: toTroubleshootingProgressData(progress),
      progressVersion: 1
    })
  });
}

export { BLOCK_REASONS as TROUBLESHOOTING_SYNC_BLOCK_REASONS };

export const learnerTroubleshootingProgress = createLearnerTroubleshootingProgress();
