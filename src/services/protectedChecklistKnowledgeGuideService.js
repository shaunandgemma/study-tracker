import { supabase } from '../lib/supabase.js';
import {
  PROTECTED_CONTENT_PREVIEW_LIMITS,
  PROTECTED_CONTENT_PUBLICATION_STATES,
  PROTECTED_CONTENT_TABLE_DESIGN,
  PROTECTED_CONTENT_TYPES,
  validateProtectedContentRecord
} from '../features/access/protectedContentContract.js';

export const CHECKLIST_CONTENT_TYPE = PROTECTED_CONTENT_TYPES.CHECKLIST_ITEM;
export const KNOWLEDGE_GUIDE_CONTENT_TYPE = PROTECTED_CONTENT_TYPES.KNOWLEDGE_GUIDE;
export const CHECKLIST_GUIDE_CONTENT_TABLE = PROTECTED_CONTENT_TABLE_DESIGN.tableName;
export const CHECKLIST_PREVIEW_LIMIT = PROTECTED_CONTENT_PREVIEW_LIMITS[CHECKLIST_CONTENT_TYPE];
export const KNOWLEDGE_GUIDE_PREVIEW_LIMIT = PROTECTED_CONTENT_PREVIEW_LIMITS[KNOWLEDGE_GUIDE_CONTENT_TYPE];

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
const deliveryId = (type, examId, stableId) => `${type}:${examId}:${stableId}`;

export function checklistDeliveryId(examId, stableId) {
  return deliveryId('checklist-item', cleanText(examId), cleanText(stableId));
}

export function knowledgeGuideDeliveryId(examId, stableId) {
  return deliveryId('knowledge-guide', cleanText(examId), cleanText(stableId));
}

function mapRecord(row) {
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
  if (!validation.valid || record.publicationStatus !== PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED) {
    return null;
  }
  return record;
}

export function mapProtectedChecklistRow(row) {
  const record = mapRecord(row);
  if (!record || record.contentType !== CHECKLIST_CONTENT_TYPE) return null;
  const stableId = cleanText(record.payload?.id);
  const item = record.payload?.checklistItem;
  if (
    !stableId
    || record.contentId !== checklistDeliveryId(record.examId, stableId)
    || cleanText(record.payload?.examId) !== record.examId
    || cleanText(item?.id) !== stableId
    || record.payload?.order !== record.sortOrder
    || !cleanText(item?.text)
  ) return null;

  return Object.freeze({
    ...item,
    examId: record.examId,
    topicId: cleanText(record.payload?.topic?.id),
    topicCode: cleanText(record.payload?.topic?.code),
    topicTitle: cleanText(record.payload?.topic?.title),
    topicDescription: cleanText(record.payload?.topic?.description),
    topicWeight: record.payload?.topic?.weight,
    topicIndex: record.payload?.topicIndex,
    itemIndex: record.payload?.itemIndex,
    order: record.sortOrder,
    previewOrder: record.previewOrder,
    contentVersion: record.contentVersion,
    contentHash: record.contentHash,
    publishedAt: row.published_at || null
  });
}

export function mapProtectedKnowledgeGuideRow(row) {
  const record = mapRecord(row);
  if (!record || record.contentType !== KNOWLEDGE_GUIDE_CONTENT_TYPE) return null;
  const stableId = cleanText(record.payload?.id);
  const guide = record.payload?.knowledgeGuide;
  if (
    !stableId
    || record.contentId !== knowledgeGuideDeliveryId(record.examId, stableId)
    || record.parentContentId !== checklistDeliveryId(record.examId, stableId)
    || cleanText(record.payload?.examId) !== record.examId
    || cleanText(record.payload?.checklistItemId) !== stableId
    || cleanText(guide?.id) !== stableId
    || record.payload?.order !== record.sortOrder
    || !cleanText(guide?.title)
  ) return null;

  return Object.freeze({
    ...guide,
    examId: record.examId,
    checklistItemId: stableId,
    order: record.sortOrder,
    previewOrder: record.previewOrder,
    contentVersion: record.contentVersion,
    contentHash: record.contentHash,
    publishedAt: row.published_at || null
  });
}

