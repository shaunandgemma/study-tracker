import React from 'react';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, FileQuestion, Network, Siren } from 'lucide-react';
import { getExamChecklistItemCount, getExamLandingDetails, getExamTopics } from '../../utils/examNavigation.js';
import { ExamAccessStatus } from '../../features/access/ExamAccessStatus.jsx';
import { ExamPaymentControls } from '../../features/payments/ExamPaymentControls.jsx';

const TOOL_CARDS = [
  {
    id: 'checklist',
    title: 'Checklist',
    description: 'Work through every topic and keep your study progress organised.',
    icon: BookOpenCheck,
    colour: 'border-indigo-800/70 bg-indigo-950/25 text-indigo-300'
  },
  {
    id: 'prep-exam',
    title: 'Prep Exam',
    description: 'Choose targeted questions, a custom practice session, or a full mock exam.',
    icon: FileQuestion,
    colour: 'border-purple-800/70 bg-purple-950/25 text-purple-300'
  },
  {
    id: 'follow-alongs',
    title: 'Follow Alongs',
    description: 'Open only the guided practical learning paths assigned to this exam.',
    icon: Network,
    colour: 'border-cyan-800/70 bg-cyan-950/25 text-cyan-300'
  }
];

export const ExamLandingPage = ({ exam, onBack = () => {}, onSelectTool = () => {}, previewOnly = false, accessPolicy = null }) => {
  if (!exam) return null;
  const details = getExamLandingDetails(exam);
  const topics = getExamTopics(exam);
  const checklistItems = getExamChecklistItemCount(exam);
  const hasKnowledgeGuide = exam.id === 'terraform-associate-004' || exam.id === 'aws-saa-c03';
  const hasTroubleshooting = exam.id === 'terraform-associate-004' || exam.id === 'aws-saa-c03';
  const toolCards = hasKnowledgeGuide
    ? [
        {
          id: 'knowledge-guide',
          title: 'Knowledge Guide',
          description: previewOnly
            ? 'Study the selected Knowledge Guide lessons included with preview access.'
            : exam.id === 'terraform-associate-004'
            ? 'Start here. Study all 37 Terraform lessons in checklist order with Previous and Next controls.'
            : 'Start here. Study AWS lessons in checklist order with Previous and Next controls.',
          icon: BookOpenCheck,
          colour: 'border-violet-700/80 bg-violet-950/35 text-violet-300'
        },
        ...(hasTroubleshooting ? [{
          id: 'troubleshooting',
          title: 'Troubleshooting',
          description: 'Investigate realistic incidents, validate your diagnosis, and build a workplace-style RCA report.',
          icon: Siren,
          colour: 'border-amber-700/80 bg-amber-950/30 text-amber-300'
        }] : []),
        ...TOOL_CARDS
      ]
    : TOOL_CARDS;

  return (
    <div className="space-y-6 animate-fadeIn">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to all exams
      </button>

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-7 sm:p-9">
        <div className="relative z-10 max-w-4xl">
          <span className="inline-flex rounded-full border border-indigo-700/70 bg-indigo-950/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-200">
            {exam.code}
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{exam.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{exam.description}</p>
          <p className="mt-3 text-xs font-semibold text-cyan-300">{details.audience}</p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
            <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5">{previewOnly ? 'Selected preview topics' : `${topics.length} topics`}</span>
            <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5">{previewOnly ? 'Curated checklist preview' : `${checklistItems} checklist items`}</span>
            <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5">Target score: {exam.passingScore}%</span>
          </div>
          <ExamAccessStatus accessPolicy={accessPolicy} examId={exam.id} />
        </div>
        <div className="pointer-events-none absolute -right-20 top-0 h-full w-80 bg-gradient-to-l from-indigo-500/10 to-transparent" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <h2 className="text-xl font-bold text-white">What would you like to do?</h2>
          <p className="mt-1 text-sm text-slate-400">Everything opened below remains connected to {exam.code}.</p>
          <div className={`mt-4 grid gap-4 ${toolCards.length > 3 ? 'md:grid-cols-2 xl:grid-cols-5' : 'md:grid-cols-3'}`}>
            {toolCards.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  className={`group flex min-h-56 flex-col rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl ${tool.colour}`}
                >
                  <Icon className="h-7 w-7" />
                  <h3 className="mt-5 text-lg font-bold text-white">{tool.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-slate-300">{tool.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-white">
                    Open {tool.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5">
          <h2 className="text-sm font-bold text-white">What you can get from this exam workspace</h2>
          <ul className="mt-4 space-y-4">
            {details.benefits.map(benefit => (
              <li key={benefit} className="flex gap-3 text-xs leading-5 text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <ExamPaymentControls accessPolicy={accessPolicy} examId={exam.id} />
        </aside>
      </section>
    </div>
  );
};
