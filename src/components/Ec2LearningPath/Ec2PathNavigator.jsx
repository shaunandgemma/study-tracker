import React, { useState } from 'react';
import {
  EC2_LEARNING_PATH_PHASES,
  getEc2PathTasks
} from '../../data/ec2LearningPathData.js';
import { CheckCircle2, Lock, ChevronDown, ChevronRight, Clock, Star } from 'lucide-react';

export const Ec2PathNavigator = ({
  activeTaskId = '',
  completedTaskIds = [],
  onSelectTask = () => {}
}) => {
  const allTasks = getEc2PathTasks();
  const taskMap = new Map(allTasks.map(t => [t.id, t]));
  const completedSet = new Set(completedTaskIds);

  // Default expand Phase 1 or active task phase
  const [expandedPhases, setExpandedPhases] = useState(() => {
    const initial = {};
    EC2_LEARNING_PATH_PHASES.forEach(p => {
      initial[p.id] = p.taskIds.includes(activeTaskId) || p.number === 1;
    });
    return initial;
  });

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  // Prerequisite check helper
  const isTaskLocked = (task) => {
    if (!task.prerequisites || task.prerequisites.length === 0) return false;
    return task.prerequisites.some(preId => !completedSet.has(preId));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-3">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <span>Programme Stepper</span>
        </h2>
        <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/50">
          34 Tasks
        </span>
      </div>

      <div className="space-y-2">
        {EC2_LEARNING_PATH_PHASES.map(phase => {
          const phaseTasks = phase.taskIds.map(id => taskMap.get(id)).filter(Boolean);
          const phaseCompletedCount = phaseTasks.filter(t => completedSet.has(t.id)).length;
          const isPhaseDone = phaseCompletedCount === phaseTasks.length;
          const isExpanded = expandedPhases[phase.id];

          return (
            <div key={phase.id} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {phase.title}
                      </span>
                      {isPhaseDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 shrink-0 ml-2">
                  {phaseCompletedCount}/{phaseTasks.length}
                </span>
              </button>

              {/* Phase Task Items */}
              {isExpanded && (
                <div className="p-2 pt-0 space-y-1 border-t border-slate-800/60">
                  {phaseTasks.map(task => {
                    const isActive = task.id === activeTaskId;
                    const isDone = completedSet.has(task.id);
                    const locked = isTaskLocked(task);

                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          if (!locked) onSelectTask(task.id);
                        }}
                        disabled={locked}
                        className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-md'
                            : isDone
                            ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                            : locked
                            ? 'opacity-50 cursor-not-allowed text-slate-500 bg-slate-950/20'
                            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : locked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <span className={`w-4 h-4 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                              isActive ? 'border-blue-400 text-blue-300' : 'border-slate-600 text-slate-400'
                            }`}>
                              {task.pathSequenceNumber}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold leading-tight line-clamp-2">
                              {task.title}
                            </span>
                            {task.isOptionalBranch && (
                              <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5" />
                                <span>Opt</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedMinutes}m</span>
                            </span>
                            <span>{task.difficulty}</span>
                          </div>

                          {locked && (
                            <p className="text-[10px] text-amber-400/90 mt-1 italic">
                              Requires prerequisite tasks
                            </p>
                          )}
                        </div>
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
