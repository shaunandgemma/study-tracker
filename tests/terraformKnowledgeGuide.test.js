import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';
import {
  TERRAFORM_KNOWLEDGE_GUIDES,
  TERRAFORM_KNOWLEDGE_GUIDE_ORDER,
  getTerraformKnowledgeGuide,
  hasTerraformKnowledgeGuide
} from '../src/data/terraformKnowledgeGuide.js';

const read = path => readFileSync(path, 'utf8');

test('Terraform Knowledge Guide covers the complete checklist', async t => {
  const checklistItems = TERRAFORM_ASSOCIATE_EXAM.topics.flatMap(topic => topic.items);
  const guideEntries = Object.entries(TERRAFORM_KNOWLEDGE_GUIDES);

  await t.test('1. every one of the 37 checklist objectives has one guide', () => {
    assert.equal(checklistItems.length, 37);
    assert.equal(guideEntries.length, 37);
    assert.deepEqual(
      guideEntries.map(([id]) => id).sort(),
      checklistItems.map(item => item.id).sort()
    );
    assert.deepEqual(TERRAFORM_KNOWLEDGE_GUIDE_ORDER, checklistItems.map(item => item.id));
  });

  await t.test('1A. every clickable row has its own independently editable file', () => {
    for (const item of checklistItems) {
      const objectiveNumber = item.id.match(/tf004-(\d)/)?.[1];
      assert.equal(
        existsSync(`src/data/terraformKnowledgeGuide/objective-${objectiveNumber}/${item.id}.js`),
        true,
        `Missing individual guide file for ${item.id}`
      );
    }
    assert.equal(existsSync('src/data/terraformKnowledgeGuide/index.js'), true);
  });

  await t.test('2. each guide has the complete beginner study structure', () => {
    for (const [id, guide] of guideEntries) {
      assert.equal(guide.id, id);
      assert.ok(guide.title.length > 5);
      assert.ok(guide.plainEnglish.length > 40);
      assert.ok(guide.whyItMatters.length > 30);
      assert.ok(guide.workplaceExample.length > 30);
      assert.ok(guide.examFocus.length > 30);
      assert.ok(guide.commonMistake.length > 30);
      assert.ok(guide.keyPoints.length >= 3);
      assert.ok(guide.sources.length >= 2);
      assert.ok(guide.sources.every(source => source.url.startsWith('https://developer.hashicorp.com/terraform/')));
    }
  });

  await t.test('3. lookup helpers expose only known Terraform lessons', () => {
    assert.equal(getTerraformKnowledgeGuide('tf004-1a')?.title, 'What infrastructure as code means');
    assert.equal(hasTerraformKnowledgeGuide('tf004-8d'), true);
    assert.equal(getTerraformKnowledgeGuide('unknown-objective'), null);
    assert.equal(hasTerraformKnowledgeGuide('unknown-objective'), false);
  });

  await t.test('4. the Terraform checklist opens lessons without changing checklist storage', () => {
    const checklistView = read('src/components/StudyChecklist/ChecklistView.jsx');
    const topicCard = read('src/components/StudyChecklist/TopicCard.jsx');
    const page = read('src/components/StudyChecklist/TerraformKnowledgeGuidePage.jsx');
    const examLanding = read('src/components/Landing/ExamLandingPage.jsx');

    assert.match(examLanding, /title: 'Knowledge Guide'/);
    assert.match(examLanding, /Study all 37 Terraform lessons in checklist order/);
    assert.match(examLanding, /id: 'knowledge-guide'/);
    assert.match(checklistView, /activeExamId === 'terraform-associate-004'/);
    assert.match(checklistView, /<TerraformKnowledgeGuidePage/);
    assert.match(topicCard, /hasTerraformKnowledgeGuide\(item\.id\)/);
    assert.match(topicCard, /Open this Knowledge Guide lesson/);
    assert.match(page, /Why this matters/);
    assert.match(page, /Workplace example/);
    assert.match(page, /What to understand for the exam/);
    assert.match(page, /Common beginner mistake/);
    assert.match(page, /Official learning sources/);
    assert.match(page, /Previous lesson/);
    assert.match(page, /Next lesson/);
    assert.match(page, /Lesson \{currentIndex \+ 1\} of \{totalLessons\}/);
  });
});
