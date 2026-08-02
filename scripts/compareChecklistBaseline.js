import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';

function hashObject(obj) {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('sha256').update(str).digest('hex');
}

const baselinePath = path.resolve('migration_work/hands_on_tasks/checklist-baseline.json');
if (!fs.existsSync(baselinePath)) {
  console.error(`Baseline file not found at ${baselinePath}`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
const baselineMap = new Map(baseline.tasks.map(t => [t.id, t]));

let errors = 0;
let changedVerificationCount = 0;
let preservedVerificationCount = 0;
let changedCleanupCount = 0;
let preservedCleanupCount = 0;
const changedTaskIds = new Set();
const changedModulePaths = new Set();

if (INITIAL_SEED_TASKS.length !== baseline.totalTasks) {
  console.error(`Mismatch in total tasks count: current ${INITIAL_SEED_TASKS.length}, baseline ${baseline.totalTasks}`);
  errors++;
}

for (const task of INITIAL_SEED_TASKS) {
  const baseTask = baselineMap.get(task.id);
  if (!baseTask) {
    console.error(`Task ${task.id} not found in baseline!`);
    errors++;
    continue;
  }

  if (task.slug !== baseTask.slug) {
    console.error(`Slug mismatch for task ${task.id}: current '${task.slug}', baseline '${baseTask.slug}'`);
    errors++;
  }

  const { verification, cleanup, ...nonChecklist } = task;
  const currentHash = hashObject(nonChecklist);
  if (currentHash !== baseTask.nonChecklistHash) {
    console.error(`Non-checklist fields modified for task ${task.id}!`);
    errors++;
  }

  const vList = Array.isArray(verification) ? verification : [];
  if (vList.length !== baseTask.verificationLength) {
    console.error(`Verification array length changed for task ${task.id}: current ${vList.length}, baseline ${baseTask.verificationLength}`);
    errors++;
  } else {
    vList.forEach((item, idx) => {
      const baseItem = baseTask.verificationItems[idx];
      if (item.id !== baseItem.id) {
        console.error(`Verification item ID mismatch at index ${idx} for task ${task.id}: current '${item.id}', baseline '${baseItem.id}'`);
        errors++;
      }
      if (baseItem.text !== '') {
        if (item.text !== baseItem.text) {
          console.error(`Pre-existing meaningful verification text modified for task ${task.id}, item ${item.id}!`);
          errors++;
        } else {
          preservedVerificationCount++;
        }
      } else {
        if (!item.text || item.text.trim().length === 0) {
          console.error(`Empty verification item not populated for task ${task.id}, item ${item.id}`);
          errors++;
        } else {
          changedVerificationCount++;
          changedTaskIds.add(task.id);
        }
      }
    });
  }

  const cList = Array.isArray(cleanup) ? cleanup : [];
  if (cList.length !== baseTask.cleanupLength) {
    console.error(`Cleanup array length changed for task ${task.id}: current ${cList.length}, baseline ${baseTask.cleanupLength}`);
    errors++;
  } else {
    cList.forEach((item, idx) => {
      const baseItem = baseTask.cleanupItems[idx];
      if (item.id !== baseItem.id) {
        console.error(`Cleanup item ID mismatch at index ${idx} for task ${task.id}: current '${item.id}', baseline '${baseItem.id}'`);
        errors++;
      }
      if (baseItem.text !== '') {
        if (item.text !== baseItem.text) {
          console.error(`Pre-existing meaningful cleanup text modified for task ${task.id}, item ${item.id}!`);
          errors++;
        } else {
          preservedCleanupCount++;
        }
      } else {
        if (!item.text || item.text.trim().length === 0) {
          console.error(`Empty cleanup item not populated for task ${task.id}, item ${item.id}`);
          errors++;
        } else {
          changedCleanupCount++;
          changedTaskIds.add(task.id);
        }
      }
    });
  }
}

if (errors > 0) {
  console.error(`Baseline Comparison FAILED with ${errors} errors.`);
  process.exit(1);
} else {
  console.log(`Baseline Comparison PASSED with ZERO errors!`);
  console.log(`Populated verification entries: ${changedVerificationCount} (Preserved: ${preservedVerificationCount})`);
  console.log(`Populated cleanup entries: ${changedCleanupCount} (Preserved: ${preservedCleanupCount})`);
  console.log(`Total repaired tasks: ${changedTaskIds.size}`);
}
