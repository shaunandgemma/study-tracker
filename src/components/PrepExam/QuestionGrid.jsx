import React from 'react';
import { Flag, CheckCircle2, Circle, X } from 'lucide-react';

export const QuestionGrid = ({ 
  isOpen, 
  onClose, 
  questions, 
  answers, 
  flaggedMap, 
  currentIndex, 
  onSelectQuestion 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Question Navigation Grid</h3>
            <p className="text-xs text-slate-400 mt-0.5">Jump to any question or review flagged items.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 inline-block" />
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-400 inline-block" />
            <span>Current</span>
          </div>
        </div>

        {/* Grid of question buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);
            const isFlagged = !!flaggedMap[q.id];

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700';
            if (isCurrent) {
              btnStyle = isAnswered 
                ? 'bg-emerald-950 text-emerald-200 font-extrabold ring-2 ring-indigo-400 border-indigo-400 shadow-lg shadow-indigo-950/50' 
                : 'bg-indigo-600 text-white font-extrabold ring-2 ring-indigo-300 border-indigo-300 shadow-lg';
            } else if (isAnswered) {
              btnStyle = 'bg-emerald-950/80 border-emerald-700 text-emerald-200 font-bold hover:border-emerald-500';
            } else if (isFlagged) {
              btnStyle = 'bg-amber-950/30 border-amber-700/80 text-amber-200 font-semibold hover:border-amber-500';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`relative py-3 rounded-2xl border text-sm transition-all duration-200 flex items-center justify-center ${btnStyle}`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute top-1 right-1 drop-shadow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-colors"
        >
          Return to Exam
        </button>

      </div>
    </div>
  );
};
