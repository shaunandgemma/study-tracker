import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  AUTHOR_MODE_STATUSES,
  AUTHOR_RESOURCE_TYPES,
  AUTHOR_VERIFICATION_MODES,
  addAuthorCleanupStep,
  addAuthorInstructionItem,
  addAuthorInstructionStep,
  addAuthorResource,
  addAuthorSource,
  addAuthorVerification,
  removeAuthorCleanupStep,
  removeAuthorInstructionItem,
  removeAuthorInstructionStep,
  removeAuthorResource,
  removeAuthorSource,
  removeAuthorVerification,
  setAuthorSourceTaskLink,
  setAuthorTaskMode,
  moveAuthorInstructionItem,
  updateAuthorCleanupStep,
  updateAuthorInstructionItem,
  updateAuthorInstructionStep,
  updateAuthorResource,
  updateAuthorSource,
  updateAuthorVerification
} from './authorContent.js';

const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500';
const cardClass = 'rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3';

function Field({ label, children, help }) {
  return <label className="block"><span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>{children}{help && <span className="block text-[11px] text-slate-500 mt-1">{help}</span>}</label>;
}

function RunButton({ children = 'Add', type = 'submit' }) {
  return <button type={type} className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> {children}</button>;
}

function RemoveButton({ label, onClick }) {
  return <button type="button" aria-label={label} onClick={onClick} className="p-2 rounded-lg bg-rose-950 text-rose-300"><Trash2 className="w-4 h-4" /></button>;
}

export function SourcesStage({ draft, apply, setMessage }) {
  const [form, setForm] = useState({ title: '', url: '', purpose: '' });
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => {
    event.preventDefault();
    const result = addAuthorSource(draft, form);
    if (!result.success) { setMessage(result.error); return; }
    apply(result.draft); setForm({ title: '', url: '', purpose: '' }); setMessage('Official AWS source added. Link it to the tasks it supports.');
  };
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Official AWS sources</h2><p className="text-sm text-slate-400 mt-1">Record the AWS pages used to write and check each task. Only official HTTPS AWS links are accepted.</p></div><form onSubmit={add} className={cardClass}><Field label="AWS document title"><input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} placeholder="Create a VPC" className={inputClass} /></Field><Field label="Official AWS documentation address"><input type="url" value={form.url} onChange={event => setForm(value => ({ ...value, url: event.target.value }))} placeholder="https://docs.aws.amazon.com/..." className={inputClass} /></Field><Field label="Why is this source being used?"><textarea value={form.purpose} onChange={event => setForm(value => ({ ...value, purpose: event.target.value }))} rows={2} className={inputClass} /></Field><RunButton>Add AWS Source</RunButton></form><div className="space-y-4">{(draft.sources || []).map(source => <article key={source.id} className={cardClass}><div className="flex items-start justify-between gap-3"><div><strong className="text-sm text-white">{source.title || 'Untitled AWS source'}</strong><span className="block text-[11px] text-slate-500 mt-1">Stable ID: {source.id}</span></div><RemoveButton label="Remove source" onClick={() => run(removeAuthorSource(draft, source.id))} /></div><Field label="Document title"><input value={source.title} onChange={event => run(updateAuthorSource(draft, source.id, { title: event.target.value }))} className={inputClass} /></Field><Field label="Official AWS documentation address"><input value={source.url} onChange={event => run(updateAuthorSource(draft, source.id, { url: event.target.value }))} className={inputClass} /></Field><Field label="Reason for using this source"><textarea value={source.purpose} onChange={event => run(updateAuthorSource(draft, source.id, { purpose: event.target.value }))} rows={2} className={inputClass} /></Field><fieldset className="rounded-xl border border-slate-800 p-3"><legend className="px-1 text-xs font-semibold text-slate-300">Tasks supported by this source</legend><div className="space-y-2 mt-2">{draft.tasks.map(task => <label key={task.id} className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={(source.taskIds || []).includes(task.id)} onChange={event => run(setAuthorSourceTaskLink(draft, source.id, task.id, event.target.checked))} /> {task.title}</label>)}</div></fieldset></article>)}</div>{!(draft.sources || []).length && <p className="text-sm text-slate-500">No AWS sources yet.</p>}</div>;
}

