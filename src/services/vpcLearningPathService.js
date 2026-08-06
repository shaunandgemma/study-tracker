/**
 * VPC Learning Path Service
 *
 * Manages path progress persistence, shared resource bindings, CLI string interpolation,
 * resource schema validation, and guest-to-account merge conflict resolution.
 *
 * Zero-regression isolation requirement: Does not alter hands_on_task_progress or taskService.
 */

import { supabase } from '../lib/supabase.js';
import { VPC_PATH_TASKS, VPC_LEARNING_PATH_PHASES } from '../data/vpcLearningPathData.js';

const GUEST_PATH_PROGRESS_KEY = 'vpc_learning_path_progress_guest';
const GUEST_PATH_RESOURCES_KEY = 'vpc_learning_path_resources_guest';

/**
 * Validates a resource record against the strict project schema.
 */
export function validateResourceRecord(record) {
  if (!record || typeof record !== 'object') {
    return { valid: false, error: 'Resource record must be an object' };
  }
  if (!record.resourceKey || typeof record.resourceKey !== 'string') {
    return { valid: false, error: 'Resource record missing required string resourceKey' };
  }
  if (!record.resourceType || typeof record.resourceType !== 'string') {
    return { valid: false, error: 'Resource record missing required string resourceType' };
  }

  const validStatuses = ['created', 'modified', 'retained', 'deleted', 'draft'];
  if (!validStatuses.includes(record.lifecycleStatus)) {
    return { valid: false, error: `Invalid lifecycleStatus: ${record.lifecycleStatus}` };
  }

  const validValidationStatuses = ['draft', 'unverified', 'verified', 'failed'];
  if (!validValidationStatuses.includes(record.validationStatus)) {
    return { valid: false, error: `Invalid validationStatus: ${record.validationStatus}` };
  }

  if (record.parentResourceIds && !Array.isArray(record.parentResourceIds)) {
    return { valid: false, error: 'parentResourceIds must be an array' };
  }

  if (record.modifiedByTaskIds && !Array.isArray(record.modifiedByTaskIds)) {
    return { valid: false, error: 'modifiedByTaskIds must be an array' };
  }

  return { valid: true };
}

/**
 * Interpolates saved resource IDs into command and instruction templates.
 * Replaces {{vpcId}}, {{publicSubnetAz1}}, {{natGatewayId}}, etc.
 */
export function interpolateResourceVariables(templateString = '', resourcesMap = {}, region = 'eu-west-2') {
  if (typeof templateString !== 'string') return '';

  let result = templateString;

  // Global region fallback
  result = result.replaceAll('{{region}}', region || 'eu-west-2');

  // Interpolate known resource keys
  Object.keys(resourcesMap).forEach(key => {
    const res = resourcesMap[key];
    const val = typeof res === 'object' ? (res.awsId || res.value || '') : String(res || '');
    if (val) {
      result = result.replaceAll(`{{${key}}}`, val);
    }
  });

  // Handle shorthand legacy keys
  if (resourcesMap.mainVpc?.awsId) {
    result = result.replaceAll('{{vpcId}}', resourcesMap.mainVpc.awsId);
  }
  if (resourcesMap.publicSubnetAz1?.awsId) {
    result = result.replaceAll('{{publicSubnetAz1}}', resourcesMap.publicSubnetAz1.awsId);
  }
  if (resourcesMap.privateSubnetAz1?.awsId) {
    result = result.replaceAll('{{privateSubnetAz1}}', resourcesMap.privateSubnetAz1.awsId);
  }
  if (resourcesMap.internetGateway?.awsId) {
    result = result.replaceAll('{{internetGatewayId}}', resourcesMap.internetGateway.awsId);
  }
  if (resourcesMap.natGateway?.awsId) {
    result = result.replaceAll('{{natGatewayId}}', resourcesMap.natGateway.awsId);
  }

  return result;
}

/**
 * Calculates high-level progress metrics for the VPC Learning Path.
 */
export function calculatePathMetrics(completedTaskIds = []) {
  const completedSet = new Set(completedTaskIds);
  const totalTasks = VPC_PATH_TASKS.length;
  const completedCount = VPC_PATH_TASKS.filter(t => completedSet.has(t.id)).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Phase completion breakdown
  const phaseMetrics = VPC_LEARNING_PATH_PHASES.map(phase => {
    const phaseTotal = phase.taskIds.length;
    const phaseDone = phase.taskIds.filter(id => completedSet.has(id)).length;
    const isPhaseComplete = phaseTotal > 0 && phaseDone === phaseTotal;

    return {
      phaseId: phase.id,
      phaseNumber: phase.phaseNumber,
      title: phase.title,
      total: phaseTotal,
      completed: phaseDone,
      percent: phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0,
      isComplete: isPhaseComplete
    };
  });

  return {
    totalTasks,
    completedCount,
    percentComplete,
    phaseMetrics
  };
}

