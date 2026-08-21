import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  PROTECTED_CONTENT_ACCESS_LEVELS,
  PROTECTED_CONTENT_PREVIEW_LIMITS,
  PROTECTED_CONTENT_PUBLICATION_STATES,
  PROTECTED_CONTENT_TABLE_DESIGN,
  PROTECTED_CONTENT_TYPES,
  evaluateProtectedContentAccess,
  validateProtectedContentRecord
} from '../src/features/access/protectedContentContract.js';
import { buildApplicationAccessPolicy } from '../src/features/access/applicationAccessPolicy.js';

const user = (id, appMetadata = {}) => ({ id, app_metadata: appMetadata });
const NOW = Date.parse('2026-08-20T12:00:00.000Z');
const HASH = 'a'.repeat(64);

function record(overrides = {}) {
  return {
    contentId: 'tf004-guide-1',
    examId: 'terraform-associate-004',
    contentType: PROTECTED_CONTENT_TYPES.KNOWLEDGE_GUIDE,
    parentContentId: 'tf004-checklist-1',
    title: 'Infrastructure as code',
    sortOrder: 0,
    previewOrder: null,
    publicationStatus: PROTECTED_CONTENT_PUBLICATION_STATES.PUBLISHED,
    contentVersion: 1,
    contentHash: HASH,
    payload: { plainEnglish: 'Protected lesson body.' },
    ...overrides
  };
}

