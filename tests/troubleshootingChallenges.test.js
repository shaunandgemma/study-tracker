import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  TROUBLESHOOTING_CHALLENGES,
  getTroubleshootingChallenge,
  getTroubleshootingChallengesForExam
} from '../src/data/troubleshootingChallenges/index.js';
import {
  buildRcaReport,
  calculateTroubleshootingScore,
  createEmptyTroubleshootingProgress
} from '../src/features/troubleshooting/troubleshootingProgress.js';

test('troubleshooting challenge catalogue', async t => {
  await t.test('contains every unique independently editable challenge', () => {
    const challengeFiles = fs.readdirSync('src/data/troubleshootingChallenges', {
      recursive: true,
      withFileTypes: true
    }).filter(entry => (
      entry.isFile()
      && entry.name.endsWith('.js')
      && !['index.js', 'generatedChallengeCatalogue.js'].includes(entry.name)
    ));

    assert.equal(TROUBLESHOOTING_CHALLENGES.length, challengeFiles.length);
    assert.equal(new Set(TROUBLESHOOTING_CHALLENGES.map(challenge => challenge.id)).size, challengeFiles.length);
    assert.ok(getTroubleshootingChallengesForExam('aws-saa-c03').length > 0);
    assert.ok(getTroubleshootingChallengesForExam('terraform-associate-004').length > 0);
    assert.equal(getTroubleshootingChallengesForExam('comptia-security-plus').length, 0);
    assert.equal(
      getTroubleshootingChallenge('aws-cloudfront-s3-access-denied')?.order,
      4
    );
  });

  await t.test('each challenge contains complete evidence, validation, hints and resolution', () => {
    for (const challenge of TROUBLESHOOTING_CHALLENGES) {
      assert.ok(challenge.title);
      assert.ok(challenge.scenario);
      assert.ok(challenge.task);
      assert.ok(challenge.evidence.length >= 2);
      assert.ok(challenge.successCriteria.length >= 4);
      assert.equal(challenge.hints.length, 3);
      assert.equal(challenge.validationQuestions.length, 2);
      assert.ok(challenge.solution.rootCause);
      assert.ok(challenge.solution.fix);
      assert.ok(challenge.solution.prevention);

      for (const question of challenge.validationQuestions) {
        assert.equal(question.options.length, 4);
        assert.ok(question.options.some(option => option.id === question.correctOptionId));
      }
    }
  });

  await t.test('catalogue lookups retain exam order', () => {
    for (const examId of ['aws-saa-c03', 'terraform-associate-004']) {
      const challenges = getTroubleshootingChallengesForExam(examId);
      assert.deepEqual(
        challenges.map(challenge => challenge.order),
        Array.from({ length: challenges.length }, (_, index) => index + 1)
      );
    }
    assert.equal(getTroubleshootingChallenge('aws-iam-access-denied')?.title, 'Diagnose an S3 AccessDenied response');
    assert.equal(getTroubleshootingChallenge('missing-challenge'), null);
  });
});

test('incident notebook and RCA helpers', async t => {
  await t.test('hint scoring is visible, bounded and assisted solutions score zero', () => {
    assert.equal(calculateTroubleshootingScore(0, false), 100);
    assert.equal(calculateTroubleshootingScore(1, false), 90);
    assert.equal(calculateTroubleshootingScore(3, false), 70);
    assert.equal(calculateTroubleshootingScore(20, false), 70);
    assert.equal(calculateTroubleshootingScore(0, true), 0);
  });

  await t.test('RCA output includes learner notes and completed resolution', () => {
    const challenge = getTroubleshootingChallenge('terraform-syntax-validation');
    const progress = {
      ...createEmptyTroubleshootingProgress(),
      observations: 'Validation points to line 15.',
      hypothesis: 'The argument syntax is malformed.',
      actions: 'Added the equals sign and ran validate.',
      pinnedEvidence: ['validate-output'],
      completed: true,
      score: 100
    };
    const report = buildRcaReport(challenge, progress);
    assert.match(report, /Validation points to line 15/);
    assert.match(report, /terraform validate output/);
    assert.match(report, /Diagnosis validated\. Score: 100\/100/);
    assert.match(report, /The bucket argument omitted the equals sign/);
  });

  await t.test('AWS and Terraform landing pages expose the shared tool', () => {
    const landing = fs.readFileSync('src/components/Landing/ExamLandingPage.jsx', 'utf8');
    const app = fs.readFileSync('src/App.jsx', 'utf8');
    const header = fs.readFileSync('src/components/Landing/ExamWorkspaceHeader.jsx', 'utf8');
    assert.match(landing, /id: 'troubleshooting'/);
    assert.match(landing, /aws-saa-c03/);
    assert.match(landing, /terraform-associate-004/);
    assert.match(app, /<TroubleshootingView/);
    assert.match(header, /troubleshooting: 'Troubleshooting'/);
  });
});
