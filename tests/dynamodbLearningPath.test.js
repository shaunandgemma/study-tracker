import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DYNAMODB_FOLLOW_ALONG_CONFIG } from '../src/data/dynamodbLearningPathData.js';
import { validateFollowAlongConfig } from '../src/components/FollowAlongs/shared/followAlongContract.js';

test('dynamodb uses the approved canonical Follow Along contract', () => {
  const canonicalIds = new Set([
  "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010",
  "task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011",
  "task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012",
  "task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013",
  "task-saa-dynamodb-enable-dynamodb-streams-014",
  "task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015",
  "task-saa-dynamodb-enable-dynamodb-global-tables-016",
  "task-saa-dynamodb-configure-dynamodb-backup-restore-017",
  "task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022"
]);
  assert.deepEqual(DYNAMODB_FOLLOW_ALONG_CONFIG.tasks.filter(task => canonicalIds.has(task.id)).map(task => task.id), [
  "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010",
  "task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011",
  "task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012",
  "task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013",
  "task-saa-dynamodb-enable-dynamodb-streams-014",
  "task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015",
  "task-saa-dynamodb-enable-dynamodb-global-tables-016",
  "task-saa-dynamodb-configure-dynamodb-backup-restore-017",
  "task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022"
]);
  assert.deepEqual(validateFollowAlongConfig(DYNAMODB_FOLLOW_ALONG_CONFIG), { valid: true, errors: [], warnings: [] });
});
