import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_SEED_TASKS } from '../src/data/tasksData.js';

const isMeaningful = (item) => typeof item?.text === 'string' && item.text.trim().length > 0;

const totalTasks = INITIAL_SEED_TASKS.length;

// Mandatory assertion 1: totalTasks === 211
if (totalTasks !== 211) {
  console.error(`Assertion Failed: totalTasks is ${totalTasks}, expected 211.`);
  process.exit(1);
}

const perTaskRecords = [];
const zeroMeaningfulVerificationTasks = [];
const zeroMeaningfulCleanupTasks = [];
const mixedVerificationTasks = [];
const mixedCleanupTasks = [];

let verificationTotal = 0;
let verificationMeaningful = 0;
let verificationEmpty = 0;

let cleanupTotal = 0;
let cleanupMeaningful = 0;
let cleanupEmpty = 0;

for (const task of INITIAL_SEED_TASKS) {
  const vList = Array.isArray(task.verification) ? task.verification : [];
  const cList = Array.isArray(task.cleanup) ? task.cleanup : [];

  const vTot = vList.length;
  const vMean = vList.filter(isMeaningful).length;
  const vEmp = vTot - vMean;

  const cTot = cList.length;
  const cMean = cList.filter(isMeaningful).length;
  const cEmp = cTot - cMean;

  // Mandatory per-task assertions
  if (vTot !== vMean + vEmp) {
    console.error(`Assertion Failed for task ${task.id}: vTot (${vTot}) !== vMean (${vMean}) + vEmp (${vEmp})`);
    process.exit(1);
  }
  if (cTot !== cMean + cEmp) {
    console.error(`Assertion Failed for task ${task.id}: cTot (${cTot}) !== cMean (${cMean}) + cEmp (${cEmp})`);
    process.exit(1);
  }

  perTaskRecords.push({
    id: task.id,
    title: task.title,
    verificationTotal: vTot,
    verificationMeaningful: vMean,
    verificationEmpty: vEmp,
    cleanupTotal: cTot,
    cleanupMeaningful: cMean,
    cleanupEmpty: cEmp
  });

  verificationTotal += vTot;
  verificationMeaningful += vMean;
  verificationEmpty += vEmp;

  cleanupTotal += cTot;
  cleanupMeaningful += cMean;
  cleanupEmpty += cEmp;

  const taskSummary = { id: task.id, title: task.title };

  if (vMean === 0) {
    zeroMeaningfulVerificationTasks.push(taskSummary);
  }
  if (cMean === 0) {
    zeroMeaningfulCleanupTasks.push(taskSummary);
  }
  if (vMean > 0 && vEmp > 0) {
    mixedVerificationTasks.push(taskSummary);
  }
  if (cMean > 0 && cEmp > 0) {
    mixedCleanupTasks.push(taskSummary);
  }
}

// Mandatory global assertions
if (verificationTotal !== verificationMeaningful + verificationEmpty) {
  console.error(`Assertion Failed: verificationTotal (${verificationTotal}) !== verificationMeaningful (${verificationMeaningful}) + verificationEmpty (${verificationEmpty})`);
  process.exit(1);
}

if (cleanupTotal !== cleanupMeaningful + cleanupEmpty) {
  console.error(`Assertion Failed: cleanupTotal (${cleanupTotal}) !== cleanupMeaningful (${cleanupMeaningful}) + cleanupEmpty (${cleanupEmpty})`);
  process.exit(1);
}

// Recalculate totals from perTaskRecords array and assert match
const recalcVTot = perTaskRecords.reduce((acc, r) => acc + r.verificationTotal, 0);
const recalcVMean = perTaskRecords.reduce((acc, r) => acc + r.verificationMeaningful, 0);
const recalcVEmp = perTaskRecords.reduce((acc, r) => acc + r.verificationEmpty, 0);

const recalcCTot = perTaskRecords.reduce((acc, r) => acc + r.cleanupTotal, 0);
const recalcCMean = perTaskRecords.reduce((acc, r) => acc + r.cleanupMeaningful, 0);
const recalcCEmp = perTaskRecords.reduce((acc, r) => acc + r.cleanupEmpty, 0);

