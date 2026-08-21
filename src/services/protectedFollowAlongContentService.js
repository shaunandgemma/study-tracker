import { supabase } from '../lib/supabase.js';
import {
  PROTECTED_CONTENT_PREVIEW_LIMITS,
  PROTECTED_CONTENT_PUBLICATION_STATES,
  PROTECTED_CONTENT_TYPES,
  validateProtectedContentRecord
} from '../features/access/protectedContentContract.js';
import {
  buildPublishedFollowAlongConfig,
  buildPublishedProgrammeCard
} from '../features/followAlongs/published/publishedFollowAlongService.js';

export const PROTECTED_FOLLOW_ALONG_TABLE = 'learner_content_items';
export const PROTECTED_FOLLOW_ALONG_TYPE = PROTECTED_CONTENT_TYPES.FOLLOW_ALONG;
export const PROTECTED_FOLLOW_ALONG_PREVIEW_LIMIT = PROTECTED_CONTENT_PREVIEW_LIMITS[PROTECTED_FOLLOW_ALONG_TYPE];
export const PROTECTED_FOLLOW_ALONG_PAGE_SIZE = 100;

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

export const protectedFollowAlongContentId = programmeId => `follow-along:${cleanText(programmeId)}`;

export function mapProtectedFollowAlongRow(row) {
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
  if (record.contentType !== PROTECTED_FOLLOW_ALONG_TYPE) return null;
  if (record.publicationStatus !== PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED) return null;

  const programmeId = cleanText(record.payload?.programme?.programmeId);
  const pathId = cleanText(record.payload?.programme?.pathId);
  if (!programmeId || pathId !== programmeId) return null;
  if (record.contentId !== protectedFollowAlongContentId(programmeId)) return null;

  const sourceRow = {
    programme_id: programmeId,
    candidate_id: null,
    source_revision: record.contentVersion,
    content_hash: record.contentHash,
    runtime_content: record.payload,
    change_summary: null,
    published_at: row?.published_at || null
  };
  const config = buildPublishedFollowAlongConfig(sourceRow);
  const programme = buildPublishedProgrammeCard(sourceRow);
  if (!config || !programme || programme.examId !== record.examId) return null;

  return Object.freeze({
    contentId: record.contentId,
    examId: record.examId,
    sortOrder: record.sortOrder,
    previewOrder: record.previewOrder,
    contentVersion: record.contentVersion,
    contentHash: record.contentHash,
    publishedAt: row?.published_at || null,
    programme,
    config
  });
}

export function applyProtectedFollowAlongVisibility({ followAlongs, examId, previewOnly = false } = {}) {
  const exactExamId = cleanText(examId);
  const source = Array.isArray(followAlongs) ? followAlongs : [];
  if (!exactExamId) return { success: false, followAlongs: [], error: 'An exact exam is required.' };
  if (source.some(item => item.examId !== exactExamId)) {
    return { success: false, followAlongs: [], error: 'Protected Follow Along data did not match the selected exam.' };
  }

  const programmeIds = source.map(item => cleanText(item?.programme?.id));
  if (programmeIds.some(id => !id) || new Set(programmeIds).size !== programmeIds.length) {
    return { success: false, followAlongs: [], error: 'Protected Follow Along programme IDs failed validation.' };
  }
  if (!previewOnly) return { success: true, followAlongs: source };

  const previews = source
    .filter(item => Number.isInteger(item.previewOrder) && item.previewOrder > 0)
    .sort((left, right) => left.previewOrder - right.previewOrder || left.programme.id.localeCompare(right.programme.id));
  if (
    previews.length > PROTECTED_FOLLOW_ALONG_PREVIEW_LIMIT
    || new Set(previews.map(item => item.previewOrder)).size !== previews.length
  ) {
    return { success: false, followAlongs: [], error: 'Protected Follow Along preview data failed validation.' };
  }
  return { success: true, followAlongs: previews };
}

async function queryFollowAlongPages(client, examId) {
  const rows = [];
  for (let page = 0; ; page += 1) {
    const from = page * PROTECTED_FOLLOW_ALONG_PAGE_SIZE;
    const to = from + PROTECTED_FOLLOW_ALONG_PAGE_SIZE - 1;
    const result = await client
      .from(PROTECTED_FOLLOW_ALONG_TABLE)
      .select(SELECT_COLUMNS)
      .eq('exam_id', examId)
      .eq('content_type', PROTECTED_FOLLOW_ALONG_TYPE)
      .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
      .order('sort_order', { ascending: true })
      .order('content_id', { ascending: true })
      .range(from, to);
    if (result?.error) return { data: null, error: result.error };
    if (!Array.isArray(result?.data)) {
      return { data: null, error: { message: 'Protected Follow Along content returned an invalid page.' } };
    }
    rows.push(...result.data);
    if (result.data.length < PROTECTED_FOLLOW_ALONG_PAGE_SIZE) return { data: rows, error: null };
  }
}

export function createProtectedFollowAlongContentService(client = supabase) {
  return Object.freeze({
    async listForExam(examId) {
      const exactExamId = cleanText(examId);
      if (!client || !exactExamId) {
        return { success: false, followAlongs: [], error: 'An exact exam is required.' };
      }

      let result;
      try {
        result = await queryFollowAlongPages(client, exactExamId);
      } catch (unexpectedError) {
        return {
          success: false,
          followAlongs: [],
          error: unexpectedError?.message || 'Unable to load protected Follow Alongs.'
        };
      }
      if (result?.error) {
        return {
          success: false,
          followAlongs: [],
          error: result.error.message || 'Unable to load protected Follow Alongs.'
        };
      }

      const followAlongs = result.data.map(mapProtectedFollowAlongRow).filter(Boolean);
      if (followAlongs.length !== result.data.length) {
        return { success: false, followAlongs: [], error: 'Protected Follow Along data failed validation.' };
      }
      return applyProtectedFollowAlongVisibility({ followAlongs, examId: exactExamId });
    },

    async loadProgramme(examId, programmeId) {
      const exactExamId = cleanText(examId);
      const exactProgrammeId = cleanText(programmeId);
      if (!client || !exactExamId || !exactProgrammeId) {
        return { success: false, followAlong: null, error: 'An exact exam and Follow Along are required.' };
      }

      let data;
      let error;
      try {
        ({ data, error } = await client
          .from(PROTECTED_FOLLOW_ALONG_TABLE)
          .select(SELECT_COLUMNS)
          .eq('exam_id', exactExamId)
          .eq('content_type', PROTECTED_FOLLOW_ALONG_TYPE)
          .eq('content_id', protectedFollowAlongContentId(exactProgrammeId))
          .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
          .maybeSingle());
      } catch (unexpectedError) {
        return {
          success: false,
          followAlong: null,
          error: unexpectedError?.message || 'Unable to load the protected Follow Along.'
        };
      }
      if (error) return { success: false, followAlong: null, error: error.message || 'Unable to load the protected Follow Along.' };
      if (!data) return { success: false, followAlong: null, notFound: true, error: 'The protected Follow Along is unavailable.' };

      const followAlong = mapProtectedFollowAlongRow(data);
      return followAlong && followAlong.examId === exactExamId && followAlong.programme.id === exactProgrammeId
        ? { success: true, followAlong }
        : { success: false, followAlong: null, error: 'Protected Follow Along data failed validation.' };
    }
  });
}

export const protectedFollowAlongContentService = createProtectedFollowAlongContentService();
