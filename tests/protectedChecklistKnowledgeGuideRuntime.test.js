import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import {
  applyProtectedChecklistKnowledgeGuideVisibility,
  buildProtectedChecklistTopics,
  CHECKLIST_PREVIEW_LIMIT,
  KNOWLEDGE_GUIDE_PREVIEW_LIMIT
} from '../src/services/protectedChecklistKnowledgeGuideService.js';

const checklistItem = ({
  id,
  examId = 'terraform-associate-004',
  order = 0,
  previewOrder = null,
  topicId = 'objective-1',
  topicIndex = 0,
  itemIndex = order
}) => ({
  id,
  text: `Understand ${id}`,
  examId,
  topicId,
  topicCode: 'Objective 1',
  topicTitle: 'Terraform foundations',
  topicDescription: 'Foundational objectives',
  topicWeight: 10,
  topicIndex,
  itemIndex,
  order,
  previewOrder
});

const guide = item => ({
  id: item.id,
  checklistItemId: item.id,
  examId: item.examId,
  order: item.order,
  previewOrder: item.previewOrder,
  title: `Guide ${item.id}`
});

test('Step 007D3 protected Checklist and Knowledge Guide runtime boundary', async t => {
  await t.test('keeps only matching deterministic preview rows for preview access', () => {
    const previewOne = checklistItem({ id: 'tf004-1a', previewOrder: 1 });
    const previewTwo = checklistItem({ id: 'tf004-1b', order: 1, itemIndex: 1, previewOrder: 2 });
    const paidOnly = checklistItem({ id: 'tf004-1c', order: 2, itemIndex: 2 });
    const result = applyProtectedChecklistKnowledgeGuideVisibility({
      examId: 'terraform-associate-004',
      previewOnly: true,
      checklistItems: [previewOne, previewTwo, paidOnly],
      knowledgeGuides: [guide(previewOne), guide(previewTwo), guide(paidOnly)]
    });

    assert.equal(result.success, true);
    assert.equal(CHECKLIST_PREVIEW_LIMIT, 10);
    assert.equal(KNOWLEDGE_GUIDE_PREVIEW_LIMIT, 10);
    assert.deepEqual(result.checklistItems.map(item => item.id), ['tf004-1a', 'tf004-1b']);
    assert.deepEqual(result.knowledgeGuides.map(item => item.id), ['tf004-1a', 'tf004-1b']);
  });

  await t.test('preserves complete exact-exam stable IDs and builds ordered topics', () => {
    const first = checklistItem({ id: 'tf004-1a' });
    const second = checklistItem({ id: 'tf004-1b', order: 1, itemIndex: 1 });
    const visible = applyProtectedChecklistKnowledgeGuideVisibility({
      examId: 'terraform-associate-004',
      checklistItems: [first, second],
      knowledgeGuides: [guide(first), guide(second)]
    });
    const topics = buildProtectedChecklistTopics({
      examId: 'terraform-associate-004',
      checklistItems: visible.checklistItems
    });

    assert.equal(visible.success, true);
    assert.equal(topics.success, true);
    assert.deepEqual(topics.topics.map(topic => topic.id), ['objective-1']);
    assert.deepEqual(topics.topics[0].items.map(item => item.id), ['tf004-1a', 'tf004-1b']);
  });

  await t.test('fails closed on cross-exam, duplicate, mismatched preview or malformed topic data', () => {
    const valid = checklistItem({ id: 'tf004-1a', previewOrder: 1 });
    const crossExam = checklistItem({ id: 'tf004-1b', examId: 'aws-saa-c03', order: 1, itemIndex: 1 });
    const mismatchedGuide = { ...guide(valid), previewOrder: 2 };

    assert.equal(applyProtectedChecklistKnowledgeGuideVisibility({
      examId: 'terraform-associate-004',
      checklistItems: [valid, crossExam],
      knowledgeGuides: []
    }).success, false);
    assert.equal(applyProtectedChecklistKnowledgeGuideVisibility({
      examId: 'terraform-associate-004',
      checklistItems: [valid, valid],
      knowledgeGuides: []
    }).success, false);
    assert.equal(applyProtectedChecklistKnowledgeGuideVisibility({
      examId: 'terraform-associate-004',
      previewOnly: true,
      checklistItems: [valid],
      knowledgeGuides: [mismatchedGuide]
    }).success, false);
    assert.equal(buildProtectedChecklistTopics({
      examId: 'terraform-associate-004',
      checklistItems: [{ ...valid, topicId: '' }]
    }).success, false);
  });

  await t.test('loads only protected exact-exam content and exposes safe states without fallback', () => {
    const checklistView = readFileSync('src/components/StudyChecklist/ChecklistView.jsx', 'utf8');
    const topicCard = readFileSync('src/components/StudyChecklist/TopicCard.jsx', 'utf8');

    assert.match(checklistView, /protectedChecklistKnowledgeGuideService\.listForExam\(activeExamId\)/);
    assert.match(checklistView, /applyProtectedChecklistKnowledgeGuideVisibility\([\s\S]*previewOnly: isPreviewAccess/);
    assert.match(checklistView, /buildProtectedChecklistTopics/);
    assert.match(checklistView, /status: 'loading'/);
    assert.match(checklistView, /status: 'unavailable'/);
    assert.match(checklistView, /status=\{protectedContentState\.status === 'ready' \? 'empty'/);
    assert.match(checklistView, /status="guide-empty"/);
    assert.match(checklistView, /No bundled Checklist or Knowledge Guide content was substituted/);
    assert.match(checklistView, /guide=\{selectedGuide\}/);
    assert.match(checklistView, /contentManagementEnabled=\{false\}/);
    assert.match(topicCard, /canManageContent && contentManagementEnabled/);
    assert.doesNotMatch(checklistView, /getAwsKnowledgeGuide|getTerraformKnowledgeGuide|getDemoChecklistTopics|getDemoKnowledgeGuideOrder|TERRAFORM_KNOWLEDGE_GUIDE_ORDER/);
  });

  await t.test('retains all independently editable source files during parity testing', () => {
    assert.equal(readdirSync('src/data/awsKnowledgeGuide', { recursive: true })
      .filter(name => name.endsWith('.js') && !name.endsWith('createAwsKnowledgeGuide.js')).length, 1547);
    assert.equal(readdirSync('src/data/terraformKnowledgeGuide', { recursive: true })
      .filter(name => name.endsWith('.js') && !name.endsWith('index.js')).length, 37);
    assert.match(readFileSync('src/data/examData.js', 'utf8'), /"id": "vpc-1"/);
    assert.match(readFileSync('src/data/exams/terraformAssociateExam.js', 'utf8'), /id: 'tf004-1a'/);
  });
});
