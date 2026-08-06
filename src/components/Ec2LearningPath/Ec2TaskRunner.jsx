import React, { useState, useEffect } from 'react';
import { TaskStepCard } from '../HandsOnTasks/TaskStepCard.jsx';
import { AwsValidationPanel } from '../HandsOnTasks/AwsValidationPanel.jsx';
import { EC2_PATH_ORDERED_TASK_IDS } from '../../data/ec2LearningPathData.js';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Key,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export const Ec2TaskRunner = ({
  task = null,
  completedTaskIds = [],
  preferredMode = 'console',
  resourcesMap = {},
  stepProgressMap = {},
  resourceDecisionsMap = {},
  onSaveProgress = () => {},
  onCompleteTask = () => {},
  onNavigateTask = () => {},
  onUpdateResources = () => {}
}) => {
  if (!task) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-xl">
        <p className="text-slate-400 text-sm">Select an EC2 task from the navigator to begin.</p>
      </div>
    );
  }

  const isCompleted = completedTaskIds.includes(task.id);
  const currentStepProgress = stepProgressMap[task.id] || {};
  const [completedItemIds, setCompletedItemIds] = useState(
    new Set(currentStepProgress.completedItems || [])
  );
  const [resourceInputs, setResourceInputs] = useState(
    currentStepProgress.resourceInputs || {}
  );
  const [localMode, setLocalMode] = useState(preferredMode);

  useEffect(() => {
    setLocalMode(preferredMode);
  }, [preferredMode]);

  useEffect(() => {
    const prog = stepProgressMap[task.id] || {};
    setCompletedItemIds(new Set(prog.completedItems || []));
    setResourceInputs(prog.resourceInputs || {});
  }, [task.id, stepProgressMap]);

  // Interpolates {{variable}} in strings using resourcesMap and resourceInputs
  const interpolateVariables = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const trimmed = key.trim();
      return (
        resourceInputs[trimmed] ||
        resourcesMap[trimmed]?.awsId ||
        resourcesMap[trimmed] ||
        `{{${trimmed}}}`
      );
    });
  };

  // Process steps with variable interpolation
  const processSteps = (steps = []) => {
    if (!Array.isArray(steps)) return [];
    return steps.map(step => ({
      ...step,
      title: interpolateVariables(step.title),
      instructions: (step.instructions || []).map(ins => ({
        ...ins,
        label: interpolateVariables(ins.label || ins.text),
        text: interpolateVariables(ins.text || ins.label),
        detail: interpolateVariables(ins.detail)
      })),
      commands: (step.commands || []).map(cmd => ({
        ...cmd,
        text: interpolateVariables(cmd.text),
        explanation: interpolateVariables(cmd.explanation)
      }))
    }));
  };

  const consoleSteps = processSteps(task.consoleSteps || []);
  const cliSteps = processSteps(task.cliSteps || []);

  const handleToggleItem = (itemId) => {
    setCompletedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleResourceInputChange = (key, value) => {
    const nextInputs = { ...resourceInputs, [key]: value };
    setResourceInputs(nextInputs);

    // Save typed resource record under path_id = ec2-learning-path
    if (value && value.trim()) {
      onUpdateResources({
        [key]: {
          resourceKey: key,
          resourceType: 'AWS::EC2::Resource',
          awsId: value.trim(),
          createdByTaskId: task.id,
          lifecycleStatus: 'created',
          validationStatus: 'verified'
        }
      });
    }
  };

  const handleSave = () => {
    onSaveProgress(task.id, {
      completedItems: Array.from(completedItemIds),
      resourceInputs
    });
  };

  const handleComplete = () => {
    handleSave();
    onCompleteTask(task.id);
  };

  const taskIndex = EC2_PATH_ORDERED_TASK_IDS.indexOf(task.id);
  const prevTaskId = taskIndex > 0 ? EC2_PATH_ORDERED_TASK_IDS[taskIndex - 1] : null;
  const nextTaskId = taskIndex >= 0 && taskIndex < EC2_PATH_ORDERED_TASK_IDS.length - 1 ? EC2_PATH_ORDERED_TASK_IDS[taskIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
              Task #{task.pathSequenceNumber || taskIndex + 1}
            </span>
            {task.isOptionalBranch && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800">
                Optional Branch
              </span>
            )}
            {isCompleted && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.estimatedMinutes} mins</span>
            </div>
            <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
              {task.difficulty}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {task.title}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {task.goal}
          </p>
        </div>

        {task.whyItMatters && (
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3.5 text-xs text-blue-200/90 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-300">Why It Matters: </span>
              {task.whyItMatters}
            </div>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLocalMode('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              localMode === 'console' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AWS Console
          </button>
          <button
            onClick={() => setLocalMode('cli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              localMode === 'cli' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AWS CLI
          </button>
          <button
            onClick={() => setLocalMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              localMode === 'both' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Show Both
          </button>
        </div>
      </div>

      {/* Steps Execution Panels */}
      <div className="space-y-4">
        {(localMode === 'console' || localMode === 'both') && consoleSteps.length > 0 && (
          <div className="space-y-4">
            {localMode === 'both' && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span>AWS Console Instructions</span>
              </h3>
            )}
            {consoleSteps.map((step, idx) => (
              <TaskStepCard
                key={step.id || idx}
                step={step}
                completedItemIds={completedItemIds}
                onToggleItem={handleToggleItem}
              />
            ))}
          </div>
        )}

        {(localMode === 'cli' || localMode === 'both') && cliSteps.length > 0 && (
          <div className="space-y-4">
            {localMode === 'both' && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 mt-6">
                <span>AWS CLI Commands</span>
              </h3>
            )}
            {cliSteps.map((step, idx) => (
              <TaskStepCard
                key={step.id || idx}
                step={step}
                completedItemIds={completedItemIds}
                onToggleItem={handleToggleItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resource Inputs Section */}
      {task.resourceBindings && Object.keys(task.resourceBindings).length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>EC2 Typed Resource Bindings</span>
          </h3>
          <p className="text-xs text-slate-400">
            Enter live AWS resource IDs created in this step to bind them to ec2-learning-path.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {Object.entries(task.resourceBindings).map(([bindingKey, targetKey]) => (
              <div key={bindingKey}>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {bindingKey} ({targetKey})
                </label>
                <input
                  type="text"
                  value={resourceInputs[targetKey] || resourcesMap[targetKey]?.awsId || ''}
                  onChange={(e) => handleResourceInputChange(targetKey, e.target.value)}
                  placeholder={`e.g. i-0123456789... or vpc-...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read-Only Validation Panel */}
      <AwsValidationPanel task={task} />

      {/* Bottom Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={() => prevTaskId && onNavigateTask(prevTaskId)}
          disabled={!prevTaskId}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            prevTaskId ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800' : 'opacity-50 cursor-not-allowed text-slate-600'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Task</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all"
          >
            <Save className="w-4 h-4 text-blue-400" />
            <span>Save Progress</span>
          </button>

          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Next</span>
          </button>
        </div>

        <button
          onClick={() => nextTaskId && onNavigateTask(nextTaskId)}
          disabled={!nextTaskId}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            nextTaskId ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800' : 'opacity-50 cursor-not-allowed text-slate-600'
          }`}
        >
          <span>Next Task</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
