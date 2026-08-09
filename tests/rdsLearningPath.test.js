import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RDS_FOLLOW_ALONG_CONFIG } from '../src/data/rdsLearningPathData.js';
import { validateFollowAlongConfig } from '../src/components/FollowAlongs/shared/followAlongContract.js';

test('rds uses the approved canonical Follow Along contract', () => {
  const canonicalIds = new Set([
  "task-saa-rds-create-rds-and-connect-from-ec2-001",
  "task-saa-rds-create-a-multi-az-rds-database-002",
  "task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003",
  "task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004",
  "task-saa-rds-enable-rds-encryption-with-kms-005",
  "task-saa-rds-compare-rds-backup-snapshot-and-pitr-006",
  "task-saa-rds-choose-the-best-database-for-exam-scenarios-025"
]);
  assert.deepEqual(RDS_FOLLOW_ALONG_CONFIG.tasks.filter(task => canonicalIds.has(task.id)).map(task => task.id), [
  "task-saa-rds-create-rds-and-connect-from-ec2-001",
  "task-saa-rds-create-a-multi-az-rds-database-002",
  "task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003",
  "task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004",
  "task-saa-rds-enable-rds-encryption-with-kms-005",
  "task-saa-rds-compare-rds-backup-snapshot-and-pitr-006",
  "task-saa-rds-choose-the-best-database-for-exam-scenarios-025"
]);
  assert.deepEqual(validateFollowAlongConfig(RDS_FOLLOW_ALONG_CONFIG), { valid: true, errors: [], warnings: [] });
});
