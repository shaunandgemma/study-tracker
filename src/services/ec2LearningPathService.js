import { supabase } from '../lib/supabase.js';
import {
  EC2_PATH_ID,
  EC2_RESOURCE_TAGS,
  getEc2PathTasks,
  EC2_LEARNING_PATH_PHASES
} from '../data/ec2LearningPathData.js';

export const GUEST_EC2_PROGRESS_KEY = 'study_tracker_guest_ec2_path_progress';
export const GUEST_EC2_RESOURCES_KEY = 'study_tracker_guest_ec2_path_resources';

export function validateEc2ResourceRecord(record) {
  if (!record || typeof record !== 'object') return false;
  if (!record.resourceKey || typeof record.resourceKey !== 'string') return false;
  if (!record.resourceType || typeof record.resourceType !== 'string') return false;
  if (!['draft', 'created', 'retained', 'cleaned'].includes(record.lifecycleStatus)) return false;
  return true;
}

export function loadGuestEc2PathState() {
  try {
    const rawProg = localStorage.getItem(GUEST_EC2_PROGRESS_KEY);
    const rawRes = localStorage.getItem(GUEST_EC2_RESOURCES_KEY);
    return {
      progress: rawProg ? JSON.parse(rawProg) : null,
      resources: rawRes ? JSON.parse(rawRes) : {}
    };
  } catch (err) {
    console.error('[ec2LearningPathService] Error loading guest EC2 state:', err);
    return { progress: null, resources: {} };
  }
}

export function saveGuestEc2PathState(progressRecord, resourcesMap = {}) {
  try {
    if (progressRecord) {
      localStorage.setItem(GUEST_EC2_PROGRESS_KEY, JSON.stringify({
        ...progressRecord,
        path_id: EC2_PATH_ID
      }));
    }
    if (resourcesMap) {
      localStorage.setItem(GUEST_EC2_RESOURCES_KEY, JSON.stringify(resourcesMap));
    }
  } catch (err) {
    console.error('[ec2LearningPathService] Error saving guest EC2 state:', err);
  }
}

export async function fetchUserEc2PathProgressFromSupabase(userId, client = supabase) {
  if (!userId || userId === 'guest') return { progress: null, resources: {} };

  try {
    const { data: progData, error: progErr } = await client
      .from('user_learning_path_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', EC2_PATH_ID)
      .maybeSingle();

    if (progErr) console.warn('[ec2LearningPathService] Error loading progress:', progErr.message);

    const { data: resData, error: resErr } = await client
      .from('user_learning_path_resources')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', EC2_PATH_ID);

    if (resErr) console.warn('[ec2LearningPathService] Error loading resources:', resErr.message);

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
    console.error('[ec2LearningPathService] Exception fetching EC2 progress:', err);
    return { progress: null, resources: {} };
  }
}

