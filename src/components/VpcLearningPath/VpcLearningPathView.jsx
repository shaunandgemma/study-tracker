import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/useAuth.js';
import { VPC_PATH_TASKS } from '../../data/vpcLearningPathData.js';
import {
  loadGuestPathState,
  saveGuestPathState,
  fetchUserPathProgressFromSupabase,
  saveUserPathProgressToSupabase,
  mergeGuestStateWithRemote
} from '../../services/vpcLearningPathService.js';
import { ChevronLeft } from 'lucide-react';
import { VpcPathDashboard } from './VpcPathDashboard.jsx';
import { VpcPathNavigator } from './VpcPathNavigator.jsx';
import { VpcTaskRunner } from './VpcTaskRunner.jsx';
import { VpcProjectCleanup } from './VpcProjectCleanup.jsx';

export const VpcLearningPathView = ({ onBackToLanding = null }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState('task-saa-vpc-design-a-vpc-cidr-plan-001');
  const [preferredMode, setPreferredMode] = useState('console'); // 'console' | 'cli' | 'both'
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [taskStepProgress, setTaskStepProgress] = useState({});
  const [resourceDecisions, setResourceDecisions] = useState({});
  const [retainedResources, setRetainedResources] = useState({});
  const [natBranchState, setNatBranchState] = useState({ activeBranch: 'nat-gateway' });
  const [subView, setSubView] = useState('runner'); // 'runner' | 'cleanup'

  // Load progress state on mount and user auth change
  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const guestState = loadGuestPathState();

      if (currentUser?.id) {
        const remoteState = await fetchUserPathProgressFromSupabase(currentUser.id);
        const finalState = mergeGuestStateWithRemote(guestState, remoteState);

        if (finalState?.progress) {
          const prog = finalState.progress;
          setActiveTaskId(prog.current_task_id || 'task-saa-vpc-design-a-vpc-cidr-plan-001');
          setPreferredMode(prog.preferred_mode || 'console');
          setCompletedTaskIds(prog.completed_task_ids || []);
          setTaskStepProgress(prog.task_step_progress || {});
          setResourceDecisions(prog.resource_decisions || {});
          setNatBranchState(prog.nat_branch_state || { activeBranch: 'nat-gateway' });
          setRetainedResources(finalState.resources || {});

          // Persist merged state to Supabase
          await saveUserPathProgressToSupabase(currentUser.id, prog, finalState.resources);
        }
      } else if (guestState.progress) {
        const prog = guestState.progress;
        setActiveTaskId(prog.current_task_id || 'task-saa-vpc-design-a-vpc-cidr-plan-001');
        setPreferredMode(prog.preferred_mode || 'console');
        setCompletedTaskIds(prog.completed_task_ids || []);
        setTaskStepProgress(prog.task_step_progress || {});
        setResourceDecisions(prog.resource_decisions || {});
        setNatBranchState(prog.nat_branch_state || { activeBranch: 'nat-gateway' });
        setRetainedResources(guestState.resources || {});
      }
    } catch (err) {
      console.error('[VpcLearningPathView] Error loading path state:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Persist state updates helper
  const persistState = useCallback(async (updatedState) => {
    const nextCompleted = updatedState.completedTaskIds !== undefined ? updatedState.completedTaskIds : completedTaskIds;
    const nextCurrentTask = updatedState.activeTaskId !== undefined ? updatedState.activeTaskId : activeTaskId;
    const nextMode = updatedState.preferredMode !== undefined ? updatedState.preferredMode : preferredMode;
    const nextStepProg = updatedState.taskStepProgress !== undefined ? updatedState.taskStepProgress : taskStepProgress;
    const nextDecisions = updatedState.resourceDecisions !== undefined ? updatedState.resourceDecisions : resourceDecisions;
    const nextNatBranch = updatedState.natBranchState !== undefined ? updatedState.natBranchState : natBranchState;
    const nextResources = updatedState.retainedResources !== undefined ? updatedState.retainedResources : retainedResources;

    const progRecord = {
      user_id: currentUser?.id || 'guest',
      path_id: 'vpc-learning-path',
      preferred_mode: nextMode,
      current_task_id: nextCurrentTask,
      completed_task_ids: nextCompleted,
      task_step_progress: nextStepProg,
      resource_decisions: nextDecisions,
      nat_branch_state: nextNatBranch,
      updated_at: new Date().toISOString()
    };

    if (currentUser?.id) {
      saveUserPathProgressToSupabase(currentUser.id, progRecord, nextResources);
    } else {
      saveGuestPathState(progRecord, nextResources);
    }
  }, [activeTaskId, completedTaskIds, currentUser, natBranchState, preferredMode, resourceDecisions, retainedResources, taskStepProgress]);

  // Task selection handler
  const handleSelectTask = (taskId) => {
    setActiveTaskId(taskId);
    setSubView('runner');
    persistState({ activeTaskId: taskId });
  };

  // Preferred mode change handler
  const handleModeChange = (newMode) => {
    setPreferredMode(newMode);
    persistState({ preferredMode: newMode });
  };

  // Restart path handler
  const handleRestartPath = () => {
    const resetTaskId = 'task-saa-vpc-design-a-vpc-cidr-plan-001';
    setActiveTaskId(resetTaskId);
    setCompletedTaskIds([]);
    setTaskStepProgress({});
    setResourceDecisions({});
    setSubView('runner');
    persistState({
      activeTaskId: resetTaskId,
      completedTaskIds: [],
      taskStepProgress: {},
      resourceDecisions: {}
    });
  };

  // Task save handler
  const handleSaveTaskProgress = ({ taskId: tid, checkedSteps, resourcesMap: updatedResources, preferredMode: mode }) => {
    const nextStepProg = { ...taskStepProgress, [tid]: checkedSteps };
    const nextResources = { ...retainedResources, ...updatedResources };
    setTaskStepProgress(nextStepProg);
    setRetainedResources(nextResources);
    persistState({
      taskStepProgress: nextStepProg,
      retainedResources: nextResources,
      preferredMode: mode
    });
  };

  // Task complete handler
  const handleCompleteTask = (tid, decision = 'retained') => {
    const nextCompleted = Array.from(new Set([...completedTaskIds, tid]));
    const nextDecisions = { ...resourceDecisions, [tid]: decision };
    setCompletedTaskIds(nextCompleted);
    setResourceDecisions(nextDecisions);
    persistState({
      completedTaskIds: nextCompleted,
      resourceDecisions: nextDecisions
    });
  };

  // Task navigation handler
  const handleNavigateTask = (direction) => {
    const currentIdx = VPC_PATH_TASKS.findIndex(t => t.id === activeTaskId);
    if (direction === 'next' && currentIdx < VPC_PATH_TASKS.length - 1) {
      const nextId = VPC_PATH_TASKS[currentIdx + 1].id;
      setActiveTaskId(nextId);
      persistState({ activeTaskId: nextId });
    } else if (direction === 'prev' && currentIdx > 0) {
      const prevId = VPC_PATH_TASKS[currentIdx - 1].id;
      setActiveTaskId(prevId);
      persistState({ activeTaskId: prevId });
    }
  };

  const activeTaskObj = VPC_PATH_TASKS.find(t => t.id === activeTaskId) || VPC_PATH_TASKS[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBackToLanding && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Follow Alongs</span>
          </button>
        </div>
      )}

      {/* Dashboard Top Banner */}
      <VpcPathDashboard
        completedTaskIds={completedTaskIds}
        preferredMode={preferredMode}
        onModeChange={handleModeChange}
        retainedResources={retainedResources}
        onRestartPath={handleRestartPath}
        onOpenCleanup={() => setSubView('cleanup')}
      />

      {/* Main Content Layout: Navigator Sidebar + Active View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Navigator Stepper */}
        <div className="lg:col-span-1">
          <VpcPathNavigator
            activeTaskId={activeTaskId}
            completedTaskIds={completedTaskIds}
            onSelectTask={handleSelectTask}
          />
        </div>

        {/* Right Column: Active Task Runner or Teardown Wizard */}
        <div className="lg:col-span-3">
          {subView === 'cleanup' ? (
            <VpcProjectCleanup
              retainedResources={retainedResources}
              onCancel={() => setSubView('runner')}
              onCompleteCleanup={(status) => {
                setSubView('runner');
                persistState({ completionStatus: status });
              }}
            />
          ) : (
            <VpcTaskRunner
              task={activeTaskObj}
              completedTaskIds={completedTaskIds}
              preferredMode={preferredMode}
              resourcesMap={retainedResources}
              stepProgressMap={taskStepProgress}
              resourceDecisionsMap={resourceDecisions}
              onSaveProgress={handleSaveTaskProgress}
              onCompleteTask={handleCompleteTask}
              onNavigateTask={handleNavigateTask}
              onUpdateResources={(res) => setRetainedResources(prev => ({ ...prev, ...res }))}
            />
          )}
        </div>
      </div>
    </div>
  );
};
