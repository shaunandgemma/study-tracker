import {
  LEARNER_PROGRESS_TYPES,
  learnerItemProgressService
} from './learnerItemProgressService.js';
import {
  fromTroubleshootingProgressRow,
  hasMeaningfulTroubleshootingProgress,
  toTroubleshootingProgressData,
  troubleshootingProgressMatches
} from './learnerTroubleshootingProgress.js';

export const LEARNER_PROGRESS_IMPORT_AUDIT_KEY = 'latt_learner_progress_import_audits_v1';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function fingerprintJson(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) throw new Error('Secure progress fingerprinting is unavailable.');
  const bytes = new TextEncoder().encode(stableStringify(value));
  const digest = await cryptoImpl.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

function readAudits(storage) {
  const selectedStorage = resolveStorage(storage);
  if (!selectedStorage) return {};
  try {
    const parsed = JSON.parse(selectedStorage.getItem(LEARNER_PROGRESS_IMPORT_AUDIT_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function saveAudit(storage, audit) {
  const selectedStorage = resolveStorage(storage);
  if (!selectedStorage) throw new Error('Browser import audit storage is unavailable.');
  const audits = readAudits(selectedStorage);
  audits[audit.key] = audit;
  selectedStorage.setItem(LEARNER_PROGRESS_IMPORT_AUDIT_KEY, JSON.stringify(audits));
}

const actionKey = action => `${action.progressType}:${action.contentId}`;

function buildRemoteMap(rows, examId) {
  const map = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row?.exam_id !== examId || typeof row?.content_id !== 'string') continue;
    map.set(`${row.progress_type}:${row.content_id}`, row);
  }
  return map;
}

export async function buildLearnerProgressImportPreview({
  userId,
  examId,
  browserSnapshot = {},
  accountRows = [],
  challengeIds = [],
  cryptoImpl = globalThis.crypto
}) {
  const remote = buildRemoteMap(accountRows, examId);
  const safeActions = [];
  const conflicts = [];
  let matchingItems = 0;

  for (const [contentId, completed] of Object.entries(browserSnapshot.checklist || {})) {
    if (typeof completed !== 'boolean') continue;
    const progressData = { completed };
    const row = remote.get(`${LEARNER_PROGRESS_TYPES.STUDY_ITEM}:${contentId}`);
    if (row?.progress_data?.completed === completed) {
      matchingItems += 1;
    } else {
      safeActions.push({
        progressType: LEARNER_PROGRESS_TYPES.STUDY_ITEM,
        contentId,
        progressData,
        category: 'checklist'
      });
    }
  }

  for (const [contentId, flagged] of Object.entries(browserSnapshot.flagged || {})) {
    if (typeof flagged !== 'boolean') continue;
    const progressData = { flagged };
    const row = remote.get(`${LEARNER_PROGRESS_TYPES.QUESTION_FLAG}:${contentId}`);
    if (row?.progress_data?.flagged === flagged) {
      matchingItems += 1;
    } else {
      safeActions.push({
        progressType: LEARNER_PROGRESS_TYPES.QUESTION_FLAG,
        contentId,
        progressData,
        category: 'question_flags'
      });
    }
  }

  const allowedChallengeIds = new Set(challengeIds);
  for (const [contentId, browserProgress] of Object.entries(browserSnapshot.troubleshooting || {})) {
    if (!allowedChallengeIds.has(contentId) || !hasMeaningfulTroubleshootingProgress(browserProgress)) continue;
    const row = remote.get(`${LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE}:${contentId}`);
    if (!row) {
      safeActions.push({
        progressType: LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE,
        contentId,
        progressData: toTroubleshootingProgressData(browserProgress),
        category: 'troubleshooting'
      });
      continue;
    }

    const accountProgress = fromTroubleshootingProgressRow(row);
    if (accountProgress && troubleshootingProgressMatches(browserProgress, accountProgress)) {
      matchingItems += 1;
    } else {
      conflicts.push({
        progressType: LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE,
        contentId,
        reason: accountProgress ? 'different_notebook_text' : 'invalid_account_notebook'
      });
    }
  }

  safeActions.sort((left, right) => actionKey(left).localeCompare(actionKey(right)));
  conflicts.sort((left, right) => actionKey(left).localeCompare(actionKey(right)));

  const fingerprintContent = {
    schemaVersion: 1,
    userId,
    examId,
    safeActions,
    conflicts
  };
  const fingerprint = await fingerprintJson(fingerprintContent, cryptoImpl);
  const counts = {
    checklistChanges: safeActions.filter(action => action.category === 'checklist').length,
    questionFlagChanges: safeActions.filter(action => action.category === 'question_flags').length,
    troubleshootingImports: safeActions.filter(action => action.category === 'troubleshooting').length,
    conflicts: conflicts.length,
    matchingItems,
    safeChanges: safeActions.length
  };

  return {
    userId,
    examId,
    fingerprint,
    safeActions,
    conflicts,
    counts
  };
}

export function createLearnerProgressImportCoordinator(options = {}) {
  const service = options.service || learnerItemProgressService;
  const storage = options.storage;
  const cryptoImpl = options.cryptoImpl || globalThis.crypto;
  const now = options.now || (() => new Date());
  const activeImports = new Set();

  const preview = async ({ userId, examId, browserSnapshot, challengeIds }) => {
    const loaded = await service.loadExamProgress({ userId, examId });
    if (!loaded.success) {
      return { success: false, error: loaded.error || 'Account progress could not be loaded.' };
    }
    const comparison = await buildLearnerProgressImportPreview({
      userId,
      examId,
      browserSnapshot,
      accountRows: loaded.rows,
      challengeIds,
      cryptoImpl
    });
    const auditKey = `${userId}:${examId}:${comparison.fingerprint}`;
    return {
      success: true,
      ...comparison,
      auditKey,
      alreadyImported: Boolean(readAudits(storage)[auditKey])
    };
  };

  const performImport = async ({ acceptedPreview, userId, examId, browserSnapshot, challengeIds }) => {
    if (!acceptedPreview?.fingerprint || acceptedPreview.userId !== userId || acceptedPreview.examId !== examId) {
      return { success: false, error: 'The accepted preview is missing or belongs to a different learner or exam.' };
    }

    const acceptedAuditKey = `${userId}:${examId}:${acceptedPreview.fingerprint}`;
    if (readAudits(storage)[acceptedAuditKey]) {
      return { success: false, alreadyImported: true, error: 'This exact browser progress import was already completed.' };
    }

    const freshPreview = await preview({ userId, examId, browserSnapshot, challengeIds });
    if (!freshPreview.success) return freshPreview;
    if (freshPreview.fingerprint !== acceptedPreview.fingerprint) {
      return { success: false, stale: true, error: 'Browser or account progress changed. Create a new comparison before importing.' };
    }
    if (freshPreview.alreadyImported) {
      return { success: false, alreadyImported: true, error: 'This exact browser progress import was already completed.' };
    }
    if (!freshPreview.safeActions.length) {
      return { success: true, noChanges: true, importedItems: 0, conflicts: freshPreview.conflicts };
    }

    const results = await Promise.all(freshPreview.safeActions.map(action => service.saveProgress({
      userId,
      examId,
      progressType: action.progressType,
      contentId: action.contentId,
      progressData: action.progressData,
      progressVersion: 1
    })));
    const failedIndexes = results
      .map((result, index) => (!result?.success || !result?.verified ? index : -1))
      .filter(index => index >= 0);
    if (failedIndexes.length) {
      return {
        success: false,
        partial: failedIndexes.length < results.length,
        error: `${failedIndexes.length} account progress item${failedIndexes.length === 1 ? '' : 's'} could not be verified. The browser copy was kept.`,
        failedItems: failedIndexes.map(index => freshPreview.safeActions[index])
      };
    }

    const audit = {
      key: freshPreview.auditKey,
      userId,
      examId,
      fingerprint: freshPreview.fingerprint,
      importedItems: results.length,
      skippedConflicts: freshPreview.conflicts.length,
      completedAt: now().toISOString()
    };
    try {
      saveAudit(storage, audit);
    } catch (error) {
      return {
        success: false,
        verificationComplete: true,
        error: `${error.message} The account writes were verified, but repeat protection could not be recorded.`
      };
    }

    return {
      success: true,
      importedItems: results.length,
      conflicts: freshPreview.conflicts,
      audit
    };
  };

  const importPreview = async input => {
    const requestKey = `${input?.userId || ''}:${input?.examId || ''}:${input?.acceptedPreview?.fingerprint || ''}`;
    if (activeImports.has(requestKey)) {
      return { success: false, alreadyRunning: true, error: 'This exact progress import is already running.' };
    }
    activeImports.add(requestKey);
    try {
      return await performImport(input);
    } finally {
      activeImports.delete(requestKey);
    }
  };

  return Object.freeze({ preview, importPreview });
}

export const learnerProgressImportCoordinator = createLearnerProgressImportCoordinator();
