import React from 'react';
import { Zap } from 'lucide-react';

export const FollowAlongRetentionModal = ({ open, isBusy, onDecision, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-cyan-400" /> Resource Retention Decision</h3>
        <p className="text-xs text-slate-300 leading-relaxed">Choose whether to keep resources for connected tasks or confirm that you manually cleaned them up. Study Tracker only records your decision and never deletes provider resources.</p>
        <div className="space-y-2 pt-2">
          <button type="button" disabled={isBusy} onClick={() => onDecision('retained')} className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left disabled:opacity-50">
            <span className="font-bold text-xs text-cyan-300 block">Keep resources for the next task (Recommended)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Keeps saved bindings available for later instructions.</span>
          </button>
          <button type="button" disabled={isBusy} onClick={() => onDecision('cleaned')} className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left disabled:opacity-50">
            <span className="font-bold text-xs text-amber-300 block">I manually cleaned up resources from this task</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Confirms your manual cleanup. Study Tracker does not perform destructive actions.</span>
          </button>
        </div>
        <button type="button" disabled={isBusy} onClick={onCancel} className="text-xs text-slate-400 hover:text-white">Cancel</button>
      </div>
    </div>
  );
};
