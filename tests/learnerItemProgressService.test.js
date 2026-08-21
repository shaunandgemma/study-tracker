import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createLearnerItemProgressService,
  LEARNER_PROGRESS_TYPES,
  validateLearnerItemProgress
} from '../src/services/learnerItemProgressService.js';

const USER_ID = '667ad4ce-312b-4f78-a3fa-366c8b669477';

function createSupabaseMock(options = {}) {
  const rows = structuredClone(options.rows || []);
  const calls = [];

  class Query {
    constructor(table) {
      this.table = table;
      this.operation = 'select';
      this.filters = [];
      this.payload = null;
      this.conflict = null;
    }

    select() {
      this.operation = this.operation === 'upsert' ? 'upsert' : 'select';
      return this;
    }

    eq(column, value) {
      this.filters.push([column, value]);
      return this;
    }

    order() {
      return this;
    }

    upsert(payload, settings) {
      this.operation = 'upsert';
      this.payload = structuredClone(payload);
      this.conflict = settings?.onConflict;
      return this;
    }

    async maybeSingle() {
      const result = await this.execute();
      return { ...result, data: result.data?.[0] || null };
    }

    then(resolve, reject) {
      return this.execute().then(resolve, reject);
    }

    async execute() {
      calls.push({
        table: this.table,
        operation: this.operation,
        filters: structuredClone(this.filters),
        payload: structuredClone(this.payload),
        conflict: this.conflict
      });

      if (this.operation === 'upsert') {
        if (options.upsertError) return { data: null, error: options.upsertError };
        const index = rows.findIndex(row => (
          row.user_id === this.payload.user_id
          && row.exam_id === this.payload.exam_id
          && row.progress_type === this.payload.progress_type
          && row.content_id === this.payload.content_id
        ));
        const saved = {
          ...(index >= 0 ? rows[index] : {}),
          ...structuredClone(this.payload),
          created_at: index >= 0 ? rows[index].created_at : '2026-08-20T10:00:00.000Z',
          updated_at: '2026-08-20T10:01:00.000Z'
        };
        if (index >= 0) rows[index] = saved;
        else rows.push(saved);
        return { data: null, error: null };
      }

      if (options.loadError) return { data: null, error: options.loadError };
      let selected = rows.filter(row => this.filters.every(([column, value]) => row[column] === value));
      if (options.readBackTransform) selected = selected.map(options.readBackTransform);
      return { data: structuredClone(selected), error: null };
    }
  }

  return {
    calls,
    rows,
    client: { from: table => new Query(table) }
  };
}

function studyInput(overrides = {}) {
  return {
    userId: USER_ID,
    examId: 'terraform-associate-004',
    progressType: LEARNER_PROGRESS_TYPES.STUDY_ITEM,
    contentId: 'tf004-1a',
    progressData: { completed: true, guide_opened: true },
    progressVersion: 1,
    ...overrides
  };
}

