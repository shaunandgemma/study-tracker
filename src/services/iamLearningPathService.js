import {
  IAM_PATH_ID,
  IAM_OPTIONAL_TASK_IDS,
  getIamPathTasks
} from '../data/iamLearningPathData.js';

export const GUEST_IAM_PROGRESS_KEY = 'study_tracker_guest_iam_path_progress';
export const GUEST_IAM_RESOURCES_KEY = 'study_tracker_guest_iam_path_resources';

export function validateIamResourceRecord(record) {
  if (!record || typeof record !== 'object') return false;
  if (!record.resourceKey || typeof record.resourceKey !== 'string') return false;
  if (!record.resourceType || typeof record.resourceType !== 'string') return false;
  const validStatuses = ['draft', 'created', 'configured', 'active', 'retained', 'deleted', 'failed'];
  if (!record.lifecycleStatus || !validStatuses.includes(record.lifecycleStatus)) return false;
  return true;
}

export function loadGuestIamPathState() {
  try {
    const rawProgress = localStorage.getItem(GUEST_IAM_PROGRESS_KEY);
    const rawResources = localStorage.getItem(GUEST_IAM_RESOURCES_KEY);

    const progress = rawProgress ? JSON.parse(rawProgress) : {
      completed_task_ids: [],
      current_task_id: 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001',
      instruction_mode: 'console',
      sub_view: 'runner',
      updated_at: new Date().toISOString()
    };

    const resources = rawResources ? JSON.parse(rawResources) : {};

    return { progress, resources };
  } catch (err) {
    console.error('[iamLearningPathService] Error loading guest state:', err);
    return {
      progress: {
        completed_task_ids: [],
        current_task_id: 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001',
        instruction_mode: 'console',
        sub_view: 'runner',
        updated_at: new Date().toISOString()
      },
      resources: {}
    };
  }
}

export function saveGuestIamPathState(progress, resources = {}) {
  try {
    if (progress) {
      const payload = {
        ...progress,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(GUEST_IAM_PROGRESS_KEY, JSON.stringify(payload));
    }

    if (resources) {
      localStorage.setItem(GUEST_IAM_RESOURCES_KEY, JSON.stringify(resources));
    }

    return true;
  } catch (err) {
    console.error('[iamLearningPathService] Error saving guest state:', err);
    return false;
  }
}

export async function fetchUserIamPathProgressFromSupabase(userId, supabaseClient) {
  if (!userId || !supabaseClient) {
    return loadGuestIamPathState();
  }

  try {
    const { data: progData, error: progErr } = await supabaseClient
      .from('user_learning_path_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', IAM_PATH_ID)
      .single();

    if (progErr && progErr.code !== 'PGRST116') {
      console.warn('[iamLearningPathService] Supabase progress fetch error:', progErr.message);
    }

    const { data: resData, error: resErr } = await supabaseClient
      .from('user_learning_path_resources')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', IAM_PATH_ID);

    if (resErr) {
      console.warn('[iamLearningPathService] Supabase resource fetch error:', resErr.message);
    }

    const progress = progData ? {
      completed_task_ids: progData.completed_task_ids || [],
      current_task_id: progData.current_task_id || 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001',
      instruction_mode: progData.instruction_mode || 'console',
      sub_view: progData.sub_view || 'runner',
      updated_at: progData.updated_at
    } : null;

    const resourcesMap = {};
    if (resData && Array.isArray(resData)) {
      resData.forEach(row => {
        resourcesMap[row.resource_key] = {
          resourceKey: row.resource_key,
          resourceType: row.resource_type,
          awsId: row.aws_id,
          lifecycleStatus: row.lifecycle_status,
          creatorTaskId: row.creator_task_id,
          metadata: row.metadata || {}
        };
      });
    }

    return { progress, resources: resourcesMap };
  } catch (err) {
    console.error('[iamLearningPathService] Remote fetch error, fallback to guest:', err);
    return loadGuestIamPathState();
  }
}

export async function saveUserIamPathProgressToSupabase(userId, progressRecord, resourcesMap, supabaseClient) {
  saveGuestIamPathState(progressRecord, resourcesMap);

  if (!userId || !supabaseClient) return true;

  try {
    const updatedAt = new Date().toISOString();

    const progPayload = {
      user_id: userId,
      path_id: IAM_PATH_ID,
      completed_task_ids: progressRecord.completed_task_ids || [],
      current_task_id: progressRecord.current_task_id || 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001',
      instruction_mode: progressRecord.instruction_mode || 'console',
      sub_view: progressRecord.sub_view || 'runner',
      updated_at: updatedAt
    };

    const { error: pErr } = await supabaseClient
      .from('user_learning_path_progress')
      .upsert(progPayload, { onConflict: 'user_id,path_id' });

    if (pErr) console.error('[iamLearningPathService] Progress upsert error:', pErr);

    if (resourcesMap && Object.keys(resourcesMap).length > 0) {
      const resourceRows = Object.values(resourcesMap).map(r => ({
        user_id: userId,
        path_id: IAM_PATH_ID,
        resource_key: r.resourceKey,
        resource_type: r.resourceType,
        aws_id: r.awsId || null,
        lifecycle_status: r.lifecycleStatus || 'created',
        creator_task_id: r.creatorTaskId || null,
        metadata: r.metadata || {},
        updated_at: updatedAt
      }));

      const { error: rErr } = await supabaseClient
        .from('user_learning_path_resources')
        .upsert(resourceRows, { onConflict: 'user_id,path_id,resource_key' });

      if (rErr) console.error('[iamLearningPathService] Resources upsert error:', rErr);
    }

    return true;
  } catch (err) {
    console.error('[iamLearningPathService] Remote save error:', err);
    return false;
  }
}

export function mergeGuestIamStateWithRemote(guestState, remoteState) {
  if (!remoteState || !remoteState.progress) {
    return guestState || loadGuestIamPathState();
  }

  if (!guestState || !guestState.progress) {
    return remoteState;
  }

  const guestCompleted = guestState.progress.completed_task_ids || [];
  const remoteCompleted = remoteState.progress.completed_task_ids || [];
  const mergedCompleted = Array.from(new Set([...guestCompleted, ...remoteCompleted]));

  const guestTime = new Date(guestState.progress.updated_at || 0).getTime();
  const remoteTime = new Date(remoteState.progress.updated_at || 0).getTime();
  const latestProgress = guestTime >= remoteTime ? guestState.progress : remoteState.progress;

  return {
    progress: {
      ...latestProgress,
      completed_task_ids: mergedCompleted
    },
    resources: {
      ...(remoteState.resources || {}),
      ...(guestState.resources || {})
    }
  };
}

export function getIamProgrammeProgressSummary(completedTaskIds = []) {
  const allTasks = getIamPathTasks();
  const total = allTasks.length; // 23 total Follow Along tasks
  const completedCount = completedTaskIds.length;

  let status = 'Not Started';
  if (completedCount > 0 && completedCount < total) {
    status = 'In Progress';
  } else if (completedCount >= total) {
    status = 'Completed';
  }

  const percentage = Math.round((completedCount / total) * 100);

  return {
    programmeId: IAM_PATH_ID,
    status,
    completed: completedCount,
    total,
    percentage,
    loading: false
  };
}
