import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const file = 'tests/sql/learner_item_progress_two_identity_rls_verification.sql';
const sql = readFileSync(file, 'utf8');
const normalized = sql.replace(/\s+/g, ' ').trim();

test('Step 004F two-identity RLS verification script', async t => {
  await t.test('1. uses one transaction and always rolls back', () => {
    assert.equal((sql.match(/^BEGIN;/gm) || []).length, 1);
    assert.equal((sql.match(/^ROLLBACK;/gm) || []).length, 1);
    assert.doesNotMatch(sql, /^COMMIT;/m);
  });

  await t.test('2. is bound to the two exact approved authenticated identities', () => {
    assert.match(sql, /667ad4ce-312b-4f78-a3fa-366c8b669477/);
    assert.match(sql, /0a70410c-912f-4a67-a0ad-a8543b6bf6d4/);
    assert.equal((sql.match(/SET LOCAL ROLE authenticated;/g) || []).length, 3);
    assert.equal((sql.match(/RESET ROLE;/g) || []).length, 3);
  });

  await t.test('3. uses only two collision-guarded disposable content identifiers', () => {
    assert.match(sql, /__step004f_identity_a_20260820__/);
    assert.match(sql, /__step004f_identity_b_20260820__/);
    assert.match(normalized, /IF existing_test_rows <> 0 THEN RAISE EXCEPTION/);
  });

  await t.test('4. proves own reads and updates in both directions', () => {
    assert.match(sql, /Identity A reads its own row/);
    assert.match(sql, /Identity B reads its own row/);
    assert.match(sql, /Identity A updates its own row/);
    assert.match(sql, /Identity B updates its own row/);
  });

  await t.test('5. proves cross-account reads and updates return zero rows', () => {
    assert.match(sql, /Identity B cannot read Identity A row/);
    assert.match(sql, /Identity B cannot update Identity A row/);
    assert.match(sql, /Identity A cannot read Identity B row/);
    assert.match(sql, /Identity A cannot update Identity B row/);
    assert.ok((sql.match(/COUNT\(\*\) = 0/g) || []).length >= 4);
  });

  await t.test('6. creates no permanent object and deletes no existing data', () => {
    assert.match(sql, /CREATE TEMPORARY TABLE/);
    assert.doesNotMatch(sql, /CREATE TABLE public\./i);
    assert.doesNotMatch(sql, /\bDELETE\s+FROM\b/i);
    assert.doesNotMatch(sql, /\bTRUNCATE\b/i);
    assert.doesNotMatch(sql, /^\s*DROP\b/im);
    assert.doesNotMatch(sql, /\bALTER\s+TABLE\b/i);
  });

  await t.test('7. verifies no disposable row remains after rollback', () => {
    assert.match(sql, /no_step004f_rows_remain/);
    assert.match(normalized, /ROLLBACK; SELECT COUNT\(\*\) = 0 AS no_step004f_rows_remain/);
  });
});