function sortByOrder(items) {
  return items.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

export function validateChecklistKnowledgeGuideRelationship({ checklistItems, knowledgeGuides, examId }) {
  const exactExamId = cleanText(examId);
  const checklist = Array.isArray(checklistItems) ? checklistItems : [];
  const guides = Array.isArray(knowledgeGuides) ? knowledgeGuides : [];
  const invalidExam = [...checklist, ...guides].some(item => cleanText(item?.examId) !== exactExamId);
  const checklistIds = checklist.map(item => cleanText(item?.id));
  const guideIds = guides.map(guide => cleanText(guide?.id));
  const checklistOrder = new Map(checklist.map(item => [item.id, item.order]));
  const invalidIds = (
    checklistIds.some(id => !id)
    || guideIds.some(id => !id)
    || new Set(checklistIds).size !== checklistIds.length
    || new Set(guideIds).size !== guideIds.length
  );
  const invalidPair = guides.some(guide => (
    !checklistOrder.has(guide.checklistItemId)
    || guide.id !== guide.checklistItemId
    || guide.order !== checklistOrder.get(guide.checklistItemId)
  ));
  if (!exactExamId || invalidExam || invalidIds || invalidPair) {
    return {
      success: false,
      checklistItems: [],
      knowledgeGuides: [],
      error: 'Protected Checklist and Knowledge Guide data failed exact-exam relationship validation.'
    };
  }
  return { success: true, checklistItems: checklist, knowledgeGuides: guides };
}

function validPreviewRows(items, limit) {
  const previews = items
    .filter(item => Number.isInteger(item.previewOrder) && item.previewOrder > 0)
    .sort((left, right) => left.previewOrder - right.previewOrder || left.id.localeCompare(right.id));
  return previews.length <= limit
    && new Set(previews.map(item => item.previewOrder)).size === previews.length
    ? previews
    : null;
}

export function applyProtectedChecklistKnowledgeGuideVisibility({
  checklistItems,
  knowledgeGuides,
  examId,
  previewOnly = false
} = {}) {
  const relationship = validateChecklistKnowledgeGuideRelationship({
    checklistItems,
    knowledgeGuides,
    examId
  });
  if (!relationship.success) return relationship;
  if (!previewOnly) return relationship;

  const checklistPreviews = validPreviewRows(relationship.checklistItems, CHECKLIST_PREVIEW_LIMIT);
  const guidePreviews = validPreviewRows(relationship.knowledgeGuides, KNOWLEDGE_GUIDE_PREVIEW_LIMIT);
  if (!checklistPreviews || !guidePreviews) {
    return {
      success: false,
      checklistItems: [],
      knowledgeGuides: [],
      error: 'Protected Checklist or Knowledge Guide preview data failed validation.'
    };
  }

  const checklistById = new Map(checklistPreviews.map(item => [item.id, item]));
  const invalidGuidePreview = guidePreviews.some(guide => (
    !checklistById.has(guide.id)
    || checklistById.get(guide.id).previewOrder !== guide.previewOrder
  ));
  if (invalidGuidePreview) {
    return {
      success: false,
      checklistItems: [],
      knowledgeGuides: [],
      error: 'Protected Checklist and Knowledge Guide previews did not match.'
    };
  }

  return {
    success: true,
    checklistItems: checklistPreviews,
    knowledgeGuides: guidePreviews
  };
}

export function buildProtectedChecklistTopics({ checklistItems, examId } = {}) {
  const exactExamId = cleanText(examId);
  const source = Array.isArray(checklistItems) ? checklistItems : [];
  const topics = [];
  const topicById = new Map();
  const itemIds = new Set();

  for (const item of source) {
    const itemId = cleanText(item?.id);
    const topicId = cleanText(item?.topicId);
    const topicTitle = cleanText(item?.topicTitle);
    const topicCode = cleanText(item?.topicCode);
    if (
      cleanText(item?.examId) !== exactExamId
      || !itemId
      || itemIds.has(itemId)
      || !topicId
      || !topicTitle
      || !Number.isInteger(item?.order)
      || !Number.isInteger(item?.topicIndex)
      || !Number.isInteger(item?.itemIndex)
    ) {
      return { success: false, topics: [], error: 'Protected Checklist topic data failed validation.' };
    }
    itemIds.add(itemId);

    let topic = topicById.get(topicId);
    if (!topic) {
      topic = {
        id: topicId,
        code: topicCode,
        title: topicTitle,
        description: cleanText(item?.topicDescription),
        weight: item?.topicWeight,
        topicIndex: item.topicIndex,
        items: []
      };
      topicById.set(topicId, topic);
      topics.push(topic);
    } else if (
      topic.title !== topicTitle
      || topic.code !== topicCode
      || topic.topicIndex !== item.topicIndex
    ) {
      return { success: false, topics: [], error: 'Protected Checklist topic metadata did not match.' };
    }
    topic.items.push(item);
  }

  const invalidOrdering = topics.some((topic, topicPosition) => (
    topic.topicIndex !== topicPosition
    || topic.items.some((item, itemPosition) => item.itemIndex !== itemPosition)
  ));
  if (!exactExamId || invalidOrdering) {
    return { success: false, topics: [], error: 'Protected Checklist ordering failed validation.' };
  }

  return { success: true, topics };
}

export const PROTECTED_STUDY_CONTENT_PAGE_SIZE = 500;

async function queryContentPage(client, examId, contentType, from, to) {
  return client
    .from(CHECKLIST_GUIDE_CONTENT_TABLE)
    .select(SELECT_COLUMNS)
    .eq('exam_id', examId)
    .eq('content_type', contentType)
    .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
    .order('sort_order', { ascending: true })
    .order('content_id', { ascending: true })
    .range(from, to);
}

async function queryContentType(client, examId, contentType) {
  const rows = [];
  for (let page = 0; ; page += 1) {
    const from = page * PROTECTED_STUDY_CONTENT_PAGE_SIZE;
    const to = from + PROTECTED_STUDY_CONTENT_PAGE_SIZE - 1;
    const result = await queryContentPage(client, examId, contentType, from, to);
    if (result?.error) return { data: null, error: result.error };
    if (!Array.isArray(result?.data)) {
      return { data: null, error: { message: 'Protected study content returned an invalid page.' } };
    }
    rows.push(...result.data);
    if (result.data.length < PROTECTED_STUDY_CONTENT_PAGE_SIZE) {
      return { data: rows, error: null };
    }
  }
}

export function createProtectedChecklistKnowledgeGuideService(client = supabase) {
  return Object.freeze({
    async listForExam(examId) {
      const exactExamId = cleanText(examId);
      if (!client || !exactExamId) {
        return {
          success: false,
          checklistItems: [],
          knowledgeGuides: [],
          error: 'An exact exam is required.'
        };
      }

      let checklistResult;
      let guideResult;
      try {
        [checklistResult, guideResult] = await Promise.all([
          queryContentType(client, exactExamId, CHECKLIST_CONTENT_TYPE),
          queryContentType(client, exactExamId, KNOWLEDGE_GUIDE_CONTENT_TYPE)
        ]);
      } catch (unexpectedError) {
        return {
          success: false,
          checklistItems: [],
          knowledgeGuides: [],
          error: unexpectedError?.message || 'Unable to load protected study content.'
        };
      }
      const databaseError = checklistResult?.error || guideResult?.error;
      if (databaseError) {
        return {
          success: false,
          checklistItems: [],
          knowledgeGuides: [],
          error: databaseError.message || 'Unable to load protected study content.'
        };
      }

      const checklistRows = Array.isArray(checklistResult?.data) ? checklistResult.data : [];
      const guideRows = Array.isArray(guideResult?.data) ? guideResult.data : [];
      const checklistItems = sortByOrder(checklistRows.map(mapProtectedChecklistRow).filter(Boolean));
      const knowledgeGuides = sortByOrder(guideRows.map(mapProtectedKnowledgeGuideRow).filter(Boolean));
      if (checklistItems.length !== checklistRows.length || knowledgeGuides.length !== guideRows.length) {
        return {
          success: false,
          checklistItems: [],
          knowledgeGuides: [],
          error: 'Protected Checklist or Knowledge Guide data failed validation.'
        };
      }
      return validateChecklistKnowledgeGuideRelationship({
        checklistItems,
        knowledgeGuides,
        examId: exactExamId
      });
    },

    async loadGuide(examId, checklistItemId) {
      const exactExamId = cleanText(examId);
      const stableId = cleanText(checklistItemId);
      if (!client || !exactExamId || !stableId) {
        return { success: false, guide: null, error: 'An exact exam and checklist item are required.' };
      }

      let data;
      let error;
      try {
        ({ data, error } = await client
          .from(CHECKLIST_GUIDE_CONTENT_TABLE)
          .select(SELECT_COLUMNS)
          .eq('exam_id', exactExamId)
          .eq('content_type', KNOWLEDGE_GUIDE_CONTENT_TYPE)
          .eq('content_id', knowledgeGuideDeliveryId(exactExamId, stableId))
          .eq('publication_status', PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED)
          .maybeSingle());
      } catch (unexpectedError) {
        return {
          success: false,
          guide: null,
          error: unexpectedError?.message || 'Unable to load the protected Knowledge Guide.'
        };
      }
      if (error) return { success: false, guide: null, error: error.message || 'Unable to load the protected Knowledge Guide.' };
      if (!data) return { success: false, guide: null, notFound: true, error: 'The protected Knowledge Guide is unavailable.' };
      const guide = mapProtectedKnowledgeGuideRow(data);
      return guide
        ? { success: true, guide }
        : { success: false, guide: null, error: 'Protected Knowledge Guide data failed validation.' };
    }
  });
}

export const protectedChecklistKnowledgeGuideService = createProtectedChecklistKnowledgeGuideService();
