import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../features/auth/useAuth.js';
import { buildCompletionTransition, normalizeFollowAlongCompletionStatus, validateFollowAlongConfig } from './followAlongContract.js';
import { FollowAlongDashboard } from './FollowAlongDashboard.jsx';
import { FollowAlongNavigator } from './FollowAlongNavigator.jsx';
import { FollowAlongTaskRunner } from './FollowAlongTaskRunner.jsx';
import { FollowAlongCleanup } from './FollowAlongCleanup.jsx';

function initialProgress(config) {
  return {
    preferredMode: 'console',
    currentTaskId: config.progress.initialTaskId,
    completedTaskIds: [],
    taskStepProgress: {},
    resourceDecisions: {},
    completionStatus: 'in_progress',
    updatedAt: new Date().toISOString()
  };
}

export const FollowAlongProgramme = ({ config, persistence, extensions = [], onBackToLanding = null }) => {
  const validation = useMemo(() => validateFollowAlongConfig(config), [config]);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(() => validation.valid ? initialProgress(config) : {});
  const [resources, setResources] = useState({});
  const [subView, setSubView] = useState('runner');
  const [loading, setLoading] = useState(validation.valid);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const runnerSave = useRef({ isDirty: false, save: null });

  useEffect(() => {
    if (!validation.valid) return undefined;
    let active = true;
    setLoading(true);
    persistence.load(currentUser?.id).then(async loaded => {
      if (!active) return;
      if (loaded?.error) setError(loaded.error);
      if (loaded?.progress) {
        setProgress({ ...initialProgress(config), ...loaded.progress, completionStatus: normalizeFollowAlongCompletionStatus(loaded.progress.completionStatus) });
        setResources(loaded.resources || {});
        if (currentUser?.id) await persistence.save(currentUser.id, loaded.progress, loaded.resources || {});
      }
    }).catch(caught => active && setError(caught?.message || 'Unable to load Follow Along progress.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [config, currentUser?.id, persistence, validation.valid]);

  const persist = useCallback(async (nextProgress, nextResources = resources) => {
    const snapshot = { ...progress, ...nextProgress, completionStatus: normalizeFollowAlongCompletionStatus(nextProgress.completionStatus ?? progress.completionStatus), updatedAt: new Date().toISOString() };
    const result = await persistence.save(currentUser?.id, snapshot, nextResources);
    if (!result?.success) {
      setError(result?.error || 'Unable to save Follow Along progress.');
      return { success: false, error: result?.error };
    }
    setProgress(snapshot);
    setResources(nextResources);
    setError('');
    return { success: true, snapshot, resources: nextResources };
  }, [currentUser?.id, persistence, progress, resources]);

  const transition = useCallback(async action => {
    if (transitionLock.current) return false;
    transitionLock.current = true;
    setTransitioning(true);
    try { return await action(); }
    finally { transitionLock.current = false; setTransitioning(false); }
  }, []);

  const saveDirty = useCallback(async () => {
    const pending = runnerSave.current;
    return pending.isDirty && typeof pending.save === 'function' ? pending.save() : { success: true, snapshot: progress, resources };
  }, [progress, resources]);

  useEffect(() => {
    const warn = event => {
      if (!runnerSave.current.isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  if (!validation.valid) return <div role="alert" className="p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-sm text-rose-200"><strong>Follow Along configuration is invalid.</strong><ul className="list-disc pl-5 mt-2">{validation.errors.map(item => <li key={item}>{item}</li>)}</ul></div>;
  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

  const activeTask = config.tasks.find(task => task.id === progress.currentTaskId) || config.tasks[0];
  const runAfterSave = action => transition(async () => {
    const saved = await saveDirty();
    if (!saved.success) return false;
    return action(saved.snapshot || progress, saved.resources || resources);
  });
  const navigateTo = taskId => runAfterSave(async (snapshot, savedResources) => {
    const result = await persist({ ...snapshot, currentTaskId: taskId }, savedResources);
    if (result.success) setSubView('runner');
    return result.success;
  });
  const navigateRelative = direction => {
    const index = config.tasks.findIndex(task => task.id === progress.currentTaskId);
    const target = config.tasks[index + (direction === 'prev' ? -1 : 1)];
    return target ? navigateTo(target.id) : false;
  };

  return (
    <div className="space-y-6">
      {onBackToLanding && <button type="button" disabled={transitioning} onClick={() => runAfterSave(async () => { onBackToLanding(); return true; })} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300"><ChevronLeft className="w-4 h-4 text-cyan-400" /> Back to Follow Alongs</button>}
      <FollowAlongDashboard
        config={config} completedTaskIds={progress.completedTaskIds} preferredMode={progress.preferredMode} resources={resources} extensions={extensions} isBusy={transitioning}
        onModeChange={mode => runAfterSave((snapshot, savedResources) => persist({ ...snapshot, preferredMode: mode }, savedResources).then(result => result.success))}
        onOpenCleanup={() => runAfterSave(async () => { setSubView('cleanup'); return true; })}
        onRestart={() => transition(async () => { const result = await persist({ ...initialProgress(config) }, resources); if (result.success) setSubView('runner'); return result.success; })}
      />
      {error && <div role="alert" className="p-3.5 rounded-xl border border-rose-800 bg-rose-950/40 text-xs text-rose-200"><strong>Progress was not saved.</strong> {error} Retry before leaving this task.</div>}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"><FollowAlongNavigator config={config} activeTaskId={activeTask.id} completedTaskIds={progress.completedTaskIds} onSelectTask={navigateTo} isBusy={transitioning} /></div>
        <div className="lg:col-span-3">
          {subView === 'cleanup' ? (
            <FollowAlongCleanup config={config} extensions={extensions} resources={resources} isBusy={transitioning} onCancel={() => setSubView('runner')} onComplete={status => transition(async () => { const result = await persist({ completionStatus: status }, resources); if (result.success) setSubView('runner'); return result.success; })} />
          ) : (
            <FollowAlongTaskRunner
              config={config} task={activeTask} completedTaskIds={progress.completedTaskIds} preferredMode={progress.preferredMode} resources={resources} stepProgress={progress.taskStepProgress} extensions={extensions} isBusy={transitioning}
              onDirtyStateChange={state => { runnerSave.current = state; }} onNavigateTask={navigateRelative}
              onSaveProgress={({ taskId, checkedSteps, resources: nextResources, preferredMode }) => persist({ taskStepProgress: { ...progress.taskStepProgress, [taskId]: checkedSteps }, preferredMode }, nextResources)}
              onCompleteAndNavigate={(taskId, decision, savedResources = resources) => transition(async () => { const index = config.tasks.findIndex(task => task.id === taskId); const nextTaskId = config.tasks[index + 1]?.id || taskId; const result = await persist(buildCompletionTransition(progress, taskId, decision, nextTaskId), savedResources); return result.success; })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
