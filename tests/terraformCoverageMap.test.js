import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';
import {
  TERRAFORM_FOLLOW_ALONG_REFERENCES,
  TERRAFORM_OBJECTIVE_COVERAGE,
  getTerraformCoverageRows,
  getTerraformCoverageSummary
} from '../src/data/terraformCoverageMap.js';

test('Terraform 004 content coverage map', async t => {
  await t.test('maps every official checklist objective exactly once', () => {
    const officialIds = TERRAFORM_ASSOCIATE_EXAM.topics.flatMap(topic => topic.items.map(item => item.id));
    const mappedIds = TERRAFORM_OBJECTIVE_COVERAGE.map(entry => entry.objectiveId);
    assert.equal(officialIds.length, 37);
    assert.equal(mappedIds.length, 37);
    assert.equal(new Set(mappedIds).size, 37);
    assert.deepEqual([...mappedIds].sort(), [...officialIds].sort());
  });

  await t.test('resolves every mapped content reference', () => {
    const rows = getTerraformCoverageRows();
    const questionIds = new Set(TERRAFORM_ASSOCIATE_EXAM.questions.map(question => question.id));
    const followAlongIds = new Set(Object.values(TERRAFORM_FOLLOW_ALONG_REFERENCES).map(programme => programme.id));

    for (const entry of TERRAFORM_OBJECTIVE_COVERAGE) {
      entry.questionIds.forEach(id => assert.equal(questionIds.has(id), true, `Unknown question ${id}`));
      entry.followAlongIds.forEach(id => assert.equal(followAlongIds.has(id), true, `Unknown Follow Along ${id}`));
    }

    assert.equal(rows.every(row => row.knowledgeGuide), true);
    assert.equal(rows.every(row => row.questions.length === coverageLength(row.id, 'questionIds')), true);
    assert.equal(rows.every(row => row.followAlongs.length === coverageLength(row.id, 'followAlongIds')), true);
    assert.equal(rows.every(row => row.troubleshooting.length === coverageLength(row.id, 'troubleshootingIds')), true);
  });

  await t.test('reports the current measured coverage and exact priority gaps', () => {
    const summary = getTerraformCoverageSummary();
    assert.equal(summary.objectives, 37);
    assert.equal(summary.knowledgeGuideObjectives, 37);
    assert.equal(summary.questionObjectives, 32);
    assert.equal(summary.followAlongObjectives, 28);
    assert.equal(summary.troubleshootingObjectives, 5);
    assert.equal(summary.questionBankSize, 30);
    assert.equal(summary.followAlongProgrammes, 4);
    assert.equal(summary.troubleshootingChallenges, 3);
    assert.deepEqual(summary.gaps.knowledgeGuide, []);
    assert.deepEqual(summary.gaps.questions, ['tf004-3c', 'tf004-3f', 'tf004-3g', 'tf004-4c', 'tf004-4d']);
  });

  await t.test('keeps a readable local planning document', () => {
    const report = fs.readFileSync('TERRAFORM_004_CONTENT_COVERAGE_MAP.md', 'utf8');
    assert.match(report, /37 of 37/);
    assert.match(report, /Immediate content priorities/);
    assert.match(report, /HCP Terraform Follow Along/);
    assert.match(report, /src\/data\/terraformCoverageMap\.js/);
  });
});

function coverageLength(objectiveId, key) {
  return TERRAFORM_OBJECTIVE_COVERAGE.find(entry => entry.objectiveId === objectiveId)?.[key]?.length || 0;
}
