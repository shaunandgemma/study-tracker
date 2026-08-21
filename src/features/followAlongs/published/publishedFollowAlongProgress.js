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

function getProgrammeConfig(row) {
  return row?.config || buildPublishedFollowAlongConfig(row);
}

function getProgrammeId(row, config = getProgrammeConfig(row)) {
  return config?.identity?.programmeId || row?.programme?.id || row?.programme_id || null;
}

export function createPublishedProgressLoadingSummaries(rows = []) {
  return Object.fromEntries(rows.map(row => [
    getProgrammeId(row),
    { loading: true }
  ]).filter(([programmeId]) => Boolean(programmeId)));
}

export async function loadPublishedFollowAlongProgressSummaries(
  rows = [],
  userId = null,
  { persistenceFactory = createFollowAlongPersistence } = {}
) {
  const summaries = await Promise.all(rows.map(async row => {
    const config = getProgrammeConfig(row);
    const programmeId = getProgrammeId(row, config);
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
