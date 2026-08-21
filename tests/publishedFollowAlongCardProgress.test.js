import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createPublishedProgressLoadingSummaries,
  loadPublishedFollowAlongProgressSummaries
} from '../src/features/followAlongs/published/publishedFollowAlongProgress.js';
import { buildPublishedFollowAlongConfig } from '../src/features/followAlongs/published/publishedFollowAlongService.js';
import { createFollowAlongPersistence } from '../src/services/followAlongPersistenceService.js';

function publishedRow(programmeId, taskCount = 3) {
  return {
    programme_id: programmeId,
    content_hash: `${programmeId}-hash`,
    runtime_content: {
      schema: {},
      programme: {
        programmeId,
        pathId: programmeId,
        serviceSlug: programmeId.replace('-learning-path', ''),
        serviceName: 'AWS Test Service',
        shortName: 'Test',
        displayName: 'Test Follow Along',
        description: 'Test published progress'
      },
      phases: [],
      tasks: Array.from({ length: taskCount }, (_, index) => ({
        id: `${programmeId}-task-${index + 1}`,
        title: `Task ${index + 1}`,
        consoleSteps: [],
        cliSteps: [],
        modeAvailability: {
          console: { status: 'not_applicable' },
          cli: { status: 'not_applicable' }
        }
      })),
      storage: {},
      progress: { initialTaskId: `${programmeId}-task-1` },
      resources: {},
      cleanup: { steps: [] }
    }
  };
}

test('published card progress creates a loading entry for each exact programme', () => {
  assert.deepEqual(
    createPublishedProgressLoadingSummaries([
      publishedRow('sqs-learning-path'),
      publishedRow('sns-learning-path')
    ]),
    {
      'sqs-learning-path': { loading: true },
      'sns-learning-path': { loading: true }
    }
  );
});

test('protected Follow Along rows preserve the same programme and progress IDs', async () => {
  const source = publishedRow('terraform-modules-learning-path', 4);
  const config = buildPublishedFollowAlongConfig(source);
  const protectedRow = {
    programme: { id: 'terraform-modules-learning-path' },
    config
  };

  assert.deepEqual(createPublishedProgressLoadingSummaries([protectedRow]), {
    'terraform-modules-learning-path': { loading: true }
  });

  const summaries = await loadPublishedFollowAlongProgressSummaries(
    [protectedRow],
    'learner-1',
    {
      persistenceFactory(receivedConfig) {
        assert.equal(receivedConfig, config);
        return {
          async getProgressSummary(userId) {
            assert.equal(userId, 'learner-1');
            return { loading: false, completedTasks: 1, totalTasks: 4 };
          }
        };
      }
    }
  );

  assert.equal(summaries['terraform-modules-learning-path'].completedTasks, 1);
});

test('published card progress loads each programme summary for the signed-in learner', async () => {
  const requested = [];
  const summaries = await loadPublishedFollowAlongProgressSummaries([
    publishedRow('sqs-learning-path', 4),
    publishedRow('sns-learning-path', 6)
  ], 'learner-1', {
    persistenceFactory(config) {
      return {
        async getProgressSummary(userId) {
          requested.push([config.identity.programmeId, userId]);
          return {
            loading: false,
            status: 'in-progress',
            completedTasks: 2,
            totalTasks: config.tasks.length,
            completionPercentage: Math.round((2 / config.tasks.length) * 100)
          };
        }
      };
    }
  });

  assert.deepEqual(requested, [
    ['sqs-learning-path', 'learner-1'],
    ['sns-learning-path', 'learner-1']
  ]);
  assert.equal(summaries['sqs-learning-path'].completedTasks, 2);
  assert.equal(summaries['sqs-learning-path'].totalTasks, 4);
  assert.equal(summaries['sns-learning-path'].totalTasks, 6);
});

test('published card progress safely shows zero progress when loading fails', async () => {
  const summaries = await loadPublishedFollowAlongProgressSummaries([
    publishedRow('cloudtrail-learning-path', 7)
  ], null, {
    persistenceFactory() {
      return { async getProgressSummary() { throw new Error('offline'); } };
    }
  });

  assert.deepEqual(summaries['cloudtrail-learning-path'], {
    loading: false,
    status: 'not-started',
    completedTasks: 0,
    totalTasks: 7,
    completionPercentage: 0,
    currentTaskTitle: 'Task 1',
    resourcesRetained: false,
    cleanupPending: false
  });
});

test('card progress ignores stale task IDs from older published revisions', async () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const row = publishedRow('sqs-learning-path', 5);
  const config = buildPublishedFollowAlongConfig(row);
  const persistence = createFollowAlongPersistence(config, { storage, supabaseClient: null });

  await persistence.saveGuest({
    currentTaskId: 'retired-task-id',
    completedTaskIds: [
      'sqs-learning-path-task-1',
      'sqs-learning-path-task-2',
      'retired-task-id-1',
      'retired-task-id-2',
      'retired-task-id-3',
      'retired-task-id-4'
    ],
    completionStatus: 'completed_cleaned'
  });

  const summary = await persistence.getProgressSummary(null);
  assert.equal(summary.completedTasks, 2);
  assert.equal(summary.totalTasks, 5);
  assert.equal(summary.completionPercentage, 40);
  assert.equal(summary.status, 'in-progress');
  assert.equal(summary.currentTaskTitle, 'Task 3');
});

test('card progress never exceeds one hundred percent', async () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const row = publishedRow('sns-learning-path', 3);
  const config = buildPublishedFollowAlongConfig(row);
  const persistence = createFollowAlongPersistence(config, { storage, supabaseClient: null });

  await persistence.saveGuest({
    completedTaskIds: [
      'sns-learning-path-task-1',
      'sns-learning-path-task-1',
      'sns-learning-path-task-2',
      'sns-learning-path-task-3',
      'old-task'
    ],
    completionStatus: 'completed_cleaned'
  });

  const summary = await persistence.getProgressSummary(null);
  assert.equal(summary.completedTasks, 3);
  assert.equal(summary.totalTasks, 3);
  assert.equal(summary.completionPercentage, 100);
  assert.equal(summary.status, 'completed');
});
