import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

export function validateFollowAlongResourceInput(field, value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return { valid: true, value: '' };
  const validator = field.validator || { kind: 'none' };
  if (validator.kind === 'identifier' && !/^[A-Za-z0-9][A-Za-z0-9._:/-]*$/.test(trimmed)) {
    return { valid: false, value: trimmed, error: validator.message || `${field.label} is not a valid identifier.` };
  }
  if (validator.kind === 'pattern') {
    try {
      if (!new RegExp(validator.pattern).test(trimmed)) {
        return { valid: false, value: trimmed, error: validator.message || `${field.label} does not match the required format.` };
      }
    } catch {
      return { valid: false, value: trimmed, error: `${field.label} has an invalid configured validator.` };
    }
  }
  return { valid: true, value: trimmed };
}

export const FollowAlongResourceCapture = ({
  config,
  task,
  resources,
  drafts,
  onDraftChange,
  onRemoveBinding,
  isBusy
}) => {
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const fields = (task.createdResourceKeys || [])
    .map(key => config.resources.schema.find(item => item.key === key))
    .filter(Boolean);

  if (!fields.length) return null;

  return (
    <>
      <section className="mt-4 p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Saved Resource Capture</span>
          <span className="text-[10px] text-slate-400">Saved values prefill later instructions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(field => {
            const result = validateFollowAlongResourceInput(field, drafts[field.key]);
            return (
              <div key={field.key}>
                <label htmlFor={`follow-along-resource-${field.key}`} className="block text-[11px] font-semibold text-slate-400 mb-1">{field.label}</label>
                <input
                  id={`follow-along-resource-${field.key}`}
                  type="text"
                  value={drafts[field.key] || ''}
                  disabled={isBusy}
                  onChange={event => onDraftChange(field.key, event.target.value)}
                  placeholder={field.placeholder || ''}
                  className={`w-full px-3 py-1.5 bg-slate-950 border rounded-lg text-xs text-cyan-200 focus:outline-none font-mono ${result.valid ? 'border-slate-800 focus:border-cyan-500' : 'border-rose-600'}`}
                />
                {!result.valid && <p role="alert" className="text-[10px] text-rose-300 mt-1">{result.error}</p>}
                {resources[field.key] && (
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">A blank field preserves the saved binding.</span>
                    <button type="button" disabled={isBusy} onClick={() => setPendingRemoval(field.key)} className="text-[10px] font-bold text-rose-300 hover:text-rose-200 disabled:opacity-50">Remove saved binding</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {pendingRemoval && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Remove saved binding?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">This removes only the Study Tracker reference. The live provider resource is not deleted and may continue to incur charges.</p>
            <div className="flex justify-end gap-3">
              <button type="button" disabled={isBusy} onClick={() => setPendingRemoval(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
              <button type="button" disabled={isBusy} onClick={async () => { if (await onRemoveBinding(pendingRemoval)) setPendingRemoval(null); }} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold disabled:opacity-50">Remove saved binding</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
