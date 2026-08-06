import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, ChevronRight, Layers, Trash2 } from 'lucide-react';

const TEARDOWN_STEPS = [
  { step: 1, title: 'AWS Network Firewall & Endpoint Rules', detail: 'Delete Network Firewall endpoints, firewall policies, rule groups, and firewall subnet routes.' },
  { step: 2, title: 'VPC Interface & Gateway Endpoints', detail: 'Delete Gateway S3/DynamoDB endpoints and Interface Secrets Manager/PrivateLink endpoints.' },
  { step: 3, title: 'PrivateLink Services & Consumer Endpoints', detail: 'Delete endpoint services, Network Load Balancers, target groups, and consumer interface endpoints.' },
  { step: 4, title: 'Transit Gateway Attachments & Transit Gateways', detail: 'Delete Transit Gateway attachments and Transit Gateway instances.' },
  { step: 5, title: 'VPC Peering Connections', detail: 'Delete peering connections between VPC 1 and VPC 2.' },
  { step: 6, title: 'NAT Gateways & Elastic IPs', detail: 'Delete NAT Gateways and release associated Elastic IP allocations.' },
  { step: 7, title: 'EC2 Test Workload Instances & Secondary ENIs', detail: 'Terminate bastion and private test instances; detach and delete secondary ENIs.' },
  { step: 8, title: 'Custom Route Tables & Associations', detail: 'Disassociate public and private custom route tables and delete route table entries.' },
  { step: 9, title: 'Security Groups & Network ACL Custom Rules', detail: 'Delete custom security groups (bastionSg, appSg) and custom NACL rules.' },
  { step: 10, title: 'Subnets', detail: 'Delete public and private subnets across all Availability Zones.' },
  { step: 11, title: 'Internet Gateways', detail: 'Detach and delete Internet Gateways.' },
  { step: 12, title: 'Virtual Private Gateways & Customer Gateways', detail: 'Detach and delete VGW and Customer Gateways.' },
  { step: 13, title: 'Virtual Private Clouds (VPCs)', detail: 'Delete primary VPC 1, partner VPC 2, and spoke VPC 3.' }
];

export const VpcProjectCleanup = ({
  retainedResources = {},
  onCompleteCleanup = () => {},
  onCancel = () => {}
}) => {
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [selectedCompletionOption, setSelectedCompletionOption] = useState('completed_cleaned');

  const toggleStep = (stepNum) => {
    setCheckedSteps(prev =>
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  const isAllChecked = checkedSteps.length === TEARDOWN_STEPS.length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Phase 8 — Complete VPC Project Resource Teardown
            </h2>
            <p className="text-xs text-slate-400">
              Dependency-ordered teardown guide generated from saved project resource records.
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Back to Path Tasks
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-300 mb-0.5">AWS Resource Deletion Policy</span>
          <p>
            Study Tracker never automatically deletes live AWS resources. Follow the ordered steps below in your AWS Management Console or AWS CLI, then record your completion status.
          </p>
        </div>
      </div>

      {/* Dependency-Ordered Teardown Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Reverse Dependency Order Checklist (13 Steps)
        </h3>

        <div className="space-y-2">
          {TEARDOWN_STEPS.map(item => {
            const isChecked = checkedSteps.includes(item.step);
            return (
              <label
                key={item.step}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 transition-colors border border-slate-800/80 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleStep(item.step)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-950 w-4 h-4"
                />
                <div className="min-w-0">
                  <span className={`text-xs font-bold block ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    Step {item.step}. {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {item.detail}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Completion Decision Selection */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
        <span className="text-xs font-bold text-white block">
          Final Programme Completion Status:
        </span>

        <div className="space-y-2">
          <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
            <input
              type="radio"
              name="completionOption"
              value="completed_cleaned"
              checked={selectedCompletionOption === 'completed_cleaned'}
              onChange={(e) => setSelectedCompletionOption(e.target.value)}
              className="text-cyan-500 bg-slate-950 border-slate-700"
            />
            <span><strong>Completed — all resources cleaned</strong> (0 active AWS resources remaining)</span>
          </label>

          <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
            <input
              type="radio"
              name="completionOption"
              value="completed_retained"
              checked={selectedCompletionOption === 'completed_retained'}
              onChange={(e) => setSelectedCompletionOption(e.target.value)}
              className="text-cyan-500 bg-slate-950 border-slate-700"
            />
            <span><strong>Completed — resources retained with cost acknowledgement</strong> (Persistent cost warnings remain)</span>
          </label>

          <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
            <input
              type="radio"
              name="completionOption"
              value="in_progress"
              checked={selectedCompletionOption === 'in_progress'}
              onChange={(e) => setSelectedCompletionOption(e.target.value)}
              className="text-cyan-500 bg-slate-950 border-slate-700"
            />
            <span><strong>Cleanup pending</strong> (Will return to teardown later)</span>
          </label>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onCompleteCleanup(selectedCompletionOption)}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Final Status</span>
        </button>
      </div>
    </div>
  );
};