function ConsoleCheckboxEditor({ draft, taskId, step, apply, setMessage }) {
  const [form, setForm] = useState({ text: '', detail: '' });
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => {
    event.preventDefault();
    const result = addAuthorInstructionItem(draft, taskId, step.id, form);
    if (!result.success) { setMessage(result.error); return; }
    apply(result.draft);
    setForm({ text: '', detail: '' });
    setMessage('Checkbox instruction added.');
  };

  return <section className="rounded-lg border border-cyan-900/60 bg-cyan-950/10 p-3 space-y-3">
    <div>
      <strong className="text-xs text-cyan-200">Learner checkbox instructions</strong>
      <p className="text-[11px] text-slate-500 mt-1">Each item appears beside its own checkbox in the Follow Along.</p>
    </div>
    {(step.instructions || []).map((instruction, index) => <article key={instruction.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-slate-400">Checkbox {index + 1}</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled={index === 0} onClick={() => run(moveAuthorInstructionItem(draft, taskId, step.id, instruction.id, -1))} className="px-2 py-1 rounded bg-slate-800 disabled:opacity-40 text-[10px] text-slate-300">Move up</button>
          <button type="button" disabled={index === step.instructions.length - 1} onClick={() => run(moveAuthorInstructionItem(draft, taskId, step.id, instruction.id, 1))} className="px-2 py-1 rounded bg-slate-800 disabled:opacity-40 text-[10px] text-slate-300">Move down</button>
          <RemoveButton label="Remove checkbox instruction" onClick={() => run(removeAuthorInstructionItem(draft, taskId, step.id, instruction.id))} />
        </div>
      </div>
      <textarea value={instruction.text} onChange={event => run(updateAuthorInstructionItem(draft, taskId, step.id, instruction.id, { text: event.target.value }))} placeholder="Exact action shown beside the checkbox" rows={2} className={inputClass} />
      <input value={instruction.detail || ''} onChange={event => run(updateAuthorInstructionItem(draft, taskId, step.id, instruction.id, { detail: event.target.value }))} placeholder="Optional extra help" className={inputClass} />
      <span className="block text-[10px] text-slate-600">Stable ID: {instruction.id}</span>
    </article>)}
    <form onSubmit={add} className="rounded-lg bg-slate-950 p-3 space-y-2">
      <textarea value={form.text} onChange={event => setForm(value => ({ ...value, text: event.target.value }))} placeholder="Next exact action for the learner" rows={2} className={inputClass} />
      <input value={form.detail} onChange={event => setForm(value => ({ ...value, detail: event.target.value }))} placeholder="Optional extra help" className={inputClass} />
      <RunButton>Add Checkbox Instruction</RunButton>
    </form>
  </section>;
}

function InstructionModeEditor({ draft, task, mode, apply, setMessage }) {
  const isConsole = mode === 'console';
  const field = isConsole ? 'consoleSteps' : 'cliSteps';
  const availability = task.modeAvailability?.[mode] || { status: 'not_applicable', reason: '' };
  const empty = isConsole ? { title: '', instruction: '', detail: '', expectedResult: '', warning: '' } : { command: '', explanation: '', expectedResult: '' };
  const [form, setForm] = useState(empty);
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => {
    event.preventDefault();
    const result = addAuthorInstructionStep(draft, task.id, mode, form);
    if (!result.success) { setMessage(result.error); return; }
    apply(result.draft);
    setForm(empty);
    setMessage(`${isConsole ? 'Console' : 'CLI'} step added.`);
  };

  return <section className="rounded-xl border border-slate-800 p-4 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label={`${isConsole ? 'Console' : 'CLI'} path`}>
        <select value={availability.status} onChange={event => run(setAuthorTaskMode(draft, task.id, mode, event.target.value, availability.reason))} className={inputClass}>
          {AUTHOR_MODE_STATUSES.map(status => <option key={status} value={status}>{status === 'available' ? 'Available' : 'Not applicable'}</option>)}
        </select>
      </Field>
      {availability.status === 'not_applicable' && <Field label="Why is this path not used?">
        <input value={availability.reason} onChange={event => run(setAuthorTaskMode(draft, task.id, mode, 'not_applicable', event.target.value))} className={inputClass} />
      </Field>}
    </div>

    {availability.status === 'available' && <>
      <div className="space-y-3">
        {(task[field] || []).map(step => <article key={step.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
          <div className="flex justify-between gap-3">
            <strong className="text-xs text-cyan-300">Step {step.stepNumber}</strong>
            <RemoveButton label={`Remove ${mode} step`} onClick={() => run(removeAuthorInstructionStep(draft, task.id, mode, step.id))} />
          </div>
          {isConsole ? <>
            <input value={step.title} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { title: event.target.value }))} placeholder="Step title" className={inputClass} />
            <ConsoleCheckboxEditor draft={draft} taskId={task.id} step={step} apply={apply} setMessage={setMessage} />
            <textarea value={step.expectedResult} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { expectedResult: event.target.value }))} placeholder="What the learner should see" rows={2} className={inputClass} />
            <input value={step.warning} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { warning: event.target.value }))} placeholder="Optional warning" className={inputClass} />
          </> : <>
            <textarea value={step.command} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { command: event.target.value }))} placeholder="One AWS CLI command" rows={2} className={`${inputClass} font-mono`} />
            <textarea value={step.explanation} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { explanation: event.target.value }))} placeholder="What this command does" rows={2} className={inputClass} />
            <textarea value={step.expectedResult} onChange={event => run(updateAuthorInstructionStep(draft, task.id, mode, step.id, { expectedResult: event.target.value }))} placeholder="Expected output" rows={2} className={inputClass} />
          </>}
        </article>)}
      </div>

      <form onSubmit={add} className="rounded-lg bg-slate-950 p-3 space-y-2">
        <strong className="text-xs text-slate-300">Add {isConsole ? 'Console' : 'CLI'} step</strong>
        {isConsole ? <>
          <input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} placeholder="Step title" className={inputClass} />
          <textarea value={form.instruction} onChange={event => setForm(value => ({ ...value, instruction: event.target.value }))} placeholder="First checkbox instruction" rows={2} className={inputClass} />
          <input value={form.detail} onChange={event => setForm(value => ({ ...value, detail: event.target.value }))} placeholder="Optional extra help for the first checkbox" className={inputClass} />
          <textarea value={form.expectedResult} onChange={event => setForm(value => ({ ...value, expectedResult: event.target.value }))} placeholder="Expected result" rows={2} className={inputClass} />
          <input value={form.warning} onChange={event => setForm(value => ({ ...value, warning: event.target.value }))} placeholder="Optional warning" className={inputClass} />
        </> : <>
          <textarea value={form.command} onChange={event => setForm(value => ({ ...value, command: event.target.value }))} placeholder="aws service action ..." rows={2} className={`${inputClass} font-mono`} />
          <textarea value={form.explanation} onChange={event => setForm(value => ({ ...value, explanation: event.target.value }))} placeholder="What this command does" rows={2} className={inputClass} />
          <textarea value={form.expectedResult} onChange={event => setForm(value => ({ ...value, expectedResult: event.target.value }))} placeholder="Expected output" rows={2} className={inputClass} />
        </>}
        <RunButton>Add Step</RunButton>
      </form>
    </>}
  </section>;
}

