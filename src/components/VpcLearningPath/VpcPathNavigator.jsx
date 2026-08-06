import React, { useState } from 'react';
import { CheckCircle2, Lock, ChevronDown, ChevronRight, Layers, Sparkles, GitBranch } from 'lucide-react';
import { VPC_LEARNING_PATH_PHASES, VPC_PATH_TASKS } from '../../data/vpcLearningPathData.js';

export const VpcPathNavigator = ({
  activeTaskId = null,
  completedTaskIds = [],
  onSelectTask = () => {}
}) => {
  const completedSet = new Set(completedTaskIds);
  const [expandedPhases, setExpandedPhases] = useState(() => {
    // Expand phase containing active task or Phase 1 by default
    const activeTaskObj = VPC_PATH_TASKS.find(t => t.id === activeTaskId);
    const activePhaseId = activeTaskObj?.phaseId || 'phase-1-vpc-foundation';
    return { [activePhaseId]: true };
  });

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Helper to determine if a task is locked
  const isTaskLocked = (task) => {
    if (!task.prerequisites || task.prerequisites.length === 0) return false;
    // Task is unlocked if at least one prerequisite is completed or all prerequisites are completed
    return !task.prerequisites.every(prereqId => completedSet.has(prereqId));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Programme Navigator
          </h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          8 Phases
        </span>
      </div>

      <div className="space-y-2">
        {VPC_LEARNING_PATH_PHASES.map(phase => {
          const isExpanded = !!expandedPhases[phase.id];
          const phaseTasks = VPC_PATH_TASKS.filter(t => t.phaseId === phase.id);
          const phaseDoneCount = phaseTasks.filter(t => completedSet.has(t.id)).length;
          const isPhaseComplete = phaseTasks.length > 0 && phaseDoneCount === phaseTasks.length;

          return (
            <div key={phase.id} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/50">
              {/* Phase Header Accordion Toggle */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {phase.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPhaseComplete && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                    {phaseDoneCount}/{phaseTasks.length}
                  </span>
                </div>
              </button>

              {/* Phase Tasks List */}
              {isExpanded && (
                <div className="p-2 pt-0 space-y-1 border-t border-slate-800/60">
                  {phaseTasks.map(task => {
                    const isActive = task.id === activeTaskId;
                    const isDone = completedSet.has(task.id);
                    const isLocked = isTaskLocked(task);

                    return (
                      <button
                        key={task.id}
                        disabled={isLocked}
                        onClick={() => onSelectTask(task.id)}
                        className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-start justify-between gap-2.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-cyan-500/50 text-white font-semibold'
                            : isDone
                            ? 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
                            : isLocked
                            ? 'bg-slate-950/40 text-slate-600 opacity-60 cursor-not-allowed'
                            : 'bg-slate-950 hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          ) : (
                            <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                          )}

                          <div className="min-w-0">
                            <span className="block truncate leading-tight">
                              {task.title}
                            </span>
                            {task.isOptionalBranch && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 mt-1">
                                <GitBranch className="w-3 h-3" /> Optional Branch
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