/**
 * Loads guest progress state from localStorage.
 */
export function loadGuestPathState() {
  try {
    const rawProg = localStorage.getItem(GUEST_PATH_PROGRESS_KEY);
    const rawRes = localStorage.getItem(GUEST_PATH_RESOURCES_KEY);
    return {
      progress: rawProg ? JSON.parse(rawProg) : null,
      resources: rawRes ? JSON.parse(rawRes) : {}
    };
  } catch (err) {
    return { progress: null, resources: {} };
  }
}

/**
 * Saves guest progress state to localStorage.
 */
export function saveGuestPathState(progressRecord, resourcesMap) {
  try {
    if (progressRecord) {
      localStorage.setItem(GUEST_PATH_PROGRESS_KEY, JSON.stringify(progressRecord));
    }
    if (resourcesMap) {
      localStorage.setItem(GUEST_PATH_RESOURCES_KEY, JSON.stringify(resourcesMap));
    }
  } catch (err) {
    console.warn('[vpcLearningPathService] Failed to save guest state to localStorage:', err);
  }
}

/**
 * Merges guest local path progress into Supabase DB after authentication.
 * Follows strict timestamp and active identity conflict resolution rules.
 */
export function mergeGuestStateWithRemote(guestState, remoteState) {
  if (!guestState?.progress) return remoteState;
  if (!remoteState?.progress) return guestState;

  const guestProg = guestState.progress;
  const remoteProg = remoteState.progress;

  // 1. Current Task Position: use position from record with latest updated_at
  const guestTime = new Date(guestProg.updated_at || guestProg.updatedAt || 0).getTime();
  const remoteTime = new Date(remoteProg.updated_at || remoteProg.updatedAt || 0).getTime();

  const currentTaskId = guestTime > remoteTime
    ? (guestProg.current_task_id || guestProg.currentTaskId)
    : (remoteProg.current_task_id || remoteProg.currentTaskId);

  // 2. Set union for completed_task_ids
  const completedSet = new Set([
    ...(remoteProg.completed_task_ids || remoteProg.completedTaskIds || []),
    ...(guestProg.completed_task_ids || guestProg.completedTaskIds || [])
  ]);

  // 3. Resources map merge: remote takes precedence when timestamps match
  const mergedResources = { ...(guestState.resources || {}), ...(remoteState.resources || {}) };

  // 4. NAT branch state: preserve active branch from latest timestamp session
  const natBranchState = guestTime > remoteTime
    ? (guestProg.nat_branch_state || guestProg.natBranchState)
    : (remoteProg.nat_branch_state || remoteProg.natBranchState);

  return {
    progress: {
      user_id: remoteProg.user_id,
      path_id: 'vpc-learning-path',
      preferred_mode: remoteProg.preferred_mode || guestProg.preferred_mode || 'console',
      current_task_id: currentTaskId,
      completed_task_ids: Array.from(completedSet),
      task_mode_history: { ...(guestProg.task_mode_history || {}), ...(remoteProg.task_mode_history || {}) },
      task_step_progress: { ...(guestProg.task_step_progress || {}), ...(remoteProg.task_step_progress || {}) },
      resource_decisions: { ...(guestProg.resource_decisions || {}), ...(remoteProg.resource_decisions || {}) },
      nat_branch_state: natBranchState || {},
      completion_status: remoteProg.completion_status || guestProg.completion_status || 'in_progress',
      updated_at: new Date().toISOString()
    },
    resources: mergedResources
  };
}

/**
 * Loads user path progress from Supabase DB.
 */
export async function fetchUserPathProgressFromSupabase(userId) {
  if (!userId) return null;

  try {
    const { data: progData, error: progError } = await supabase
      .from('user_learning_path_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', 'vpc-learning-path')
      .maybeSingle();

    if (progError && progError.code !== 'PGRST116') {
      console.warn('[vpcLearningPathService] Error fetching progress:', progError.message);
    }

    const { data: resData, error: resError } = await supabase
      .from('user_learning_path_resources')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', 'vpc-learning-path')
      .maybeSingle();

    if (resError && resError.code !== 'PGRST116') {
      console.warn('[vpcLearningPathService] Error fetching resources:', resError.message);
    }

    if (!progData) return null;

    return {
      progress: progData,
      resources: resData?.resources || {}
    };
  } catch (err) {
    console.error('[vpcLearningPathService] Exception fetching path progress:', err);
    return null;
  }
}

/**
 * Saves user path progress to Supabase DB.
 */
