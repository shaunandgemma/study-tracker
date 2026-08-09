import { createFollowAlongPersistence } from './followAlongPersistenceService.js';
import { DYNAMODB_FOLLOW_ALONG_CONFIG } from '../data/dynamodbLearningPathData.js';

export const dynamodbLearningPathPersistence = createFollowAlongPersistence(DYNAMODB_FOLLOW_ALONG_CONFIG);

// Compatibility adapter for established landing-page consumers. User IDs use
// the shared persistence summary; legacy completed-ID arrays are projected
// directly from the same canonical schema3 configuration.
export function getDynamodbProgrammeProgressSummary(completedTaskIdsOrUserId = []) {
  if (!Array.isArray(completedTaskIdsOrUserId)) {
    return dynamodbLearningPathPersistence.getProgressSummary(completedTaskIdsOrUserId);
  }

  const progressTasks = DYNAMODB_FOLLOW_ALONG_CONFIG.progress.optionalTasksCountTowardsProgress
    ? DYNAMODB_FOLLOW_ALONG_CONFIG.tasks
    : DYNAMODB_FOLLOW_ALONG_CONFIG.tasks.filter(task => !task.isOptional);
  const progressTaskIds = new Set(progressTasks.map(task => task.id));
  const completedTaskIds = new Set(
    completedTaskIdsOrUserId.filter(taskId => progressTaskIds.has(taskId))
  );
  const completedTasks = completedTaskIds.size;
  const totalTasks = progressTasks.length;
  const completionPercentage = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return {
    loading: false,
    status: completedTasks === 0
      ? 'not-started'
      : completedTasks === totalTasks
        ? 'completed'
        : 'in-progress',
    completedTasks,
    totalTasks,
    completionPercentage
  };
}
