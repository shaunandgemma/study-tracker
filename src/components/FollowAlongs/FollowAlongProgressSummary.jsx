import React from 'react';
import { CheckCircle2, Clock, Cpu, Wrench } from 'lucide-react';

export const FollowAlongProgressSummary = ({ summary }) => {
  if (!summary || summary.loading) {
    return (
      <div className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-slate-800 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-800 rounded w-1/3" />
          <div className="h-2.5 bg-slate-800/60 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const status = String(summary.status || 'not-started')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  const completedTasks = summary.completedTasks ?? summary.completed ?? 0;
  const totalTasks = summary.totalTasks ?? summary.total ?? 0;
  const completionPercentage = summary.completionPercentage ?? summary.percentage ?? 0;
  const { currentTaskTitle } = summary;

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cleanup-pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
            <Wrench className="w-3.5 h-3.5" /> Cleanup Pending
          </span>
        );
      case 'resources-retained':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Cpu className="w-3.5 h-3.5" /> Resources Retained
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
            <Clock className="w-3.5 h-3.5" /> In Progress ({completionPercentage}%)
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
            Coming Soon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {getStatusBadge()}
        {status !== 'coming-soon' && (
          <span className="text-xs font-semibold text-slate-400">
            {completedTasks} of {totalTasks} tasks completed
          </span>
        )}
      </div>

      {status !== 'coming-soon' && status !== 'not-started' && (
        <div className="space-y-1.5">
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, completionPercentage))}%` }}
            />
          </div>
          {currentTaskTitle && (
            <p className="text-[11px] text-slate-400 truncate">
              <span className="font-semibold text-slate-300">Next/Current Task:</span> {currentTaskTitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