export async function saveUserPathProgressToSupabase(userId, progressRecord, resourcesMap) {
  if (!userId) return { success: false, error: 'User not authenticated' };

  try {
    const progPayload = {
      user_id: userId,
      path_id: 'vpc-learning-path',
      preferred_mode: progressRecord.preferred_mode || progressRecord.preferredMode || 'console',
      current_task_id: progressRecord.current_task_id || progressRecord.currentTaskId || 'task-saa-vpc-design-a-vpc-cidr-plan-001',
      completed_task_ids: progressRecord.completed_task_ids || progressRecord.completedTaskIds || [],
      task_mode_history: progressRecord.task_mode_history || progressRecord.taskModeHistory || {},
      task_step_progress: progressRecord.task_step_progress || progressRecord.taskStepProgress || {},
      resource_decisions: progressRecord.resource_decisions || progressRecord.resourceDecisions || {},
      nat_branch_state: progressRecord.nat_branch_state || progressRecord.natBranchState || {},
      completion_status: progressRecord.completion_status || progressRecord.completionStatus || 'in_progress',
      updated_at: new Date().toISOString()
    };

    const { error: progErr } = await supabase
      .from('user_learning_path_progress')
      .upsert(progPayload, { onConflict: 'user_id,path_id' });

    if (progErr) throw progErr;

    if (resourcesMap) {
      const resPayload = {
        user_id: userId,
        path_id: 'vpc-learning-path',
        region: 'eu-west-2',
        resources: resourcesMap,
        updated_at: new Date().toISOString()
      };

      const { error: resErr } = await supabase
        .from('user_learning_path_resources')
        .upsert(resPayload, { onConflict: 'user_id,path_id' });

      if (resErr) throw resErr;
    }

    return { success: true };
  } catch (err) {
    console.error('[vpcLearningPathService] Error saving path progress:', err);
    return { success: false, error: err.message || 'Failed to save path progress.' };
  }
}

/**
 * Calculates a standardized progress summary for a follow-along programme.
 * Handles loading states, guest localStorage progress, and authenticated Supabase progress.
 */
export async function getProgrammeProgressSummary(userId, programmeId = 'vpc-learning-path') {
  if (programmeId !== 'vpc-learning-path') {
    return {
      loading: false,
      programmeId,
      status: 'coming-soon',
      completedTasks: 0,
      totalTasks: 0,
      completionPercentage: 0,
      currentTaskId: null,
      currentTaskTitle: null,
      resourcesRetained: false,
      cleanupPending: false,
      lastUpdatedAt: null
    };
  }

  let state = null;

  if (!userId) {
    state = loadGuestPathState();
  } else {
    state = await fetchUserPathState(userId, 'vpc-learning-path');
  }

  if (!state || !state.progress) {
    const firstTask = VPC_PATH_TASKS[0];
    return {
      loading: false,
      programmeId,
      status: 'not-started',
      completedTasks: 0,
      totalTasks: VPC_PATH_TASKS.length,
      completionPercentage: 0,
      currentTaskId: firstTask?.id || null,
      currentTaskTitle: firstTask?.title || null,
      resourcesRetained: false,
      cleanupPending: false,
      lastUpdatedAt: null
    };
  }

  const prog = state.progress;
  const completedTaskIds = prog.completed_task_ids || prog.completedTaskIds || [];
  const metrics = calculatePathMetrics(completedTaskIds);
  const currentTaskId = prog.current_task_id || prog.currentTaskId || VPC_PATH_TASKS[0]?.id;
  const currentTaskObj = VPC_PATH_TASKS.find(t => t.id === currentTaskId) || VPC_PATH_TASKS[0];

  const total = VPC_PATH_TASKS.length;
  const completedCount = completedTaskIds.length;
  const percent = metrics.percentComplete || 0;

  let status = 'in-progress';
  if (completedCount === 0) {
    status = 'not-started';
  } else if (completedCount >= total || prog.completion_status === 'completed') {
    status = 'completed';
  } else if (prog.completion_status === 'cleanup_pending') {
    status = 'cleanup-pending';
  } else if (prog.completion_status === 'resources_retained') {
    status = 'resources-retained';
  }

  return {
    loading: false,
    programmeId,
    status,
    completedTasks: completedCount,
    totalTasks: total,
    completionPercentage: percent,
    currentTaskId: currentTaskObj?.id || null,
    currentTaskTitle: currentTaskObj?.title || null,
    resourcesRetained: status === 'resources-retained' || Object.keys(state.resources || {}).length > 0,
    cleanupPending: status === 'cleanup-pending',
    lastUpdatedAt: prog.updated_at || prog.updatedAt || null
  };
}