export async function saveUserEc2PathProgressToSupabase(userId, progressRecord, resourcesMap = {}, client = supabase) {
  if (!userId || userId === 'guest') return;

  try {
    if (progressRecord) {
      await client
        .from('user_learning_path_progress')
        .upsert({
          user_id: userId,
          path_id: EC2_PATH_ID,
          preferred_mode: progressRecord.preferred_mode || 'console',
          current_task_id: progressRecord.current_task_id || 'task-saa-ec2-compare-ec2-pricing-models-016',
          completed_task_ids: progressRecord.completed_task_ids || [],
          task_step_progress: progressRecord.task_step_progress || {},
          resource_decisions: progressRecord.resource_decisions || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,path_id' });
    }

    if (resourcesMap && Object.keys(resourcesMap).length > 0) {
      const rowsToUpsert = Object.entries(resourcesMap).map(([key, record]) => ({
        user_id: userId,
        path_id: EC2_PATH_ID,
        resource_key: key,
        resource_type: record.resourceType || 'AWS::EC2::Resource',
        aws_id: record.awsId || null,
        arn: record.arn || null,
        account_id: record.accountId || null,
        region: record.region || 'eu-west-2',
        availability_zone: record.availabilityZone || 'eu-west-2a',
        parent_resource_ids: record.parentResourceIds || [],
        created_by_task_id: record.createdByTaskId || null,
        modified_by_task_ids: record.modifiedByTaskIds || [],
        lifecycle_status: record.lifecycleStatus || 'created',
        validation_status: record.validationStatus || 'verified',
        metadata: {
          ...(record.metadata || {}),
          tags: EC2_RESOURCE_TAGS
        },
        updated_at: new Date().toISOString()
      }));

      await client
        .from('user_learning_path_resources')
        .upsert(rowsToUpsert, { onConflict: 'user_id,path_id,resource_key' });
    }
  } catch (err) {
    console.error('[ec2LearningPathService] Error saving to Supabase:', err);
  }
}

export function mergeGuestEc2StateWithRemote(guestState, remoteState) {
  const guestProg = guestState?.progress;
  const remoteProg = remoteState?.progress;

  const guestCompleted = new Set(guestProg?.completed_task_ids || []);
  const remoteCompleted = new Set(remoteProg?.completed_task_ids || []);
  const mergedCompleted = Array.from(new Set([...guestCompleted, ...remoteCompleted]));

  const mergedStepProg = { ...(remoteProg?.task_step_progress || {}), ...(guestProg?.task_step_progress || {}) };
  const mergedDecisions = { ...(remoteProg?.resource_decisions || {}), ...(guestProg?.resource_decisions || {}) };
  const mergedResources = { ...(remoteState?.resources || {}), ...(guestState?.resources || {}) };

  const currentTaskId = guestProg?.current_task_id || remoteProg?.current_task_id || 'task-saa-ec2-compare-ec2-pricing-models-016';
  const preferredMode = guestProg?.preferred_mode || remoteProg?.preferred_mode || 'console';

  return {
    progress: {
      path_id: EC2_PATH_ID,
      current_task_id: currentTaskId,
      preferred_mode: preferredMode,
      completed_task_ids: mergedCompleted,
      task_step_progress: mergedStepProg,
      resource_decisions: mergedDecisions
    },
    resources: mergedResources
  };
}

export function calculateEc2PathMetrics(completedTaskIds = []) {
  const allTasks = getEc2PathTasks();
  const totalCount = allTasks.length;
  const completedSet = new Set(completedTaskIds);
  const completedCount = allTasks.filter(t => completedSet.has(t.id)).length;
  const overallPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const phaseMetrics = EC2_LEARNING_PATH_PHASES.map(phase => {
    const phaseTotal = phase.taskIds.length;
    const phaseDone = phase.taskIds.filter(id => completedSet.has(id)).length;
    const percentage = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
    return {
      id: phase.id,
      number: phase.number,
      title: phase.title,
      total: phaseTotal,
      completed: phaseDone,
      percentage,
      isCompleted: phaseDone === phaseTotal
    };
  });

  return {
    totalTasks: totalCount,
    completedTasks: completedCount,
    overallPercentage,
    phaseMetrics
  };
}

export async function getEc2ProgrammeProgressSummary(userId, client = supabase) {
  const allTasks = getEc2PathTasks();
  const totalTasks = allTasks.length;

  if (!userId || userId === 'guest') {
    const { progress, resources } = loadGuestEc2PathState();
    const completedTasks = (progress?.completed_task_ids || []).length;
    const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let status = 'not-started';
    if (completedTasks === totalTasks && totalTasks > 0) {
      status = 'completed';
    } else if (completedTasks > 0) {
      status = 'in-progress';
    }

    const retainedCount = Object.values(resources).filter(r => r.lifecycleStatus === 'created' || r.lifecycleStatus === 'retained').length;
    if (retainedCount > 0 && status !== 'completed') {
      status = 'resources-retained';
    }

    return {
      programmeId: EC2_PATH_ID,
      loading: false,
      completedTasks,
      totalTasks,
      completionPercentage: pct,
      status,
      retainedResourceCount: retainedCount
    };
  }

  const { progress, resources } = await fetchUserEc2PathProgressFromSupabase(userId, client);
  const completedTasks = (progress?.completed_task_ids || []).length;
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  let status = 'not-started';
  if (completedTasks === totalTasks && totalTasks > 0) {
    status = 'completed';
  } else if (completedTasks > 0) {
    status = 'in-progress';
  }

  const retainedCount = Object.values(resources).filter(r => r.lifecycleStatus === 'created' || r.lifecycleStatus === 'retained').length;
  if (retainedCount > 0 && status !== 'completed') {
    status = 'resources-retained';
  }

  return {
    programmeId: EC2_PATH_ID,
    loading: false,
    completedTasks,
    totalTasks,
    completionPercentage: pct,
    status,
    retainedResourceCount: retainedCount
  };
}
