import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  Terminal,
  Layers,
  Cpu
} from 'lucide-react';
import { interpolateResourceVariables, validateResourceRecord } from '../../services/vpcLearningPathService.js';
import { VPC_PATH_TASKS } from '../../data/vpcLearningPathData.js';
import { FollowAlongStepCard } from '../../features/followAlongs/runtime/FollowAlongStepCard.jsx';

export const VpcTaskRunner = ({
  task = null,
  completedTaskIds = [],
  preferredMode = 'console',
  resourcesMap = {},
  stepProgressMap = {},
  onSaveProgress = () => {},
  onCompleteTask = () => {},
  onNavigateTask = () => {}
}) => {
  const taskId = task?.id || null;
  const isCompleted = completedTaskIds.includes(taskId);

  // Local state for mode switching inside the task
  const [activeMode, setActiveMode] = useState(preferredMode);
  const [checkedSteps, setCheckedSteps] = useState(() => taskId ? stepProgressMap[taskId] || [] : []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editableResources, setEditableResources] = useState(() => {
    const keys = task?.createdResourceKeys || [];
    const initial = {};
    keys.forEach(k => {
      initial[k] = resourcesMap[k]?.awsId || '';
    });
    return initial;
  });

  // Sync mode and resources when task changes
  useEffect(() => {
    setActiveMode(preferredMode);
    setCheckedSteps(taskId ? stepProgressMap[taskId] || [] : []);
    setHasUnsavedChanges(false);

    const keys = task?.createdResourceKeys || [];
    const updated = {};
    keys.forEach(k => {
      updated[k] = resourcesMap[k]?.awsId || '';
    });
    setEditableResources(updated);
  }, [taskId, preferredMode, resourcesMap, stepProgressMap, task]);

  if (!task) return null;

  // Toggle item checkbox
  const handleToggleItem = (itemId) => {
    setCheckedSteps(prev => {
      const next = prev.includes(itemId) ? prev.filter(s => s !== itemId) : [...prev, itemId];
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Toggle main step checkbox
  const handleToggleMainStep = (stepId, shouldCheck) => {
    const allSteps = [...(task.consoleSteps || []), ...(task.cliSteps || [])];
    const targetStep = allSteps.find(s => s.id === stepId);
    if (!targetStep) return;

    const itemIds = (targetStep.instructions || []).map(i => i.id);
    if (itemIds.length === 0) itemIds.push(targetStep.id);

    setCheckedSteps(prev => {
      let next;
      if (shouldCheck) {
        next = Array.from(new Set([...prev, ...itemIds]));
      } else {
        const removeSet = new Set(itemIds);
        next = prev.filter(id => !removeSet.has(id));
      }
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // Handle resource input change
  const handleResourceInputChange = (key, val) => {
    setEditableResources(prev => ({ ...prev, [key]: val }));
    setHasUnsavedChanges(true);
  };

  // Save progress handler
  const handleSave = () => {
    const updatedResourcesMap = { ...resourcesMap };
    Object.keys(editableResources).forEach(key => {
      const val = editableResources[key]?.trim();
      if (val) {
        const record = {
          resourceKey: key,
          resourceType: key.toLowerCase().includes('vpc') ? 'AWS::EC2::VPC' : key.toLowerCase().includes('subnet') ? 'AWS::EC2::Subnet' : 'AWS::Resource',
          awsId: val,
          createdByTaskId: taskId,
          lifecycleStatus: 'created',
          validationStatus: 'verified',
          modifiedByTaskIds: []
        };

        if (validateResourceRecord(record).valid) {
          updatedResourcesMap[key] = record;
        }
      }
    });

    onSaveProgress({
      taskId,
      checkedSteps,
      resourcesMap: updatedResourcesMap,
      preferredMode: activeMode
    });

    setHasUnsavedChanges(false);
  };

  // Next task click handler
  const handleNextClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    }
    onCompleteTask(taskId, 'retained');
    onNavigateTask('next');
  };

  // Interpolates step, instructions, and commands with live/draft bound resource variables
  const interpolateStep = (step, stepIdx) => {
    if (!step) return step;
    return {
      ...step,
      number: step.number || stepIdx + 1,
      title: interpolateResourceVariables(step.title, resourcesMap, task.region),
      description: interpolateResourceVariables(step.description, resourcesMap, task.region),
      note: interpolateResourceVariables(step.note, resourcesMap, task.region),
      warning: interpolateResourceVariables(step.warning, resourcesMap, task.region),
      expectedResult: interpolateResourceVariables(step.expectedResult, resourcesMap, task.region),
      instructions: (step.instructions || []).map(ins => ({
        ...ins,
        text: interpolateResourceVariables(ins.text, resourcesMap, task.region),
        label: interpolateResourceVariables(ins.label, resourcesMap, task.region),
        detail: interpolateResourceVariables(ins.detail, resourcesMap, task.region)
      })).filter(ins => ins.text || ins.label || ins.detail),
      commands: (step.commands || []).map(cmd => ({
        ...cmd,
        text: interpolateResourceVariables(cmd.text, resourcesMap, task.region),
        explanation: interpolateResourceVariables(cmd.explanation, resourcesMap, task.region),
        expectedOutput: interpolateResourceVariables(cmd.expectedOutput, resourcesMap, task.region),
        warning: interpolateResourceVariables(cmd.warning, resourcesMap, task.region)
      }))
    };
  };

  const currentIdx = VPC_PATH_TASKS.findIndex(t => t.id === taskId);
  const hasPrev = currentIdx > 0;

  const rawConsoleSteps = task.consoleSteps || [];
  const rawCliSteps = task.cliSteps || [];

  return (
    <div className="space-y-6">
      {/* Task Runner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Phase {task.phaseNumber || 1} — Task {currentIdx + 1} of {VPC_PATH_TASKS.length}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {task.title}
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveMode('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'console' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AWS Console
            </button>
            <button
              onClick={() => setActiveMode('cli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'cli' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AWS CLI
            </button>
            <button
              onClick={() => setActiveMode('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'both' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Show Both
            </button>
          </div>
        </div>

        {/* Goal Banner */}
        <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-cyan-400 block mb-1">Objective:</span>
          {task.goal}
        </div>

        {/* Resource Binding Input Panel (If task creates resources) */}
        {task.createdResourceKeys && task.createdResourceKeys.length > 0 && (
          <div className="mt-4 p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Learning Path Saved Resource Capture
              </span>
              <span className="text-[10px] text-slate-400">Prefills into subsequent CLI commands</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {task.createdResourceKeys.map(key => (
                <div key={key}>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={editableResources[key] || ''}
                    onChange={(e) => handleResourceInputChange(key, e.target.value)}
                    placeholder={`e.g. ${key.toLowerCase().includes('vpc') ? 'vpc-0123456789' : 'subnet-0123456789'}`}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Instructions Execution Section */}
        <div className="mt-6 space-y-6">
          {/* Console Steps */}
          {(activeMode === 'console' || activeMode === 'both') && rawConsoleSteps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                AWS Management Console Instructions
              </h3>

              {rawConsoleSteps.map((step, sIdx) => {
                const interpolated = interpolateStep(step, sIdx);
                return (
                  <FollowAlongStepCard
                    key={step.id || sIdx}
                    step={interpolated}
                    completedItemIds={checkedSteps}
                    onToggleItem={handleToggleItem}
                    onToggleMainStep={handleToggleMainStep}
                  />
                );
              })}
            </div>
          )}

          {/* CLI Steps */}
          {(activeMode === 'cli' || activeMode === 'both') && rawCliSteps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                AWS CLI Commands
              </h3>

              {rawCliSteps.map((step, sIdx) => {
                const interpolated = interpolateStep(step, sIdx);
                return (
                  <FollowAlongStepCard
                    key={step.id || sIdx}
                    step={interpolated}
                    completedItemIds={checkedSteps}
                    onToggleItem={handleToggleItem}
                    onToggleMainStep={handleToggleMainStep}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800">
          <button
            disabled={!hasPrev}
            onClick={() => onNavigateTask('prev')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Task</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasUnsavedChanges ? 'Save Unsaved Changes' : 'Save Progress'}</span>
            </button>

            <button
              onClick={handleNextClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Next Task</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
