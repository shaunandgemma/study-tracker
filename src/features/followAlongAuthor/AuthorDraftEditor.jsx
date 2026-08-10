import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react';
import { saveAuthorDraft } from './authorDraftService.js';
import { validateAuthorContent } from './authorContent.js';
import { CleanupStage, FullCheckStage, InstructionsStage, ResourcesVerificationStage, SourcesStage } from './AuthorContentStages.jsx';
import { validateAuthorReview } from './authorReview.js';
import { AuthorPreviewStage, AuthorReviewStage } from './AuthorReviewStages.jsx';
import { AuthorApprovalStage } from './AuthorTrustedApprovalStage.jsx';
import {
  AUTHOR_PROGRAMME_DIFFICULTIES,
  AUTHOR_REGION_SCOPES,
  AUTHOR_TASK_DIFFICULTIES,
  addAuthorPhase,
  addAuthorTask,
  getOrderedAuthorTasks,
  moveAuthorPhase,
  moveAuthorTask,
  removeAuthorTask,
  removeEmptyAuthorPhase,
  updateAuthorPhase,
  updateAuthorTask,
  validateAuthorPlanning
} from './authorPlanning.js';

const STAGES = [
  { id: 'programme', label: '1. Programme' },
  { id: 'phases', label: '2. Phases' },
  { id: 'tasks', label: '3. Tasks' },
  { id: 'check', label: '4. Planning Check' },
  { id: 'sources', label: '5. AWS Sources' },
  { id: 'instructions', label: '6. Instructions' },
  { id: 'resources', label: '7. Resources and Checks' },
  { id: 'cleanup', label: '8. Cleanup' },
  { id: 'authoring-check', label: '9. Authoring Check' },
  { id: 'preview', label: '10. Learner Preview' },
  { id: 'review', label: '11. Review' },
  { id: 'approval-boundary', label: '12. Release Candidate' }
];

const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500';

function Field({ label, children, help }) {
  return <label className="block"><span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>{children}{help && <span className="block text-[11px] text-slate-500 mt-1">{help}</span>}</label>;
}

function ProgrammeStage({ draft, change }) {
  const p = draft.programme;
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">AWS service and learner outcome</h2><p className="text-sm text-slate-400 mt-1">Describe one connected project in plain language.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Field label="Official AWS service name"><input value={p.serviceName} onChange={event => change('serviceName', event.target.value)} placeholder="Amazon VPC" className={inputClass} /></Field>
    <Field label="Short name"><input value={p.shortName} onChange={event => change('shortName', event.target.value)} placeholder="VPC" className={inputClass} /></Field>
    <Field label="Programme title"><input value={p.displayName} onChange={event => change('displayName', event.target.value)} placeholder="VPC Follow Along" className={inputClass} /></Field>
    <Field label="Short subtitle"><input value={p.subtitle} onChange={event => change('subtitle', event.target.value)} placeholder="Virtual Private Cloud and Networking" className={inputClass} /></Field>
    <Field label="AWS category"><input value={p.category} onChange={event => change('category', event.target.value)} placeholder="Networking and Content Delivery" className={inputClass} /></Field>
    <Field label="Difficulty"><select value={p.difficulty} onChange={event => change('difficulty', event.target.value)} className={inputClass}>{AUTHOR_PROGRAMME_DIFFICULTIES.map(value => <option key={value}>{value}</option>)}</select></Field>
    <Field label="Region scope"><select value={p.regionScope} onChange={event => change('regionScope', event.target.value)} className={inputClass}>{AUTHOR_REGION_SCOPES.map(value => <option key={value} value={value}>{value}</option>)}</select></Field>
    <Field label="Example AWS Region"><input value={p.defaultRegion} disabled={p.regionScope === 'global'} onChange={event => change('defaultRegion', event.target.value)} placeholder="eu-west-2" className={inputClass} /></Field>
    <Field label="Estimated total minutes (optional)"><input type="number" min="1" value={p.estimatedMinutes ?? ''} onChange={event => change('estimatedMinutes', event.target.value === '' ? null : Number(event.target.value))} placeholder="Self-paced" className={inputClass} /></Field>
  </div><Field label="What will the learner build?"><textarea value={p.description} onChange={event => change('description', event.target.value)} rows={3} className={inputClass} /></Field><Field label="What should the learner achieve when finished?"><textarea value={p.learningOutcome} onChange={event => change('learningOutcome', event.target.value)} rows={3} className={inputClass} /></Field></div>;
}