export function InstructionsStage({ draft, apply, setMessage }) {
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Easy task instructions</h2><p className="text-sm text-slate-400 mt-1">Write exact actions and the result the learner should see. Use Console, CLI, or both.</p></div>{draft.tasks.map(task => <article key={task.id} className={cardClass}><div><strong className="text-sm text-white">{task.title}</strong><span className="block text-[11px] text-slate-500 mt-1">Task ID: {task.id}</span></div><InstructionModeEditor draft={draft} task={task} mode="console" apply={apply} setMessage={setMessage} /><InstructionModeEditor draft={draft} task={task} mode="cli" apply={apply} setMessage={setMessage} /></article>)}{!draft.tasks.length && <p className="text-sm text-amber-300">Add tasks before writing instructions.</p>}</div>;
}

function ResourceEditor({ draft, task, apply, setMessage }) {
  const [form, setForm] = useState({ label: '', type: 'other', description: '', required: true });
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => { event.preventDefault(); const result = addAuthorResource(draft, task.id, form); if (!result.success) { setMessage(result.error); return; } apply(result.draft); setForm({ label: '', type: 'other', description: '', required: true }); setMessage('Resource capture added.'); };
  const resources = (draft.resources?.schema || []).filter(resource => resource.sourceTaskId === task.id);
  return <section className="rounded-xl border border-slate-800 p-4 space-y-3"><h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Resources created</h4>{resources.map(resource => <article key={resource.key} className="rounded-lg bg-slate-950 p-3 space-y-2"><div className="flex justify-between gap-3"><span className="text-[11px] text-slate-500">Stable key: {resource.key}</span><RemoveButton label="Remove resource" onClick={() => run(removeAuthorResource(draft, resource.key))} /></div><input value={resource.label} onChange={event => run(updateAuthorResource(draft, resource.key, { label: event.target.value }))} className={inputClass} /><textarea value={resource.description} onChange={event => run(updateAuthorResource(draft, resource.key, { description: event.target.value }))} rows={2} className={inputClass} /><select value={resource.type} onChange={event => run(updateAuthorResource(draft, resource.key, { type: event.target.value }))} className={inputClass}>{AUTHOR_RESOURCE_TYPES.map(type => <option key={type}>{type}</option>)}</select></article>)}<form onSubmit={add} className="rounded-lg bg-slate-950 p-3 space-y-2"><input value={form.label} onChange={event => setForm(value => ({ ...value, label: event.target.value }))} placeholder="Resource name, for example Project VPC ID" className={inputClass} /><textarea value={form.description} onChange={event => setForm(value => ({ ...value, description: event.target.value }))} placeholder="What value must the learner save and where will it be reused?" rows={2} className={inputClass} /><select value={form.type} onChange={event => setForm(value => ({ ...value, type: event.target.value }))} className={inputClass}>{AUTHOR_RESOURCE_TYPES.map(type => <option key={type}>{type}</option>)}</select><RunButton>Add Resource</RunButton></form></section>;
}

