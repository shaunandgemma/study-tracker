import React from 'react';
import { Check } from 'lucide-react';

export const InstructionCheckbox = ({ instruction, isChecked, onToggle }) => {
  return (
    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/50 transition-colors cursor-pointer group select-none">
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(instruction.id)}
          className="peer sr-only"
          id={`checkbox-${instruction.id}`}
        />
        <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
          isChecked 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/30' 
            : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'
        }`}>
          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      <span className={`text-xs sm:text-sm leading-relaxed transition-colors ${
        isChecked ? 'text-slate-400 line-through opacity-80' : 'text-slate-200 group-hover:text-white'
      }`}>
        {instruction.text}
      </span>
    </label>
  );
};
