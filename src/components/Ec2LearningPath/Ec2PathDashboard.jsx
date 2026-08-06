import React, { useState } from 'react';
import { Cpu, AlertTriangle, RefreshCw, Layers, ShieldCheck, Trash2 } from 'lucide-react';
import { calculateEc2PathMetrics } from '../../services/ec2LearningPathService.js';

export const Ec2PathDashboard = ({
  completedTaskIds = [],
  preferredMode = 'console',
  onModeChange = () => {},
  retainedResources = {},
  onRestartPath = () => {},
  onOpenCleanup = () => {}
}) => {
  const [showRestartModal, setShowRestartModal] = useState(false);
  const metrics = calculateEc2PathMetrics(completedTaskIds);

  const chargeableKeys = ['primaryInstanceId', 'privateEc2InstanceId', 'ebsVolumeId', 'customAmiId', 'elasticIpAllocId', 'spotInstanceId', 'hibernateInstanceId'];
  const retainedChargeableCount = chargeableKeys.filter(k => !!retainedResources[k]?.awsId).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-xl shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                EC2 Follow Along
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                34 Connected Tasks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Build an enterprise multi-AZ EC2 compute lab step-by-step with reusable saved resources.
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher: Console | CLI | Show Both */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => onModeChange('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'console'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Console
            </button>
            <button
              onClick={() => onModeChange('cli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'cli'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CLI
            </button>
            <button
              onClick={() => onModeChange('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preferredMode === 'both'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Show Both
            </button>
          </div>

          {/* Teardown Wizard Trigger */}
          <button
            onClick={onOpenCleanup}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Teardown Wizard</span>
          </button>

          {/* Restart Path */}
          <button
            onClick={() => setShowRestartModal(true)}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Restart Path"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Overall Progress</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {metrics.overallPercentage}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.overallPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed Tasks</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {metrics.completedTasks} <span className="text-xs font-normal text-slate-400">/ {metrics.totalTasks}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            8 Phases
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Instance</span>
          </div>
          <div className="text-sm font-bold text-white mt-1 truncate">
            {retainedResources.primaryInstanceId?.awsId || 'Not Launched'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Primary Workload
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <AlertTriangle className={`w-3.5 h-3.5 ${retainedChargeableCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Retained Chargeables</span>
          </div>
          <div className={`text-xl font-bold mt-1 ${retainedChargeableCount > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
            {retainedChargeableCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {retainedChargeableCount > 0 ? 'Cost Notice Active' : 'No Active Charges'}
          </div>
        </div>
      </div>

      {/* Restart Modal Confirmation */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Restart EC2 Follow Along?</h3>
                <p className="text-xs text-slate-400">This will reset your EC2 task progress. VPC progress remains unaffected.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  onRestartPath();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all"
              >
                Restart EC2 Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
