import React from 'react';
import { Target, AlertTriangle, Lightbulb, CheckCircle2, HelpCircle, Info, ShieldCheck } from 'lucide-react';
import { remapExplanationOptionLetters, parseExplanationSections } from '../../utils/explanationUtils';

export { remapExplanationOptionLetters, parseExplanationSections };

export default function ExplanationViewer({ explanation, optionMapping }) {
  if (!explanation) return null;

  const remappedText = remapExplanationOptionLetters(explanation, optionMapping);
  const sections = parseExplanationSections(remappedText);

  return (
    <div className="space-y-3 text-xs sm:text-sm mt-3">
      {sections.map((sec, idx) => {
        if (sec.type === 'trigger') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                <Target className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{sec.title}</span>
              </div>
              <p className="leading-relaxed pl-6 text-amber-100/90 font-medium">{sec.content}</p>
            </div>
          );
        }

        if (sec.type === 'trap') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-rose-400 mb-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{sec.title}</span>
              </div>
              <p className="leading-relaxed pl-6 text-rose-100/90">{sec.content}</p>
            </div>
          );
        }

        if (sec.type === 'memory') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1.5">
                <Lightbulb className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{sec.title}</span>
              </div>
              <p className="leading-relaxed pl-6 text-emerald-100/90 font-medium">{sec.content}</p>
            </div>
          );
        }

        if (sec.type === 'aws_note') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-sky-950/30 border border-sky-800/50 text-sky-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sky-400 mb-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                <span>{sec.title}</span>
              </div>
              <p className="leading-relaxed pl-6 text-sky-100/90">{sec.content}</p>
            </div>
          );
        }

        if (sec.type === 'distractors') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-400 mb-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{sec.title}</span>
              </div>
              <div className="space-y-2.5 pl-2">
                {sec.content.split('\n').map((line, lIdx) => {
                  const lineTrimmed = line.trim();
                  if (!lineTrimmed) return null;
                  return (
                    <p key={lIdx} className="leading-relaxed text-slate-300">
                      {lineTrimmed}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        }

        if (sec.type === 'why_correct' || sec.type === 'correct') {
          return (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 text-slate-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-indigo-400 mb-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>{sec.title}</span>
              </div>
              <p className="leading-relaxed text-slate-200">{sec.content}</p>
            </div>
          );
        }

        return (
          <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-indigo-400 mb-1.5">
              <Info className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>{sec.title}</span>
            </div>
            <p className="leading-relaxed text-slate-300">{sec.content}</p>
          </div>
        );
      })}
    </div>
  );
}
