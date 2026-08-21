import { canAccessCompleteExam } from './applicationAccessPolicy.js';

export const PROTECTED_CONTENT_TYPES = Object.freeze({
  CHECKLIST_ITEM: 'checklist_item',
  KNOWLEDGE_GUIDE: 'knowledge_guide',
  FOLLOW_ALONG: 'follow_along',
  TROUBLESHOOTING_CHALLENGE: 'troubleshooting_challenge'
});

export const PROTECTED_CONTENT_ACCESS_LEVELS = Object.freeze({
  NONE: 'none',
  PREVIEW: 'preview',
  COMPLETE: 'complete'
});

export const PROTECTED_CONTENT_PUBLICATION_STATES = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  WITHDRAWN: 'withdrawn'
});

export const PROTECTED_CONTENT_PREVIEW_LIMITS = Object.freeze({
  [PROTECTED_CONTENT_TYPES.CHECKLIST_ITEM]: 10,
  [PROTECTED_CONTENT_TYPES.KNOWLEDGE_GUIDE]: 10,
  [PROTECTED_CONTENT_TYPES.FOLLOW_ALONG]: 2,
  [PROTECTED_CONTENT_TYPES.TROUBLESHOOTING_CHALLENGE]: 2
});

export const PROTECTED_CONTENT_TABLE_DESIGN = Object.freeze({
  tableName: 'learner_content_items',
  primaryKey: 'content_id',
  columns: Object.freeze([
    'content_id',
    'exam_id',
    'content_type',
    'parent_content_id',
    'title',
    'sort_order',
    'preview_order',
    'publication_status',
    'content_version',
    'content_hash',
    'payload',
    'published_at',
    'created_at',
    'updated_at'
  ]),
  uniqueKeys: Object.freeze([
    Object.freeze(['exam_id', 'content_type', 'content_id']),
    Object.freeze(['exam_id', 'content_type', 'preview_order'])
  ]),
  browserPrivileges: Object.freeze(['select']),
  writerRoles: Object.freeze(['protected_server_process']),
  rowVisibility: Object.freeze([
    'published deterministic preview row',
    'active exact-exam entitlement',
    'trusted non-conflicting staff role'
  ])
});

const cleanText = value => typeof value === 'string' ? value.trim() : '';
const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isPositiveInteger = value => Number.isInteger(value) && value > 0;
const isNonNegativeInteger = value => Number.isInteger(value) && value >= 0;

export function validateProtectedContentRecord(record) {
  const errors = [];
  const contentId = cleanText(record?.contentId);
  const examId = cleanText(record?.examId);
  const contentType = cleanText(record?.contentType);
  const publicationStatus = cleanText(record?.publicationStatus);
  const previewOrder = record?.previewOrder ?? null;
  const previewLimit = PROTECTED_CONTENT_PREVIEW_LIMITS[contentType];

  if (!contentId) errors.push('contentId is required.');
  if (!examId) errors.push('examId is required.');
  if (!Object.values(PROTECTED_CONTENT_TYPES).includes(contentType)) {
    errors.push('contentType is not supported.');
  }
  if (!Object.values(PROTECTED_CONTENT_PUBLICATION_STATES).includes(publicationStatus)) {
    errors.push('publicationStatus is not supported.');
  }
  if (!isNonNegativeInteger(record?.sortOrder)) errors.push('sortOrder must be a non-negative integer.');
  if (!isPositiveInteger(record?.contentVersion)) errors.push('contentVersion must be a positive integer.');
  if (!/^[a-f0-9]{64}$/i.test(cleanText(record?.contentHash))) errors.push('contentHash must be a SHA-256 fingerprint.');
  if (!isPlainObject(record?.payload)) errors.push('payload must be a JSON object.');

  if (previewOrder !== null) {
    if (!isPositiveInteger(previewOrder)) {
      errors.push('previewOrder must be null or a positive integer.');
    } else if (previewLimit && previewOrder > previewLimit) {
      errors.push(`previewOrder exceeds the ${contentType} preview limit.`);
    }
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
function decision(record, accessLevel, reason) {
  return Object.freeze({
    allowed: accessLevel !== PROTECTED_CONTENT_ACCESS_LEVELS.NONE,
    accessLevel,
    reason,
    contentId: cleanText(record?.contentId),
    examId: cleanText(record?.examId),
    contentType: cleanText(record?.contentType)
  });
}

export function evaluateProtectedContentAccess({ record, accessPolicy } = {}) {
  const validation = validateProtectedContentRecord(record);
  if (!validation.valid) {
    return decision(record, PROTECTED_CONTENT_ACCESS_LEVELS.NONE, 'invalid_content_record');
  }

  if (record.publicationStatus !== PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED) {
    return decision(record, PROTECTED_CONTENT_ACCESS_LEVELS.NONE, 'content_not_published');
  }

  if (canAccessCompleteExam(accessPolicy, record.examId)) {
    return decision(record, PROTECTED_CONTENT_ACCESS_LEVELS.COMPLETE, 'exact_exam_or_staff_access');
  }

  if (record.previewOrder !== null) {
    // Preview bodies are intentionally public so the unauthenticated Supabase
    // client used by Demo mode can read them. The application route still keeps
    // an ordinary signed-out visitor outside the exam workspace.
    return decision(record, PROTECTED_CONTENT_ACCESS_LEVELS.PREVIEW, 'curated_public_preview');
  }

  return decision(record, PROTECTED_CONTENT_ACCESS_LEVELS.NONE, 'complete_content_requires_access');
}
