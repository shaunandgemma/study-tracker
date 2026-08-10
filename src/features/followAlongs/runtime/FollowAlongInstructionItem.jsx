import React from 'react';
import { Check, Copy } from 'lucide-react';

export const copyFollowAlongInstructionText = async (instruction, clipboard = globalThis.navigator?.clipboard) => {
  const text = [instruction?.text || instruction?.label || '', instruction?.detail || ''].filter(Boolean).join('\n');
  if (!text || !clipboard?.writeText) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const FollowAlongInstructionItem = ({ instruction, isChecked, onToggle }) => {
  if (!instruction) return null;

  const labelText = instruction.text || instruction.label || '';
  const detailText = instruction.detail || '';

  if (!labelText && !detailText) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
      console.warn('[FollowAlongInstructionItem] Empty instruction content found:', instruction.id);
    }
    return null;
  }

  const copy = () => { void copyFollowAlongInstructionText(instruction); };

  return (
    <div className="flex items-start gap-3 p-2 my-1 rounded-lg hover:bg-slate-900/50 transition-colors group">
      <label className="relative flex items-center justify-center shrink-0 mt-0.5 cursor-pointer select-none" aria-label={isChecked ? 'Mark instruction not done' : 'Mark instruction done'}>
          <input type="checkbox" checked={isChecked} onChange={() => onToggle(instruction.id)}
            className="peer sr-only" id={`follow-along-checkbox-${instruction.id}`} />
          <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
            isChecked ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/30'
              : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'
          }`}>
            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
      </label>

      <div className="flex flex-col min-w-0 flex-1 select-text cursor-text">
          {labelText && <span className={`text-xs sm:text-sm leading-relaxed transition-colors ${
            isChecked ? 'text-slate-400 line-through opacity-80' : 'text-slate-200 group-hover:text-white'
          }`}>{labelText}</span>}
          {detailText && <span className={`text-xs mt-0.5 leading-normal ${
            isChecked ? 'text-slate-500 line-through opacity-70' : 'text-slate-400'
          }`}>{detailText}</span>}
      </div>

      <button type="button" onClick={copy} aria-label="Copy instruction" title="Copy instruction"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-white hover:border-slate-600 select-none">
        <Copy className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Copy</span>
      </button>
    </div>
  );
};
