import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';
import { validateTaskSchema } from '../src/services/taskService.js';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_PROJECT_REF = 'mbouckqylgarxrmtxego';
const TABLE_PATH = '/rest/v1/hands_on_tasks';

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = String(selector(item));
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, canonicalize(value[key])])
    );
  }
  return value;
}

export function stableJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function mapTaskToRow(task) {
  return {
    id: task.id,
    exam_code: task.examCode,
    topic_id: task.topicId,
    title: task.title,
    slug: task.slug,
    service: task.service,
    feature: task.feature,
    difficulty: task.difficulty,
    estimated_minutes: task.estimatedMinutes,
    region: task.region,
    content: task,
    status: task.status
  };
}

export function auditSourceTasks(tasks = INITIAL_SEED_TASKS) {
  const rejected = [];
  const requiredDatabaseFields = [
    'id', 'examCode', 'topicId', 'title', 'slug', 'service', 'feature',
    'difficulty', 'estimatedMinutes', 'region', 'status'
  ];

  tasks.forEach((task, index) => {
    try {
      validateTaskSchema(task);
      for (const field of requiredDatabaseFields) {
        if (task[field] === undefined || task[field] === null || task[field] === '') {
          throw new Error(`Missing database field '${field}'`);
        }
      }
      if (!Number.isInteger(task.estimatedMinutes) || task.estimatedMinutes <= 0) {
        throw new Error('estimatedMinutes must be a positive integer');
      }
      if (!['draft', 'published', 'archived'].includes(task.status)) {
        throw new Error(`Unsupported status '${task.status}'`);
      }
    } catch (error) {
      rejected.push({ index, id: task?.id || null, error: error.message });
    }
  });

  const duplicateIds = duplicateValues(tasks.map(task => task.id));
  const duplicateSlugs = duplicateValues(tasks.map(task => task.slug));

  return {
    sourceTaskCount: tasks.length,
    validTaskCount: tasks.length - rejected.length,
    rejectedTaskCount: rejected.length,
    uniqueTaskCount: new Set(tasks.map(task => task.id)).size,
    duplicateIds,
    duplicateSlugs,
    examCodeCounts: countBy(tasks, task => task.examCode),
    statusCounts: countBy(tasks, task => task.status),
    rejected
  };
}

function comparableRow(row) {
  return {
    id: row.id,
    exam_code: row.exam_code,
    topic_id: row.topic_id,
    title: row.title,
    slug: row.slug,
    service: row.service,
    feature: row.feature,
    difficulty: row.difficulty,
    estimated_minutes: row.estimated_minutes,
    region: row.region,
    content: row.content,
    status: row.status
  };
}

export function createImportPlan(sourceTasks, liveRows) {
  const audit = auditSourceTasks(sourceTasks);
  if (audit.rejectedTaskCount || audit.duplicateIds.length || audit.duplicateSlugs.length) {
    return { audit, inserts: [], updates: [], unchanged: [], conflicts: [] };
  }

  const sourceRows = sourceTasks.map(mapTaskToRow);
  const liveById = new Map(liveRows.map(row => [row.id, row]));
  const liveSlugOwners = new Map(liveRows.map(row => [row.slug, row.id]));
  const inserts = [];
  const updates = [];
  const unchanged = [];
  const conflicts = [];

  for (const row of sourceRows) {
    const conflictingId = liveSlugOwners.get(row.slug);
    if (conflictingId && conflictingId !== row.id) {
      conflicts.push({ id: row.id, slug: row.slug, existingId: conflictingId });
      continue;
    }

    const liveRow = liveById.get(row.id);
    if (!liveRow) {
      inserts.push(row);
    } else if (stableJson(comparableRow(liveRow)) === stableJson(row)) {
      unchanged.push(row);
    } else {
      updates.push(row);
    }
  }

  return { audit, inserts, updates, unchanged, conflicts };
}

async function loadEnvFile() {
  const envPath = resolve(PROJECT_ROOT, '.env.local');
  const contents = await readFile(envPath, 'utf8');
  const values = {};
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    values[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return values;
}

function createRestClient(url, apiKey) {
  const baseUrl = url.replace(/\/$/, '');
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': 'study-tracker-hands-on-import/1.0'
  };

  return {
    async listAll(select = '*', key = apiKey) {
      const response = await fetch(`${baseUrl}${TABLE_PATH}?select=${encodeURIComponent(select)}&order=id.asc`, {
        headers: { ...headers, apikey: key, Authorization: `Bearer ${key}`, Range: '0-999' }
      });
      if (!response.ok) throw new Error(`Task inventory failed (${response.status}): ${await response.text()}`);
      return response.json();
    },

    async upsert(rows) {
      const response = await fetch(`${baseUrl}${TABLE_PATH}?on_conflict=id`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(rows)
      });
      if (!response.ok) throw new Error(`Task upsert failed (${response.status}): ${await response.text()}`);
    }
  };
}

