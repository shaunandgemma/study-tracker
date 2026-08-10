import React, { useState } from 'react';
import { AlertTriangle, Cpu, Layers, RefreshCw, ShieldCheck } from 'lucide-react';
import { calculateFollowAlongMetrics } from './followAlongContract.js';

function ExtensionSlot({ slot, registrations = [], context }) {
  return registrations
    .filter(item => item.slot === slot && item.status === 'complete' && item.Component)
    .map(item => <item.Component key={item.id} context={context} />);
}

export const FollowAlongDashboard = ({
  config,
  completedTaskIds,
  preferredMode,
  resources,
  extensions,
  onModeChange,
  onRestart,
  onOpenCleanup,
  isBusy
}) => {
  const [confirmRestart, setConfirmRestart] = useState(false);
  const metrics = calculateFollowAlongMetrics(config, completedTaskIds);
  const chargeable = new Set(config.resources.chargeableResourceKeys || []);
  const chargeableCount = Object.entries(resources || {}).filter(([key, value]) => chargeable.has(key) && value).length;
  const context = { config, metrics, resources, completedTaskIds };
  const accentColor = config.presentation.accentColor || '#0891b2';
  const iconLabel = config.presentation.iconLabel || config.identity.serviceName.slice(0, 2).toUpperCase();
  const hasConsole = config.tasks.some(task => task.modeAvailability?.console?.status === 'supported' && (task.consoleSteps || []).length > 0);
  const hasCli = config.tasks.some(task => task.modeAvailability?.cli?.status === 'supported' && (task.cliSteps || []).length > 0);
  const availableModes = [hasConsole && ['console', 'Console'], hasCli && ['cli', 'CLI'], hasConsole && hasCli && ['both', 'Show Both']].filter(Boolean);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl p-0.5 shrink-0" style={{ backgroundColor: accentColor }}>
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-sm font-black tracking-tight" style={{ color: accentColor }} aria-label={`${config.identity.serviceName} icon`}>{iconLabel}</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{config.identity.displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {config.tasks.length} Connected Tasks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{config.identity.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            {availableModes.map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                disabled={isBusy}
                onClick={() => onModeChange(mode)}
                style={preferredMode === mode ? { backgroundColor: accentColor } : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${preferredMode === mode ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button" disabled={isBusy} onClick={() => setConfirmRestart(true)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50">
            <RefreshCw className="w-3.5 h-3.5" /> Restart
          </button>
          <button type="button" disabled={isBusy} onClick={onOpenCleanup} className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
            <ShieldCheck className="w-4 h-4" /> Teardown &amp; Cleanup
          </button>
        </div>
      </div>

      <ExtensionSlot slot="dashboard.beforeMetrics" registrations={extensions} context={context} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2"><span>Overall Path Progress</span><span className="text-cyan-400">{metrics.percentComplete}%</span></div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2"><div className="h-full" style={{ width: `${metrics.percentComplete}%`, backgroundColor: accentColor }} /></div>
          <span className="text-[11px] text-slate-500">{metrics.completedCount} of {metrics.totalTasks} tasks completed</span>
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div><span className="text-xs font-semibold text-slate-400 block">Phases Completed</span><span className="text-xl font-extrabold text-white">{metrics.phaseMetrics.filter(item => item.isComplete).length} / {config.phases.length}</span></div>
          <Layers className="w-6 h-6 text-blue-400" />
        </div>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div><span className="text-xs font-semibold text-slate-400 block">Captured Resources</span><span className={`text-xl font-extrabold ${chargeableCount ? 'text-amber-400' : 'text-emerald-400'}`}>{Object.keys(resources || {}).length} Saved</span><span className="text-[11px] text-slate-500 block">{chargeableCount ? `${chargeableCount} potentially chargeable` : 'No chargeable bindings recorded'}</span></div>
          {chargeableCount ? <AlertTriangle className="w-6 h-6 text-amber-400" /> : <Cpu className="w-6 h-6 text-emerald-400" />}
        </div>
      </div>

      {chargeableCount > 0 && (
        <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p><strong className="text-amber-300">Potential charges:</strong> {config.warnings.cost || 'Captured resources may continue to incur provider charges until manually removed.'}</p>
        </div>
      )}

      <ExtensionSlot slot="dashboard.afterMetrics" registrations={extensions} context={context} />

      {confirmRestart && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-2">Restart this Follow Along?</h2>
            <p className="text-xs text-slate-300 mb-5">Task completion and step history reset. Saved resource bindings and live provider resources remain. Cleanup is always manual through Teardown &amp; Cleanup.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmRestart(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">Cancel</button>
              <button type="button" disabled={isBusy} onClick={async () => { const ok = await onRestart(); if (ok) setConfirmRestart(false); }} className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white disabled:opacity-50">Reset Progress</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
