import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTask } from '../context/TaskContext';
import { calculateTaskProgress } from '../services/taskService';
import { 
  CheckSquare, 
  FileText, 
  PlusCircle, 
  Moon, 
  Sun, 
  Sparkles, 
  Award,
  Database,
  Terminal
} from 'lucide-react';

export const Navbar = ({ onOpenAddModal, onOpenBackupModal }) => {
  const { 
    exams, 
    activeExamId, 
    setActiveExamId, 
    activeExam, 
    viewMode, 
    setViewMode, 
    theme, 
    toggleTheme,
    checklist,
    examHistory
  } = useExam();

  const { tasks, taskProgress, currentUser, openAuthModal, signOutUser } = useTask();

  // Calculate active exam overall checklist progress %
  let totalTasks = 0;
  let completedTasks = 0;

  if (activeExam && activeExam.domains) {
    activeExam.domains.forEach(domain => {
      domain.subtopics.forEach(sub => {
        sub.tasks.forEach(task => {
          totalTasks++;
          if (checklist[activeExamId]?.[task.id]) {
            completedTasks++;
          }
        });
      });
    });
  }

  const checklistPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate hands-on labs overall progress %
  let totalLabs = 0;
  let completedLabs = 0;
  tasks.forEach(t => {
    totalLabs++;
    const prog = taskProgress[t.id];
    const metrics = calculateTaskProgress(t, prog || {}, prog?.selectedMode || 'console');
    if (metrics.isCompleted) completedLabs++;
  });

  const labsPercent = totalLabs > 0 ? Math.round((completedLabs / totalLabs) * 100) : 0;

  // Calculate last score for active exam
  const activeHistory = examHistory.filter(h => h.examId === activeExamId);
  const lastAttempt = activeHistory[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                ExamPulse
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                Prep AI
              </span>
            </div>
          </div>

          {/* Exam Category Switcher (Tabs) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-x-auto max-w-md">
            {exams.map(exam => {
              const isActive = exam.id === activeExamId;
              return (
                <button
                  key={exam.id}
                  onClick={() => setActiveExamId(exam.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {exam.code}
                </button>
              );
            })}
            <button
              onClick={onOpenAddModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 transition-colors flex items-center gap-1 border border-dashed border-indigo-800/50"
              title="Add Custom Exam"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Add</span>
            </button>
          </div>

          {/* View Mode Switcher: Checklist | Prep Exam | Hands-On Tasks */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'checklist'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Checklist</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewMode === 'checklist' 
                  ? 'bg-indigo-800 text-indigo-100' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {checklistPercent}%
              </span>
            </button>

            <button
              onClick={() => setViewMode('prep-exam')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'prep-exam'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Prep Exam</span>
              {lastAttempt && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  lastAttempt.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {Math.round(lastAttempt.scorePercentage)}%
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('hands-on-tasks')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'hands-on-tasks'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Hands-On Tasks</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewMode === 'hands-on-tasks'
                  ? 'bg-emerald-800 text-emerald-100'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {labsPercent}%
              </span>
            </button>
          </div>

          {/* Actions & Utilities & Auth Controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden xl:inline-block text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 max-w-[150px] truncate">
                  {currentUser.email}
                </span>
                <button
                  onClick={signOutUser}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 hover:border-rose-800 transition-all flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={onOpenBackupModal}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
              title="Backup / Restore JSON Data"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

        </div>

        {/* Mobile Exam Selector Row */}
        <div className="flex md:hidden items-center gap-1.5 pb-3 overflow-x-auto">
          {exams.map(exam => {
            const isActive = exam.id === activeExamId;
            return (
              <button
                key={exam.id}
                onClick={() => setActiveExamId(exam.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800/60 text-slate-400'
                }`}
              >
                {exam.code}
              </button>
            );
          })}
          <button
            onClick={onOpenAddModal}
            className="px-2 py-1 rounded-lg text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 whitespace-nowrap"
          >
            + Add Exam
          </button>
        </div>

      </div>
    </header>
  );
};
