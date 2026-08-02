import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { calculateTaskProgress } from '../../services/taskService';
import { TaskStepCard } from './TaskStepCard';
import { TaskResetDialog } from './TaskResetDialog';
import { AwsValidationPanel } from './AwsValidationPanel';
import {
  ArrowLeft,
  Terminal,
  Globe,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Zap,
  RotateCcw,
  BookOpen,
  DollarSign,
  Layers,
  Award,
  Clock,
  Sparkles,
  Info,
  Check
} from 'lucide-react';

export const TaskGuide = () => {
  const {
    activeTask: task,
    activeMode,
    taskProgress,
    closeTask,
    setActiveMode,
    toggleItemCompletion,
    toggleMainStepCompletion,
    resetTaskProgress,
    completeTask
  } = useTask();

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [showCleanupWarning, setShowCleanupWarning] = useState(false);

  if (!task) return null;

  const currentProgressRecord = taskProgress[task.id] || {};
  const metrics = calculateTaskProgress(task, currentProgressRecord, activeMode);

  const completedConsoleItems = currentProgressRecord.consoleCompletedItems || [];
  const completedCliItems = currentProgressRecord.cliCompletedItems || [];
  const completedVerifyItems = currentProgressRecord.verificationCompletedItems || [];
  const completedCleanupItems = currentProgressRecord.cleanupCompletedItems || [];

  const currentModeItems = activeMode === 'cli' ? completedCliItems : completedConsoleItems;
  const currentSteps = activeMode === 'cli' ? task.cliSteps : task.consoleSteps;

  const handleToggleVerification = (id) => {
    toggleItemCompletion(task.id, 'verification', id);
  };

  const handleToggleCleanup = (id) => {
    toggleItemCompletion(task.id, 'cleanup', id);
  };

  const handleCompleteButtonClick = () => {
    if (metrics.isCleanupPending) {
      setShowCleanupWarning(true);
      return;
    }
    completeTask(task.id);
  };

  const diffColor = task.difficulty === 'Easy' 
    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' 
    : (task.difficulty === 'Hard' ? 'text-rose-400 bg-rose-950/60 border-rose-800' : 'text-amber-400 bg-amber-950/60 border-amber-800');

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={closeTask}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Labs</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsResetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Section */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {task.examCode.toUpperCase()} LAB
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {task.service}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mb-3">
          {task.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <strong className="text-indigo-300">Goal: </strong>
          {task.goal}
        </p>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Service</span>
          <span className="text-xs font-bold text-slate-200">{task.service}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Feature</span>
          <span className="text-xs font-bold text-slate-200">{task.feature}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Region</span>
          <span className="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1">
            <Globe className="w-3 h-3" />
            {task.region}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Exam</span>
          <span className="text-xs font-bold text-slate-200">{task.examCode.toUpperCase()}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Difficulty</span>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffColor}`}>
            {task.difficulty}
          </span>
        </div>
      </div>

      {/* 3. What You Are Building (Architecture Flow) */}
      {task.flow && task.flow.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            What You Are Building (Architecture Flow)
          </h2>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {task.flow.map((stepName, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                  {idx + 1}. {stepName}
                </span>
                {idx < task.flow.length - 1 && (
                  <span className="text-slate-600 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* AWS Verification & Permissions Panel */}
      <AwsValidationPanel key={task.id} task={task} />

      {/* 4. Concepts to Know First */}
      {task.concepts && task.concepts.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Concepts to Know First
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {task.concepts.map(concept => (
              <div key={concept.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <h3 className="text-xs font-bold text-indigo-300">{concept.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{concept.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Why This Matters */}
      {task.whyItMatters && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-300 text-sm block mb-1">Why This Matters</strong>
            <p className="leading-relaxed">{task.whyItMatters}</p>
          </div>
        </div>
      )}

      {/* 6. Chosen Example Values */}
      {task.values && task.values.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Chosen Example Values For This Lab
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {task.values.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400">{item.label}</span>
                <span className="text-xs font-mono font-bold text-emerald-300 mt-1 break-all">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Cost Warning */}
      {task.costWarning && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 text-sm block mb-1">AWS Cost Warning</strong>
            <p className="leading-relaxed">{task.costWarning}</p>
          </div>
        </div>
      )}

      {/* 8. Console vs CLI Mode Toggle */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 pl-3">Lab Guide Mode:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveMode('console')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeMode === 'console'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>AWS Console</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950 text-indigo-300 border border-indigo-800">
                  {metrics.consolePercent}%
                </span>
              </button>

              <button
                onClick={() => setActiveMode('cli')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeMode === 'cli'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>AWS CLI</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950 text-purple-300 border border-purple-800">
                  {metrics.cliPercent}%
                </span>
              </button>
            </div>
          </div>

          <div className="pr-3 text-xs text-slate-400 font-semibold text-right">
            Mode Steps: {metrics.completedStepCount} / {metrics.totalStepCount} complete
          </div>
        </div>

        {/* 9. Steps List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {activeMode === 'cli' ? <Terminal className="w-5 h-5 text-purple-400" /> : <Globe className="w-5 h-5 text-indigo-400" />}
              {activeMode === 'cli' ? 'AWS CLI Guide Steps' : 'AWS Console Guide Steps'}
            </h2>
            <span className="text-xs text-slate-400">
              Checking all items in a step completes the main step badge.
            </span>
          </div>

          {currentSteps && currentSteps.map(step => (
            <TaskStepCard
              key={step.id}
              step={step}
              completedItemIds={currentModeItems}
              onToggleItem={(itemId) => toggleItemCompletion(task.id, activeMode, itemId)}
              onToggleMainStep={(stepId, shouldCheck) => toggleMainStepCompletion(task.id, activeMode, stepId, shouldCheck)}
            />
          ))}
        </div>
      </div>

      {/* 10. Verification Checklist */}
      {task.verification && task.verification.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Lab Verification Checklist (Required)
            </h2>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              {metrics.verificationPercent}% Verified
            </span>
          </div>

          <div className="space-y-2">
            {task.verification.map(v => {
              const isChecked = completedVerifyItems.includes(v.id);
              return (
                <label key={v.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer select-none">
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleVerification(v.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                      isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {v.text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 11. Cleanup Section */}
      {task.cleanup && task.cleanup.length > 0 && (
        <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Resource Teardown & Cleanup (Required)
            </h2>
            <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
              {metrics.cleanupPercent}% Cleaned
            </span>
          </div>

          {showCleanupWarning && !metrics.cleanupComplete && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 flex items-center gap-2.5 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Please acknowledge all cleanup steps before marking this lab complete to avoid unexpected AWS charges!</span>
            </div>
          )}

          <div className="space-y-2">
            {task.cleanup.map(c => {
              const isChecked = completedCleanupItems.includes(c.id);
              return (
                <label key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer select-none">
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCleanup(c.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                      isChecked ? 'bg-amber-600 border-amber-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {c.text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 12. Cheat Sheet */}
      {task.cheatSheet && task.cheatSheet.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Lab Cheat Sheet / Quick Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {task.cheatSheet.map(cs => (
              <div key={cs.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <h3 className="text-xs font-bold text-slate-200">{cs.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cs.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. Troubleshooting */}
      {task.troubleshooting && task.troubleshooting.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Troubleshooting Common Lab Issues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {task.troubleshooting.map(ts => (
              <div key={ts.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>{ts.title}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ts.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. Exam Traps */}
      {task.examTraps && task.examTraps.length > 0 && (
        <div className="bg-slate-900/60 border border-rose-900/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Exam Traps & Misconceptions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {task.examTraps.map(trap => (
              <div key={trap.id} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <h3 className="text-xs font-bold text-rose-300">{trap.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{trap.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. Exam Tips */}
      {task.examTips && task.examTips.length > 0 && (
        <div className="bg-slate-900/60 border border-indigo-900/40 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Exam Tips ({task.examCode.toUpperCase()})
          </h2>
          <ul className="space-y-2">
            {task.examTips.map(tip => (
              <li key={tip.id} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold shrink-0">•</span>
                <span className="leading-relaxed">{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 16. Memory Hook */}
      {task.memoryHook && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40 text-center space-y-1">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Memory Hook</span>
          <p className="text-sm font-semibold text-slate-100 italic">"{task.memoryHook}"</p>
        </div>
      )}

      {/* 17. Final Completion Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-sm">
            {metrics.overallPercent}%
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 block">Overall Lab Completion</span>
            <span className="text-[11px] text-slate-400">
              {metrics.isCompleted ? 'Lab Fully Completed!' : (metrics.isCleanupPending ? 'Awaiting Cleanup Acknowledgment' : 'Complete steps and verification')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsResetOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Lab</span>
          </button>

          <button
            onClick={handleCompleteButtonClick}
            disabled={metrics.isCompleted || (!metrics.stepsComplete && !metrics.verifyComplete)}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              metrics.isCompleted 
                ? 'bg-emerald-600 text-white cursor-default' 
                : (metrics.stepsComplete && metrics.verifyComplete 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed')
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{metrics.isCompleted ? 'Lab Completed ✓' : 'Mark Lab Complete'}</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <TaskResetDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={() => resetTaskProgress(task.id)}
        taskTitle={task.title}
      />
    </div>
  );
};
