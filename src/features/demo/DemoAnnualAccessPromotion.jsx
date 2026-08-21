import React from 'react';
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Crown,
  FileQuestion,
  Network,
  Siren,
  Sparkles
} from 'lucide-react';

const ANNUAL_ACCESS_BENEFITS = Object.freeze([
  {
    title: 'Complete practice-question bank',
    description: 'Use the entire exam-specific library. Established libraries contain 100+ questions and continue to grow.',
    icon: FileQuestion
  },
  {
    title: 'Every exam practice mode',
    description: 'Use full mock exams, targeted topic quizzes, custom sessions, answer explanations and result review.',
    icon: Sparkles
  },
  {
    title: 'Complete checklist and Knowledge Guide',
    description: 'Study every objective and open every detailed lesson instead of the short Demo selection.',
    icon: BookOpenCheck
  },
  {
    title: 'Complete Follow Along library',
    description: 'Open all practical programmes assigned to the purchased exam, including full guided steps and cleanup.',
    icon: Network
  },
  {
    title: 'Complete Troubleshooting library',
    description: 'Work through all available incidents, validation questions, hints and workplace-style RCA reports.',
    icon: Siren
  },
  {
    title: 'Twelve months of access and updates',
    description: 'Unlock the purchased exam’s complete library and receive additions made to that workspace during the access year.',
    icon: CalendarDays
  }
]);

export const DemoAnnualAccessBanner = () => (
  <section className="mb-6 rounded-2xl border border-amber-700/60 bg-gradient-to-r from-amber-950/45 via-slate-900 to-indigo-950/45 p-4 shadow-lg" aria-label="Full annual exam access information">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-amber-700/60 bg-amber-950/70 p-2.5 text-amber-300">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">Preview access is active for this exam</p>
          <p className="mt-1 text-sm font-black text-white">An active exam entitlement unlocks the complete learning library for one year.</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Full question banks, every checklist lesson, all assigned Follow Alongs, Troubleshooting Challenges and updates are included. Signed-in accounts keep their progress even while using the preview.
          </p>
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
        Payments coming later
      </span>
    </div>
  </section>
);

export const DemoAnnualAccessAdvert = () => (
  <section className="overflow-hidden rounded-3xl border border-amber-700/60 bg-gradient-to-br from-amber-950/45 via-slate-900 to-indigo-950/45 p-6 shadow-2xl sm:p-8" aria-label="Planned paid annual exam access">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-700/70 bg-amber-950/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-200">
          <Crown className="h-3.5 w-3.5" /> Planned annual exam access
        </span>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">Unlock the complete workspace for your chosen exam.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          When payments are enabled, purchasing an exam will provide twelve months of access to its full learning library and all updates added during that access period.
        </p>
      </div>
      <div className="rounded-2xl border border-amber-800/60 bg-slate-950/65 px-5 py-4 text-center">
        <CalendarDays className="mx-auto h-6 w-6 text-amber-300" />
        <p className="mt-2 text-lg font-black text-white">12 months</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Per purchased exam</p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {ANNUAL_ACCESS_BENEFITS.map(benefit => {
        const Icon = benefit.icon;
        return (
          <article key={benefit.title} className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4">
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h3 className="text-sm font-bold text-white">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{benefit.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>

    <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-[11px] leading-5 text-slate-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      <span>This is an information preview only. No purchase button or payment link is available until the protected payment system is added.</span>
    </div>
  </section>
);