test('Step 007B protected-content structure and policy contract', async t => {
  await t.test('defines one scalable protected row structure without browser writes', () => {
    assert.equal(PROTECTED_CONTENT_TABLE_DESIGN.tableName, 'learner_content_items');
    for (const column of [
      'content_id',
      'exam_id',
      'content_type',
      'sort_order',
      'preview_order',
      'publication_status',
      'content_version',
      'content_hash',
      'payload'
    ]) {
      assert.ok(PROTECTED_CONTENT_TABLE_DESIGN.columns.includes(column));
    }
    assert.deepEqual(PROTECTED_CONTENT_TABLE_DESIGN.browserPrivileges, ['select']);
    assert.ok(!PROTECTED_CONTENT_TABLE_DESIGN.browserPrivileges.includes('insert'));
    assert.ok(!PROTECTED_CONTENT_TABLE_DESIGN.browserPrivileges.includes('update'));
    assert.ok(!PROTECTED_CONTENT_TABLE_DESIGN.browserPrivileges.includes('delete'));
  });

  await t.test('uses the existing curated preview sizes for all four content types', () => {
    assert.deepEqual(PROTECTED_CONTENT_PREVIEW_LIMITS, {
      checklist_item: 10,
      knowledge_guide: 10,
      follow_along: 2,
      troubleshooting_challenge: 2
    });
  });

  await t.test('accepts a complete versioned record and rejects unsafe or ambiguous records', () => {
    assert.deepEqual(validateProtectedContentRecord(record()), { valid: true, errors: [] });
    assert.equal(validateProtectedContentRecord(record({ payload: 'frontend source' })).valid, false);
    assert.equal(validateProtectedContentRecord(record({ contentHash: 'not-a-hash' })).valid, false);
    assert.equal(validateProtectedContentRecord(record({ publicationStatus: 'available' })).valid, false);
    assert.equal(validateProtectedContentRecord(record({ previewOrder: 11 })).valid, false);
    assert.equal(validateProtectedContentRecord(record({ contentType: 'unknown' })).valid, false);
  });

  await t.test('allows only deterministic published preview rows without complete access', () => {
    const signedOut = buildApplicationAccessPolicy(null);
    const demo = buildApplicationAccessPolicy({ id: 'demo-read-only', is_demo: true });
    const registeredFree = buildApplicationAccessPolicy(user('free-user'));
    const preview = record({ previewOrder: 1 });
    const paidOnly = record({ previewOrder: null });

    for (const accessPolicy of [signedOut, demo, registeredFree]) {
      assert.equal(
        evaluateProtectedContentAccess({ record: preview, accessPolicy }).accessLevel,
        PROTECTED_CONTENT_ACCESS_LEVELS.PREVIEW
      );
      assert.equal(
        evaluateProtectedContentAccess({ record: paidOnly, accessPolicy }).accessLevel,
        PROTECTED_CONTENT_ACCESS_LEVELS.NONE
      );
    }
  });

  await t.test('grants complete content only for the learner exact active exam', () => {
    const paidPolicy = buildApplicationAccessPolicy(user('paid-user'), {
      now: NOW,
      verifiedEntitlements: [{
        user_id: 'paid-user',
        exam_id: 'terraform-associate-004',
        status: 'active',
        starts_at: '2026-08-01T00:00:00.000Z',
        expires_at: '2027-08-01T00:00:00.000Z'
      }]
    });

    assert.equal(
      evaluateProtectedContentAccess({ record: record(), accessPolicy: paidPolicy }).accessLevel,
      PROTECTED_CONTENT_ACCESS_LEVELS.COMPLETE
    );
    assert.equal(
      evaluateProtectedContentAccess({
        record: record({ examId: 'aws-saa-c03' }),
        accessPolicy: paidPolicy
      }).accessLevel,
      PROTECTED_CONTENT_ACCESS_LEVELS.NONE
    );
    assert.equal(
      evaluateProtectedContentAccess({
        record: record({ examId: 'aws-saa-c03', previewOrder: 1 }),
        accessPolicy: paidPolicy
      }).accessLevel,
      PROTECTED_CONTENT_ACCESS_LEVELS.PREVIEW
    );
  });

  await t.test('preserves full staff learning access and denies conflicting staff complete access', () => {
    for (const role of ['author', 'approver', 'admin']) {
      const staffPolicy = buildApplicationAccessPolicy(user(`${role}-user`, { roles: [role] }));
      assert.equal(
        evaluateProtectedContentAccess({ record: record(), accessPolicy: staffPolicy }).accessLevel,
        PROTECTED_CONTENT_ACCESS_LEVELS.COMPLETE
      );
    }

    const conflictPolicy = buildApplicationAccessPolicy(user('conflict-user', {
      roles: ['author', 'approver']
    }));
    assert.equal(conflictPolicy.roleConflict, true);
    assert.equal(
      evaluateProtectedContentAccess({ record: record(), accessPolicy: conflictPolicy }).accessLevel,
      PROTECTED_CONTENT_ACCESS_LEVELS.NONE
    );
    assert.equal(
      evaluateProtectedContentAccess({
        record: record({ previewOrder: 1 }),
        accessPolicy: conflictPolicy
      }).accessLevel,
      PROTECTED_CONTENT_ACCESS_LEVELS.PREVIEW
    );
  });

  await t.test('never serves drafts, withdrawn rows or malformed bodies', () => {
    const adminPolicy = buildApplicationAccessPolicy(user('admin-user', { roles: ['admin'] }));

    for (const protectedRecord of [
      record({ publicationStatus: PROTECTED_CONTENT_PUBLICATION_STATES.DRAFT }),
      record({ publicationStatus: PROTECTED_CONTENT_PUBLICATION_STATES.WITHDRAWN }),
      record({ payload: null }),
      record({ examId: '' })
    ]) {
      assert.equal(
        evaluateProtectedContentAccess({ record: protectedRecord, accessPolicy: adminPolicy }).accessLevel,
        PROTECTED_CONTENT_ACCESS_LEVELS.NONE
      );
    }
  });

  await t.test('is a local unintegrated contract with no database or network action', () => {
    const source = fs.readFileSync(
      new URL('../src/features/access/protectedContentContract.js', import.meta.url),
      'utf8'
    );
    assert.doesNotMatch(source, /\.from\(['"]|supabase\.|fetch\(|CREATE TABLE|ALTER TABLE|INSERT INTO|UPDATE\s+public\.|DELETE FROM/i);
  });
});
