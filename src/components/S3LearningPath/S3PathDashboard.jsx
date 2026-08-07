import React from 'react';
import { getS3PathTasks, S3_LEARNING_PATH_PHASES } from '../../data/s3LearningPathData.js';
import { getS3ProgrammeProgressSummary } from '../../services/s3LearningPathService.js';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Database, Cloud } from 'lucide-react';

export const S3PathDashboard = ({ completedTaskIds = [], activeTaskId, onSelectTask }) => {
  const summary = getS3ProgrammeProgressSummary(completedTaskIds);
  const allTasks = getS3PathTasks();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Progress Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" /> S3 Learning Path Progress
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {summary.completed} of {summary.total} tasks completed ({summary.percentage}%)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-36 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${summary.percentage}%` }}
            />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
            {summary.status}
          </span>
        </div>
      </div>

      {/* Phase Cards Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {S3_LEARNING_PATH_PHASES.map(phase => {
          const phaseTaskObjs = allTasks.filter(t => t.phaseId === phase.id);
          const phaseCompleted = phaseTaskObjs.filter(t => completedTaskIds.includes(t.id));
          const isPhaseDone = phaseTaskObjs.length > 0 && phaseCompleted.length === phaseTaskObjs.length;

          return (
            <div
              key={phase.id}
              className={`p-4 rounded-lg border transition-all ${
                isPhaseDone
                  ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Phase {phase.id}
                </span>
                <span className="text-xs text-slate-400">
                  {phaseCompleted.length}/{phaseTaskObjs.length}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">{phase.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{phase.description}</p>

              {/* Task Badges */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {phaseTaskObjs.map(task => {
                  const isDone = completedTaskIds.includes(task.id);
                  const isActive = task.id === activeTaskId;

                  return (
                    <button
                      key={task.id}
                      onClick={() => onSelectTask(task.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 ${
                        isActive
                          ? 'ring-1 ring-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : isDone
                          ? 'bg-amber-950/40 border border-amber-800/40 text-amber-400'
                          : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" /> : <Circle className="w-2.5 h-2.5" />}
                      {task.id.replace('task-saa-s3-', '').replace('path-s3-', '').slice(0, 18)}
                      {task.isOptional && <span className="text-[8px] text-sky-400 font-sans ml-0.5">opt</span>}
                      {task.isReviewOnly && <span className="text-[8px] text-emerald-400 font-sans ml-0.5">audit</span>}
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

export default S3PathDashboard;
