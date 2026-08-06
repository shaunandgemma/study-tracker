import React from 'react';
import { InstructionCheckbox } from './InstructionCheckbox';
import { CommandBlock } from './CommandBlock';
import { CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';

export const TaskStepCard = ({
  step,
  completedItemIds = [],
  onToggleItem,
  onToggleMainStep
}) => {
  if (!step) return null;

  const instructions = step.instructions || [];
  const commands = step.commands || [];

  const completedSet = new Set(completedItemIds);

  let isStepComplete = false;
  if (instructions.length > 0) {
    isStepComplete = instructions.every(ins => completedSet.has(ins.id));
  } else {
    isStepComplete = completedSet.has(step.id);
  }

  const handleMainCheckboxChange = (e) => {
    const shouldCheck = e.target.checked;
    onToggleMainStep(step.id, shouldCheck);
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 p-4 sm:p-5 ${
      isStepComplete 
        ? 'border-indigo-900/60 bg-indigo-950/10 shadow-md shadow-indigo-950/20' 
        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
    }`}>
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          {step.number !== undefined && (
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              isStepComplete ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              Step {step.number}
            </span>
          )}
          <h3 className={`text-base font-semibold ${
            isStepComplete ? 'text-indigo-200' : 'text-slate-100'
          }`}>
            {step.title}
          </h3>
        </div>

        {/* Main Step Checkbox */}
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-semibold text-slate-300 select-none shrink-0">
          <input
            type="checkbox"
            checked={isStepComplete}
            onChange={handleMainCheckboxChange}
            className="peer sr-only"
          />
          <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
            isStepComplete ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
          }`}>
            {isStepComplete && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Mark Step Done</span>
        </label>
      </div>

      {/* Step Description */}
      {step.description && (
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{step.description}</p>
      )}

      {/* Instructions list */}
      {instructions.length > 0 && (
        <div className="space-y-1 my-3 pl-1">
          {instructions.map(ins => (
            <InstructionCheckbox
              key={ins.id}
              instruction={ins}
              isChecked={completedSet.has(ins.id)}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}

      {/* Commands list */}
      {commands.length > 0 && (
        <div className="my-3">
          {commands.map(cmd => (
            <CommandBlock key={cmd.id || cmd.text} command={cmd} />
          ))}
        </div>
      )}

      {/* Note Callout */}
      {step.note && (
        <div className="mt-3 p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-300">Note: </span>
            <span>{step.note}</span>
          </div>
        </div>
      )}

      {/* Warning Callout */}
      {step.warning && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Warning: </span>
            <span>{step.warning}</span>
          </div>
        </div>
      )}

      {/* Expected Result Callout */}
      {step.expectedResult && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-emerald-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-400">Expected Result: </span>
            <span>{step.expectedResult}</span>
          </div>
        </div>
      )}
    </div>
  );
};
