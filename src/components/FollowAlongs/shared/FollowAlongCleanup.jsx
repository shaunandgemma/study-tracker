import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { canCompleteCleanup } from './followAlongContract.js';

function ExtensionSlot({ slot, registrations, context }) {
  return (registrations || []).filter(item => item.slot === slot && item.status === 'complete' && item.Component)
    .map(item => <item.Component key={item.id} context={context} />);
}

export const FollowAlongCleanup = ({ config, extensions, resources, onCancel, onComplete, isBusy }) => {
  const [checkedIds, setCheckedIds] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [status, setStatus] = useState('in_progress');
  const [error, setError] = useState('');
  const cleanupCapability = config.capabilities.cleanup;
  const supported = cleanupCapability.status === 'supported';
  const canSubmit = canCompleteCleanup(config, checkedIds, acknowledged, status);
  const context = { config, resources, checkedIds, acknowledged, status };

  const submit = async () => {
    if (!canSubmit || isBusy) return;
    setError('');
    if (!await onComplete(status)) setError('Cleanup status was not saved. Review the error above and retry.');
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
        <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
        <div><h2 className="text-xl font-extrabold text-white">Teardown &amp; Cleanup</h2><p className="text-xs text-slate-400 mt-1">Follow the approved manual sequence, then record the final project status.</p></div>
      </div>
      <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0" /><p><strong>Manual safety gate:</strong> Study Tracker never deletes live provider resources. Verify every destructive action yourself in the provider interface.</p>
      </div>
      <ExtensionSlot slot="cleanup.beforeChecklist" registrations={extensions} context={context} />
      {supported ? (
        <div className="space-y-2">
          {config.cleanup.steps.map((step, index) => (
            <label key={step.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input type="checkbox" disabled={isBusy} checked={checkedIds.includes(step.id)} onChange={() => setCheckedIds(ids => ids.includes(step.id) ? ids.filter(id => id !== step.id) : [...ids, step.id])} className="mt-0.5" />
              <span><span className="text-xs font-bold text-slate-200">{index + 1}. {step.title}</span>{step.description && <span className="block text-[11px] text-slate-400 mt-1">{step.description}</span>}</span>
            </label>
          ))}
        </div>
      ) : (
        <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
          <input type="checkbox" disabled={isBusy} checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} className="mt-0.5" />
          <span><strong className="text-white">Cleanup is not applicable:</strong> {cleanupCapability.reason} Acknowledge this assessment before recording a cleaned result.</span>
        </label>
      )}
      <ExtensionSlot slot="cleanup.afterChecklist" registrations={extensions} context={context} />
      <fieldset className="space-y-2">
        <legend className="text-xs font-bold text-slate-300 mb-2">Final project status</legend>
        {[
          ['in_progress', 'Still in progress'],
          ['completed_retained', 'Completed — resources retained'],
          ['completed_cleaned', 'Completed — manually cleaned']
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-2 text-xs text-slate-300"><input type="radio" name="follow-along-status" value={value} checked={status === value} onChange={() => setStatus(value)} disabled={isBusy} />{label}</label>
        ))}
      </fieldset>
      {!canSubmit && <p role="alert" className="text-xs text-amber-300">Complete the cleanup gate before recording a manually cleaned status.</p>}
      {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-800">
        <button type="button" disabled={isBusy} onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Return to tasks</button>
        <button type="button" disabled={isBusy || !canSubmit} onClick={submit} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save Final Status</button>
      </div>
    </section>
  );
};
