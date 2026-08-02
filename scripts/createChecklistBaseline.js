import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';

function hashObject(obj) {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash('sha256').update(str).digest('hex');
}

const baseline = {
  timestamp: new Date().toISOString(),
  totalTasks: INITIAL_SEED_TASKS.length,
  tasks: INITIAL_SEED_TASKS.map(task => {
    const { verification, cleanup, ...nonChecklist } = task;
    return {
      id: task.id,
      slug: task.slug,
      nonChecklistHash: hashObject(nonChecklist),
      verificationLength: Array.isArray(verification) ? verification.length : 0,
      verificationItems: (Array.isArray(verification) ? verification : []).map(item => ({
        id: item.id,
        text: item.text ?? ''
      })),
      cleanupLength: Array.isArray(cleanup) ? cleanup.length : 0,
      cleanupItems: (Array.isArray(cleanup) ? cleanup : []).map(item => ({
        id: item.id,
        text: item.text ?? ''
      }))
    };
  })
};

const outputPath = path.resolve('migration_work/hands_on_tasks/checklist-baseline.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(baseline, null, 2), 'utf-8');

console.log(`Baseline created for ${baseline.totalTasks} tasks at ${outputPath}`);
