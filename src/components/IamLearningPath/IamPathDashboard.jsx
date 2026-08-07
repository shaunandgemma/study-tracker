import React from 'react';
import {
  IAM_LEARNING_PATH_PHASES,
  getIamPathTasks,
  IAM_OPTIONAL_TASK_IDS,
  IAM_REVIEW_ONLY_TASK_IDS
} from '../../data/iamLearningPathData.js';
import { ShieldCheck, CheckCircle2, Circle, Layers, Sparkles } from 'lucide-react';

export const IamPathDashboard = ({ completedTaskIds = [], onSelectTask }) => {
  const allTasks = getIamPathTasks();
  const canonicalTasks = allTasks.filter(t => !t.isPathOnly);

  const completedCount = completedTaskIds.length;
  const totalCount = allTasks.length; // 23 total Follow Along tasks
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl">
      {/* Progress Overview Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            IAM Learning Path Overall Progress
          </span>
          <span className="text-purple-400 font-mono font-bold">
            {completedCount} / {totalCount} Tasks Completed ({percentage}%)
          </span>
        </div>

        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Phase Cards Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {IAM_LEARNING_PATH_PHASES.map(phase => {
          const phaseTasks = canonicalTasks.filter(t => t.phaseId === phase.id);
          const phaseDoneCount = phaseTasks.filter(t => completedTaskIds.includes(t.id)).length;
          const isPhaseDone = phaseTasks.length > 0 && phaseDoneCount === phaseTasks.length;

          return (
            <div
              key={phase.id}
              className={`p-4 rounded-xl border transition-all ${
                isPhaseDone
                  ? 'bg-purple-950/20 border-purple-800/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    Phase {phase.id}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-0.5">{phase.title}</h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {phaseDoneCount}/{phaseTasks.length}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                {phase.description}
              </p>

              {/* Task Quick Badges */}
              <div className="flex flex-wrap gap-1">
                {phaseTasks.map(task => {
                  const isDone = completedTaskIds.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => onSelectTask(task.id)}
                      title={task.title}
                      className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                        isDone
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-800/50'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3 text-purple-400" /> : <Circle className="w-3 h-3 text-slate-600" />}
                      <span className="truncate max-w-[100px]">{task.title.split(' ')[0]}...</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IamPathDashboard;
