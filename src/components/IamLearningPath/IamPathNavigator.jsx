import React from 'react';
import { getIamPathTasks, IAM_LEARNING_PATH_PHASES } from '../../data/iamLearningPathData.js';
import { CheckCircle2, Circle, ShieldCheck, Wrench } from 'lucide-react';

export const IamPathNavigator = ({ activeTaskId, completedTaskIds = [], onSelectTask }) => {
  const allTasks = getIamPathTasks();

  return (
    <div className="p-4 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          IAM Learning Path Outline
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">22 Canonical Tasks across 6 Phases</p>
      </div>

      <div className="space-y-4">
        {IAM_LEARNING_PATH_PHASES.map(phase => {
          const phaseTasks = allTasks.filter(t => t.phaseId === phase.id && !t.isPathOnly);

          return (
            <div key={phase.id} className="space-y-1.5">
              <div className="text-[11px] font-bold text-purple-400/90 uppercase tracking-wider px-2">
                Phase {phase.id}
              </div>

              <div className="space-y-0.5">
                {phaseTasks.map(task => {
                  const isDone = completedTaskIds.includes(task.id);
                  const isActive = task.id === activeTaskId;

                  return (
                    <button
                      key={task.id}
                      onClick={() => onSelectTask(task.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-purple-500/15 border border-purple-500/40 text-purple-300 font-medium shadow-sm'
                          : isDone
                          ? 'text-slate-300 hover:bg-slate-800/40'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[12px] leading-snug">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                          <span className="font-mono">{task.difficulty}</span>
                          {task.isOptional && (
                            <span className="text-sky-400 bg-sky-950/40 px-1 rounded border border-sky-800/40">
                              Optional
                            </span>
                          )}
                          {task.isReviewOnly && (
                            <span className="text-emerald-400 bg-emerald-950/40 px-1 rounded border border-emerald-800/40">
                              Review
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Path-Only Teardown Section */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] font-bold text-rose-400/90 uppercase tracking-wider px-2 mb-1.5">
            Final Project Teardown
          </div>
          {allTasks.filter(t => t.isPathOnly).map(task => {
            const isActive = task.id === activeTaskId;
            const isDone = completedTaskIds.includes(task.id);

            return (
              <button
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300 font-medium'
                    : isDone
                    ? 'text-slate-300 hover:bg-slate-800/40'
                    : 'text-slate-400 hover:bg-slate-800/30'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Wrench className="w-3.5 h-3.5 text-rose-500/70" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[12px] font-medium leading-snug">{task.title}</div>
                  <div className="text-[10px] text-rose-400/70 mt-0.5">Final Cleanup Wizard</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IamPathNavigator;
