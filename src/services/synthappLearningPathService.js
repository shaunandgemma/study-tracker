import { createFollowAlongPersistence } from './followAlongPersistenceService.js';
import { SYNTHAPP_FOLLOW_ALONG_CONFIG } from '../data/synthappLearningPathData.js';

export const synthappLearningPathPersistence = createFollowAlongPersistence(SYNTHAPP_FOLLOW_ALONG_CONFIG);

// Compatibility adapter for established landing-page consumers. User IDs use
// the shared persistence summary; legacy completed-ID arrays are projected
// directly from the same canonical schema3 configuration.
export function getSynthappProgrammeProgressSummary(completedTaskIdsOrUserId = []) {
  if (!Array.isArray(completedTaskIdsOrUserId)) {
    return synthappLearningPathPersistence.getProgressSummary(completedTaskIdsOrUserId);
  }

  const progressTasks = SYNTHAPP_FOLLOW_ALONG_CONFIG.progress.optionalTasksCountTowardsProgress
    ? SYNTHAPP_FOLLOW_ALONG_CONFIG.tasks
    : SYNTHAPP_FOLLOW_ALONG_CONFIG.tasks.filter(task => !task.isOptional);
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