function summarizePlan(plan, liveRows) {
  return {
    sourceTaskCount: plan.audit.sourceTaskCount,
    validTaskCount: plan.audit.validTaskCount,
    rejectedTaskCount: plan.audit.rejectedTaskCount,
    liveTaskCountBefore: liveRows.length,
    inserts: plan.inserts.length,
    updates: plan.updates.length,
    unchanged: plan.unchanged.length,
    duplicateIds: plan.audit.duplicateIds,
    duplicateSlugs: plan.audit.duplicateSlugs,
    liveSlugConflicts: plan.conflicts,
    examCodeCounts: plan.audit.examCodeCounts,
    statusCounts: plan.audit.statusCounts,
    rejected: plan.audit.rejected
  };
}

async function writeJsonReport(relativePath, value) {
  const target = resolve(PROJECT_ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return target;
}

async function run() {
  const apply = process.argv.includes('--apply');
  const env = await loadEnvFile();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !serviceKey || !publishableKey) {
    throw new Error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and VITE_SUPABASE_PUBLISHABLE_KEY are required.');
  }
  if (!supabaseUrl.includes(DEFAULT_PROJECT_REF)) {
    throw new Error(`Refusing to import into unexpected Supabase project: ${supabaseUrl}`);
  }

  const audit = auditSourceTasks();
  if (audit.rejectedTaskCount || audit.duplicateIds.length || audit.duplicateSlugs.length) {
    throw new Error(`Source audit failed: ${JSON.stringify(audit)}`);
  }

  const client = createRestClient(supabaseUrl, serviceKey);
  const liveRows = await client.listAll('*');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = await writeJsonReport(
    `data/backups/hands-on-tasks/hands_on_tasks-before-import-${timestamp}.json`,
    liveRows
  );
  const plan = createImportPlan(INITIAL_SEED_TASKS, liveRows);
  const report = summarizePlan(plan, liveRows);
  const reportPath = await writeJsonReport(
    `migration_work/hands_on_tasks/SAA/import-${apply ? 'apply' : 'dry-run'}-${timestamp}.json`,
    { mode: apply ? 'apply' : 'dry-run', backupPath, ...report }
  );

  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', backupPath, reportPath, ...report }, null, 2));

  if (!apply) return;
  if (plan.conflicts.length) throw new Error('Live slug conflicts prevent import. See dry-run report.');

  const changedRows = [...plan.inserts, ...plan.updates].map(row => ({
    ...row,
    updated_at: new Date().toISOString()
  }));
  const batchSize = 10;
  for (let index = 0; index < changedRows.length; index += batchSize) {
    await client.upsert(changedRows.slice(index, index + batchSize));
  }

  const liveRowsAfter = await client.listAll('*');
  const verifyPlan = createImportPlan(INITIAL_SEED_TASKS, liveRowsAfter);
  const anonymousRows = await client.listAll('id,exam_code,status', publishableKey);
  const verification = {
    liveTaskCountAfter: liveRowsAfter.length,
    publishedTaskCountByExamAndStatus: countBy(liveRowsAfter, row => `${row.exam_code}|${row.status}`),
    anonymousPublishedTaskCount: anonymousRows.length,
    remainingInserts: verifyPlan.inserts.length,
    remainingUpdates: verifyPlan.updates.length,
    unchangedCanonicalRows: verifyPlan.unchanged.length,
    conflicts: verifyPlan.conflicts
  };
  await writeJsonReport(
    `migration_work/hands_on_tasks/SAA/import-verification-${timestamp}.json`,
    verification
  );
  console.log(JSON.stringify({ verification }, null, 2));

  if (
    verification.remainingInserts ||
    verification.remainingUpdates ||
    verification.conflicts.length ||
    verification.anonymousPublishedTaskCount !== audit.statusCounts.published
  ) {
    throw new Error('Post-import verification failed. Inspect the verification report and backup.');
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  run().catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
