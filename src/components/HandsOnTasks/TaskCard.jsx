import React from 'react';
import { calculateTaskProgress } from '../../services/taskService';
import { Clock, Play, RotateCcw, CheckCircle2, ChevronRight, Layers, ShieldCheck } from 'lucide-react';

export const TaskCard = ({ task, progressRecord, onSelectTask }) => {
  const metrics = calculateTaskProgress(task, progressRecord || {}, progressRecord?.selectedMode || 'console');

  const isCompleted = metrics.isCompleted;
  const isStarted = (progressRecord?.consoleCompletedItems?.length > 0) || 
                    (progressRecord?.cliCompletedItems?.length > 0) ||
                    (progressRecord?.verificationCompletedItems?.length > 0);

  const statusLabel = isCompleted ? 'Completed' : (isStarted ? 'In Progress' : 'Not Started');
  const statusColor = isCompleted 
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
    : (isStarted ? 'bg-amber-950/80 text-amber-300 border-amber-800' : 'bg-slate-800/80 text-slate-400 border-slate-700');

  const diffColor = task.difficulty === 'Easy' 
    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
    : (task.difficulty === 'Hard' ? 'text-rose-400 bg-rose-950/60 border-rose-800/50' : 'text-amber-400 bg-amber-950/60 border-amber-800/50');

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 backdrop-blur-xl">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
              {task.examCode.toUpperCase()}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
              {task.service}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diffColor}`}>
              {task.difficulty}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
          {task.title}
        </h3>

        {/* Goal Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {task.goal}
        </p>

        {/* Feature & Metadata */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{task.feature}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{task.estimatedMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Actions */}
      <div className="space-y-3 pt-3 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Lab Progress</span>
          <span className="font-semibold text-indigo-300">{metrics.overallPercent}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${metrics.overallPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">
            {metrics.completedStepCount} / {metrics.totalStepCount} steps done
          </span>

          <button
            onClick={() => onSelectTask(task.id, progressRecord?.selectedMode || 'console')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompleted 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : (isStarted 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20')
            }`}
          >
            <span>{isCompleted ? 'Review Lab' : (isStarted ? 'Continue Lab' : 'Start Lab')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
