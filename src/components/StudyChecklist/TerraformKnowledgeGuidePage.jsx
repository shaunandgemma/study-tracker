import React from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, Code2, ExternalLink, GraduationCap, Lightbulb, TriangleAlert } from 'lucide-react';

const Section = ({ icon: Icon, title, children, colour = 'text-violet-300' }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
    <h2 className={`flex items-center gap-2 text-sm font-extrabold ${colour}`}>
      <Icon className="h-5 w-5" /> {title}
    </h2>
    <div className="mt-3 text-sm leading-7 text-slate-300">{children}</div>
  </section>
);

const LessonNavigation = ({ currentIndex, totalLessons, onPrevious, onNext }) => (
  <nav aria-label="Terraform lesson navigation" className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
    <button
      type="button"
      onClick={onPrevious || undefined}
      disabled={!onPrevious}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      <ArrowLeft className="h-4 w-4" /> Previous lesson
    </button>
    <span className="text-center text-xs font-extrabold uppercase tracking-wider text-violet-300">
      Lesson {currentIndex + 1} of {totalLessons}
    </span>
    <button
      type="button"
      onClick={onNext || undefined}
      disabled={!onNext}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
    >
      Next lesson <ArrowRight className="h-4 w-4" />
    </button>
  </nav>
);

export const TerraformKnowledgeGuidePage = ({
  guide,
  objectiveCode = 'Terraform 004',
  currentIndex = 0,
  totalLessons = 1,
  onPrevious = null,
  onNext = null,
  onBack = () => {}
}) => {
  if (!guide) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Terraform Knowledge Guide
      </button>

      <header className="rounded-3xl border border-violet-800/60 bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-950 p-7 sm:p-9">
        <span className="inline-flex rounded-full border border-violet-700 bg-violet-950/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-violet-200">
          {objectiveCode} Knowledge Guide
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white">{guide.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{guide.plainEnglish}</p>
      </header>

      <LessonNavigation currentIndex={currentIndex} totalLessons={totalLessons} onPrevious={onPrevious} onNext={onNext} />

      <div className="grid gap-5 md:grid-cols-2">
        <Section icon={Lightbulb} title="Why this matters">
          <p>{guide.whyItMatters}</p>
        </Section>
        <Section icon={BriefcaseBusiness} title="Workplace example" colour="text-cyan-300">
          <p>{guide.workplaceExample}</p>
        </Section>
        <Section icon={GraduationCap} title="What to understand for the exam" colour="text-amber-300">
          <p>{guide.examFocus}</p>
        </Section>
        <Section icon={TriangleAlert} title="Common beginner mistake" colour="text-rose-300">
          <p>{guide.commonMistake}</p>
        </Section>
      </div>

      <Section icon={CheckCircle2} title="Key points to remember" colour="text-emerald-300">
        <ul className="space-y-3">
          {guide.keyPoints.map(point => (
            <li key={point} className="flex gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Section>

      {guide.example && (
        <Section icon={Code2} title="Small example" colour="text-blue-300">
          <p className="mb-4 text-xs text-slate-400">Read the example line by line. It is here to explain the concept, not as a complete environment to deploy blindly.</p>
          <pre className="overflow-x-auto whitespace-pre rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs leading-6 text-cyan-100"><code>{guide.example}</code></pre>
        </Section>
      )}

      <Section icon={ExternalLink} title="Official learning sources" colour="text-indigo-300">
        <div className="space-y-2">
          {guide.sources.map(source => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-xs font-bold text-indigo-300 transition hover:border-indigo-700 hover:text-indigo-200">
              <span>{source.title}</span><ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          ))}
        </div>
      </Section>

      <LessonNavigation currentIndex={currentIndex} totalLessons={totalLessons} onPrevious={onPrevious} onNext={onNext} />
    </div>
  );
};