function PhaseStage({ draft, apply, setMessage }) {
  const [form, setForm] = useState({ title: '', description: '', isOptional: false });
  const add = event => {
    event.preventDefault();
    const result = addAuthorPhase(draft, form);
    if (!result.success) { setMessage(result.error); return; }
    apply(result.draft); setForm({ title: '', description: '', isOptional: false }); setMessage('Phase added. Save the draft when ready.');
  };
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Phase planner</h2><p className="text-sm text-slate-400 mt-1">Put the learner journey into a clear order.</p></div><form onSubmit={add} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3"><Field label="New phase title"><input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} placeholder="Foundation and planning" className={inputClass} /></Field><Field label="What will the learner achieve in this phase?"><textarea value={form.description} onChange={event => setForm(value => ({ ...value, description: event.target.value }))} rows={2} className={inputClass} /></Field><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.isOptional} onChange={event => setForm(value => ({ ...value, isOptional: event.target.checked }))} /> This whole phase is optional</label><button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add Phase</button></form><div className="space-y-3">{draft.phases.map((phase, index) => <article key={phase.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3"><div className="flex items-center justify-between gap-3"><strong className="text-sm text-cyan-300">Phase {index + 1}</strong><div className="flex gap-2"><button type="button" aria-label="Move phase up" disabled={index === 0} onClick={() => run(moveAuthorPhase(draft, phase.id, 'up'))} className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button type="button" aria-label="Move phase down" disabled={index === draft.phases.length - 1} onClick={() => run(moveAuthorPhase(draft, phase.id, 'down'))} className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button><button type="button" aria-label="Remove empty phase" onClick={() => run(removeEmptyAuthorPhase(draft, phase.id))} className="p-2 rounded-lg bg-rose-950 text-rose-300"><Trash2 className="w-4 h-4" /></button></div></div><input value={phase.title} onChange={event => run(updateAuthorPhase(draft, phase.id, { title: event.target.value }))} className={inputClass} /><textarea value={phase.description} onChange={event => run(updateAuthorPhase(draft, phase.id, { description: event.target.value }))} rows={2} className={inputClass} /><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={phase.isOptional} onChange={event => run(updateAuthorPhase(draft, phase.id, { isOptional: event.target.checked }))} /> Optional phase</label><span className="block text-[11px] text-slate-500">{phase.taskIds.length} tasks · Stable ID: {phase.id}</span></article>)}</div>{!draft.phases.length && <p className="text-sm text-slate-500">No phases yet.</p>}</div>;
}

