import { supabase } from '../lib/supabase.js';
import { normalizeFollowAlongCompletionStatus } from '../components/FollowAlongs/shared/followAlongContract.js';

function resolveStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function timestampOf(progress) {
  const value = progress?.updatedAt || progress?.updated_at || 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeFollowAlongProgress(progress = {}, config) {
  const initialTaskId = config.progress.initialTaskId;
  return {
    preferredMode: progress.preferredMode || progress.preferred_mode || 'console',
    currentTaskId: progress.currentTaskId || progress.current_task_id || initialTaskId,
    completedTaskIds: [...new Set(progress.completedTaskIds || progress.completed_task_ids || [])],
    taskStepProgress: progress.taskStepProgress || progress.task_step_progress || {},
    resourceDecisions: progress.resourceDecisions || progress.resource_decisions || {},
    completionStatus: normalizeFollowAlongCompletionStatus(
      progress.completionStatus || progress.completion_status
    ),
    updatedAt: progress.updatedAt || progress.updated_at || new Date().toISOString()
  };
}

export function mergeFollowAlongStates(guestState, remoteState, config) {
  if (!guestState?.progress && !remoteState?.progress) return null;
  if (!guestState?.progress) {
    return { progress: normalizeFollowAlongProgress(remoteState.progress, config), resources: remoteState.resources || {} };
  }
  if (!remoteState?.progress) {
    return { progress: normalizeFollowAlongProgress(guestState.progress, config), resources: guestState.resources || {} };
  }

  const guest = normalizeFollowAlongProgress(guestState.progress, config);
  const remote = normalizeFollowAlongProgress(remoteState.progress, config);
  const guestIsLatest = timestampOf(guest) > timestampOf(remote);
  const latest = guestIsLatest ? guest : remote;
  const older = guestIsLatest ? remote : guest;
  return {
    progress: {
      ...latest,
      completedTaskIds: [...new Set([...remote.completedTaskIds, ...guest.completedTaskIds])],
      taskStepProgress: { ...older.taskStepProgress, ...latest.taskStepProgress },
      resourceDecisions: { ...older.resourceDecisions, ...latest.resourceDecisions },
      updatedAt: new Date().toISOString()
    },
    resources: guestIsLatest
      ? { ...(remoteState.resources || {}), ...(guestState.resources || {}) }
      : { ...(guestState.resources || {}), ...(remoteState.resources || {}) }
  };
}

export function createFollowAlongPersistence(config, options = {}) {
  const storage = resolveStorage(options.storage);
  const client = options.supabaseClient || supabase;
  const { programmeId, pathId } = config.identity;
  const storageConfig = config.storage;

  const loadGuest = () => {
    if (!storage) return null;
    try {
      const progressRaw = storage.getItem(storageConfig.guestProgressKey);
      const resourcesRaw = storage.getItem(storageConfig.guestResourcesKey);
      if (!progressRaw) return null;
      return {
        progress: normalizeFollowAlongProgress(JSON.parse(progressRaw), config),
        resources: resourcesRaw ? JSON.parse(resourcesRaw) : {}
      };
    } catch {
      return null;
    }
  };

  const saveGuest = async (progress, resources = {}) => {
    if (!storage) return { success: true };
    try {
      storage.setItem(storageConfig.guestProgressKey, JSON.stringify(normalizeFollowAlongProgress(progress, config)));
      storage.setItem(storageConfig.guestResourcesKey, JSON.stringify(resources));
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message || 'Unable to save guest progress.' };
    }
  };

  const fetchRemote = async userId => {
    if (!userId || !client) return null;
    try {
      const { data: progress, error: progressError } = await client
        .from(storageConfig.remoteProgressTable)
        .select('*')
        .eq('user_id', userId)
        .eq('path_id', pathId)
        .maybeSingle();
      if (progressError && progressError.code !== 'PGRST116') throw progressError;
      if (!progress) return null;
      const { data: resourceRow, error: resourceError } = await client
        .from(storageConfig.remoteResourcesTable)
        .select('*')
        .eq('user_id', userId)
        .eq('path_id', pathId)
        .maybeSingle();
      if (resourceError && resourceError.code !== 'PGRST116') throw resourceError;
      return { progress: normalizeFollowAlongProgress(progress, config), resources: resourceRow?.resources || {} };
    } catch (error) {
      return { error: error?.message || 'Unable to load authenticated progress.' };
    }
  };

  const saveRemote = async (userId, progress, resources = {}) => {
    if (!userId || !client) return { success: false, error: 'Authenticated user is required.' };
    const normalized = normalizeFollowAlongProgress(progress, config);
    try {
      const progressPayload = {
        user_id: userId,
        path_id: pathId,
        preferred_mode: normalized.preferredMode,
        current_task_id: normalized.currentTaskId,
        completed_task_ids: normalized.completedTaskIds,
        task_step_progress: normalized.taskStepProgress,
        resource_decisions: normalized.resourceDecisions,
        completion_status: normalized.completionStatus,
        updated_at: new Date().toISOString()
      };
      const { error: progressError } = await client
        .from(storageConfig.remoteProgressTable)
        .upsert(progressPayload, { onConflict: 'user_id,path_id' });
      if (progressError) throw progressError;
      const { error: resourceError } = await client
        .from(storageConfig.remoteResourcesTable)
        .upsert({
          user_id: userId,
          path_id: pathId,
          resources,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,path_id' });
      if (resourceError) throw resourceError;
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message || 'Unable to save authenticated progress.' };
    }
  };

  const load = async userId => {
    const guest = loadGuest();
    if (!userId) return guest;
    const remote = await fetchRemote(userId);
    if (remote?.error) return guest || remote;
    return mergeFollowAlongStates(guest, remote, config);
  };

  const save = async (userId, progress, resources) => userId
    ? saveRemote(userId, progress, resources)
    : saveGuest(progress, resources);

  const getProgressSummary = async userId => {
    const state = await load(userId);
    if (state?.error) throw new Error(state.error);
    const progress = state?.progress;
    const tasks = Array.isArray(config.tasks) ? config.tasks : [];
    const currentTaskIds = new Set(tasks.map(task => task.id));
    const completedTaskIds = new Set(
      (progress?.completedTaskIds || []).filter(taskId => currentTaskIds.has(taskId))
    );
    const completedTasks = completedTaskIds.size;
    const totalTasks = tasks.length;
    const completionStatus = progress?.completionStatus;
    const allCurrentTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
    const status = !progress
      ? 'not-started'
      : completionStatus === 'completed_cleaned' && allCurrentTasksCompleted
        ? 'completed'
        : completionStatus === 'completed_retained' && allCurrentTasksCompleted
          ? 'resources-retained'
          : 'in-progress';
    const currentTask = tasks.find(task => task.id === progress?.currentTaskId)
      || tasks.find(task => !completedTaskIds.has(task.id))
      || tasks[0];
    return {
      loading: false,
      status,
      completedTasks,
      totalTasks,
      completionPercentage: totalTasks > 0
        ? Math.min(100, Math.round((completedTasks / totalTasks) * 100))
        : 0,
      currentTaskTitle: currentTask?.title,
      resourcesRetained: completionStatus === 'completed_retained',
      cleanupPending: completionStatus === 'completed_retained'
    };
  };

  return {
    programmeId,
    pathId,
    loadGuest,
    saveGuest,
    fetchRemote,
    saveRemote,
    load,
    save,
    getProgressSummary,
    merge: (guest, remote) => mergeFollowAlongStates(guest, remote, config)
  };
}
