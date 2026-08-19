import React from 'react';
import { ArrowRight, Award, BookOpenCheck, CheckCircle2, GraduationCap, PlusCircle, Sparkles } from 'lucide-react';
import { getExamChecklistItemCount } from '../../utils/examNavigation.js';

export const AppLandingPage = ({ exams = [], onSelectExam = () => {}, onAddExam = () => {}, canManageContent = false }) => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] animate-fadeIn">
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/35 to-slate-950 p-7 sm:p-10 shadow-2xl">
      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-700/70 bg-indigo-950/70 px-3 py-1 text-xs font-bold text-indigo-200">
          <Sparkles className="h-4 w-4" />
          One place to study, practise, and build
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Prepare for your next certification with a clear learning path.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            LATT brings together editable study checklists, practice exams, progress history, and guided Follow Alongs. Select an exam to open a workspace containing only the learning tools assigned to it.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Plan', 'See the topics you need to cover.'],
            ['Practise', 'Test knowledge and review results.'],
            ['Build', 'Follow practical tasks step by step.']
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
    </section>

    <aside className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-xl" aria-label="Exam selection">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl border border-indigo-800 bg-indigo-950/70 p-2.5 text-indigo-300">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Your exams</p>
          <h2 className="text-lg font-bold text-white">Choose an exam</h2>
        </div>
      </div>

      <div className="space-y-3">
        {exams.map(exam => (
          <button
            key={exam.id}
            type="button"
            onClick={() => onSelectExam(exam.id)}
            className="group w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:border-indigo-500/70 hover:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                  <Award className="h-3 w-3 text-amber-400" /> {exam.code}
                </span>
                <h3 className="text-sm font-bold leading-5 text-white">{exam.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <BookOpenCheck className="h-3.5 w-3.5 text-cyan-400" />
                  {getExamChecklistItemCount(exam)} checklist items
                </p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-300" />
            </div>
          </button>
        ))}

        {canManageContent && <button
          type="button"
          onClick={onAddExam}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-700/70 bg-indigo-950/30 px-4 py-3 text-xs font-bold text-indigo-300 transition hover:bg-indigo-950/60"
        >
          <PlusCircle className="h-4 w-4" /> Add Custom Exam
        </button>}
      </div>
    </aside>
  </div>
);
