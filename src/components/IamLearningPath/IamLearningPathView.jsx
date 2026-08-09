import React, { useState, useEffect } from 'react';
import {
  getIamPathTasks,
  IAM_PATH_ID
} from '../../data/iamLearningPathData.js';
import {
  loadGuestIamPathState,
  saveUserIamPathProgressToSupabase,
  fetchUserIamPathProgressFromSupabase
} from '../../services/iamLearningPathService.js';
import { IamPathDashboard } from './IamPathDashboard.jsx';
import { IamPathNavigator } from './IamPathNavigator.jsx';
import { IamTaskRunner } from './IamTaskRunner.jsx';
import { IamProjectCleanup } from './IamProjectCleanup.jsx';
import { useExam } from '../../context/ExamContext.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { ShieldCheck, LayoutDashboard, ListOrdered, Wrench, ArrowLeft, RefreshCw } from 'lucide-react';

export const IamLearningPathView = ({ onBackToLanding }) => {
  const { currentUser } = useAuth();
  const { supabaseClient } = useExam();
  const allTasks = getIamPathTasks();

  const [loading, setLoading] = useState(true);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState('task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001');
  const [preferredMode, setPreferredMode] = useState('console');
  const [subView, setSubView] = useState('runner'); // 'runner' | 'cleanup'
  const [retainedResources, setRetainedResources] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);
      const state = await fetchUserIamPathProgressFromSupabase(currentUser?.id, supabaseClient);
      if (isMounted) {
        setCompletedTaskIds(state.progress?.completed_task_ids || []);
        setActiveTaskId(state.progress?.current_task_id || 'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001');
        setPreferredMode(state.progress?.instruction_mode || 'console');
        setSubView(state.progress?.sub_view || 'runner');
        setRetainedResources(state.resources || {});
        setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [currentUser, supabaseClient]);

  const persistState = (newCompleted, newTaskId, newMode, newSubView, newResources) => {
    const updatedCompleted = newCompleted !== undefined ? newCompleted : completedTaskIds;
    const updatedTaskId = newTaskId !== undefined ? newTaskId : activeTaskId;
    const updatedMode = newMode !== undefined ? newMode : preferredMode;
    const updatedSubView = newSubView !== undefined ? newSubView : subView;
    const updatedResources = newResources !== undefined ? newResources : retainedResources;

    const progressRecord = {
      completed_task_ids: updatedCompleted,
      current_task_id: updatedTaskId,
      instruction_mode: updatedMode,
      sub_view: updatedSubView
    };

    saveUserIamPathProgressToSupabase(currentUser?.id, progressRecord, updatedResources, supabaseClient);
  };

  const handleToggleTaskComplete = (taskId) => {
    const isCompleted = completedTaskIds.includes(taskId);
    const updated = isCompleted
      ? completedTaskIds.filter(id => id !== taskId)
      : [...completedTaskIds, taskId];

    setCompletedTaskIds(updated);
    persistState(updated);
  };

  const handleSelectTask = (taskId) => {
    setActiveTaskId(taskId);
    if (taskId === 'path-iam-project-final-cleanup') {
      setSubView('cleanup');
    } else {
      setSubView('runner');
    }
    persistState(completedTaskIds, taskId, preferredMode, taskId === 'path-iam-project-final-cleanup' ? 'cleanup' : 'runner');
  };

  const handleModeChange = (mode) => {
    setPreferredMode(mode);
    persistState(completedTaskIds, activeTaskId, mode);
  };

  const handleResourceUpdate = (key, resourceRecord) => {
    const updated = {
      ...retainedResources,
      [key]: resourceRecord
    };
    setRetainedResources(updated);
    persistState(completedTaskIds, activeTaskId, preferredMode, subView, updated);
  };

  const currentTask = allTasks.find(t => t.id === activeTaskId) || allTasks[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
        <span>Loading IAM Follow Along...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Navigation & Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Follow Alongs
            </button>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
              IAM Follow Along
            </h1>
            <p className="text-xs text-slate-400">
              Identity & Access Management: Least privilege, roles, policies, boundaries, MFA, SAML, Access Analyzer, and cross-account authorization.
            </p>
          </div>

          {/* View Tab Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setSubView('runner'); persistState(completedTaskIds, activeTaskId, preferredMode, 'runner'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subView === 'runner' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-4 h-4" /> Task Runner
            </button>
            <button
              onClick={() => { setSubView('cleanup'); persistState(completedTaskIds, 'path-iam-project-final-cleanup', preferredMode, 'cleanup'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subView === 'cleanup' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" /> Teardown Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigator */}
        <div className="lg:col-span-4 xl:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl">
          <IamPathNavigator
            activeTaskId={activeTaskId}
            completedTaskIds={completedTaskIds}
            onSelectTask={handleSelectTask}
          />
        </div>

        {/* Primary View Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <IamPathDashboard
            completedTaskIds={completedTaskIds}
            onSelectTask={handleSelectTask}
          />

          {subView === 'runner' ? (
            <IamTaskRunner
              task={currentTask}
              completedTaskIds={completedTaskIds}
              preferredMode={preferredMode}
              retainedResources={retainedResources}
              onToggleComplete={handleToggleTaskComplete}
              onModeChange={handleModeChange}
              onResourceUpdate={handleResourceUpdate}
            />
          ) : (
            <IamProjectCleanup
              retainedResources={retainedResources}
              onResourceUpdate={handleResourceUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IamLearningPathView;
