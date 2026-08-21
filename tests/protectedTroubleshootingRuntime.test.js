import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import {
  applyProtectedTroubleshootingVisibility,
  TROUBLESHOOTING_PREVIEW_LIMIT
} from '../src/services/protectedTroubleshootingContentService.js';

const challenge = ({
  id,
  examId = 'aws-saa-c03',
  previewOrder = null,
  order = 1
}) => ({ id, examId, previewOrder, order });

test('Step 007C5 protected Troubleshooting runtime boundary', async t => {
  await t.test('keeps only deterministic preview rows for preview access', () => {
    const result = applyProtectedTroubleshootingVisibility({
      examId: 'aws-saa-c03',
      previewOnly: true,
      challenges: [
        challenge({ id: 'paid-only', order: 3 }),
        challenge({ id: 'preview-two', previewOrder: 2, order: 2 }),
        challenge({ id: 'preview-one', previewOrder: 1, order: 1 })
      ]
    });

    assert.equal(result.success, true);
    assert.equal(TROUBLESHOOTING_PREVIEW_LIMIT, 2);
    assert.deepEqual(result.challenges.map(item => item.id), ['preview-one', 'preview-two']);
  });

  await t.test('preserves complete exact-exam challenge IDs for complete access', () => {
    const challenges = [
      challenge({ id: 'preview-one', previewOrder: 1, order: 1 }),
      challenge({ id: 'paid-only', order: 2 })
    ];
    const result = applyProtectedTroubleshootingVisibility({
      examId: 'aws-saa-c03',
      previewOnly: false,
      challenges
    });

    assert.equal(result.success, true);
    assert.deepEqual(result.challenges.map(item => item.id), ['preview-one', 'paid-only']);
  });

  await t.test('fails closed on cross-exam, duplicate-ID or excessive preview data', () => {
    const crossExam = applyProtectedTroubleshootingVisibility({
      examId: 'aws-saa-c03',
      challenges: [challenge({ id: 'wrong-exam', examId: 'terraform-associate-004' })]
    });
    const duplicates = applyProtectedTroubleshootingVisibility({
      examId: 'aws-saa-c03',
      challenges: [challenge({ id: 'same' }), challenge({ id: 'same', order: 2 })]
    });
    const excessivePreview = applyProtectedTroubleshootingVisibility({
      examId: 'aws-saa-c03',
      previewOnly: true,
      challenges: [
        challenge({ id: 'one', previewOrder: 1 }),
        challenge({ id: 'two', previewOrder: 2, order: 2 }),
        challenge({ id: 'three', previewOrder: 3, order: 3 })
      ]
    });

    assert.equal(crossExam.success, false);
    assert.deepEqual(crossExam.challenges, []);
    assert.equal(duplicates.success, false);
    assert.deepEqual(duplicates.challenges, []);
    assert.equal(excessivePreview.success, false);
    assert.deepEqual(excessivePreview.challenges, []);
  });

  await t.test('loads only through the protected exact-exam service and exposes safe states', () => {
    const view = readFileSync('src/components/Troubleshooting/TroubleshootingView.jsx', 'utf8');
    const progressImport = readFileSync('src/components/Progress/LearnerProgressImportPanel.jsx', 'utf8');

    assert.match(view, /protectedTroubleshootingContentService\.listForExam\(examId\)/);
    assert.match(view, /previewOnly: isPreviewAccess/);
    assert.match(view, /status: 'loading'/);
    assert.match(view, /status: 'unavailable'/);
    assert.match(view, /status=\{protectedContentState\.status === 'ready' \? 'empty'/);
    assert.match(view, /no bundled challenge content was substituted/i);
    assert.match(view, /challengeIds: challenges\.map\(challenge => challenge\.id\)/);
    assert.doesNotMatch(view, /getTroubleshootingChallengesForExam|limitDemoTroubleshootingChallenges/);
    assert.match(progressImport, /protectedTroubleshootingContentService\.listForExam\(examId\)/);
    assert.doesNotMatch(progressImport, /getTroubleshootingChallengesForExam|troubleshootingChallenges\/index/);
  });

  await t.test('retains every independently editable frontend source during parity testing', () => {
    const sourceFiles = readdirSync('src/data/troubleshootingChallenges', {
      recursive: true,
      withFileTypes: true
    }).filter(entry => (
      entry.isFile()
      && entry.name.endsWith('.js')
      && !['index.js', 'generatedChallengeCatalogue.js'].includes(entry.name)
    ));
    const awsPreview = readFileSync('src/data/troubleshootingChallenges/aws/privateSubnetConnectivity.js', 'utf8');
    const terraformPreview = readFileSync('src/data/troubleshootingChallenges/terraform/terraformUnwantedReplacement.js', 'utf8');

    assert.equal(sourceFiles.length, 55);
    assert.match(awsPreview, /aws-private-subnet-connectivity/);
    assert.match(terraformPreview, /terraform-unwanted-replacement/);
  });
});
