import React, { useState } from 'react';
import { CheckCircle2, Circle, Copy, Check, Terminal, Layout, Layers, ShieldAlert, ArrowRight } from 'lucide-react';

export const S3TaskRunner = ({
  task,
  completedTaskIds = [],
  preferredMode = 'console',
  retainedResources = {},
  onToggleComplete,
  onModeChange,
  onResourceUpdate,
  onNextTask
}) => {
  const [copiedCmdId, setCopiedCmdId] = useState(null);
  const [stepChecklist, setStepChecklist] = useState({});

  if (!task) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        No S3 task selected.
      </div>
    );
  }

  const isCompleted = completedTaskIds.includes(task.id);

  const handleCopyCommand = (cmdId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdId(cmdId);
    setTimeout(() => setCopiedCmdId(null), 2000);
  };

  const handleToggleStep = (stepId) => {
    setStepChecklist(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
              {task.id}
            </span>
            {task.isOptional && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-sky-400">
                Optional Branch
              </span>
            )}
            {task.isReviewOnly && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                Review Only
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-100">{task.title}</h2>
          {task.goal && <p className="text-xs text-slate-400">{task.goal}</p>}
        </div>

        {/* Instruction Mode Selector & Complete Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onModeChange('console')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                preferredMode === 'console' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> Console
            </button>
            <button
              onClick={() => onModeChange('cli')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                preferredMode === 'cli' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> CLI
            </button>
            <button
              onClick={() => onModeChange('both')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                preferredMode === 'both' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Show Both
            </button>
          </div>

          <button
            onClick={() => onToggleComplete(task.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isCompleted
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-200 hover:border-amber-500/50'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Why it Matters Context Box */}
      {task.whyItMatters && (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 block mb-1">Why This Matters:</strong>
          {task.whyItMatters}
        </div>
      )}

      {/* Console Instructions Block */}
      {(preferredMode === 'console' || preferredMode === 'both') && task.consoleSteps && task.consoleSteps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" /> AWS Management Console Instructions
          </h3>

          <div className="space-y-3">
            {task.consoleSteps.map((step, idx) => (
              <div key={step.id || idx} className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-xs text-amber-300">
                  Step {step.number || idx + 1}: {step.title}
                </div>

                <div className="space-y-1.5 pl-2">
                  {step.instructions && step.instructions.map((ins, iIdx) => (
                    <label key={ins.id || iIdx} className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-slate-100">
                      <input
                        type="checkbox"
                        checked={!!stepChecklist[`${task.id}-${step.id}-${ins.id}`]}
                        onChange={() => handleToggleStep(`${task.id}-${step.id}-${ins.id}`)}
                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/20"
                      />
                      <span>{ins.text || ins.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLI Instructions Block */}
      {(preferredMode === 'cli' || preferredMode === 'both') && task.cliSteps && task.cliSteps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" /> AWS CLI Command Instructions
          </h3>

          <div className="space-y-3">
            {task.cliSteps.map((step, idx) => (
              <div key={step.id || idx} className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-xs text-amber-300">
                  CLI Step {step.number || idx + 1}: {step.title}
                </div>

                {step.commands && step.commands.map((cmd, cIdx) => (
                  <div key={cmd.id || cIdx} className="bg-slate-950 rounded border border-slate-800 p-3 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 text-[10px]">Command {cIdx + 1}</span>
                      <button
                        onClick={() => handleCopyCommand(`${step.id}-${cIdx}`, cmd.text)}
                        className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        {copiedCmdId === `${step.id}-${cIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedCmdId === `${step.id}-${cIdx}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="block text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {cmd.text}
                    </code>
                    {cmd.explanation && (
                      <p className="text-[11px] font-sans text-slate-400 mt-1">{cmd.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Items */}
      {task.verification && task.verification.length > 0 && (
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verification Checklist</h4>
          <ul className="space-y-1 pl-4 list-disc text-xs text-slate-400">
            {task.verification.map((v, idx) => (
              <li key={v.id || idx}>{v.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default S3TaskRunner;
