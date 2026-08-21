import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createLearnerTroubleshootingProgress,
  fromTroubleshootingProgressRow,
  hasMeaningfulTroubleshootingProgress,
  reconcileTroubleshootingProgress,
  toTroubleshootingProgressData,
  TROUBLESHOOTING_SYNC_BLOCK_REASONS,
  troubleshootingProgressMatches
} from '../src/services/learnerTroubleshootingProgress.js';

const USER_ID = '667ad4ce-312b-4f78-a3fa-366c8b669477';
const EXAM_ID = 'terraform-associate-004';
const CHALLENGE_ID = 'terraform-syntax-validation';

const notebook = (overrides = {}) => ({
  observations: 'Validation points to line 15.',
  hypothesis: 'The syntax is malformed.',
  actions: 'Ran terraform validate.',
  pinnedEvidence: ['validate-output'],
  revealedHints: 1,
  answers: { diagnosis: 'syntax' },
  completed: false,
  solutionRevealed: false,
  score: null,
  updatedAt: '2026-08-20T12:00:00.000Z',
  ...overrides
});

const remoteRow = (progress = notebook()) => ({
  user_id: USER_ID,
  exam_id: EXAM_ID,
  progress_type: 'troubleshooting_challenge',
  content_id: CHALLENGE_ID,
  progress_data: toTroubleshootingProgressData(progress),
  progress_version: 1,
  updated_at: '2026-08-20T12:05:00.000Z'
});

test('private Troubleshooting Challenge notebook integration', async t => {
  await t.test('1. converts browser and database field names without losing notebook content', () => {
    const original = notebook();
    const data = toTroubleshootingProgressData(original);
    assert.deepEqual(data.pinned_evidence_ids, ['validate-output']);
    assert.equal(data.revealed_hints, 1);
    assert.equal(data.solution_revealed, false);

    const restored = fromTroubleshootingProgressRow(remoteRow(original));
    assert.equal(restored.observations, original.observations);
    assert.deepEqual(restored.pinnedEvidence, original.pinnedEvidence);
    assert.deepEqual(restored.answers, original.answers);
  });

  await t.test('2. distinguishes an empty notebook from learner-authored work', () => {
    assert.equal(hasMeaningfulTroubleshootingProgress(null), false);
    assert.equal(hasMeaningfulTroubleshootingProgress({}), false);
    assert.equal(hasMeaningfulTroubleshootingProgress(notebook()), true);
  });

  await t.test('3. loads account content only when the browser notebook is empty', () => {
    const result = reconcileTroubleshootingProgress({
      browserProgress: {},
      examId: EXAM_ID,
      challengeIds: [CHALLENGE_ID],
      rows: [remoteRow()]
    });
    assert.equal(result.progress[CHALLENGE_ID].observations, notebook().observations);
    assert.deepEqual(result.blocked, {});
    assert.equal(result.loadedAccountRows, 1);
  });

  await t.test('4. never silently merges different browser and account notes', () => {
    const browser = notebook({ observations: 'Browser-only finding.' });
    const result = reconcileTroubleshootingProgress({
      browserProgress: { [CHALLENGE_ID]: browser },
      examId: EXAM_ID,
      challengeIds: [CHALLENGE_ID],
      rows: [remoteRow(notebook({ observations: 'Different account finding.' }))]
    });
    assert.equal(result.progress[CHALLENGE_ID].observations, 'Browser-only finding.');
    assert.equal(result.blocked[CHALLENGE_ID], TROUBLESHOOTING_SYNC_BLOCK_REASONS.CONTENT_CONFLICT);
  });

  await t.test('5. pauses an existing browser notebook when no account copy exists', () => {
    const result = reconcileTroubleshootingProgress({
      browserProgress: { [CHALLENGE_ID]: notebook() },
      examId: EXAM_ID,
      challengeIds: [CHALLENGE_ID],
      rows: []
    });
    assert.equal(result.blocked[CHALLENGE_ID], TROUBLESHOOTING_SYNC_BLOCK_REASONS.BROWSER_IMPORT_REQUIRED);
  });

  await t.test('6. permits future saves when both copies already match', () => {
    const browser = notebook({ updatedAt: 'older-device-time' });
    const account = notebook({ updatedAt: 'server-time' });
    assert.equal(troubleshootingProgressMatches(browser, account), true);
    const result = reconcileTroubleshootingProgress({
      browserProgress: { [CHALLENGE_ID]: browser },
      examId: EXAM_ID,
      challengeIds: [CHALLENGE_ID],
      rows: [remoteRow(account)]
    });
    assert.deepEqual(result.blocked, {});
  });

  await t.test('7. sends one complete private notebook through the verified service', async () => {
    const calls = [];
    const integration = createLearnerTroubleshootingProgress({
      service: {
        loadExamProgress: async input => ({ success: true, rows: [], input }),
        saveProgress: async input => {
          calls.push(input);
          return { success: true, verified: true };
        }
      }
    });
    const result = await integration.saveChallenge({
      userId: USER_ID,
      examId: EXAM_ID,
      challengeId: CHALLENGE_ID,
      progress: notebook()
    });
    assert.equal(result.verified, true);
    assert.equal(calls[0].progressType, 'troubleshooting_challenge');
    assert.equal(calls[0].contentId, CHALLENGE_ID);
    assert.equal(calls[0].progressData.observations, notebook().observations);
  });

  await t.test('8. retains browser-first saving and excludes Demo or signed-out account writes', () => {
    const view = readFileSync('src/components/Troubleshooting/TroubleshootingView.jsx', 'utf8');
    assert.match(view, /saveTroubleshootingProgress\(updated, progressStorage\)/);
    assert.match(view, /!isDemoAccount && currentUser\?\.id/);
    assert.match(view, /accountProgressEnabled/);
    assert.match(view, /needs a controlled comparison/);
  });
});
