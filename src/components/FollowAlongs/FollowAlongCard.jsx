import React from 'react';
import {
  Network,
  HardDrive,
  Cpu,
  ShieldCheck,
  Database,
  Table,
  Zap,
  Globe,
  FileCode,
  TrendingUp,
  Activity,
  Lock,
  RefreshCw,
  ArrowRight,
  Layers,
  Terminal
} from 'lucide-react';
import { FollowAlongProgressSummary } from './FollowAlongProgressSummary.jsx';

const ICON_MAP = {
  Network,
  HardDrive,
  Cpu,
  ShieldCheck,
  Database,
  Table,
  Zap,
  Globe,
  FileCode,
  TrendingUp,
  Activity,
  Lock,
  RefreshCw
};

export const FollowAlongCard = ({
  programme,
  cardNumber = null,
  progressSummary = null,
  onSelectProgramme = () => {}
}) => {
  const IconComponent = ICON_MAP[programme.icon] || Layers;
  const isAvailable = programme.status === 'available';

  const isLoading = progressSummary?.loading;
  const hasProgressSummary = Boolean(progressSummary);
  const normalizedProgressStatus = String(progressSummary?.status || 'not-started')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  const isNotStarted = !progressSummary || normalizedProgressStatus === 'not-started';
  const buttonText = isNotStarted ? 'Start Follow Along' : 'Resume Follow Along';
  const supportedModes = programme.supportedModes || [];
  const modeLabel = supportedModes.includes('console') && supportedModes.includes('cli')
    ? 'Console & CLI'
    : supportedModes.includes('cli')
      ? 'CLI'
      : 'Console';

  return (
    <div
      className={`h-[28rem] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden relative ${
        isAvailable
          ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 group'
          : 'bg-slate-950/40 border-slate-800/60 opacity-80'
      }`}
    >
      {/* Top Accent Line */}
      {isAvailable && (
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
      )}

      <div className="p-6 flex flex-1 flex-col gap-4 min-h-0">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              isAvailable
                ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-900/40 transition-all'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              {Number.isInteger(cardNumber) && cardNumber >= 0 && (
                <span className="mb-1 inline-flex rounded-full border border-violet-700/70 bg-violet-950/50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-violet-200">
                  Follow Along {cardNumber}
                </span>
              )}
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {programme.category}
              </span>
              <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 min-h-[2.75rem]">
                {programme.title}
              </h3>
            </div>
          </div>

          {isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
              Active Path
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/80">
              Coming Soon
            </span>
          )}
        </div>

        {/* Subtitle & Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 min-h-[3.75rem]">
          {programme.description}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {programme.taskCount && (
            <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono">
              {programme.taskCount} Tasks
            </span>
          )}
          {programme.phaseCount && (
            <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              {programme.phaseCount} Phases
            </span>
          )}
          <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            {modeLabel}
          </span>
        </div>

        {/* Progress Summary Section */}
        {isAvailable && hasProgressSummary && (
          <div className="mt-auto pt-2 border-t border-slate-800/80">
            {isLoading ? (
              <div className="animate-pulse space-y-2 py-2">
                <div className="h-3 bg-slate-800 rounded w-1/2" />
                <div className="h-2 bg-slate-800/60 rounded w-full" />
              </div>
            ) : (
              <FollowAlongProgressSummary summary={progressSummary} />
            )}
          </div>
        )}
      </div>

      {/* Footer / Action Section */}
      <div className="shrink-0 p-4 bg-slate-950/80 border-t border-slate-800/80">
        {isAvailable ? (
          <button
            onClick={() => onSelectProgramme(programme.id)}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 group-hover:shadow-cyan-500/30"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Coming Soon</span>
          </button>
        )}
      </div>
    </div>
  );
};
