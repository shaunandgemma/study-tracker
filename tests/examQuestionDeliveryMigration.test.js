import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = relativePath => fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
const migration = read('supabase/migrations/20260903_protect_exam_question_delivery.sql');
const verification = read('tests/sql/exam_question_delivery_post_deployment_verification.sql');
const service = read('src/services/questionService.js');
const terraformExam = read('src/data/exams/terraformAssociateExam.js');

test('Step 004K protected exam-question delivery', async t => {
  await t.test('preserves rows and creates at most ten deterministic preview questions per exam', () => {
    assert.equal((migration.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((migration.match(/^COMMIT;$/gm) || []).length, 1);
    assert.match(migration, /CREATE TEMP TABLE question_delivery_counts_before/);
    assert.match(migration, /ADD COLUMN preview_order SMALLINT NULL/);
    assert.match(migration, /ROW_NUMBER\(\) OVER[\s\S]*?PARTITION BY exam_code/);
    assert.match(migration, /ranked\.question_position <= 10/);
    assert.match(migration, /COUNT\(\*\)[\s\S]*?question or topic rows changed unexpectedly/);
    assert.doesNotMatch(migration, /DELETE FROM public\.(?:exam_questions|question_topics)/i);
  });

  await t.test('replaces unrestricted public reads with preview or trusted complete access', () => {
    assert.match(migration, /DROP POLICY IF EXISTS "Allow public read access to exam_questions"/);
    assert.match(migration, /DROP POLICY IF EXISTS "Allow public read access to question_topics"/);
    assert.match(migration, /CREATE POLICY "Preview exam questions"/);
    assert.match(migration, /CREATE POLICY "Entitled exam questions"/);
    assert.match(migration, /CREATE POLICY "Trusted role exam questions"/);
    assert.match(migration, /preview_order BETWEEN 1 AND 10/);
    assert.match(migration, /entitlement\.user_id = auth\.uid\(\)/);
    assert.match(migration, /entitlement\.exam_id = exam_questions\.exam_code/);
    assert.match(migration, /entitlement\.status = 'active'/);
    assert.match(migration, /entitlement\.starts_at <= clock_timestamp\(\)/);
    assert.match(migration, /entitlement\.expires_at > clock_timestamp\(\)/);
    for (const role of ['author', 'approver', 'admin']) {
      assert.match(migration, new RegExp(`'${role}'`));
    }
    assert.match(migration, /AND NOT[\s\S]*?'approver'/);
    assert.match(migration, /AND NOT[\s\S]*?'author'/);
  });

  await t.test('topic mappings are visible only when their question is visible', () => {
    assert.match(migration, /CREATE POLICY "Topics for visible exam questions"/);
    assert.match(migration, /FROM public\.exam_questions visible_question/);
    assert.match(migration, /visible_question\.id = question_topics\.question_id/);
  });

  await t.test('browser roles receive read-only access and no secret writer', () => {
    assert.match(migration, /REVOKE ALL PRIVILEGES[\s\S]*?FROM PUBLIC, anon, authenticated/);
    assert.match(migration, /GRANT SELECT[\s\S]*?TO anon, authenticated/);
    assert.doesNotMatch(migration, /GRANT\s+(?:INSERT|UPDATE|DELETE|ALL)/i);
    assert.doesNotMatch(migration, /SECURITY DEFINER|service_role|SUPABASE_SERVICE_ROLE_KEY/i);
    assert.doesNotMatch(migration, /CREATE(?: OR REPLACE)? FUNCTION/i);
  });

  await t.test('protected browser runtime has no full-bank fallback import', () => {
    assert.match(service, /PROTECTED_EXAM_QUESTION_IDS/);
    assert.doesNotMatch(service, /saa-c03-question-export\.json/);
    assert.match(service, /return isProtectedExam\(examCode\)[\s\S]*?\? \[\]/);
    assert.doesNotMatch(terraformExam, /terraformAssociateQuestions|questions:\s*TERRAFORM_ASSOCIATE_QUESTIONS/);
  });

  await t.test('post-deployment verification is read-only and rollback-only', () => {
    const executable = verification.replace(/^--.*$/gm, '');
    assert.equal((executable.match(/^BEGIN;$/gm) || []).length, 1);
    assert.equal((executable.match(/^SET TRANSACTION READ ONLY;$/gm) || []).length, 1);
    assert.equal((executable.match(/^ROLLBACK;$/gm) || []).length, 1);
    assert.doesNotMatch(
      executable,
      /^\s*(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE|GRANT|REVOKE|COMMIT)\b/im
    );
  });
});