if (recalcVTot !== verificationTotal || recalcVMean !== verificationMeaningful || recalcVEmp !== verificationEmpty) {
  console.error(`Assertion Failed: Recalculated verification totals do not match aggregated global totals.`);
  process.exit(1);
}

if (recalcCTot !== cleanupTotal || recalcCMean !== cleanupMeaningful || recalcCEmp !== cleanupEmpty) {
  console.error(`Assertion Failed: Recalculated cleanup totals do not match aggregated global totals.`);
  process.exit(1);
}

// Specific raw examples
const s3TargetId = 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001';
const s3Task = INITIAL_SEED_TASKS.find(t => t.id === s3TargetId);
const ec2Task = INITIAL_SEED_TASKS.find(t => t.id.includes('-ec2-'));
const vpcTask = INITIAL_SEED_TASKS.find(t => t.id.includes('-vpc-'));
const rdsTask = INITIAL_SEED_TASKS.find(t => t.id.includes('-rds-'));
const dynamoTask = INITIAL_SEED_TASKS.find(t => t.id.includes('-dynamodb-'));

if (!s3Task) {
  console.error(`Target S3 task ${s3TargetId} not found!`);
  process.exit(1);
}

const rawExamples = {
  s3: { id: s3Task.id, title: s3Task.title, verification: s3Task.verification, cleanup: s3Task.cleanup },
  ec2: ec2Task ? { id: ec2Task.id, title: ec2Task.title, verification: ec2Task.verification, cleanup: ec2Task.cleanup } : null,
  vpc: vpcTask ? { id: vpcTask.id, title: vpcTask.title, verification: vpcTask.verification, cleanup: vpcTask.cleanup } : null,
  rds: rdsTask ? { id: rdsTask.id, title: rdsTask.title, verification: rdsTask.verification, cleanup: rdsTask.cleanup } : null,
  dynamodb: dynamoTask ? { id: dynamoTask.id, title: dynamoTask.title, verification: dynamoTask.verification, cleanup: dynamoTask.cleanup } : null
};

const report = {
  totalTasks,
  verificationTotal,
  verificationMeaningful,
  verificationEmpty,
  cleanupTotal,
  cleanupMeaningful,
  cleanupEmpty,
  tasksWithZeroMeaningfulVerification: zeroMeaningfulVerificationTasks.length,
  tasksWithZeroMeaningfulCleanup: zeroMeaningfulCleanupTasks.length,
  tasksWithMixedVerification: mixedVerificationTasks.length,
  tasksWithMixedCleanup: mixedCleanupTasks.length,
  tasks: perTaskRecords,
  affectedTasks: {
    zeroMeaningfulVerification: zeroMeaningfulVerificationTasks,
    zeroMeaningfulCleanup: zeroMeaningfulCleanupTasks,
    mixedVerification: mixedVerificationTasks,
    mixedCleanup: mixedCleanupTasks
  },
  rawExamples
};

const outputPath = path.resolve('migration_work/hands_on_tasks/checklist-content-audit.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');

console.log(`Audited ${totalTasks} tasks successfully.`);
console.log(`Verification Total: ${verificationTotal} (Meaningful: ${verificationMeaningful}, Empty: ${verificationEmpty})`);
console.log(`Cleanup Total: ${cleanupTotal} (Meaningful: ${cleanupMeaningful}, Empty: ${cleanupEmpty})`);
console.log(`Tasks with 0 Meaningful Verification: ${zeroMeaningfulVerificationTasks.length}`);
console.log(`Tasks with 0 Meaningful Cleanup: ${zeroMeaningfulCleanupTasks.length}`);
console.log(`Tasks with Mixed Verification: ${mixedVerificationTasks.length}`);
console.log(`Tasks with Mixed Cleanup: ${mixedCleanupTasks.length}`);
console.log(`Selected example task IDs:`);
console.log(`  S3: ${s3Task.id}`);
console.log(`  EC2: ${ec2Task?.id}`);
console.log(`  VPC: ${vpcTask?.id}`);
console.log(`  RDS: ${rdsTask?.id}`);
console.log(`  DynamoDB: ${dynamoTask?.id}`);
console.log(`JSON report saved to: ${outputPath}`);
