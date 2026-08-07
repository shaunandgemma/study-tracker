import { supabase } from '../lib/supabase.js';
import {
  S3_PATH_ID,
  S3_RESOURCE_TAGS,
  getS3PathTasks,
  S3_LEARNING_PATH_PHASES
} from '../data/s3LearningPathData.js';

export const GUEST_S3_PROGRESS_KEY = 'study_tracker_guest_s3_path_progress';
export const GUEST_S3_RESOURCES_KEY = 'study_tracker_guest_s3_path_resources';

export function validateS3ResourceRecord(record) {
  if (!record || typeof record !== 'object') return false;
  if (!record.resourceKey || typeof record.resourceKey !== 'string') return false;
  if (!record.resourceType || typeof record.resourceType !== 'string') return false;
  if (!['draft', 'created', 'retained', 'cleaned'].includes(record.lifecycleStatus)) return false;
  return true;
}

export function loadGuestS3PathState() {
  try {
    const rawProg = localStorage.getItem(GUEST_S3_PROGRESS_KEY);
    const rawRes = localStorage.getItem(GUEST_S3_RESOURCES_KEY);
    return {
      progress: rawProg ? JSON.parse(rawProg) : null,
      resources: rawRes ? JSON.parse(rawRes) : {}
    };
  } catch (err) {
    console.error('[s3LearningPathService] Error loading guest S3 state:', err);
    return { progress: null, resources: {} };
  }
}

export function saveGuestS3PathState(progressRecord, resourcesMap = {}) {
  try {
    if (progressRecord) {
      localStorage.setItem(GUEST_S3_PROGRESS_KEY, JSON.stringify({
        ...progressRecord,
        path_id: S3_PATH_ID
      }));
    }
    if (resourcesMap) {
      localStorage.setItem(GUEST_S3_RESOURCES_KEY, JSON.stringify(resourcesMap));
    }
  } catch (err) {
    console.error('[s3LearningPathService] Error saving guest S3 state:', err);
  }
}

export async function fetchUserS3PathProgressFromSupabase(userId, client = supabase) {
  if (!userId || userId === 'guest') return { progress: null, resources: {} };

  try {
    const { data: progData, error: progErr } = await client
      .from('user_learning_path_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', S3_PATH_ID)
      .maybeSingle();

    if (progErr) console.warn('[s3LearningPathService] Error loading progress:', progErr.message);

    const { data: resData, error: resErr } = await client
      .from('user_learning_path_resources')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', S3_PATH_ID);

    if (resErr) console.warn('[s3LearningPathService] Error loading resources:', resErr.message);

    const resourcesMap = {};
    if (Array.isArray(resData)) {
      resData.forEach(row => {
        resourcesMap[row.resource_key] = {
          resourceKey: row.resource_key,
          resourceType: row.resource_type,
          awsId: row.aws_id,
          arn: row.arn,
          accountId: row.account_id,
          region: row.region,
          availabilityZone: row.availability_zone,
          parentResourceIds: row.parent_resource_ids || [],
          createdByTaskId: row.created_by_task_id,
          modifiedByTaskIds: row.modified_by_task_ids || [],
          lifecycleStatus: row.lifecycle_status || 'created',
          validationStatus: row.validation_status || 'verified',
          metadata: row.metadata || {}
        };
      });
    }

    return {
      progress: progData || null,
      resources: resourcesMap
    };
  } catch (err) {
    console.error('[s3LearningPathService] Exception fetching S3 progress:', err);
    return { progress: null, resources: {} };
  }
}

export async function saveUserS3PathProgressToSupabase(userId, progressRecord, resourcesMap = {}, client = supabase) {
  if (!userId || userId === 'guest') {
    saveGuestS3PathState(progressRecord, resourcesMap);
    return { success: true, mode: 'guest' };
  }

  try {
    const now = new Date().toISOString();
    const payload = {
      user_id: userId,
      path_id: S3_PATH_ID,
      current_task_id: progressRecord.current_task_id || 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001',
      preferred_mode: progressRecord.preferred_mode || 'console',
      completed_task_ids: progressRecord.completed_task_ids || [],
      task_step_progress: progressRecord.task_step_progress || {},
      resource_decisions: progressRecord.resource_decisions || {},
      updated_at: now
    };

    const { error: progErr } = await client
      .from('user_learning_path_progress')
      .upsert(payload, { onConflict: 'user_id,path_id' });

    if (progErr) {
      console.error('[s3LearningPathService] Error saving progress:', progErr.message);
    }

    // Upsert resource records
    const resEntries = Object.values(resourcesMap).filter(validateS3ResourceRecord);

    if (resEntries.length > 0) {
      const resRows = resEntries.map(rec => ({
        user_id: userId,
        path_id: S3_PATH_ID,
        resource_key: rec.resourceKey,
        resource_type: rec.resourceType,
        aws_id: rec.awsId || null,
        arn: rec.arn || null,
        account_id: rec.accountId || null,
        region: rec.region || 'eu-west-2',
        availability_zone: rec.availabilityZone || null,
        parent_resource_ids: rec.parentResourceIds || [],
        created_by_task_id: rec.createdByTaskId || null,
        modified_by_task_ids: rec.modifiedByTaskIds || [],
        lifecycle_status: rec.lifecycleStatus || 'created',
        validation_status: rec.validationStatus || 'verified',
        metadata: rec.metadata || {},
        updated_at: now
      }));

      const { error: resErr } = await client
        .from('user_learning_path_resources')
        .upsert(resRows, { onConflict: 'user_id,path_id,resource_key' });

      if (resErr) {
        console.error('[s3LearningPathService] Error saving resources:', resErr.message);
      }
    }

    // Always mirror to guest storage
    saveGuestS3PathState(progressRecord, resourcesMap);
    return { success: true, mode: 'supabase' };
  } catch (err) {
    console.error('[s3LearningPathService] Exception saving S3 state:', err);
    saveGuestS3PathState(progressRecord, resourcesMap);
    return { success: false, error: err.message };
  }
}

export function mergeGuestS3StateWithRemote(guestState, remoteState) {
  const guestProg = guestState?.progress;
  const remoteProg = remoteState?.progress;

  if (!guestProg && !remoteProg) return { progress: null, resources: {} };
  if (!guestProg) return remoteState;
  if (!remoteProg) return guestState;

  const guestTime = new Date(guestProg.updated_at || 0).getTime();
  const remoteTime = new Date(remoteProg.updated_at || 0).getTime();

  const mergedCompleted = Array.from(new Set([
    ...(guestProg.completed_task_ids || []),
    ...(remoteProg.completed_task_ids || [])
  ]));

  const baseProg = guestTime >= remoteTime ? guestProg : remoteProg;

  const mergedResources = {
    ...(remoteState?.resources || {}),
    ...(guestState?.resources || {})
  };

  return {
    progress: {
      ...baseProg,
      completed_task_ids: mergedCompleted,
      task_step_progress: {
        ...(remoteProg.task_step_progress || {}),
        ...(guestProg.task_step_progress || {})
      },
      resource_decisions: {
        ...(remoteProg.resource_decisions || {}),
        ...(guestProg.resource_decisions || {})
      }
    },
    resources: mergedResources
  };
}

export function getS3ProgrammeProgressSummary(completedTaskIds = []) {
  const allTasks = getS3PathTasks();
  const total = allTasks.length;
  const completed = completedTaskIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  let status = 'Not Started';
  if (completed === total && total > 0) {
    status = 'Completed';
  } else if (completed > 0) {
    status = 'In Progress';
  }

  return {
    completed,
    total,
    percentage,
    status
  };
}
