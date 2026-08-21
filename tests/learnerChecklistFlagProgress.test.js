import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createLearnerChecklistFlagProgress,
  mergeLearnerAccountProgress,
  supportsLearnerAccountProgress
} from '../src/services/learnerChecklistFlagProgress.js';

const USER_ID = '667ad4ce-312b-4f78-a3fa-366c8b669477';
const EXAM_ID = 'terraform-associate-004';

test('checklist and question-flag account integration', async t => {
  await t.test('1. supports only the current permanent exam IDs', () => {
    assert.equal(supportsLearnerAccountProgress(EXAM_ID), true);
    assert.equal(supportsLearnerAccountProgress('custom-exam'), false);
  });

  await t.test('2. loads remote progress into missing browser values', () => {
    const merged = mergeLearnerAccountProgress({
      examId: EXAM_ID,
      checklist: { [EXAM_ID]: {} },
      flagged: { [EXAM_ID]: {} },
      rows: [
        { exam_id: EXAM_ID, progress_type: 'study_item', content_id: 'task-1', progress_data: { completed: true } },
        { exam_id: EXAM_ID, progress_type: 'question_flag', content_id: 'q-1', progress_data: { flagged: true } }
      ]
    });
    assert.equal(merged.checklist[EXAM_ID]['task-1'], true);
    assert.equal(merged.flagged[EXAM_ID]['q-1'], true);
    assert.equal(merged.appliedRows, 2);
  });

  await t.test('3. preserves completed browser work and explicit browser flags', () => {
    const merged = mergeLearnerAccountProgress({
      examId: EXAM_ID,
      checklist: { [EXAM_ID]: { 'task-1': true } },
      flagged: { [EXAM_ID]: { 'q-1': false } },
      rows: [
        { exam_id: EXAM_ID, progress_type: 'study_item', content_id: 'task-1', progress_data: { completed: false } },
        { exam_id: EXAM_ID, progress_type: 'question_flag', content_id: 'q-1', progress_data: { flagged: true } }
      ]
    });
    assert.equal(merged.checklist[EXAM_ID]['task-1'], true);
    assert.equal(merged.flagged[EXAM_ID]['q-1'], false);
    assert.equal(merged.preservedBrowserChoices, 2);
  });

  await t.test('4. ignores malformed and unrelated rows safely', () => {
    const merged = mergeLearnerAccountProgress({
      examId: EXAM_ID,
      rows: [
        { exam_id: 'aws-saa-c03', progress_type: 'study_item', content_id: 'task-1', progress_data: { completed: true } },
        { exam_id: EXAM_ID, progress_type: 'study_item', content_id: 'task-2', progress_data: { completed: 'yes' } }
      ]
    });
    assert.equal(merged.ignoredRows, 2);
    assert.deepEqual(merged.checklist[EXAM_ID], {});
  });

  await t.test('5. maps checklist and flag actions to the private service', async () => {
    const calls = [];
    const service = {
      loadExamProgress: async input => {
        calls.push(['load', input]);
        return { success: true, rows: [] };
      },
      saveProgress: async input => {
        calls.push(['save', input]);
        return { success: true, verified: true };
      }
    };
    const integration = createLearnerChecklistFlagProgress({ service });

    await integration.loadExamProgress({ userId: USER_ID, examId: EXAM_ID });
    await integration.saveChecklistItem({ userId: USER_ID, examId: EXAM_ID, contentId: 42, completed: true });
    await integration.saveQuestionFlag({ userId: USER_ID, examId: EXAM_ID, contentId: 'q-2', flagged: false });

    assert.deepEqual(calls[0], ['load', { userId: USER_ID, examId: EXAM_ID }]);
    assert.equal(calls[1][1].progressType, 'study_item');
    assert.equal(calls[1][1].contentId, '42');
    assert.deepEqual(calls[1][1].progressData, { completed: true });
    assert.equal(calls[2][1].progressType, 'question_flag');
    assert.deepEqual(calls[2][1].progressData, { flagged: false });
  });

  await t.test('6. keeps Demo and guest writes out of the integration boundary', () => {
    const source = readFileSync('src/context/ExamContext.jsx', 'utf8');
    assert.match(source, /!isDemoAccount && currentUser\?\.id/);
    assert.match(source, /accountProgressEnabled/);
    assert.match(source, /saveChecklistState\(updated\)/);
    assert.match(source, /saveFlaggedState\(updated\)/);
  });

  await t.test('7. exposes a visible warning when account verification fails', () => {
    const context = readFileSync('src/context/ExamContext.jsx', 'utf8');
    const app = readFileSync('src/App.jsx', 'utf8');
    assert.match(context, /could not be verified in your account/);
    assert.match(app, /Account progress needs attention/);
    assert.match(app, /progressSyncError/);
  });
});
