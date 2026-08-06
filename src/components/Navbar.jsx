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
  Terminal,
  Network,
  Menu,
  X,
  User,
  LogOut
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/90 border-b border-slate-800 text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                ExamPulse
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                Prep AI
              </span>
            </div>
          </div>

          {/* Desktop Exam Category Switcher (Tabs) */}
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

          {/* Desktop View Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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

            <button
              onClick={() => setViewMode('follow-alongs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'follow-alongs'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Follow Alongs</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewMode === 'follow-alongs'
                  ? 'bg-cyan-800 text-cyan-100'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                13
              </span>
            </button>
          </div>

          {/* Desktop Actions & Utilities */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile Right Controls: Active Exam Badge & Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 max-w-[110px] truncate">
              {activeExam?.code || 'SAA-C03'}
            </span>

            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white active:scale-95 transition-all border border-slate-700/60"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-indigo-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Slide-Over Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-slate-100 text-base">Menu & Settings</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Exam Selection List */}
              <div className="py-4 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Select Exam
                </h3>
                <div className="space-y-1.5">
                  {exams.map(exam => {
                    const isActive = exam.id === activeExamId;
                    return (
                      <button
                        key={exam.id}
                        onClick={() => {
                          setActiveExamId(exam.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                            : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-300" />
                          <span>{exam.title || exam.code}</span>
                        </div>
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAddModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/40 border border-dashed border-indigo-800/60 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Custom Exam</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions & Utilities */}
              <div className="py-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Utilities & Data
                </h3>
                
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenBackupModal();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 border border-slate-800"
                >
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Backup / Restore JSON Data</span>
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center justify-between border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                    <span>Theme ({theme === 'dark' ? 'Dark' : 'Light'})</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Toggle</span>
                </button>
              </div>
            </div>

            {/* Footer Account Section */}
            <div className="pt-4 border-t border-slate-800">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      signOutUser();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/60 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openAuthModal();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
