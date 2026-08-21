import { supabase } from '../lib/supabase.js';
import {
  PROTECTED_CONTENT_PREVIEW_LIMITS,
  PROTECTED_CONTENT_PUBLICATION_STATES,
  PROTECTED_CONTENT_TYPES,
  validateProtectedContentRecord
} from '../features/access/protectedContentContract.js';

export const PROTECTED_CONTENT_TABLE = 'learner_content_items';
export const TROUBLESHOOTING_CONTENT_TYPE = PROTECTED_CONTENT_TYPES.TROUBLESHOOTING_CHALLENGE;
export const TROUBLESHOOTING_PREVIEW_LIMIT = PROTECTED_CONTENT_PREVIEW_LIMITS[TROUBLESHOOTING_CONTENT_TYPE];

const SELECT_COLUMNS = [
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
  'published_at'
].join(',');

const cleanText = value => typeof value === 'string' ? value.trim() : '';

export function mapProtectedTroubleshootingRow(row) {
  const record = {
    contentId: cleanText(row?.content_id),
    examId: cleanText(row?.exam_id),
    contentType: cleanText(row?.content_type),
    parentContentId: cleanText(row?.parent_content_id) || null,
    title: cleanText(row?.title),
    sortOrder: row?.sort_order,
    previewOrder: row?.preview_order ?? null,
    publicationStatus: cleanText(row?.publication_status),
    contentVersion: row?.content_version,
    contentHash: cleanText(row?.content_hash),
    payload: row?.payload
  };
  const validation = validateProtectedContentRecord(record);
  if (!validation.valid) return null;
  if (record.contentType !== TROUBLESHOOTING_CONTENT_TYPE) return null;
  if (record.publicationStatus !== PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED) return null;
  if (cleanText(record.payload?.id) !== record.contentId) return null;
  if (cleanText(record.payload?.examId) !== record.examId) return null;

  return Object.freeze({
    ...record.payload,
    contentVersion: record.contentVersion,
    contentHash: record.contentHash,
    previewOrder: record.previewOrder,
    publishedAt: row.published_at || null
  });
}

function mapRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map(mapProtectedTroubleshootingRow)
    .filter(Boolean)
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

export function applyProtectedTroubleshootingVisibility({ challenges, examId, previewOnly = false } = {}) {
  const cleanExamId = cleanText(examId);
  const source = Array.isArray(challenges) ? challenges : [];
  if (!cleanExamId) {
    return { success: false, challenges: [], error: 'An exact exam is required.' };
  }
  if (source.some(challenge => cleanText(challenge?.examId) !== cleanExamId)) {
    return {
      success: false,
      challenges: [],
      error: 'Protected Troubleshooting Challenge data did not match the selected exam.'
    };
  }

  const challengeIds = source.map(challenge => cleanText(challenge?.id));
  if (challengeIds.some(challengeId => !challengeId) || new Set(challengeIds).size !== challengeIds.length) {
    return {
      success: false,
      challenges: [],
      error: 'Protected Troubleshooting Challenge IDs failed validation.'
    };
  }

  if (!previewOnly) return { success: true, challenges: source };

  const previews = source
    .filter(challenge => Number.isInteger(challenge.previewOrder) && challenge.previewOrder > 0)
    .sort((left, right) => left.previewOrder - right.previewOrder || left.id.localeCompare(right.id));

  if (
    previews.length > TROUBLESHOOTING_PREVIEW_LIMIT
    || new Set(previews.map(challenge => challenge.previewOrder)).size !== previews.length
  ) {
    return {
      success: false,
      challenges: [],
      error: 'Protected Troubleshooting Challenge preview data failed validation.'
    };
  }

  return { success: true, challenges: previews };
}

export function createProtectedTroubleshootingContentService(client = supabase) {
  return Object.freeze({
    async listForExam(examId) {
      const cleanExamId = cleanText(examId);
      if (!client || !cleanExamId) {
        return { success: false, challenges: [], error: 'An exact exam is required.' };
      }

      let data;
      let error;
      try {
        ({ data, error } = await client
          .from(PROTECTED_CONTENT_TABLE)
          .select(SELECT_COLUMNS)
          .eq('exam_id', cleanExamId)
          .eq('content_type', TROUBLESHOOTING_CONTENT_TYPE)
          .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
          .order('sort_order', { ascending: true })
          .order('content_id', { ascending: true }));
      } catch (unexpectedError) {
        return {
          success: false,
          challenges: [],
          error: unexpectedError?.message || 'Unable to load protected Troubleshooting Challenges.'
        };
      }

      if (error) {
        return {
          success: false,
          challenges: [],
          error: error.message || 'Unable to load protected Troubleshooting Challenges.'
        };
      }

      const challenges = mapRows(data);
      if (challenges.length !== (data || []).length) {
        return {
          success: false,
          challenges: [],
          error: 'Protected Troubleshooting Challenge data failed validation.'
        };
      }

      const exactExamResult = applyProtectedTroubleshootingVisibility({
        challenges,
        examId: cleanExamId
      });
      if (!exactExamResult.success) return exactExamResult;

      return { success: true, challenges: exactExamResult.challenges };
    },

    async loadChallenge(examId, challengeId) {
      const cleanExamId = cleanText(examId);
      const cleanChallengeId = cleanText(challengeId);
      if (!client || !cleanExamId || !cleanChallengeId) {
        return { success: false, challenge: null, error: 'An exact exam and challenge are required.' };
      }

      let data;
      let error;
      try {
        ({ data, error } = await client
          .from(PROTECTED_CONTENT_TABLE)
          .select(SELECT_COLUMNS)
          .eq('exam_id', cleanExamId)
          .eq('content_type', TROUBLESHOOTING_CONTENT_TYPE)
          .eq('content_id', cleanChallengeId)
          .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
          .maybeSingle());
      } catch (unexpectedError) {
        return {
          success: false,
          challenge: null,
          error: unexpectedError?.message || 'Unable to load the protected Troubleshooting Challenge.'
        };
      }

      if (error) {
        return {
          success: false,
          challenge: null,
          error: error.message || 'Unable to load the protected Troubleshooting Challenge.'
        };
      }
      if (!data) {
        return {
          success: false,
          challenge: null,
          notFound: true,
          error: 'The protected Troubleshooting Challenge is unavailable.'
        };
      }

      const challenge = mapProtectedTroubleshootingRow(data);
      return challenge
        ? { success: true, challenge }
        : {
            success: false,
            challenge: null,
            error: 'Protected Troubleshooting Challenge data failed validation.'
          };
    }
  });
}

export const protectedTroubleshootingContentService = createProtectedTroubleshootingContentService();