function VerificationEditor({ draft, task, apply, setMessage }) {
  const [form, setForm] = useState({ title: '', instruction: '', expectedResult: '', mode: 'either' });
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => { event.preventDefault(); const result = addAuthorVerification(draft, task.id, form); if (!result.success) { setMessage(result.error); return; } apply(result.draft); setForm({ title: '', instruction: '', expectedResult: '', mode: 'either' }); setMessage('Verification check added.'); };
  return <section className="rounded-xl border border-slate-800 p-4 space-y-3"><h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">How the learner checks their work</h4>{(task.verification || []).map(check => <article key={check.id} className="rounded-lg bg-slate-950 p-3 space-y-2"><div className="flex justify-end"><RemoveButton label="Remove verification" onClick={() => run(removeAuthorVerification(draft, task.id, check.id))} /></div><input value={check.title} onChange={event => run(updateAuthorVerification(draft, task.id, check.id, { title: event.target.value }))} className={inputClass} /><textarea value={check.instruction} onChange={event => run(updateAuthorVerification(draft, task.id, check.id, { instruction: event.target.value }))} rows={2} className={inputClass} /><textarea value={check.expectedResult} onChange={event => run(updateAuthorVerification(draft, task.id, check.id, { expectedResult: event.target.value }))} rows={2} className={inputClass} /><select value={check.mode} onChange={event => run(updateAuthorVerification(draft, task.id, check.id, { mode: event.target.value }))} className={inputClass}>{AUTHOR_VERIFICATION_MODES.map(mode => <option key={mode}>{mode}</option>)}</select></article>)}<form onSubmit={add} className="rounded-lg bg-slate-950 p-3 space-y-2"><input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} placeholder="Check title" className={inputClass} /><textarea value={form.instruction} onChange={event => setForm(value => ({ ...value, instruction: event.target.value }))} placeholder="Exact check to perform" rows={2} className={inputClass} /><textarea value={form.expectedResult} onChange={event => setForm(value => ({ ...value, expectedResult: event.target.value }))} placeholder="What proves success" rows={2} className={inputClass} /><select value={form.mode} onChange={event => setForm(value => ({ ...value, mode: event.target.value }))} className={inputClass}>{AUTHOR_VERIFICATION_MODES.map(mode => <option key={mode}>{mode}</option>)}</select><RunButton>Add Verification</RunButton></form></section>;
}

