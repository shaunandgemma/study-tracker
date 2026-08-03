import React from 'react';
import { useExam } from '../context/ExamContext';
import { useTask } from '../context/TaskContext';
import { calculateTaskProgress } from '../services/taskService';
import { CheckSquare, FileText, Terminal } from 'lucide-react';

export const MobileBottomNav = () => {
  const { 
    activeExam, 
    activeExamId, 
    viewMode, 
    setViewMode, 
    checklist, 
    examHistory 
  } = useExam();

  const { tasks, taskProgress } = useTask();

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

  const navItems = [
    {
      id: 'checklist',
      label: 'Checklist',
      icon: CheckSquare,
      badge: `${checklistPercent}%`,
      activeColor: 'from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
    },
    {
      id: 'prep-exam',
      label: 'Prep Exam',
      icon: FileText,
      badge: lastAttempt ? `${lastAttempt.score}%` : null,
      activeColor: 'from-purple-600 to-pink-600 text-white shadow-purple-500/20'
    },
    {
      id: 'hands-on-tasks',
      label: 'Hands-On',
      icon: Terminal,
      badge: `${labsPercent}%`,
      activeColor: 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
    }
  ];

  return (
    <nav 
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-1.5 shadow-2xl shadow-slate-950 flex items-center justify-around"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = viewMode === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-white' 
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.activeColor} shadow-md opacity-100 -z-10`} />
            )}

            <div className="relative flex items-center justify-center">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              
              {item.badge && (
                <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>

            <span className={`text-[11px] font-semibold tracking-tight mt-0.5 ${
              isActive ? 'text-white' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