function TaskCard({ draft, task, index, apply, setMessage }) {
  const ordered = getOrderedAuthorTasks(draft);
  const currentIndex = ordered.findIndex(item => item.id === task.id);
  const possiblePrerequisites = ordered.slice(0, currentIndex);
  const phase = draft.phases.find(item => item.id === task.phaseId);
  const phaseIndex = phase.taskIds.indexOf(task.id);
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const change = changes => run(updateAuthorTask(draft, task.id, changes));
  const togglePrerequisite = id => change({ prerequisites: task.prerequisites.includes(id) ? task.prerequisites.filter(item => item !== id) : [...task.prerequisites, id] });
  return <article className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4"><div className="flex items-start justify-between gap-3"><div><strong className="text-sm text-white">Task {index + 1}: {task.title}</strong><span className="block text-[11px] text-slate-500 mt-1">Stable ID: {task.id}</span></div><div className="flex gap-2"><button type="button" aria-label="Move task up" disabled={phaseIndex === 0} onClick={() => run(moveAuthorTask(draft, task.id, 'up'))} className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button type="button" aria-label="Move task down" disabled={phaseIndex === phase.taskIds.length - 1} onClick={() => run(moveAuthorTask(draft, task.id, 'down'))} className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button><button type="button" aria-label="Remove task" onClick={() => { if (globalThis.confirm?.(`Remove draft task "${task.title}"?`) !== false) run(removeAuthorTask(draft, task.id)); }} className="p-2 rounded-lg bg-rose-950 text-rose-300"><Trash2 className="w-4 h-4" /></button></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Task title"><input value={task.title} onChange={event => change({ title: event.target.value })} className={inputClass} /></Field><Field label="AWS feature"><input value={task.feature} onChange={event => change({ feature: event.target.value })} className={inputClass} /></Field><Field label="Phase"><select value={task.phaseId} onChange={event => change({ phaseId: event.target.value })} className={inputClass}>{draft.phases.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field><Field label="Difficulty"><select value={task.difficulty} onChange={event => change({ difficulty: event.target.value })} className={inputClass}>{AUTHOR_TASK_DIFFICULTIES.map(value => <option key={value}>{value}</option>)}</select></Field><Field label="Minutes (optional)"><input type="number" min="1" value={task.estimatedMinutes ?? ''} onChange={event => change({ estimatedMinutes: event.target.value === '' ? null : Number(event.target.value) })} placeholder="Self-paced" className={inputClass} /></Field><Field label="Region"><input value={task.region} onChange={event => change({ region: event.target.value })} className={inputClass} /></Field></div><Field label="Learner objective"><textarea value={task.goal} onChange={event => change({ goal: event.target.value })} rows={2} className={inputClass} /></Field><Field label="Why does this matter?"><textarea value={task.whyItMatters} onChange={event => change({ whyItMatters: event.target.value })} rows={2} className={inputClass} /></Field><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={task.isOptional} onChange={event => change({ isOptional: event.target.checked })} /> This task is optional</label><fieldset className="rounded-xl border border-slate-800 p-3"><legend className="px-1 text-xs font-semibold text-slate-300">Earlier required tasks</legend>{possiblePrerequisites.length ? <div className="space-y-2 mt-2">{possiblePrerequisites.map(item => <label key={item.id} className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={task.prerequisites.includes(item.id)} onChange={() => togglePrerequisite(item.id)} /> {item.title}{item.isOptional ? ' (optional)' : ''}</label>)}</div> : <p className="text-[11px] text-slate-500 mt-2">No earlier tasks are available.</p>}</fieldset></article>;
}

function TaskStage({ draft, apply, setMessage }) {
  const [form, setForm] = useState({ phaseId: draft.phases[0]?.id || '', title: '', feature: '', goal: '', whyItMatters: '', difficulty: 'Medium', estimatedMinutes: '', isOptional: false });
  const ordered = getOrderedAuthorTasks(draft);
  const add = event => {
    event.preventDefault();
    const result = addAuthorTask(draft, form);
    if (!result.success) { setMessage(result.error); return; }
    apply(result.draft); setForm(value => ({ ...value, title: '', feature: '', goal: '', whyItMatters: '', phaseId: result.task.phaseId })); setMessage('Task added. Save the draft when ready.');
  };
  if (!draft.phases.length) return <div><h2 className="text-xl font-extrabold text-white">Task planner</h2><p className="mt-3 text-sm text-amber-300">Add a phase before creating tasks.</p></div>;
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Task planner</h2><p className="text-sm text-slate-400 mt-1">Add task objectives and connect each task only to earlier work.</p></div><form onSubmit={add} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Phase"><select value={form.phaseId} onChange={event => setForm(value => ({ ...value, phaseId: event.target.value }))} className={inputClass}>{draft.phases.map(phase => <option key={phase.id} value={phase.id}>{phase.title}</option>)}</select></Field><Field label="Task title"><input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} className={inputClass} /></Field><Field label="AWS feature"><input value={form.feature} onChange={event => setForm(value => ({ ...value, feature: event.target.value }))} className={inputClass} /></Field><Field label="Minutes"><input type="number" min="1" value={form.estimatedMinutes} onChange={event => setForm(value => ({ ...value, estimatedMinutes: event.target.value }))} className={inputClass} /></Field></div><Field label="Learner objective"><textarea value={form.goal} onChange={event => setForm(value => ({ ...value, goal: event.target.value }))} rows={2} className={inputClass} /></Field><Field label="Why does this matter?"><textarea value={form.whyItMatters} onChange={event => setForm(value => ({ ...value, whyItMatters: event.target.value }))} rows={2} className={inputClass} /></Field><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.isOptional} onChange={event => setForm(value => ({ ...value, isOptional: event.target.checked }))} /> Optional task</label><button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add Task</button></form><div className="space-y-4">{ordered.map((task, index) => <TaskCard key={task.id} draft={draft} task={task} index={index} apply={apply} setMessage={setMessage} />)}</div>{!ordered.length && <p className="text-sm text-slate-500">No tasks yet.</p>}</div>;
}

function CheckStage({ validation }) {
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Planning check</h2><p className="text-sm text-slate-400 mt-1">This checks programme details, phase order, task order and prerequisites.</p></div><div className={`rounded-xl border p-4 ${validation.valid ? 'border-emerald-800 bg-emerald-950/30' : 'border-amber-800 bg-amber-950/20'}`}><div className="flex items-center gap-2"><CheckCircle2 className={`w-5 h-5 ${validation.valid ? 'text-emerald-300' : 'text-amber-300'}`} /><strong className="text-sm text-white">{validation.valid ? 'Planning checks passed' : `${validation.errors.length} planning problems to fix`}</strong></div></div>{validation.errors.length > 0 && <section><h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">Errors</h3><ol className="space-y-2">{validation.errors.map((item, index) => <li key={`${item.section}-${item.id || item.field || index}`} className="rounded-lg border border-rose-900 bg-rose-950/20 p-3 text-xs text-rose-200">{index + 1}. {item.message}</li>)}</ol></section>}{validation.warnings.length > 0 && <section><h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">Warnings</h3><ol className="space-y-2">{validation.warnings.map((item, index) => <li key={`${item.section}-${item.id || index}`} className="rounded-lg border border-amber-900 bg-amber-950/20 p-3 text-xs text-amber-200">{index + 1}. {item.message}</li>)}</ol></section>}</div>;
}

export const AuthorDraftEditor = ({ initialDraft, userId, authorEmail = '', storageMode = 'private_local_browser', onSaveDraft, onPreviewCandidateReadiness, onStoreReleaseCandidate, onSavedAndExit, onCancel }) => {
  const [draft, setDraft] = useState(initialDraft);
  const [savedRevision, setSavedRevision] = useState(initialDraft.draft.revision);
  const [saveState, setSaveState] = useState('Saved');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState('programme');
  const planningValidation = useMemo(() => validateAuthorPlanning(draft), [draft]);
  const contentValidation = useMemo(() => validateAuthorContent(draft), [draft]);
  const reviewValidation = useMemo(() => validateAuthorReview(draft), [draft]);
  const validation = useMemo(() => ({
    valid: planningValidation.valid && contentValidation.valid && reviewValidation.valid,
    errors: [...planningValidation.errors, ...contentValidation.errors, ...reviewValidation.errors],
    warnings: [...planningValidation.warnings, ...contentValidation.warnings, ...reviewValidation.warnings]
  }), [planningValidation, contentValidation, reviewValidation]);
  const stageIndex = STAGES.findIndex(item => item.id === stage);
  const isShared = storageMode === 'shared_supabase';

  const apply = nextDraft => { setDraft(nextDraft); setSaveState('Unsaved changes'); setMessage(''); };
  const changeProgramme = (field, value) => apply({ ...draft, programme: { ...draft.programme, [field]: value } });
  const save = async () => {
    setSaveState('Saving');
    const prepared = { ...draft, review: { ...draft.review, validationStatus: validation.valid ? 'passed' : 'failed', validationErrors: validation.errors, validationWarnings: validation.warnings } };
    const result = onSaveDraft
      ? await onSaveDraft({ draft: prepared, expectedRevision: savedRevision })
      : saveAuthorDraft({ userId, draft: prepared, expectedRevision: savedRevision });
    if (!result.success) { setSaveState('Save failed'); setMessage(result.error); return result; }
    setDraft(result.draft); setSavedRevision(result.draft.draft.revision); setSaveState('Saved'); setMessage('Draft saved.'); return result;
  };
  const leave = () => { if (saveState === 'Unsaved changes' && globalThis.confirm?.('Leave without saving these changes?') === false) return; onCancel(); };
  const moveStage = async offset => { const result = await save(); if (!result.success) return; const next = STAGES[stageIndex + offset]; if (next) setStage(next.id); };

  return <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6">
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3"><button type="button" onClick={leave} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"><ArrowLeft className="w-4 h-4" /> Author Home</button><span role="status" className={`text-xs font-semibold ${saveState === 'Save failed' ? 'text-rose-300' : saveState === 'Saved' ? 'text-emerald-300' : 'text-amber-300'}`}>{saveState} · Revision {savedRevision}</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 h-fit"><span className="block px-2 py-2 text-xs font-bold uppercase tracking-wider text-cyan-400">{isShared ? 'Shared Author stages' : 'Private Author stages'}</span>{STAGES.map(item => <button key={item.id} type="button" onClick={() => setStage(item.id)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold mt-1 ${stage === item.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>{item.label}</button>)}</aside>
        <section className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
          <div className="mb-5 pb-4 border-b border-slate-800"><span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{isShared ? 'Shared draft' : 'Private browser draft'} · Learners cannot see this</span><h1 className="text-2xl font-extrabold text-white mt-1">{draft.programme.displayName}</h1></div>
          {stage === 'programme' && <ProgrammeStage draft={draft} change={changeProgramme} />}{stage === 'phases' && <PhaseStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'tasks' && <TaskStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'check' && <CheckStage validation={planningValidation} />}{stage === 'sources' && <SourcesStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'instructions' && <InstructionsStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'resources' && <ResourcesVerificationStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'cleanup' && <CleanupStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'authoring-check' && <FullCheckStage planning={planningValidation} content={contentValidation} />}{stage === 'preview' && <AuthorPreviewStage draft={draft} apply={apply} setMessage={setMessage} />}{stage === 'review' && <AuthorReviewStage draft={draft} planningValidation={planningValidation} contentValidation={contentValidation} reviewValidation={reviewValidation} apply={apply} setMessage={setMessage} />}{stage === 'approval-boundary' && <AuthorApprovalStage draft={draft} userId={userId} authorEmail={authorEmail} storageMode={storageMode} onPreviewCandidateReadiness={onPreviewCandidateReadiness} onStoreReleaseCandidate={onStoreReleaseCandidate} planningValidation={planningValidation} contentValidation={contentValidation} reviewValidation={reviewValidation} setMessage={setMessage} />}
          {message && <p role={saveState === 'Save failed' ? 'alert' : 'status'} className={`mt-5 rounded-xl border p-3 text-xs ${saveState === 'Save failed' ? 'border-rose-800 bg-rose-950/40 text-rose-200' : 'border-slate-700 bg-slate-950/50 text-slate-300'}`}>{message}{saveState === 'Save failed' ? ' Your answers remain on this screen.' : ''}</p>}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 mt-6 border-t border-slate-800"><button type="button" disabled={stageIndex === 0} onClick={() => moveStage(-1)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30">Back</button><div className="flex flex-col sm:flex-row gap-3"><button type="button" onClick={save} className="px-4 py-2.5 rounded-xl bg-slate-700 text-xs font-bold text-white inline-flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Draft</button><button type="button" onClick={async () => { const result = await save(); if (result.success) onSavedAndExit(result.draft); }} className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white">Save and Exit</button><button type="button" disabled={stageIndex === STAGES.length - 1} onClick={() => moveStage(1)} className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white disabled:opacity-30">Continue</button></div></div>
        </section>
      </div>
    </div>
  </main>;
};