export function ResourcesVerificationStage({ draft, apply, setMessage }) {
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Resources and verification</h2><p className="text-sm text-slate-400 mt-1">Record values the learner must keep, then explain how they prove each task worked.</p></div>{draft.tasks.map(task => <article key={task.id} className={cardClass}><strong className="text-sm text-white">{task.title}</strong><ResourceEditor draft={draft} task={task} apply={apply} setMessage={setMessage} /><VerificationEditor draft={draft} task={task} apply={apply} setMessage={setMessage} /></article>)}</div>;
}

function CleanupEditor({ draft, task, resources, apply, setMessage }) {
  const [form, setForm] = useState({ title: '', instruction: '', verification: '', resourceKeys: [] });
  const steps = task ? task.cleanup || [] : draft.cleanup?.steps || [];
  const run = result => { if (result.success) apply(result.draft); else setMessage(result.error); };
  const add = event => { event.preventDefault(); const result = addAuthorCleanupStep(draft, task?.id || null, form); if (!result.success) { setMessage(result.error); return; } apply(result.draft); setForm({ title: '', instruction: '', verification: '', resourceKeys: [] }); setMessage('Manual cleanup step added.'); };
  const update = (stepId, changes) => run(updateAuthorCleanupStep(draft, task?.id || null, stepId, changes));
  const toggle = (keys, key) => keys.includes(key) ? keys.filter(item => item !== key) : [...keys, key];
  return <section className="rounded-xl border border-slate-800 p-4 space-y-3"><h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">{task ? `${task.title} cleanup` : 'Final programme cleanup check'}</h4>{steps.map(step => <article key={step.id} className="rounded-lg bg-slate-950 p-3 space-y-2"><div className="flex justify-between gap-3"><strong className="text-xs text-slate-300">Step {step.stepNumber}</strong><RemoveButton label="Remove cleanup step" onClick={() => run(removeAuthorCleanupStep(draft, task?.id || null, step.id))} /></div><input value={step.title} onChange={event => update(step.id, { title: event.target.value })} className={inputClass} /><textarea value={step.instruction} onChange={event => update(step.id, { instruction: event.target.value })} rows={2} className={inputClass} /><textarea value={step.verification} onChange={event => update(step.id, { verification: event.target.value })} rows={2} className={inputClass} /><fieldset className="rounded-lg border border-slate-800 p-2"><legend className="text-[11px] text-slate-400">Resources cleaned by this step</legend>{resources.map(resource => <label key={resource.key} className="flex items-center gap-2 text-xs text-slate-300 mt-2"><input type="checkbox" checked={(step.resourceKeys || []).includes(resource.key)} onChange={() => update(step.id, { resourceKeys: toggle(step.resourceKeys || [], resource.key) })} /> {resource.label}</label>)}</fieldset></article>)}<form onSubmit={add} className="rounded-lg bg-slate-950 p-3 space-y-2"><input value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} placeholder="Cleanup step title" className={inputClass} /><textarea value={form.instruction} onChange={event => setForm(value => ({ ...value, instruction: event.target.value }))} placeholder="Exact manual removal action" rows={2} className={inputClass} /><textarea value={form.verification} onChange={event => setForm(value => ({ ...value, verification: event.target.value }))} placeholder="How the learner confirms removal" rows={2} className={inputClass} /><fieldset className="rounded-lg border border-slate-800 p-2"><legend className="text-[11px] text-slate-400">Resources this step cleans</legend>{resources.map(resource => <label key={resource.key} className="flex items-center gap-2 text-xs text-slate-300 mt-2"><input type="checkbox" checked={form.resourceKeys.includes(resource.key)} onChange={() => setForm(value => ({ ...value, resourceKeys: toggle(value.resourceKeys, resource.key) }))} /> {resource.label}</label>)}</fieldset><RunButton>Add Cleanup Step</RunButton></form></section>;
}

