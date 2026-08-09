import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/useAuth.js';
import { getS3PathTasks } from '../../data/s3LearningPathData.js';
import {
  loadGuestS3PathState,
  saveGuestS3PathState,
  fetchUserS3PathProgressFromSupabase,
  saveUserS3PathProgressToSupabase,
  mergeGuestS3StateWithRemote
} from '../../services/s3LearningPathService.js';
import { ChevronLeft } from 'lucide-react';
import { S3PathDashboard } from './S3PathDashboard.jsx';
import { S3PathNavigator } from './S3PathNavigator.jsx';
import { S3TaskRunner } from './S3TaskRunner.jsx';
import { S3ProjectCleanup } from './S3ProjectCleanup.jsx';

export const S3LearningPathView = ({ onBackToLanding = null }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState('task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
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
      const guestState = loadGuestS3PathState();

      if (currentUser?.id) {
        const remoteState = await fetchUserS3PathProgressFromSupabase(currentUser.id);
        const finalState = mergeGuestS3StateWithRemote(guestState, remoteState);

        if (finalState?.progress) {
          const prog = finalState.progress;
          setActiveTaskId(prog.current_task_id || 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
          setPreferredMode(prog.preferred_mode || 'console');
          setCompletedTaskIds(prog.completed_task_ids || []);
          setTaskStepProgress(prog.task_step_progress || {});
          setResourceDecisions(prog.resource_decisions || {});
          setRetainedResources(finalState.resources || {});

          await saveUserS3PathProgressToSupabase(currentUser.id, prog, finalState.resources);
        }
      } else if (guestState.progress) {
        const prog = guestState.progress;
        setActiveTaskId(prog.current_task_id || 'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001');
        setPreferredMode(prog.preferred_mode || 'console');
        setCompletedTaskIds(prog.completed_task_ids || []);
        setTaskStepProgress(prog.task_step_progress || {});
        setResourceDecisions(prog.resource_decisions || {});
        setRetainedResources(guestState.resources || {});
      }
    } catch (err) {
      console.error('[S3LearningPathView] Error loading S3 path state:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const persistState = useCallback(async (updatedState) => {
    const nextCompleted = updatedState.completedTaskIds !== undefined ? updatedState.completedTaskIds : completedTaskIds;
    const nextCurrentTask = updatedState.activeTaskId !== undefined ? updatedState.activeTaskId : activeTaskId;
    const nextMode = updatedState.preferredMode !== undefined ? updatedState.preferredMode : preferredMode;
    const nextStepProg = updatedState.taskStepProgress !== undefined ? updatedState.taskStepProgress : taskStepProgress;
    const nextDecisions = updatedState.resourceDecisions !== undefined ? updatedState.resourceDecisions : resourceDecisions;
    const nextResources = updatedState.retainedResources !== undefined ? updatedState.retainedResources : retainedResources;

    const progRecord = {
      current_task_id: nextCurrentTask,
      preferred_mode: nextMode,
      completed_task_ids: nextCompleted,
      task_step_progress: nextStepProg,
      resource_decisions: nextDecisions,
      updated_at: new Date().toISOString()
    };

    if (currentUser?.id) {
      await saveUserS3PathProgressToSupabase(currentUser.id, progRecord, nextResources);
    } else {
      saveGuestS3PathState(progRecord, nextResources);
    }
  }, [completedTaskIds, activeTaskId, preferredMode, taskStepProgress, resourceDecisions, retainedResources, currentUser]);

  const handleSelectTask = (taskId) => {
    setActiveTaskId(taskId);
    if (taskId === 'path-s3-project-final-cleanup') {
      setSubView('cleanup');
    } else {
      setSubView('runner');
    }
    persistState({ activeTaskId: taskId });
  };

  const handleToggleTaskComplete = (taskId) => {
    let nextCompleted;
    if (completedTaskIds.includes(taskId)) {
      nextCompleted = completedTaskIds.filter(id => id !== taskId);
    } else {
      nextCompleted = [...completedTaskIds, taskId];
    }
    setCompletedTaskIds(nextCompleted);
    persistState({ completedTaskIds: nextCompleted });
  };

  const handleModeChange = (mode) => {
    setPreferredMode(mode);
    persistState({ preferredMode: mode });
  };

  const handleResourceUpdate = (resourceKey, record) => {
    const nextResources = {
      ...retainedResources,
      [resourceKey]: record
    };
    setRetainedResources(nextResources);
    persistState({ retainedResources: nextResources });
  };

  const allTasks = getS3PathTasks();
  const currentTaskObj = allTasks.find(t => t.id === activeTaskId) || allTasks[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Loading S3 Follow Along...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Catalogue
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-100">AWS S3 Follow Along</h1>
            <p className="text-xs text-amber-400">33 Canonical Tasks + 1 Teardown Wizard</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setSubView('runner')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subView === 'runner' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Task Runner
          </button>
          <button
            onClick={() => {
              setActiveTaskId('path-s3-project-final-cleanup');
              setSubView('cleanup');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              subView === 'cleanup' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Final Cleanup
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigator */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col overflow-y-auto">
          <S3PathNavigator
            activeTaskId={activeTaskId}
            completedTaskIds={completedTaskIds}
            onSelectTask={handleSelectTask}
          />
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="max-w-5xl mx-auto space-y-6">
            <S3PathDashboard
              completedTaskIds={completedTaskIds}
              activeTaskId={activeTaskId}
              onSelectTask={handleSelectTask}
            />

            {subView === 'cleanup' ? (
              <S3ProjectCleanup
                retainedResources={retainedResources}
                onResourceUpdate={handleResourceUpdate}
              />
            ) : (
              <S3TaskRunner
                task={currentTaskObj}
                completedTaskIds={completedTaskIds}
                preferredMode={preferredMode}
                retainedResources={retainedResources}
                onToggleComplete={handleToggleTaskComplete}
                onModeChange={handleModeChange}
                onResourceUpdate={handleResourceUpdate}
                onNextTask={(nextId) => handleSelectTask(nextId)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default S3LearningPathView;
