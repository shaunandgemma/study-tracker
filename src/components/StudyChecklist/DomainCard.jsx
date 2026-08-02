import React, { useState, useEffect, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Layers, 
  CheckSquare,
  Sparkles
} from 'lucide-react';

export const DomainCard = ({ domain, searchQuery, onLaunchDomainQuiz }) => {
  const { activeExamId, checklist, toggleTask, checkGroupTasks, highlightedDomainId } = useExam();
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef(null);

  const isHighlighted = highlightedDomainId === domain.id;

  // Auto-scroll and highlight if targeted by diagnostic jump
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      setIsOpen(true);
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  // Calculate domain completion statistics
  let totalTasks = 0;
  let completedTasks = 0;

  domain.subtopics.forEach(sub => {
    sub.tasks.forEach(task => {
      totalTasks++;
      if (checklist[activeExamId]?.[task.id]) {
        completedTasks++;
      }
    });
  });

  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Search query matching filter
  const matchesSearch = (text) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const domainMatches = matchesSearch(domain.title) || matchesSearch(domain.code);

  const filteredSubtopics = domain.subtopics.map(sub => {
    const subMatches = matchesSearch(sub.title);
    const matchingTasks = sub.tasks.filter(t => matchesSearch(t.text) || subMatches || domainMatches);
    return { ...sub, matchingTasks };
  }).filter(sub => sub.matchingTasks.length > 0);

  if (searchQuery && filteredSubtopics.length === 0) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl transition-all duration-300 border ${
        isHighlighted
          ? 'bg-indigo-950/60 border-indigo-500 shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 shadow-xl'
      }`}
    >
      {/* Domain Header Accordion Control */}
      <div className="p-5 sm:p-6 border-b border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-1 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {domain.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  Weight: {domain.weight}%
                </span>
                {isHighlighted && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Focus Area
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1.5 flex items-center gap-2">
                {domain.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {domain.description}
              </p>
            </div>
          </div>

          {/* Right Action & Progress gauge */}
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                const taskIds = domain.subtopics.flatMap(sub => sub.tasks.map(t => t.id));
                const allChecked = taskIds.length > 0 && taskIds.every(id => checklist[activeExamId]?.[id]);
                checkGroupTasks(activeExamId, taskIds, !allChecked);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 flex items-center gap-1.5 transition-all hover:scale-105"
              title="Auto check all boxes in this domain"
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Check All</span>
            </button>

            <button
              onClick={() => onLaunchDomainQuiz(domain.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
              title="Practice questions for this domain"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quiz Domain</span>
            </button>

            <div className="text-right min-w-[80px]">
              <span className="text-base font-extrabold text-indigo-400">
                {percent}%
              </span>
              <span className="text-[11px] text-slate-500 block">
                {completedTasks}/{totalTasks} done
              </span>
            </div>
          </div>

        </div>

        {/* Domain Progress Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Accordion Subtopics Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6 bg-slate-950/40 rounded-b-2xl">
          {filteredSubtopics.map(subtopic => (
            <div key={subtopic.id} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                {subtopic.title}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {subtopic.matchingTasks.map(task => {
                  const isChecked = !!checklist[activeExamId]?.[task.id];
                  return (
                    <label
                      key={task.id}
                      onClick={() => toggleTask(activeExamId, task.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-950/30 border-indigo-800/60 text-slate-200 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <span className={`text-xs leading-relaxed font-medium ${isChecked ? 'line-through opacity-80 text-slate-300' : ''}`}>
                        {task.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