test('private learner item progress service', async t => {
  await t.test('1. rejects missing authenticated identity before contacting Supabase', async () => {
    const mock = createSupabaseMock();
    const result = await createLearnerItemProgressService({ supabaseClient: mock.client })
      .saveProgress(studyInput({ userId: '' }));
    assert.equal(result.success, false);
    assert.equal(result.validationError, true);
    assert.equal(result.unsaved, true);
    assert.equal(mock.calls.length, 0);
  });

  await t.test('2. rejects unsupported exams, keys, types and oversized progress locally', () => {
    assert.equal(validateLearnerItemProgress(studyInput({ examId: 'invented-exam' })).valid, false);
    assert.equal(validateLearnerItemProgress(studyInput({ progressData: { secret: 'no' } })).valid, false);
    assert.equal(validateLearnerItemProgress(studyInput({ progressData: { completed: 'yes' } })).valid, false);
    assert.equal(validateLearnerItemProgress(studyInput({ progressData: { last_section: 'x'.repeat(70000) } })).valid, false);
  });

  await t.test('3. saves once and performs a separate matching read-back', async () => {
    const mock = createSupabaseMock();
    const service = createLearnerItemProgressService({ supabaseClient: mock.client });
    const result = await service.saveProgress(studyInput());
    assert.equal(result.success, true);
    assert.equal(result.verified, true);
    assert.equal(result.unsaved, false);
    assert.equal(mock.calls.length, 2);
    assert.equal(mock.calls[0].operation, 'upsert');
    assert.equal(mock.calls[0].conflict, 'user_id,exam_id,progress_type,content_id');
    assert.equal(mock.calls[1].operation, 'select');
    assert.deepEqual(mock.calls[1].filters, [
      ['user_id', USER_ID],
      ['exam_id', 'terraform-associate-004'],
      ['progress_type', 'study_item'],
      ['content_id', 'tf004-1a']
    ]);
  });

  await t.test('4. never claims success when read-back differs', async () => {
    const mock = createSupabaseMock({
      readBackTransform: row => ({ ...row, progress_data: { completed: false } })
    });
    const result = await createLearnerItemProgressService({ supabaseClient: mock.client })
      .saveProgress(studyInput());
    assert.equal(result.success, false);
    assert.equal(result.verificationFailed, true);
    assert.equal(result.unsaved, true);
  });

  await t.test('5. reports a failed write without attempting read-back', async () => {
    const mock = createSupabaseMock({ upsertError: { message: 'RLS denied the write.' } });
    const result = await createLearnerItemProgressService({ supabaseClient: mock.client })
      .saveProgress(studyInput());
    assert.equal(result.success, false);
    assert.equal(result.writeFailed, true);
    assert.equal(result.unsaved, true);
    assert.equal(mock.calls.length, 1);
  });

  await t.test('6. loads only the requested learner and exam', async () => {
    const mock = createSupabaseMock({ rows: [
      {
        user_id: USER_ID,
        exam_id: 'terraform-associate-004',
        progress_type: 'study_item',
        content_id: 'tf004-1a',
        progress_data: { completed: true },
        progress_version: 1
      },
      {
        user_id: USER_ID,
        exam_id: 'aws-saa-c03',
        progress_type: 'study_item',
        content_id: 'iam-1',
        progress_data: { completed: true },
        progress_version: 1
      }
    ] });
    const result = await createLearnerItemProgressService({ supabaseClient: mock.client })
      .loadExamProgress({ userId: USER_ID, examId: 'terraform-associate-004' });
    assert.equal(result.success, true);
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].content_id, 'tf004-1a');
    assert.deepEqual(mock.calls[0].filters, [
      ['user_id', USER_ID],
      ['exam_id', 'terraform-associate-004']
    ]);
  });

  await t.test('7. reports private-load failures without returning another fallback', async () => {
    const mock = createSupabaseMock({ loadError: { message: 'RLS denied the read.' } });
    const result = await createLearnerItemProgressService({ supabaseClient: mock.client })
      .loadExamProgress({ userId: USER_ID, examId: 'terraform-associate-004' });
    assert.equal(result.success, false);
    assert.equal(result.loadFailed, true);
    assert.equal(result.unsaved, true);
    assert.equal(result.rows, undefined);
  });

  await t.test('8. exposes no direct delete operation', () => {
    const service = createLearnerItemProgressService({ supabaseClient: createSupabaseMock().client });
    assert.deepEqual(Object.keys(service).sort(), ['loadExamProgress', 'loadItem', 'saveProgress']);
  });

  await t.test('9. remains isolated from UI, local storage, entitlements and Follow Along storage', () => {
    const source = readFileSync('src/services/learnerItemProgressService.js', 'utf8');
    assert.doesNotMatch(source, /localStorage|sessionStorage|ExamContext|TroubleshootingView|ChecklistView/);
    assert.doesNotMatch(source, /exam_entitlements|payment|checkout|subscription/);
    assert.doesNotMatch(source, /user_learning_path_progress|user_learning_path_resources/);
  });
});
