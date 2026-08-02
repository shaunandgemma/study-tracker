import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useExam } from '../../context/ExamContext';
import { SAA_C03_DOMAINS, getDomainForQuestion } from '../../data/saaC03DomainMapping';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Zap, 
  Sparkles,
  Clock,
  Check,
  X,
  Download,
  FileText,
  Loader2
} from 'lucide-react';
import { buildCompleteAttemptObject, generateAttemptPDF, exportAttemptJSON } from '../../utils/exportUtils';
import ExplanationViewer from './ExplanationViewer';

export const ExamResults = ({ attemptResult, onRetake, onChangeMode, isReadOnly = false, saveError = false }) => {
  const { activeExam, jumpToTopicChecklist, flagged } = useExam();
  const [activeTab, setActiveTab] = useState('diagnostic'); // 'diagnostic' | 'review'
  const [filterReview, setFilterReview] = useState('all'); // 'all' | 'incorrect' | 'correct'
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [jsonError, setJsonError] = useState(null);

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    try {
      const fullAttempt = buildCompleteAttemptObject(attemptResult, activeExam, flagged);
      generateAttemptPDF(fullAttempt, activeExam);
    } catch (err) {
      console.error('[ExamResults] PDF export error:', err);
      setPdfError('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExportJSON = () => {
    setJsonError(null);
    try {
      const fullAttempt = buildCompleteAttemptObject(attemptResult, activeExam, flagged);
      exportAttemptJSON(fullAttempt);
    } catch (err) {
      console.error('[ExamResults] JSON export error:', err);
      setJsonError('Failed to export JSON file.');
    }
  };

  const { config, userAnswers, durationSeconds } = attemptResult;
  const questions = config.questions;

  const topicsList = activeExam.topics || activeExam.domains || [];

  // Calculate overall score, domain breakdown & topic performance breakdown
  let correctCount = 0;
  const topicStats = {}; // { [topicId]: { total: 0, correct: 0 } }
  const domainStats = {}; // { [domainId]: { total: 0, correct: 0 } }

  SAA_C03_DOMAINS.forEach(d => {
    domainStats[d.id] = { id: d.id, code: d.code, title: d.title, weight: d.weight, total: 0, correct: 0 };
  });

  // Initialize topic stats
  topicsList.forEach(t => {
    topicStats[t.id] = { id: t.id, code: t.code, title: t.title, total: 0, correct: 0 };
  });

  questions.forEach(q => {
    const topicId = q.topicId || q.domainId;
    if (!topicStats[topicId]) {
      topicStats[topicId] = { id: topicId, code: 'Service', title: 'General Service', total: 0, correct: 0 };
    }

    const dom = getDomainForQuestion(q);
    if (!domainStats[dom.id]) {
      domainStats[dom.id] = { id: dom.id, code: dom.code, title: dom.title, weight: dom.weight, total: 0, correct: 0 };
    }
    
    topicStats[topicId].total += 1;
    domainStats[dom.id].total += 1;

    const correctAnswers = q.correctAnswers || (typeof q.correctAnswer === 'number' ? [q.correctAnswer] : [0]);
    const userAns = userAnswers[q.id];
    const selectedArr = Array.isArray(userAns) ? userAns : (typeof userAns === 'number' ? [userAns] : []);
    const isAnswered = selectedArr.length > 0;
    
    if (isAnswered) {
      const selectedSorted = [...selectedArr].sort((a, b) => a - b);
      const correctSorted = [...correctAnswers].sort((a, b) => a - b);
      const isCorrect = selectedSorted.length === correctSorted.length && selectedSorted.every((val, idx) => val === correctSorted[idx]);
      
      if (isCorrect) {
        correctCount += 1;
        topicStats[topicId].correct += 1;
        domainStats[dom.id].correct += 1;
      }
    }
  });

  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercentage >= activeExam.passingScore;

  // Fire celebratory confetti if passed!
  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [passed]);

  const formatTimeUsed = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    if (mins > 0) {
      return `${mins}m ${remainingSecs}s`;
    }
    return `${remainingSecs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">

      {/* Save Error Warning Banner */}
      {saveError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-950/60 border border-amber-700/80 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-amber-300 block">Result not saved to history</span>
            <span className="text-amber-400/80 mt-0.5 block">
              Unable to save this attempt to Supabase. Your score is shown correctly for this session, but it will not appear in Exam History after you leave. Check your connection and try again.
            </span>
          </div>
        </div>
      )}

      {/* Read-Only Review Banner */}
      {isReadOnly && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Historical Review</span>
          <span className="text-slate-500">— Read-only. Answers and question order are preserved exactly as they appeared during the original attempt.</span>
        </div>
      )}

      {/* Export Errors */}
      {(pdfError || jsonError) && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{pdfError || jsonError}</span>
          </div>
          <button
            onClick={() => { setPdfError(null); setJsonError(null); }}
            className="text-rose-400 hover:text-rose-200 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Score Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl ${
        passed 
          ? 'bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-emerald-500/50' 
          : 'bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border-rose-500/50'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border">
              {passed ? (
                <span className="bg-emerald-950 text-emerald-300 border-emerald-800 flex items-center gap-1.5 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED EXAM
                </span>
              ) : (
                <span className="bg-rose-950 text-rose-300 border-rose-800 flex items-center gap-1.5 px-2 py-0.5 rounded-full">
                  <XCircle className="w-3.5 h-3.5" /> NEEDS REVIEW
                </span>
              )}
              <span className="text-slate-400">Passing Threshold: {activeExam.passingScore}%</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-100">
              {passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-sm text-slate-300 max-w-lg">
              {passed 
                ? `Great job! You achieved ${scorePercentage}% on the ${activeExam.code} practice test, surpassing the target threshold.` 
                : `You scored ${scorePercentage}%. Review your weak service topic areas below to boost your readiness score.`}
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-slate-400 justify-center sm:justify-start flex-wrap">
              <span>{correctCount} of {totalQuestions} Correct</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Time Used: <strong className="text-slate-200">{formatTimeUsed(durationSeconds)}</strong>
              </span>
              {config.mode === 'full' && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">Time Allowed: <strong className="text-slate-300">2h 10m</strong></span>
                </>
              )}
              {config.mode === 'custom' && (config.timeAllowedSeconds > 0 || config.timerType === 'timed') && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">Time Allowed: <strong className="text-slate-300">{formatTimeUsed(config.timeAllowedSeconds || (totalQuestions * 120))}</strong></span>
                </>
              )}
            </div>

            {config.mode === 'custom' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-pink-400 font-extrabold">Custom Exam:</span>
                  <span>Requested: <strong>{config.requestedQuestionCount || totalQuestions}</strong></span>
                  <span>•</span>
                  <span>Actual: <strong>{totalQuestions} Questions</strong></span>
                  <span>•</span>
                  <span>Selection: <strong>{config.selectionType === 'all' ? 'All Available' : (config.selectionType === 'random' ? 'Random' : 'Balanced')}</strong></span>
                  <span>•</span>
                  <span>Timer: <strong>{config.timerType === 'timed' || (config.timeAllowedSeconds > 0) ? 'Timed' : 'Untimed'}</strong></span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3 flex-wrap border-t border-slate-800/60 mt-1">
                  <span className="font-bold text-slate-300">Actual Domain Allocation:</span>
                  {SAA_C03_DOMAINS.map(d => (
                    <span key={d.id}>
                      {d.code}: <strong className="text-indigo-300">{domainStats[d.id]?.total || 0}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Large Gauge Widget */}
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-w-[180px] shrink-0 text-center shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Final Score
            </span>
            <div className={`text-5xl font-black my-2 ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {scorePercentage}%
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              Target: {activeExam.passingScore}%
            </span>
          </div>

        </div>
      </div>

      {/* Tabs View Switcher & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'diagnostic'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" /> Service / Topic Diagnostic Breakdown
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'review'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Full Question Review ({questions.length})
          </button>
        </div>

        {/* Quick Export Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-indigo-950/40 disabled:opacity-50"
            title="Export full exam results report as PDF"
          >
            {isGeneratingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Download className="w-3.5 h-3.5 text-indigo-400" />}
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md"
            title="Export machine-readable JSON backup"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Diagnostic Breakdown & Weak Area Actions */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6">

          {/* AWS SAA-C03 Domain Performance Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                AWS SAA-C03 Domain Performance Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Performance scored across the four official AWS Solutions Architect Associate exam domains.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAA_C03_DOMAINS.map(d => {
                const stat = domainStats[d.id] || { total: 0, correct: 0 };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                const isWeak = pct < activeExam.passingScore;

                return (
                  <div key={d.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-indigo-300 block">
                          {d.title}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 block mt-1">
                          {stat.correct} / {stat.total} questions correct
                        </span>
                      </div>
                      <span className={`text-xl font-black ${isWeak ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWeak ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Topic Performance Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Service Topic Performance Analysis</h3>
              <p className="text-xs text-slate-400 mt-1">
                Directly jump to study checklist items for weak service areas to strengthen your domain knowledge.
              </p>
            </div>

            <div className="space-y-5">
              {Object.values(topicStats).filter(t => t.total > 0).map(topic => {
                const topicScore = Math.round((topic.correct / topic.total) * 100);
                const isWeak = topicScore < activeExam.passingScore;

                return (
                  <div key={topic.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {topic.code || 'Service'}
                          </span>
                          <span className="text-sm font-bold text-slate-100">
                            {topic.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          {topic.correct} of {topic.total} questions answered correctly
                        </span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`text-base font-extrabold ${isWeak ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {topicScore}%
                        </span>
                        
                        {/* Jump to Checklist Button for Weak Topic */}
                        <button
                          onClick={() => jumpToTopicChecklist(topic.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isWeak
                              ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 hover:scale-105 shadow-md shadow-rose-950/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                          title="Jump to Study Checklist for this topic"
                        >
                          <span>Review {topic.title} Checklist</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWeak ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${topicScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed Question Review */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setFilterReview('all')}
                className={`px-3 py-1.5 rounded-lg ${filterReview === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilterReview('incorrect')}
                className={`px-3 py-1.5 rounded-lg ${filterReview === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
              >
                Incorrect ({totalQuestions - correctCount})
              </button>
              <button
                onClick={() => setFilterReview('correct')}
                className={`px-3 py-1.5 rounded-lg ${filterReview === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const correctAnswers = q.correctAnswers || (typeof q.correctAnswer === 'number' ? [q.correctAnswer] : [0]);
              const userAns = userAnswers[q.id];
              const selectedArr = Array.isArray(userAns) ? userAns : (typeof userAns === 'number' ? [userAns] : []);
              const isAnswered = selectedArr.length > 0;
              
              let isCorrect = false;
              if (isAnswered) {
                const selectedSorted = [...selectedArr].sort((a, b) => a - b);
                const correctSorted = [...correctAnswers].sort((a, b) => a - b);
                isCorrect = selectedSorted.length === correctSorted.length && selectedSorted.every((val, idx) => val === correctSorted[idx]);
              }

              if (filterReview === 'incorrect' && isCorrect) return null;
              if (filterReview === 'correct' && !isCorrect) return null;

              const userSelectedLetters = [...selectedArr].sort((a, b) => a - b).map(idx => String.fromCharCode(65 + idx)).join(', ');
              const correctLetters = [...correctAnswers].sort((a, b) => a - b).map(idx => String.fromCharCode(65 + idx)).join(', ');

              return (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  
                  {/* Question Header & Correctness Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400">Question {qIdx + 1}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-100">
                    {q.question}
                  </h4>

                  {/* Explicit User Selections vs Correct Answers Summary */}
                  <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-bold">Your Choice:</span>
                      <span className={isCorrect ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>
                        {userSelectedLetters || 'None selected'}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-bold">Correct Answer(s):</span>
                      <span className="text-emerald-400 font-extrabold">{correctLetters}</span>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserSelected = selectedArr.includes(optIdx);
                      const isCorrectOption = correctAnswers.includes(optIdx);

                      let style = 'bg-slate-950/60 border-slate-800/80 text-slate-400';
                      let badge = null;

                      if (isCorrectOption && isUserSelected) {
                        style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-950/30';
                        badge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-900/80 text-emerald-200 border border-emerald-700 ml-auto shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-300" /> Correct Choice
                          </span>
                        );
                      } else if (isCorrectOption && !isUserSelected) {
                        style = 'bg-emerald-950/40 border-emerald-600/80 text-emerald-300 font-semibold';
                        badge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 ml-auto shrink-0">
                            ★ Correct Answer
                          </span>
                        );
                      } else if (isUserSelected && !isCorrectOption) {
                        style = 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold shadow-md shadow-rose-950/30';
                        badge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-900/80 text-rose-200 border border-rose-700 ml-auto shrink-0 flex items-center gap-1">
                            <X className="w-3 h-3 text-rose-300" /> Your Incorrect Selection
                          </span>
                        );
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${style}`}>
                          <div className="flex items-start gap-3">
                            <span className="font-bold shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rationale Explanation */}
                  <ExplanationViewer explanation={q.explanation} optionMapping={q.optionMapping} />

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-900">
        {!isReadOnly && (
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" /> Retake Practice Exam
          </button>
        )}

        {/* Primary Export Results CTA */}
        <button
          onClick={handleExportPDF}
          disabled={isGeneratingPDF}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
        >
          {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export Results (PDF)</span>
        </button>

        <button
          onClick={handleExportJSON}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Export JSON</span>
        </button>

        <button
          onClick={onChangeMode}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-colors"
        >
          {isReadOnly ? 'Back to Exam History' : 'Configure New Quiz Setup'}
        </button>
      </div>

    </div>
  );
};
