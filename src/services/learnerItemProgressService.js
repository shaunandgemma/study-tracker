import { supabase } from '../lib/supabase.js';

export const LEARNER_ITEM_PROGRESS_TABLE = 'learner_item_progress';

export const LEARNER_PROGRESS_TYPES = Object.freeze({
  STUDY_ITEM: 'study_item',
  QUESTION_FLAG: 'question_flag',
  TROUBLESHOOTING_CHALLENGE: 'troubleshooting_challenge',
  WORKSPACE_STATE: 'workspace_state'
});

export const LEARNER_PROGRESS_EXAM_IDS = Object.freeze([
  'aws-saa-c03',
  'terraform-associate-004',
  'comptia-sec-plus'
]);

const ALLOWED_KEYS = Object.freeze({
  [LEARNER_PROGRESS_TYPES.STUDY_ITEM]: new Set([
    'completed',
    'guide_opened',
    'last_section'
  ]),
  [LEARNER_PROGRESS_TYPES.QUESTION_FLAG]: new Set(['flagged']),
  [LEARNER_PROGRESS_TYPES.TROUBLESHOOTING_CHALLENGE]: new Set([
    'observations',
    'hypothesis',
    'actions',
    'pinned_evidence_ids',
    'revealed_hints',
    'answers',
    'completed',
    'solution_revealed',
    'score'
  ]),
  [LEARNER_PROGRESS_TYPES.WORKSPACE_STATE]: new Set([
    'last_view',
    'last_knowledge_item_id',
    'last_troubleshooting_challenge_id'
  ])
});

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PROGRESS_BYTES = 65536;
const IDENTITY_COLUMNS = 'user_id,exam_id,progress_type,content_id';

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function encodedSize(value) {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map(key => [key, canonicalize(value[key])])
  );
}

function sameJson(left, right) {
  return JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));
}

function validOptionalString(progressData, key) {
  return !(key in progressData) || typeof progressData[key] === 'string';
}

function validateValueTypes(progressType, progressData) {
  if ('completed' in progressData && typeof progressData.completed !== 'boolean') {
    return 'completed must be true or false.';
  }
  if ('guide_opened' in progressData && typeof progressData.guide_opened !== 'boolean') {
    return 'guide_opened must be true or false.';
  }
  if ('flagged' in progressData && typeof progressData.flagged !== 'boolean') {
    return 'flagged must be true or false.';
  }
  if ('solution_revealed' in progressData && typeof progressData.solution_revealed !== 'boolean') {
    return 'solution_revealed must be true or false.';
  }

  for (const key of [
    'last_section',
    'last_view',
    'last_knowledge_item_id',
    'last_troubleshooting_challenge_id',
    'observations',
    'hypothesis',
    'actions'
  ]) {
    if (!validOptionalString(progressData, key)) return `${key} must be text.`;
  }

  if ('pinned_evidence_ids' in progressData && (
    !Array.isArray(progressData.pinned_evidence_ids)
    || progressData.pinned_evidence_ids.some(value => typeof value !== 'string')
  )) {
    return 'pinned_evidence_ids must contain only identifiers.';
  }

  if ('answers' in progressData && !isPlainObject(progressData.answers)) {
    return 'answers must be an object.';
  }

  if ('revealed_hints' in progressData && (
    !Number.isInteger(progressData.revealed_hints)
    || progressData.revealed_hints < 0
  )) {
    return 'revealed_hints must be a non-negative whole number.';
  }

  if ('score' in progressData && progressData.score !== null && (
    typeof progressData.score !== 'number'
    || !Number.isFinite(progressData.score)
    || progressData.score < 0
    || progressData.score > 100
  )) {
    return 'score must be null or a number from 0 to 100.';
  }

  if (progressType === LEARNER_PROGRESS_TYPES.QUESTION_FLAG && !('flagged' in progressData)) {
    return 'Question-flag progress requires flagged.';
  }

  return null;
}

