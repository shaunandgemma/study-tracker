import {
  LEARNER_PROGRESS_EXAM_IDS,
  LEARNER_PROGRESS_TYPES,
  learnerItemProgressService
} from './learnerItemProgressService.js';

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export function supportsLearnerAccountProgress(examId) {
  return LEARNER_PROGRESS_EXAM_IDS.includes(String(examId || '').trim());
}

export function mergeLearnerAccountProgress({ checklist = {}, flagged = {}, examId, rows = [] }) {
  const localChecklist = checklist[examId] || {};
  const localFlags = flagged[examId] || {};
  const mergedChecklist = { ...localChecklist };
  const mergedFlags = { ...localFlags };
  let appliedRows = 0;
  let preservedBrowserChoices = 0;
  let ignoredRows = 0;

  for (const row of Array.isArray(rows) ? rows : []) {
    if (row?.exam_id !== examId || typeof row?.content_id !== 'string') {
      ignoredRows += 1;
      continue;
    }

    if (
      row.progress_type === LEARNER_PROGRESS_TYPES.STUDY_ITEM
      && typeof row.progress_data?.completed === 'boolean'
    ) {
      const browserCompleted = localChecklist[row.content_id];
      if (browserCompleted === true && row.progress_data.completed === false) {
        preservedBrowserChoices += 1;
      } else {
        mergedChecklist[row.content_id] = row.progress_data.completed;
        appliedRows += 1;
      }
      continue;
    }

    if (
      row.progress_type === LEARNER_PROGRESS_TYPES.QUESTION_FLAG
      && typeof row.progress_data?.flagged === 'boolean'
    ) {
      if (hasOwn(localFlags, row.content_id)) {
        if (localFlags[row.content_id] !== row.progress_data.flagged) {
          preservedBrowserChoices += 1;
        }
      } else {
        mergedFlags[row.content_id] = row.progress_data.flagged;
        appliedRows += 1;
      }
      continue;
    }

    ignoredRows += 1;
  }

  return {
    checklist: { ...checklist, [examId]: mergedChecklist },
    flagged: { ...flagged, [examId]: mergedFlags },
    appliedRows,
    preservedBrowserChoices,
    ignoredRows
  };
}

export function createLearnerChecklistFlagProgress(options = {}) {
  const service = options.service || learnerItemProgressService;

  const loadExamProgress = ({ userId, examId }) => service.loadExamProgress({ userId, examId });

  const saveChecklistItem = ({ userId, examId, contentId, completed }) => service.saveProgress({
    userId,
    examId,
    progressType: LEARNER_PROGRESS_TYPES.STUDY_ITEM,
    contentId: String(contentId),
    progressData: { completed: Boolean(completed) },
    progressVersion: 1
  });

  const saveQuestionFlag = ({ userId, examId, contentId, flagged }) => service.saveProgress({
    userId,
    examId,
    progressType: LEARNER_PROGRESS_TYPES.QUESTION_FLAG,
    contentId: String(contentId),
    progressData: { flagged: Boolean(flagged) },
    progressVersion: 1
  });

  return Object.freeze({
    loadExamProgress,
    saveChecklistItem,
    saveQuestionFlag
  });
}

export const learnerChecklistFlagProgress = createLearnerChecklistFlagProgress();
