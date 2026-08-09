import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYNTHAPP_FOLLOW_ALONG_CONFIG } from '../src/data/synthappLearningPathData.js';
import { validateFollowAlongConfig } from '../src/components/FollowAlongs/shared/followAlongContract.js';

test('synthapp uses the approved canonical Follow Along contract', () => {
  const canonicalIds = new Set([
  "task-synthapp-architecture-001",
  "task-synthapp-dynamodb-002",
  "task-synthapp-frontend-003",
  "task-synthapp-lambda-role-004",
  "task-synthapp-lambda-api-005",
  "task-synthapp-http-api-006",
  "task-synthapp-cognito-007",
  "task-synthapp-observability-008",
  "task-synthapp-cleanup-009"
]);
  assert.deepEqual(SYNTHAPP_FOLLOW_ALONG_CONFIG.tasks.filter(task => canonicalIds.has(task.id)).map(task => task.id), [
  "task-synthapp-architecture-001",
  "task-synthapp-dynamodb-002",
  "task-synthapp-frontend-003",
  "task-synthapp-lambda-role-004",
  "task-synthapp-lambda-api-005",
  "task-synthapp-http-api-006",
  "task-synthapp-cognito-007",
  "task-synthapp-observability-008",
  "task-synthapp-cleanup-009"
]);
  assert.deepEqual(validateFollowAlongConfig(SYNTHAPP_FOLLOW_ALONG_CONFIG), { valid: true, errors: [], warnings: [] });
});
