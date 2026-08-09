import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Layers, Save, Terminal } from 'lucide-react';
import { FollowAlongStepCard } from '../../../features/followAlongs/runtime/FollowAlongStepCard.jsx';
import { interpolateFollowAlongVariables, removeSavedResourceBinding } from './followAlongContract.js';
import { FollowAlongResourceCapture, validateFollowAlongResourceInput } from './FollowAlongResourceCapture.jsx';
import { FollowAlongRetentionModal } from './FollowAlongRetentionModal.jsx';

function ExtensionSlot({ slot, registrations, context }) {
  return (registrations || []).filter(item => item.slot === slot && item.status === 'complete' && item.Component)
    .map(item => <item.Component key={item.id} context={context} />);
}

export const FollowAlongTaskRunner = ({ config, task, completedTaskIds, preferredMode, resources, stepProgress, extensions, onSaveProgress, onCompleteAndNavigate, onNavigateTask, onDirtyStateChange, isBusy }) => {
  const taskId = task?.id;
  const [activeMode, setActiveMode] = useState(preferredMode);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!task) return;
    setActiveMode(preferredMode);
    setCheckedSteps(stepProgress[task.id] || []);
    setDrafts(Object.fromEntries((task.createdResourceKeys || []).map(key => [key, resources[key]?.value ?? resources[key]?.providerId ?? ''])));
    setDirty(false);
    setError('');
  }, [preferredMode, resources, stepProgress, task, taskId]);

  const buildResources = useCallback((removeKey = null) => {
    const next = removeKey ? removeSavedResourceBinding(resources, removeKey) : { ...resources };
    for (const key of task.createdResourceKeys || []) {
      if (key === removeKey) continue;
      const field = config.resources.schema.find(item => item.key === key);
      const result = validateFollowAlongResourceInput(field, drafts[key]);
      if (!result.valid) return { success: false, error: result.error };
      if (result.value) next[key] = { key, type: field.type, value: result.value, providerId: result.value, createdByTaskId: task.id, lifecycleStatus: 'created' };
    }
    return { success: true, resources: next };
  }, [config.resources.schema, drafts, resources, task]);

  const save = useCallback(async (removeKey = null) => {
    if (saving || isBusy) return { success: false, error: 'A progress transition is already running.' };
    const built = buildResources(removeKey);
    if (!built.success) { setError(built.error); return built; }
    setSaving(true);
    setError('');
    try {
      const result = await onSaveProgress({ taskId, checkedSteps, resources: built.resources, preferredMode: activeMode });
      if (!result?.success) { setError(result?.error || 'Unable to save task progress.'); return { success: false, error: result?.error }; }
      if (removeKey) setDrafts(value => ({ ...value, [removeKey]: '' }));
      setDirty(false);
      return result;
    } catch (caught) {
      const message = caught?.message || 'Unable to save task progress.';
      setError(message);
      return { success: false, error: message };
    } finally { setSaving(false); }
  }, [activeMode, buildResources, checkedSteps, isBusy, onSaveProgress, saving, taskId]);

  useEffect(() => {
    onDirtyStateChange({ isDirty: dirty, save });
    return () => onDirtyStateChange({ isDirty: false, save: null });
  }, [dirty, onDirtyStateChange, save]);

  const renderedSteps = useCallback(steps => (steps || []).map((step, index) => {
    const resolve = value => interpolateFollowAlongVariables(value, resources, config.resources.variables || {}, config.resources.interpolationAliases || {});
    return {
      ...step,
      number: step.number || index + 1,
      title: resolve(step.title), description: resolve(step.description), note: resolve(step.note), warning: resolve(step.warning), expectedResult: resolve(step.expectedResult),
      instructions: (step.instructions || []).map(item => ({ ...item, text: resolve(item.text), label: resolve(item.label), detail: resolve(item.detail) })),
      commands: (step.commands || []).map(item => ({ ...item, text: resolve(item.text), explanation: resolve(item.explanation), expectedOutput: resolve(item.expectedOutput), warning: resolve(item.warning) }))
    };
  }), [config.resources.interpolationAliases, config.resources.variables, resources]);

  const displayed = useMemo(() => ({ console: renderedSteps(task?.consoleSteps), cli: renderedSteps(task?.cliSteps) }), [renderedSteps, task]);
  if (!task) return null;
  const index = config.tasks.findIndex(item => item.id === task.id);
  const actionBusy = isBusy || saving || completing;
  const context = { config, task, resources, activeMode, checkedSteps };
  const toggleStep = (step, shouldCheck) => {
    const ids = step.instructions?.length ? step.instructions.map(item => item.id) : [step.id];
    setCheckedSteps(value => shouldCheck ? [...new Set([...value, ...ids])] : value.filter(id => !ids.includes(id)));
    setDirty(true);
  };
  const renderMode = mode => {
    const availability = task.modeAvailability[mode];
    if (availability.status === 'not_applicable') return <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-300"><strong className="text-white">{mode === 'console' ? 'Console' : 'CLI'} instructions are not applicable.</strong> {availability.reason}</div>;
    const Icon = mode === 'console' ? Layers : Terminal;
    return <div className="space-y-4"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Icon className="w-4 h-4 text-cyan-400" />{mode === 'console' ? 'Console Instructions' : 'CLI Commands'}</h3>{displayed[mode].map(step => <FollowAlongStepCard key={step.id} step={step} completedItemIds={checkedSteps} onToggleItem={id => { setCheckedSteps(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id]); setDirty(true); }} onToggleMainStep={(_, checked) => toggleStep(step, checked)} />)}</div>;
  };

  return (
    <>
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div><div className="flex items-center gap-2"><span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Phase {config.phases.findIndex(item => item.id === task.phaseId) + 1} — Task {index + 1} of {config.tasks.length}</span>{completedTaskIds.includes(task.id) && <span className="text-[10px] text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>}</div><h2 className="text-xl font-extrabold text-white mt-1">{task.title}</h2></div>
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex gap-1">{[['console', 'Console'], ['cli', 'CLI'], ['both', 'Show Both']].map(([mode, label]) => <button type="button" key={mode} disabled={actionBusy} onClick={() => { setActiveMode(mode); setDirty(true); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeMode === mode ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>{label}</button>)}</div>
        </div>
        <ExtensionSlot slot="runner.beforeObjective" registrations={extensions} context={context} />
        <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300"><strong className="text-cyan-400 block mb-1">Objective:</strong>{task.goal}</div>
        <FollowAlongResourceCapture config={config} task={task} resources={resources} drafts={drafts} onDraftChange={(key, value) => { setDrafts(current => ({ ...current, [key]: value })); setDirty(true); }} onRemoveBinding={save} isBusy={actionBusy} />
        <ExtensionSlot slot="runner.afterResourceCapture" registrations={extensions} context={context} />
        <ExtensionSlot slot="runner.beforeSteps" registrations={extensions} context={context} />
        <div className="mt-6 space-y-6">{(activeMode === 'console' || activeMode === 'both') && renderMode('console')}{(activeMode === 'cli' || activeMode === 'both') && renderMode('cli')}</div>
        <ExtensionSlot slot="runner.afterSteps" registrations={extensions} context={context} />
        {error && <div role="alert" className="mt-4 p-3 rounded-xl border border-rose-800 bg-rose-950/40 text-xs text-rose-200"><strong>Progress was not saved.</strong> {error}</div>}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-6 border-t border-slate-800">
          <button type="button" disabled={index === 0 || actionBusy} onClick={() => onNavigateTask('prev')} className="px-4 py-2.5 rounded-xl bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-semibold flex justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Previous Task</button>
          <div className="flex gap-3"><button type="button" disabled={actionBusy} onClick={() => save()} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex gap-2"><Save className="w-4 h-4" /> {dirty ? 'Save Unsaved Changes' : 'Save Progress'}</button><button type="button" disabled={actionBusy} onClick={async () => { if (!dirty || (await save()).success) setDecisionOpen(true); }} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold flex gap-2">Next Task <ChevronRight className="w-4 h-4" /></button></div>
        </div>
      </section>
      <FollowAlongRetentionModal open={decisionOpen} isBusy={actionBusy} onCancel={() => setDecisionOpen(false)} onDecision={async decision => { setCompleting(true); setError(''); const ok = await onCompleteAndNavigate(task.id, decision); if (ok) setDecisionOpen(false); else setError('The retention decision was not saved. The task remains unchanged.'); setCompleting(false); }} />
    </>
  );
};
