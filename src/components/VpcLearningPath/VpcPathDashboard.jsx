import React, { useState } from 'react';
import { Network, Sparkles, AlertTriangle, RefreshCw, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { calculatePathMetrics } from '../../services/vpcLearningPathService.js';

export const VpcPathDashboard = ({
  completedTaskIds = [],
  preferredMode = 'console',
  onModeChange = () => {},
  retainedResources = {},
  onRestartPath = () => {},
  onOpenCleanup = () => {}
}) => {
  const [showRestartModal, setShowRestartModal] = useState(false);
  const metrics = calculatePathMetrics(completedTaskIds);

  // Check if any chargeable resources are currently marked as retained
  const chargeableKeys = ['natGateway', 'natEipAllocation', 'bastionInstanceId', 'privateTestInstanceId', 'secretsManagerVpce', 'transitGateway', 'customerGateway', 'virtualPrivateGateway'];
  const retainedChargeableCount = chargeableKeys.filter(k => !!retainedResources[k]?.awsId).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-xl shadow-xl">
      {/* Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Network className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                VPC Learning Path
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                45 Connected Tasks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Build an enterprise multi-AZ AWS network programme step-by-step with reusable saved resources.
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => onModeChange('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'console'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Console
            </button>
            <button
              onClick={() => onModeChange('cli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'cli'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CLI
            </button>
            <button
              onClick={() => onModeChange('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'both'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Show Both
            </button>
          </div>

          <button
            onClick={() => setShowRestartModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700/60 flex items-center gap-1.5"
            title="Restart Path"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          <button
            onClick={onOpenCleanup}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Teardown & Cleanup</span>
          </button>
        </div>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {/* Progress % Bar */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Overall Path Progress</span>
            <span className="text-cyan-400 font-bold">{metrics.percentComplete}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${metrics.percentComplete}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics.completedCount} of {metrics.totalTasks} path tasks completed
          </span>
        </div>

        {/* Phase Summary */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Phases Completed</span>
            <span className="text-xl font-extrabold text-slate-100">
              {metrics.phaseMetrics.filter(p => p.isComplete).length} / 8
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">Structured learning sequence</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Retained Chargeable Resources Alert Card */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Active Retained Resources</span>
            <span className={`text-xl font-extrabold ${retainedChargeableCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {Object.keys(retainedResources).length} Saved
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {retainedChargeableCount > 0 ? `${retainedChargeableCount} chargeable in AWS` : 'No active chargeable resources'}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            retainedChargeableCount > 0
              ? 'bg-amber-950/80 border-amber-800/60 text-amber-400'
              : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400'
          }`}>
            {retainedChargeableCount > 0 ? <AlertTriangle className="w-5 h-5 animate-bounce" /> : <Cpu className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Region-Neutral Cost Warning Banner */}
      {retainedChargeableCount > 0 && (
        <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-300 mb-0.5">Potentially Chargeable Retained AWS Resources</span>
            <p>
              This path has saved retained resources (e.g. NAT Gateway, EC2 instances, EIPs). These resources incur hourly and data-processing charges in AWS. Review current AWS pricing for your selected Region. Teardown or delete resources when work is complete.
            </p>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              Restart VPC Learning Path?
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              This will reset your learning path task position back to Task 1 and clear your saved path progress history. Your live AWS resources in AWS will not be deleted automatically.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  onRestartPath();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
