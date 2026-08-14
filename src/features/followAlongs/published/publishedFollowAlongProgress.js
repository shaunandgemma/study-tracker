import { createFollowAlongPersistence } from '../../../services/followAlongPersistenceService.js';
import { buildPublishedFollowAlongConfig } from './publishedFollowAlongService.js';

function notStartedSummary(config) {
  return {
    loading: false,
    status: 'not-started',
    completedTasks: 0,
    totalTasks: config?.tasks?.length || 0,
    completionPercentage: 0,
    currentTaskTitle: config?.tasks?.[0]?.title || '',
    resourcesRetained: false,
    cleanupPending: false
  };
}

export function createPublishedProgressLoadingSummaries(rows = []) {
  return Object.fromEntries(rows.map(row => [
    row?.programme_id,
    { loading: true }
  ]).filter(([programmeId]) => Boolean(programmeId)));
}

export async function loadPublishedFollowAlongProgressSummaries(
  rows = [],
  userId = null,
  { persistenceFactory = createFollowAlongPersistence } = {}
) {
  const summaries = await Promise.all(rows.map(async row => {
    const config = buildPublishedFollowAlongConfig(row);
    const programmeId = config?.identity?.programmeId || row?.programme_id;
    if (!programmeId || !config) return null;

    try {
      const summary = await persistenceFactory(config).getProgressSummary(userId);
      return [programmeId, summary || notStartedSummary(config)];
    } catch {
      return [programmeId, notStartedSummary(config)];
    }
  }));

  return Object.fromEntries(summaries.filter(Boolean));
}
