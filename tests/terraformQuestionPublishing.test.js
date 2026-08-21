import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';
import { TERRAFORM_ASSOCIATE_QUESTIONS } from '../src/data/exams/terraformAssociateQuestions.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationPath = path.join(root, 'supabase', 'migrations', '20260830_expand_terraform_004_exam_questions_to_100.sql');

test('Terraform 004 uses protected Supabase delivery without bundling its full bank into the exam definition', () => {
  assert.equal(TERRAFORM_ASSOCIATE_EXAM.questionSource, 'supabase');
  assert.equal('questions' in TERRAFORM_ASSOCIATE_EXAM, false);
  assert.equal(TERRAFORM_ASSOCIATE_QUESTIONS.length, 100);
  assert.equal(new Set(TERRAFORM_ASSOCIATE_QUESTIONS.map(question => question.id)).size, 100);
});

test('Terraform question migration is guarded and scoped away from AWS questions', () => {
  const sql = fs.readFileSync(migrationPath, 'utf8');

  for (const question of TERRAFORM_ASSOCIATE_QUESTIONS) {
    assert.match(sql, new RegExp(`\\$tfq\\$${question.id}\\$tfq\\$`));
  }

  assert.match(sql, /exam_code <> 'terraform-associate-004'/);
  assert.match(sql, /expected 100 seed questions/);
  assert.match(sql, /topic mapping count is not 100/);
  assert.doesNotMatch(sql, /q-saa-/);
  assert.doesNotMatch(sql, /DELETE FROM public\.exam_questions/i);
  assert.doesNotMatch(sql, /exam_attempts|follow_along_|hands_on_/i);
});

test('protected question service fails closed instead of using a bundled full-bank fallback', () => {
  const service = fs.readFileSync(path.join(root, 'src', 'services', 'questionService.js'), 'utf8');
  const setup = fs.readFileSync(path.join(root, 'src', 'components', 'PrepExam', 'ExamSetup.jsx'), 'utf8');

  assert.match(service, /getExamQuestions\(examCode, localFallbackQuestions = null\)/);
  assert.match(service, /getQuestionsByTopic\(examCode, topicId, localFallbackQuestions = null\)/);
  assert.match(setup, /activeExam\.questionSource === 'supabase'/);
  assert.match(service, /PROTECTED_EXAM_QUESTION_IDS/);
  assert.doesNotMatch(service, /saa-c03-question-export\.json/);
  assert.match(service, /isProtectedExam\(examCode\)[\s\S]*?\? \[\]/);
});
