import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildLearnerProgressImportPreview,
  createLearnerProgressImportCoordinator,
  LEARNER_PROGRESS_IMPORT_AUDIT_KEY
} from '../src/services/learnerProgressImport.js';
import { toTroubleshootingProgressData } from '../src/services/learnerTroubleshootingProgress.js';

const USER_ID = '667ad4ce-312b-4f78-a3fa-366c8b669477';
const OTHER_USER_ID = '0a70410c-912f-4a67-a0ad-a8543b6bf6d4';
const EXAM_ID = 'terraform-associate-004';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

function notebook(observations) {
  return {
    observations,
    hypothesis: 'Check configuration.',
    actions: 'Run validate.',
    pinnedEvidence: [],
    revealedHints: 0,
    answers: {},
    completed: false,
    solutionRevealed: false,
    score: null,
    updatedAt: '2026-08-20T12:00:00.000Z'
  };
}

function row(progressType, contentId, progressData) {
  return {
    user_id: USER_ID,
    exam_id: EXAM_ID,
    progress_type: progressType,
    content_id: contentId,
    progress_data: progressData,
    progress_version: 1,
    updated_at: '2026-08-20T12:05:00.000Z'
  };
}

function snapshot() {
  return {
    checklist: { 'tf004-1a': true, 'tf004-1b': false },
    flagged: { 'tf-q-1': true },
    troubleshooting: {
      'challenge-safe': notebook('Browser-only notebook.'),
      'challenge-conflict': notebook('Browser conflict text.')
    }
  };
}

test('controlled browser-to-account learner progress import', async t => {
  await t.test('1. shows exact safe changes, matches and notebook conflicts', async () => {
    const preview = await buildLearnerProgressImportPreview({
      userId: USER_ID,
      examId: EXAM_ID,
      browserSnapshot: snapshot(),
      challengeIds: ['challenge-safe', 'challenge-conflict'],
      accountRows: [
        row('study_item', 'tf004-1a', { completed: true }),
        row('question_flag', 'tf-q-1', { flagged: false }),
        row('troubleshooting_challenge', 'challenge-conflict', toTroubleshootingProgressData(notebook('Different account text.')))
      ]
    });
    assert.deepEqual(preview.counts, {
      checklistChanges: 1,
      questionFlagChanges: 1,
      troubleshootingImports: 1,
      conflicts: 1,
      matchingItems: 1,
      safeChanges: 3
    });
    assert.equal(preview.conflicts[0].contentId, 'challenge-conflict');
    assert.equal(preview.safeActions.some(action => action.contentId === 'challenge-conflict'), false);
    assert.match(preview.fingerprint, /^[a-f0-9]{64}$/);
  });

  await t.test('2. binds the comparison fingerprint to the exact learner and exam', async () => {
    const base = { examId: EXAM_ID, browserSnapshot: snapshot(), accountRows: [], challengeIds: ['challenge-safe', 'challenge-conflict'] };
    const first = await buildLearnerProgressImportPreview({ ...base, userId: USER_ID });
    const otherUser = await buildLearnerProgressImportPreview({ ...base, userId: OTHER_USER_ID });
    const otherExam = await buildLearnerProgressImportPreview({ ...base, userId: USER_ID, examId: 'aws-saa-c03' });
    assert.notEqual(first.fingerprint, otherUser.fingerprint);
    assert.notEqual(first.fingerprint, otherExam.fingerprint);
  });

  await t.test('3. stops when browser or account state changes after preview', async () => {
    const service = {
      loadExamProgress: async () => ({ success: true, rows: [] }),
      saveProgress: async () => ({ success: true, verified: true })
    };
    const coordinator = createLearnerProgressImportCoordinator({ service, storage: memoryStorage() });
    const accepted = await coordinator.preview({ userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    const changed = snapshot();
    changed.checklist['tf004-1a'] = false;
    const result = await coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: changed, challengeIds: ['challenge-safe', 'challenge-conflict'] });
    assert.equal(result.success, false);
    assert.equal(result.stale, true);
  });

  await t.test('4. verifies every safe write and records repeat protection only after success', async () => {
    const storage = memoryStorage();
    const calls = [];
    const conflictRow = row(
      'troubleshooting_challenge',
      'challenge-conflict',
      toTroubleshootingProgressData(notebook('Different account text.'))
    );
    const service = {
      loadExamProgress: async () => ({ success: true, rows: [conflictRow] }),
      saveProgress: async input => {
        calls.push(input);
        return { success: true, verified: true };
      }
    };
    const coordinator = createLearnerProgressImportCoordinator({
      service,
      storage,
      now: () => new Date('2026-08-20T15:00:00.000Z')
    });
    const accepted = await coordinator.preview({ userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    const result = await coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    assert.equal(result.success, true);
    assert.equal(result.importedItems, 4);
    assert.equal(calls.length, 4);
    assert.equal(calls.some(call => call.contentId === 'challenge-conflict'), false);
    const audits = JSON.parse(storage.getItem(LEARNER_PROGRESS_IMPORT_AUDIT_KEY));
    assert.equal(Object.keys(audits).length, 1);
    assert.equal(Object.values(audits)[0].userId, USER_ID);

    const repeated = await coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    assert.equal(repeated.success, false);
    assert.equal(repeated.alreadyImported, true);
    assert.equal(calls.length, 4);
  });

  await t.test('5. records no audit when even one write cannot be verified', async () => {
    const storage = memoryStorage();
    let writeCount = 0;
    const coordinator = createLearnerProgressImportCoordinator({
      storage,
      service: {
        loadExamProgress: async () => ({ success: true, rows: [] }),
        saveProgress: async () => {
          writeCount += 1;
          return writeCount === 2 ? { success: false, unsaved: true } : { success: true, verified: true };
        }
      }
    });
    const accepted = await coordinator.preview({ userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    const result = await coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    assert.equal(result.success, false);
    assert.equal(result.partial, true);
    assert.equal(storage.getItem(LEARNER_PROGRESS_IMPORT_AUDIT_KEY), null);
  });

  await t.test('6. blocks a duplicate click while the exact import is still running', async () => {
    let releaseWrite;
    const writeGate = new Promise(resolve => { releaseWrite = resolve; });
    const coordinator = createLearnerProgressImportCoordinator({
      storage: memoryStorage(),
      service: {
        loadExamProgress: async () => ({ success: true, rows: [] }),
        saveProgress: async () => {
          await writeGate;
          return { success: true, verified: true };
        }
      }
    });
    const accepted = await coordinator.preview({ userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    const first = coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    const duplicate = await coordinator.importPreview({ acceptedPreview: accepted, userId: USER_ID, examId: EXAM_ID, browserSnapshot: snapshot(), challengeIds: ['challenge-safe', 'challenge-conflict'] });
    assert.equal(duplicate.success, false);
    assert.equal(duplicate.alreadyRunning, true);
    releaseWrite();
    assert.equal((await first).success, true);
  });

  await t.test('7. learner UI requires a signed-in non-Demo account and explicit confirmation', () => {
    const panel = readFileSync('src/components/Progress/LearnerProgressImportPanel.jsx', 'utf8');
    const app = readFileSync('src/App.jsx', 'utf8');
    assert.match(panel, /!currentUser\?\.id \|\| isDemoAccount/);
    assert.match(panel, /I confirm these/);
    assert.match(panel, /disabled=\{!confirmed \|\| loading\}/);
    assert.match(panel, /skip all notebook conflicts/);
    assert.match(app, /<LearnerProgressImportPanel examId=\{activeExamId\}/);
  });
});
