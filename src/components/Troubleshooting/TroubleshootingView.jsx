import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clipboard,
  FileWarning,
  Lightbulb,
  Pin,
  PinOff,
  RotateCcw,
  Search,
  ShieldCheck,
  Siren,
  Wrench
} from 'lucide-react';
import { getTroubleshootingChallengesForExam } from '../../data/troubleshootingChallenges/index.js';
import {
  buildRcaReport,
  calculateTroubleshootingScore,
  createEmptyTroubleshootingProgress,
  loadTroubleshootingProgress,
  saveTroubleshootingProgress
} from '../../features/troubleshooting/troubleshootingProgress.js';
import { useExam } from '../../context/ExamContext.jsx';
import { DemoContentNotice } from '../../features/demo/DemoContentNotice.jsx';
import { limitDemoTroubleshootingChallenges } from '../../features/demo/demoContentPolicy.js';
import { demoProgressStorage } from '../../features/demo/demoMode.js';

const getProgress = (allProgress, challengeId) => ({
  ...createEmptyTroubleshootingProgress(),
  ...(allProgress[challengeId] || {})
});

const ChallengeList = ({ challenges, progress, examCode, onOpen, demoAccount }) => {
  const completed = challenges.filter(challenge => getProgress(progress, challenge.id).completed).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-amber-800/50 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/60 bg-amber-950/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300">
              <Siren className="h-3.5 w-3.5" /> Workplace incident practice
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white">Troubleshooting Challenges</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Diagnose the evidence before viewing help. Record your reasoning, validate the fix, and finish with a reusable root-cause report.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-6 py-4 text-center">
            <p className="text-3xl font-black text-emerald-400">{completed}/{challenges.length}</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{examCode} incidents solved</p>
          </div>
        </div>
      </section>

      {demoAccount && (
        <DemoContentNotice>
          Two Troubleshooting Challenges are included in this exam workspace. The paid exam workspace unlocks the complete incident library.
        </DemoContentNotice>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {challenges.map((challenge, index) => {
          const saved = getProgress(progress, challenge.id);
          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => onOpen(challenge.id)}
              className="group flex min-h-72 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:-translate-y-1 hover:border-amber-700/70 hover:shadow-xl hover:shadow-amber-950/20"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg bg-amber-950/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">Incident {index + 1}</span>
                {saved.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <FileWarning className="h-5 w-5 text-slate-500" />}
              </div>
              <p className="mt-5 text-xs font-bold text-cyan-300">{challenge.category}</p>
              <h2 className="mt-2 text-lg font-black text-white">{challenge.title}</h2>
              <p className="mt-3 flex-1 text-xs leading-6 text-slate-400">{challenge.summary}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-[11px] font-bold text-slate-500">{challenge.difficulty}</span>
                <span className="inline-flex items-center gap-2 text-xs font-black text-white">
                  {saved.completed ? `Solved · ${saved.score}/100` : saved.updatedAt ? 'Resume incident' : 'Start incident'}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const IncidentNotebook = ({ challenge, saved, updateSaved, onCopy, copyMessage }) => (
  <aside className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-5 xl:sticky xl:top-5 xl:self-start">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-cyan-950 p-2 text-cyan-300"><Clipboard className="h-5 w-5" /></div>
      <div>
        <h2 className="text-sm font-black text-white">Incident Notebook</h2>
        <p className="text-[10px] text-slate-500">Saved automatically on this computer</p>
      </div>
    </div>

    <div className="mt-5 space-y-4">
      <label className="block">
        <span className="text-xs font-bold text-slate-300">Observations</span>
        <textarea
          value={saved.observations}
          onChange={event => updateSaved({ observations: event.target.value })}
          rows={4}
          placeholder="What facts can you prove from the evidence?"
          className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-5 text-white outline-none transition focus:border-cyan-600"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold text-slate-300">Working hypothesis</span>
        <textarea
          value={saved.hypothesis}
          onChange={event => updateSaved({ hypothesis: event.target.value })}
          rows={3}
          placeholder="What do you currently think is wrong?"
          className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-5 text-white outline-none transition focus:border-cyan-600"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold text-slate-300">Actions attempted</span>
        <textarea
          value={saved.actions}
          onChange={event => updateSaved({ actions: event.target.value })}
          rows={4}
          placeholder="Record each check or correction and its result."
          className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-5 text-white outline-none transition focus:border-cyan-600"
        />
      </label>
    </div>

    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pinned evidence</p>
      {saved.pinnedEvidence.length ? (
        <ul className="mt-2 space-y-1 text-xs text-cyan-200">
          {challenge.evidence.filter(item => saved.pinnedEvidence.includes(item.id)).map(item => <li key={item.id}>• {item.title}</li>)}
        </ul>
      ) : <p className="mt-2 text-xs text-slate-600">Nothing pinned yet.</p>}
    </div>

    <button type="button" onClick={onCopy} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-cyan-950/50 px-4 py-2.5 text-xs font-black text-cyan-200 transition hover:bg-cyan-900/60">
      <Clipboard className="h-4 w-4" /> Copy RCA report
    </button>
    {copyMessage && <p className="mt-2 text-center text-[10px] font-bold text-emerald-400">{copyMessage}</p>}
  </aside>
);

const ChallengeRunner = ({ challenge, saved, updateSaved, onBack, onReset }) => {
  const [validationMessage, setValidationMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const projectedScore = calculateTroubleshootingScore(saved.revealedHints, false);

  const toggleEvidence = evidenceId => {
    const pinnedEvidence = saved.pinnedEvidence.includes(evidenceId)
      ? saved.pinnedEvidence.filter(id => id !== evidenceId)
      : [...saved.pinnedEvidence, evidenceId];
    updateSaved({ pinnedEvidence });
  };

  const validate = () => {
    const unanswered = challenge.validationQuestions.some(question => !saved.answers[question.id]);
    if (unanswered) {
      setValidationMessage('Choose an answer for every diagnosis check first.');
      return;
    }
    const correct = challenge.validationQuestions.every(question => saved.answers[question.id] === question.correctOptionId);
    if (!correct) {
      setValidationMessage('The diagnosis is not complete yet. Re-check the evidence and your notebook.');
      return;
    }
    updateSaved({ completed: true, solutionRevealed: false, score: projectedScore });
    setValidationMessage('Diagnosis validated. The incident resolution is now available.');
  };

  const revealSolution = () => {
    updateSaved({ completed: true, solutionRevealed: true, score: 0 });
    setConfirmReveal(false);
    setValidationMessage('Solution revealed. This attempt is recorded as assisted.');
  };

  const copyReport = async () => {
    const report = buildRcaReport(challenge, saved);
    try {
      await navigator.clipboard.writeText(report);
      setCopyMessage('RCA copied');
    } catch {
      setCopyMessage('Clipboard unavailable');
    }
  };

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-black text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to incidents
      </button>

      <section className="rounded-3xl border border-amber-900/60 bg-slate-900/80 p-6 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
              <span className="rounded-lg bg-amber-950 px-2.5 py-1 text-amber-300">{challenge.category}</span>
              <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-slate-400">{challenge.difficulty}</span>
            </div>
            <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">{challenge.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{challenge.scenario}</p>
          </div>
          <div className={`rounded-2xl border px-5 py-3 text-center ${saved.completed ? 'border-emerald-800 bg-emerald-950/40' : 'border-slate-700 bg-slate-950/60'}`}>
            <p className={`text-2xl font-black ${saved.completed ? 'text-emerald-400' : 'text-white'}`}>{saved.completed ? saved.score : projectedScore}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{saved.completed ? 'Final score' : 'Available score'}</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-cyan-900/60 bg-cyan-950/20 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Your task</p>
          <p className="mt-2 text-sm leading-6 text-cyan-100">{challenge.task}</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3"><Search className="h-5 w-5 text-indigo-400" /><h2 className="text-lg font-black text-white">Starting evidence</h2></div>
            <div className="mt-4 space-y-4">
              {challenge.evidence.map(item => {
                const pinned = saved.pinnedEvidence.includes(item.id);
                return (
                  <article key={item.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                      <h3 className="text-xs font-black text-slate-200">{item.title}</h3>
                      <button type="button" onClick={() => toggleEvidence(item.id)} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black transition ${pinned ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        {pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}{pinned ? 'Unpin' : 'Pin evidence'}
                      </button>
                    </div>
                    {item.kind === 'code'
                      ? <pre className="overflow-x-auto whitespace-pre-wrap p-4 text-xs leading-6 text-emerald-200">{item.content}</pre>
                      : <p className="p-4 text-xs leading-6 text-slate-300">{item.content}</p>}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-400" /><h2 className="text-lg font-black text-white">Success criteria</h2></div>
            <ul className="mt-4 space-y-3">
              {challenge.successCriteria.map(item => <li key={item} className="flex gap-3 text-xs leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />{item}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-900/50 bg-amber-950/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-amber-400" /><div><h2 className="text-lg font-black text-white">Optional hints</h2><p className="text-[10px] text-slate-500">Each hint reduces the available score by 10.</p></div></div>
              {!saved.completed && saved.revealedHints < challenge.hints.length && (
                <button type="button" onClick={() => updateSaved({ revealedHints: saved.revealedHints + 1 })} className="rounded-xl border border-amber-800 bg-amber-950/60 px-4 py-2 text-xs font-black text-amber-200 transition hover:bg-amber-900/60">Reveal hint {saved.revealedHints + 1}</button>
              )}
            </div>
            {saved.revealedHints > 0 ? <ol className="mt-4 space-y-3">{challenge.hints.slice(0, saved.revealedHints).map((hint, index) => <li key={hint} className="rounded-xl border border-amber-900/50 bg-slate-950/60 p-3 text-xs leading-5 text-amber-100"><strong>Hint {index + 1}:</strong> {hint}</li>)}</ol> : <p className="mt-4 text-xs text-slate-600">No hints used.</p>}
          </section>

          <section className="rounded-2xl border border-purple-900/60 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-purple-400" /><h2 className="text-lg font-black text-white">Validate your diagnosis</h2></div>
            <div className="mt-5 space-y-6">
              {challenge.validationQuestions.map((question, questionIndex) => (
                <fieldset key={question.id} disabled={saved.completed}>
                  <legend className="text-sm font-bold text-slate-200">{questionIndex + 1}. {question.prompt}</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map(option => (
                      <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-xs leading-5 transition ${saved.answers[question.id] === option.id ? 'border-purple-500 bg-purple-950/40 text-white' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-600'}`}>
                        <input type="radio" name={`${challenge.id}-${question.id}`} value={option.id} checked={saved.answers[question.id] === option.id} onChange={() => updateSaved({ answers: { ...saved.answers, [question.id]: option.id } })} className="mt-1" />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                  {saved.completed && <p className="mt-2 text-xs leading-5 text-emerald-300">{question.explanation}</p>}
                </fieldset>
              ))}
            </div>

            {!saved.completed && <button type="button" onClick={validate} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-black text-white transition hover:bg-purple-500"><ShieldCheck className="h-4 w-4" /> Validate diagnosis</button>}
            {validationMessage && <p className={`mt-4 rounded-xl border p-3 text-xs font-bold ${saved.completed ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-amber-800 bg-amber-950/30 text-amber-300'}`}>{validationMessage}</p>}
          </section>

          {saved.completed && (
            <section className="rounded-2xl border border-emerald-800 bg-emerald-950/20 p-5">
              <div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-400" /><h2 className="text-xl font-black text-white">Incident resolution</h2></div>
              <dl className="mt-5 space-y-4 text-xs leading-6">
                <div><dt className="font-black uppercase tracking-wider text-emerald-400">Root cause</dt><dd className="mt-1 text-slate-300">{challenge.solution.rootCause}</dd></div>
                <div><dt className="font-black uppercase tracking-wider text-emerald-400">Fix</dt><dd className="mt-1 text-slate-300">{challenge.solution.fix}</dd></div>
                <div><dt className="font-black uppercase tracking-wider text-emerald-400">Prevention</dt><dd className="mt-1 text-slate-300">{challenge.solution.prevention}</dd></div>
              </dl>
            </section>
          )}

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div>
              {!saved.completed && !confirmReveal && <button type="button" onClick={() => setConfirmReveal(true)} className="text-xs font-bold text-slate-500 transition hover:text-amber-300">I am stuck — end challenge and reveal solution</button>}
              {!saved.completed && confirmReveal && <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-amber-300">This records a score of 0.</span><button type="button" onClick={revealSolution} className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-black text-white">Reveal solution</button><button type="button" onClick={() => setConfirmReveal(false)} className="px-2 text-xs text-slate-400">Cancel</button></div>}
            </div>
            {!confirmReset ? <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-white"><RotateCcw className="h-4 w-4" /> Reset local work</button> : <div className="flex items-center gap-2"><button type="button" onClick={() => { onReset(); setConfirmReset(false); }} className="rounded-lg bg-red-800 px-3 py-1.5 text-xs font-black text-white">Confirm reset</button><button type="button" onClick={() => setConfirmReset(false)} className="text-xs text-slate-400">Cancel</button></div>}
          </section>
        </div>

        <IncidentNotebook challenge={challenge} saved={saved} updateSaved={updateSaved} onCopy={copyReport} copyMessage={copyMessage} />
      </div>
    </div>
  );
};

export const TroubleshootingView = ({ examId, examCode }) => {
  const { isDemoAccount } = useExam();
  const progressStorage = isDemoAccount ? demoProgressStorage : null;
  const challenges = useMemo(() => {
    const available = getTroubleshootingChallengesForExam(examId);
    return isDemoAccount ? limitDemoTroubleshootingChallenges(available) : available;
  }, [examId, isDemoAccount]);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [allProgress, setAllProgress] = useState(() => loadTroubleshootingProgress(progressStorage));
  const selectedChallenge = challenges.find(challenge => challenge.id === selectedChallengeId) || null;

  useEffect(() => {
    saveTroubleshootingProgress(allProgress, progressStorage);
  }, [allProgress, progressStorage]);

  const updateSelected = changes => {
    if (!selectedChallenge) return;
    setAllProgress(current => ({
      ...current,
      [selectedChallenge.id]: {
        ...getProgress(current, selectedChallenge.id),
        ...changes,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const resetSelected = () => {
    if (!selectedChallenge) return;
    setAllProgress(current => {
      const next = { ...current };
      delete next[selectedChallenge.id];
      return next;
    });
  };

  if (!challenges.length) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center"><BookOpen className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-3 text-sm text-slate-400">No troubleshooting challenges are assigned to this exam yet.</p></div>;
  }

  if (selectedChallenge) {
    return <ChallengeRunner challenge={selectedChallenge} saved={getProgress(allProgress, selectedChallenge.id)} updateSaved={updateSelected} onBack={() => setSelectedChallengeId(null)} onReset={resetSelected} />;
  }

  return <ChallengeList challenges={challenges} progress={allProgress} examCode={examCode} onOpen={setSelectedChallengeId} demoAccount={isDemoAccount} />;
};
