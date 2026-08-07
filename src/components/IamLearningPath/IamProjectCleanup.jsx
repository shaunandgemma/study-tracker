import React, { useState } from 'react';
import { IAM_PATH_ONLY_TASKS } from '../../data/iamLearningPathData.js';
import { Wrench, AlertTriangle, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

export const IamProjectCleanup = ({ retainedResources = {}, onResourceUpdate }) => {
  const cleanupTask = IAM_PATH_ONLY_TASKS.find(t => t.id === 'path-iam-project-final-cleanup') || IAM_PATH_ONLY_TASKS[0];
  const [completedSteps, setCompletedSteps] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const handleToggleStep = (stepId) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasMfa = !!retainedResources.mfaDeviceArn;
  const hasSaml = !!retainedResources.samlProviderArn;
  const hasLambda = !!retainedResources.lambdaFunctionName;

  return (
    <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <Wrench className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-100">{cleanupTask.title}</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{cleanupTask.goal}</p>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-4 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block text-amber-300">100% Manual Guided Teardown Protocol</strong>
          <p className="text-slate-300">
            Study Tracker never issues automatic AWS deletion API calls. Follow the 12 dependency-ordered manual steps below to empty and delete lab IAM users, roles, policies, virtual MFA devices, S3 buckets, EC2 instances, and restore your recorded prior account password policy.
          </p>
        </div>
      </div>

      {/* Conditional Optional Resource Badges */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Follow Along Resources for Teardown
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            IAM User: <code className="text-purple-400">{retainedResources.iamUserName?.awsId || 'saa-iam-user-001'}</code>
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
            S3 Bucket: <code className="text-purple-400">{retainedResources.testBucketName?.awsId || 'saa-iam-bucket-[account-id]'}</code>
          </span>
          <span className={`px-2.5 py-1 rounded border ${hasMfa ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-950 border-slate-800/60 text-slate-500'}`}>
            Virtual MFA (Optional Task 13): <code className={hasMfa ? 'text-purple-400' : 'text-slate-500'}>{hasMfa ? retainedResources.mfaDeviceArn.awsId : 'Skipped (Not Created)'}</code>
          </span>
          <span className={`px-2.5 py-1 rounded border ${hasSaml ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-950 border-slate-800/60 text-slate-500'}`}>
            SAML Provider (Optional Task 16): <code className={hasSaml ? 'text-purple-400' : 'text-slate-500'}>{hasSaml ? retainedResources.samlProviderArn.awsId : 'Skipped (Not Created)'}</code>
          </span>
          <span className={`px-2.5 py-1 rounded border ${hasLambda ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-950 border-slate-800/60 text-slate-500'}`}>
            Lambda Stopper (Optional Task 25): <code className={hasLambda ? 'text-purple-400' : 'text-slate-500'}>{hasLambda ? retainedResources.lambdaFunctionName.awsId : 'Skipped (Not Created)'}</code>
          </span>
        </div>
      </div>

      {/* Console Teardown Steps */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Dependency-Ordered Teardown Checklist (12 Steps)</h3>

        <div className="space-y-3">
          {cleanupTask.consoleSteps.map((step, idx) => (
            <div key={step.id || idx} className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-purple-300">
                  Step {idx + 1}: {step.title}
                </span>
                <button
                  onClick={() => handleToggleStep(step.id)}
                  className={`text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-all ${
                    completedSteps[step.id]
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-800/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {completedSteps[step.id] ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  {completedSteps[step.id] ? 'Done' : 'Mark Done'}
                </button>
              </div>

              {step.instructions && step.instructions.map((ins, iIdx) => (
                <p key={ins.id || iIdx} className="text-xs text-slate-300 pl-2">
                  • <strong>{ins.label}:</strong> {ins.detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CLI Reference Commands */}
      {cleanupTask.cliSteps && cleanupTask.cliSteps.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AWS CLI Teardown Reference Commands</h4>
          {cleanupTask.cliSteps[0].commands.map((cmd, cIdx) => (
            <div key={cmd.id || cIdx} className="bg-slate-950 rounded border border-slate-800 p-3 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{cmd.explanation}</span>
                <button
                  onClick={() => handleCopy(`cli-clean-${cIdx}`, cmd.text)}
                  className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300"
                >
                  {copiedId === `cli-clean-${cIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedId === `cli-clean-${cIdx}` ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block text-slate-200">{cmd.text}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IamProjectCleanup;
