import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LABELS = {
  checklist: 'Checklist',
  'knowledge-guide': 'Knowledge Guide',
  troubleshooting: 'Troubleshooting',
  'prep-exam': 'Prep Exam',
  'follow-alongs': 'Follow Alongs'
};

export const ExamWorkspaceHeader = ({ exam, viewMode, onBack = () => {} }) => (
  <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 transition hover:text-white">
      <ArrowLeft className="h-4 w-4 text-indigo-400" /> Back to {exam?.code || 'exam'}
    </button>
    <div className="text-left sm:text-right">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Current exam workspace</p>
      <p className="text-xs font-bold text-white">{exam?.code} · {LABELS[viewMode] || 'Study'}</p>
    </div>
  </div>
);
