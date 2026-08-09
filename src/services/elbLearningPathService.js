import { createFollowAlongPersistence } from './followAlongPersistenceService.js';
import { ELB_FOLLOW_ALONG_CONFIG } from '../data/elbLearningPathData.js';

export const elbLearningPathPersistence = createFollowAlongPersistence(ELB_FOLLOW_ALONG_CONFIG);

// Compatibility adapter for established landing-page consumers. User IDs use
// the shared persistence summary; legacy completed-ID arrays are projected
// directly from the same canonical schema3 configuration.
export function getElbProgrammeProgressSummary(completedTaskIdsOrUserId = []) {
  if (!Array.isArray(completedTaskIdsOrUserId)) {
    return elbLearningPathPersistence.getProgressSummary(completedTaskIdsOrUserId);
  }

  const progressTasks = ELB_FOLLOW_ALONG_CONFIG.progress.optionalTasksCountTowardsProgress
    ? ELB_FOLLOW_ALONG_CONFIG.tasks
    : ELB_FOLLOW_ALONG_CONFIG.tasks.filter(task => !task.isOptional);
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
