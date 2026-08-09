import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/useAuth.js';
import { getEc2PathTasks } from '../../data/ec2LearningPathData.js';
import {
  loadGuestEc2PathState,
  saveGuestEc2PathState,
  fetchUserEc2PathProgressFromSupabase,
  saveUserEc2PathProgressToSupabase,
  mergeGuestEc2StateWithRemote
} from '../../services/ec2LearningPathService.js';
import { ChevronLeft } from 'lucide-react';
import { Ec2PathDashboard } from './Ec2PathDashboard.jsx';
import { Ec2PathNavigator } from './Ec2PathNavigator.jsx';
import { Ec2TaskRunner } from './Ec2TaskRunner.jsx';
import { Ec2ProjectCleanup } from './Ec2ProjectCleanup.jsx';

export const Ec2LearningPathView = ({ onBackToLanding = null }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState('task-saa-ec2-compare-ec2-pricing-models-016');
  const [preferredMode, setPreferredMode] = useState('console'); // 'console' | 'cli' | 'both'
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [taskStepProgress, setTaskStepProgress] = useState({});
  const [resourceDecisions, setResourceDecisions] = useState({});
  const [retainedResources, setRetainedResources] = useState({});
  const [subView, setSubView] = useState('runner'); // 'runner' | 'cleanup'

  // Load progress state on mount and user auth change
  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const guestState = loadGuestEc2PathState();

      if (currentUser?.id) {
        const remoteState = await fetchUserEc2PathProgressFromSupabase(currentUser.id);
        const finalState = mergeGuestEc2StateWithRemote(guestState, remoteState);

        if (finalState?.progress) {
          const prog = finalState.progress;
          setActiveTaskId(prog.current_task_id || 'task-saa-ec2-compare-ec2-pricing-models-016');
          setPreferredMode(prog.preferred_mode || 'console');
          setCompletedTaskIds(prog.completed_task_ids || []);
          setTaskStepProgress(prog.task_step_progress || {});
          setResourceDecisions(prog.resource_decisions || {});
          setRetainedResources(finalState.resources || {});

          // Persist merged state to Supabase for path_id = ec2-learning-path
          await saveUserEc2PathProgressToSupabase(currentUser.id, prog, finalState.resources);
        }
      } else if (guestState.progress) {
        const prog = guestState.progress;
        setActiveTaskId(prog.current_task_id || 'task-saa-ec2-compare-ec2-pricing-models-016');
        setPreferredMode(prog.preferred_mode || 'console');
        setCompletedTaskIds(prog.completed_task_ids || []);
        setTaskStepProgress(prog.task_step_progress || {});
        setResourceDecisions(prog.resource_decisions || {});
        setRetainedResources(guestState.resources || {});
      }
    } catch (err) {
      console.error('[Ec2LearningPathView] Error loading EC2 path state:', err);
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
    const nextResources = updatedState.retainedResources !== undefined ? updatedState.retainedResources : retainedResources;

    const progRecord = {
      user_id: currentUser?.id || 'guest',
      path_id: 'ec2-learning-path',
      preferred_mode: nextMode,
      current_task_id: nextCurrentTask,
      completed_task_ids: nextCompleted,
      task_step_progress: nextStepProg,
      resource_decisions: nextDecisions,
      updated_at: new Date().toISOString()
    };

    if (currentUser?.id) {
      saveUserEc2PathProgressToSupabase(currentUser.id, progRecord, nextResources);
    } else {
      saveGuestEc2PathState(progRecord, nextResources);
    }
  }, [activeTaskId, completedTaskIds, currentUser, preferredMode, resourceDecisions, retainedResources, taskStepProgress]);

  const handleSelectTask = (taskId) => {
    setActiveTaskId(taskId);
    setSubView('runner');
    persistState({ activeTaskId: taskId });
  };

  const handleModeChange = (newMode) => {
    setPreferredMode(newMode);
    persistState({ preferredMode: newMode });
  };

  const handleRestartPath = () => {
    const resetTaskId = 'task-saa-ec2-compare-ec2-pricing-models-016';
    setActiveTaskId(resetTaskId);
    setCompletedTaskIds([]);
    setTaskStepProgress({});
    setResourceDecisions({});
    setRetainedResources({});
    persistState({
      activeTaskId: resetTaskId,
      completedTaskIds: [],
      taskStepProgress: {},
      resourceDecisions: {},
      retainedResources: {}
    });
  };

  const handleSaveTaskProgress = (taskId, progressData) => {
    const nextStepProgress = {
      ...taskStepProgress,
      [taskId]: progressData
    };
    setTaskStepProgress(nextStepProgress);
    persistState({ taskStepProgress: nextStepProgress });
  };

  const handleCompleteTask = (taskId) => {
    if (!completedTaskIds.includes(taskId)) {
      const nextCompleted = [...completedTaskIds, taskId];
      setCompletedTaskIds(nextCompleted);

      const allTasks = getEc2PathTasks();
      const idx = allTasks.findIndex(t => t.id === taskId);
      const nextTask = idx >= 0 && idx < allTasks.length - 1 ? allTasks[idx + 1] : null;
      const nextTaskId = nextTask ? nextTask.id : taskId;

      if (nextTask) {
        setActiveTaskId(nextTaskId);
      }

      persistState({
        completedTaskIds: nextCompleted,
        activeTaskId: nextTaskId
      });
    }
  };

  const handleNavigateTask = (taskId) => {
    setActiveTaskId(taskId);
    setSubView('runner');
    persistState({ activeTaskId: taskId });
  };

  const allTasks = getEc2PathTasks();
  const activeTaskObj = allTasks.find(t => t.id === activeTaskId) || allTasks[0];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl h-96" />
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to Follow Alongs Navigation Button */}
      {onBackToLanding && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span>Back to Follow Alongs</span>
          </button>
        </div>
      )}

      {/* Dashboard Top Banner */}
      <Ec2PathDashboard
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
          <Ec2PathNavigator
            activeTaskId={activeTaskId}
            completedTaskIds={completedTaskIds}
            onSelectTask={handleSelectTask}
          />
        </div>

        {/* Right Column: Active Task Runner or Teardown Wizard */}
        <div className="lg:col-span-3">
          {subView === 'cleanup' ? (
            <Ec2ProjectCleanup
              retainedResources={retainedResources}
              onCancel={() => setSubView('runner')}
              onCompleteCleanup={(status) => {
                setSubView('runner');
                persistState({ completionStatus: status });
              }}
            />
          ) : (
            <Ec2TaskRunner
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