export function validateLearnerItemProgress(input = {}) {
  const userId = String(input.userId || '').trim();
  const examId = String(input.examId || '').trim();
  const progressType = String(input.progressType || '').trim();
  const contentId = String(input.contentId || '').trim();
  const progressVersion = input.progressVersion ?? 1;
  const progressData = input.progressData;

  if (!UUID_PATTERN.test(userId)) return { valid: false, error: 'Authenticated learner ID is required.' };
  if (!LEARNER_PROGRESS_EXAM_IDS.includes(examId)) return { valid: false, error: 'Unsupported exam ID.' };
  if (!Object.values(LEARNER_PROGRESS_TYPES).includes(progressType)) {
    return { valid: false, error: 'Unsupported progress type.' };
  }
  if (!contentId || contentId.length > 200 || contentId !== input.contentId) {
    return { valid: false, error: 'A trimmed content ID of 1 to 200 characters is required.' };
  }
  if (!Number.isInteger(progressVersion) || progressVersion < 1 || progressVersion > 32767) {
    return { valid: false, error: 'Progress version must be a positive whole number.' };
  }
  if (!isPlainObject(progressData)) return { valid: false, error: 'Progress data must be an object.' };

  const unexpectedKey = Object.keys(progressData).find(key => !ALLOWED_KEYS[progressType].has(key));
  if (unexpectedKey) return { valid: false, error: `Progress field ${unexpectedKey} is not allowed.` };

  const typeError = validateValueTypes(progressType, progressData);
  if (typeError) return { valid: false, error: typeError };

  if (encodedSize(progressData) > MAX_PROGRESS_BYTES) {
    return { valid: false, error: 'Progress data is larger than the 65,536-byte safety limit.' };
  }

  return {
    valid: true,
    value: { userId, examId, progressType, contentId, progressData, progressVersion }
  };
}

function failure(error, extra = {}) {
  return {
    success: false,
    unsaved: true,
    error: error?.message || String(error || 'Unable to save learner progress.'),
    ...extra
  };
}

export function createLearnerItemProgressService(options = {}) {
  const client = options.supabaseClient || supabase;

  const loadItem = async input => {
    const validation = validateLearnerItemProgress({
      ...input,
      progressData: input?.progressData || {},
      progressVersion: input?.progressVersion || 1
    });
    if (!validation.valid) return failure(validation.error, { validationError: true });

    const { userId, examId, progressType, contentId } = validation.value;
    try {
      const { data, error } = await client
        .from(LEARNER_ITEM_PROGRESS_TABLE)
        .select('*')
        .eq('user_id', userId)
        .eq('exam_id', examId)
        .eq('progress_type', progressType)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) return failure(error, { loadFailed: true });
      return { success: true, found: Boolean(data), row: data || null };
    } catch (error) {
      return failure(error, { loadFailed: true });
    }
  };

  const loadExamProgress = async ({ userId, examId }) => {
    const selectedUserId = String(userId || '').trim();
    const selectedExamId = String(examId || '').trim();
    if (!UUID_PATTERN.test(selectedUserId)) return failure('Authenticated learner ID is required.', { validationError: true });
    if (!LEARNER_PROGRESS_EXAM_IDS.includes(selectedExamId)) return failure('Unsupported exam ID.', { validationError: true });

    try {
      const { data, error } = await client
        .from(LEARNER_ITEM_PROGRESS_TABLE)
        .select('*')
        .eq('user_id', selectedUserId)
        .eq('exam_id', selectedExamId)
        .order('updated_at', { ascending: false });

      if (error) return failure(error, { loadFailed: true });
      return { success: true, rows: Array.isArray(data) ? data : [] };
    } catch (error) {
      return failure(error, { loadFailed: true });
    }
  };

  const saveProgress = async input => {
    const validation = validateLearnerItemProgress(input);
    if (!validation.valid) return failure(validation.error, { validationError: true });

    const {
      userId,
      examId,
      progressType,
      contentId,
      progressData,
      progressVersion
    } = validation.value;

    try {
      const { error } = await client
        .from(LEARNER_ITEM_PROGRESS_TABLE)
        .upsert({
          user_id: userId,
          exam_id: examId,
          progress_type: progressType,
          content_id: contentId,
          progress_data: progressData,
          progress_version: progressVersion
        }, { onConflict: IDENTITY_COLUMNS });

      if (error) return failure(error, { writeFailed: true });

      const verified = await loadItem({
        userId,
        examId,
        progressType,
        contentId,
        progressData,
        progressVersion
      });

      if (!verified.success || !verified.found) {
        return failure(
          verified.error || 'Saved progress could not be read back.',
          { verificationFailed: true }
        );
      }

      const row = verified.row;
      const identityMatches = row.user_id === userId
        && row.exam_id === examId
        && row.progress_type === progressType
        && row.content_id === contentId;
      const contentMatches = sameJson(row.progress_data, progressData)
        && row.progress_version === progressVersion;

      if (!identityMatches || !contentMatches) {
        return failure('Saved progress read-back did not match the requested item.', {
          verificationFailed: true
        });
      }

      return { success: true, verified: true, unsaved: false, row };
    } catch (error) {
      return failure(error, { writeFailed: true });
    }
  };

  return Object.freeze({
    loadItem,
    loadExamProgress,
    saveProgress
  });
}

export const learnerItemProgressService = createLearnerItemProgressService();