export function CleanupStage({ draft, apply, setMessage }) {
  const resources = draft.resources?.schema || [];
  const changeWarning = (field, value) => apply({ ...draft, warnings: { ...draft.warnings, [field]: value }, cleanup: { ...draft.cleanup, manualOnly: true } });
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Warnings and manual cleanup</h2><p className="text-sm text-slate-400 mt-1">Explain costs and safety, then cover every resource in reverse dependency order.</p></div><section className={cardClass}><Field label="Cost warning"><textarea value={draft.warnings?.cost || ''} onChange={event => changeWarning('cost', event.target.value)} rows={2} className={inputClass} /></Field><Field label="Cleanup safety warning"><textarea value={draft.warnings?.safety || ''} onChange={event => changeWarning('safety', event.target.value)} rows={2} className={inputClass} /></Field><Field label="Credential warning"><textarea value={draft.warnings?.credentials || ''} onChange={event => changeWarning('credentials', event.target.value)} rows={2} className={inputClass} /></Field><Field label="Region warning"><textarea value={draft.warnings?.region || ''} onChange={event => changeWarning('region', event.target.value)} rows={2} className={inputClass} /></Field></section>{draft.tasks.map(task => <CleanupEditor key={task.id} draft={draft} task={task} resources={resources.filter(resource => resource.sourceTaskId === task.id)} apply={apply} setMessage={setMessage} />)}<CleanupEditor draft={draft} task={null} resources={resources} apply={apply} setMessage={setMessage} /><p className="text-xs text-slate-500">Cleanup is instruction-only and always manual. Author never runs deletion commands.</p></div>;
}

function ResultList({ title, items, colour }) {
  if (!items.length) return null;
  return <section><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colour}`}>{title}</h3><ol className="space-y-2">{items.map((item, index) => <li key={`${item.section}-${item.id || item.field || index}`} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">{index + 1}. {item.message}</li>)}</ol></section>;
}

export function FullCheckStage({ planning, content }) {
  const valid = planning.valid && content.valid;
  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Private authoring check</h2><p className="text-sm text-slate-400 mt-1">This checks the plan, AWS sources, instructions, verification, resources, warnings and cleanup.</p></div><div className={`rounded-xl border p-4 ${valid ? 'border-emerald-800 bg-emerald-950/30' : 'border-amber-800 bg-amber-950/20'}`}><strong className="text-sm text-white">{valid ? 'All private authoring checks passed' : `${planning.errors.length + content.errors.length} problems to fix`}</strong><p className="text-xs text-slate-400 mt-1">Passing this check does not publish or approve the draft.</p></div><ResultList title="Planning errors" items={planning.errors} colour="text-rose-300" /><ResultList title="Content and safety errors" items={content.errors} colour="text-rose-300" /><ResultList title="Warnings" items={[...planning.warnings, ...content.warnings]} colour="text-amber-300" /></div>;
}
