import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import { getExamQuestions, getQuestionsByTopic } from '../../services/questionService';
import { 
  Play, 
  Award, 
  Target, 
  Clock, 
  Sliders, 
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Loader2,
  AlertCircle,
  History,
  ExternalLink,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

import {
  prepareExamQuestions,
  prepareFullMockForExam,
  prepareCustomExamQuestions
} from '../../utils/examUtils';

export const ExamSetup = ({ onStartExam, presetConfig, onViewAttempt }) => {
  const { activeExam, supabaseAttempts, loadingAttempts } = useExam();

  const topicsList = activeExam?.topics || activeExam?.domains || [];

  const [mode, setMode] = useState(presetConfig?.mode || 'full'); // 'full' | 'domain' | 'custom'
  const [selectedDomainId, setSelectedDomainId] = useState(presetConfig?.domainId || topicsList[0]?.id || '');
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [enableTimer, setEnableTimer] = useState(true);

  // Custom Exam configuration states
  const [customCountInput, setCustomCountInput] = useState('25');
  const [isAllAvailable, setIsAllAvailable] = useState(false);
  const [customSelectionType, setCustomSelectionType] = useState('balanced'); // 'balanced' | 'random'
  const [customTimerType, setCustomTimerType] = useState('untimed'); // 'timed' | 'untimed'

  // Loaded question banks from Supabase or local fallback
  const [fullExamQuestions, setFullExamQuestions] = useState([]);
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [loadingFull, setLoadingFull] = useState(true);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch full exam questions once when activeExam changes
  useEffect(() => {
    let isMounted = true;

    async function loadFullExam() {
      if (!activeExam) return;
      setLoadingFull(true);
      setError(null);

      try {
        if (activeExam.id === 'aws-saa-c03' || !activeExam.questions) {
          const fetched = await getExamQuestions(activeExam.id);
          if (isMounted) {
            setFullExamQuestions(fetched);
            setLoadingFull(false);
          }
        } else {
          if (isMounted) {
            setFullExamQuestions(activeExam.questions || []);
            setLoadingFull(false);
          }
        }
      } catch (err) {
        console.error('Failed to load full exam questions:', err);
        if (isMounted) {
          setError('Unable to load exam questions. Please try again.');
          setLoadingFull(false);
        }
      }
    }

    loadFullExam();

    return () => {
      isMounted = false;
    };
  }, [activeExam?.id]);

  // 2. Fetch targeted topic questions when mode === 'domain' or selectedDomainId changes
  useEffect(() => {
    let isMounted = true;

    async function loadTopicQuestions() {
      if (!activeExam || mode !== 'domain' || !selectedDomainId) return;
      setLoadingTopic(true);
      setError(null);

      try {
        if (activeExam.id === 'aws-saa-c03' || !activeExam.questions) {
          const fetched = await getQuestionsByTopic(activeExam.id, selectedDomainId);
          if (isMounted) {
            setTopicQuestions(fetched);
            setLoadingTopic(false);
          }
        } else {
          const available = (activeExam.questions || []).filter(q => 
            (q.topicId || q.domainId) === selectedDomainId ||
            (Array.isArray(q.topicIds) && q.topicIds.includes(selectedDomainId))
          );
          if (isMounted) {
            setTopicQuestions(available);
            setLoadingTopic(false);
          }
        }
      } catch (err) {
        console.error('Failed to load targeted topic questions:', err);
        if (isMounted) {
          setError('Unable to load targeted topic questions. Please try again.');
          setLoadingTopic(false);
        }
      }
    }

    if (mode === 'domain') {
      loadTopicQuestions();
    }

    return () => {
      isMounted = false;
    };
  }, [activeExam?.id, mode, selectedDomainId]);

  if (!activeExam) return null;

  const bankTotal = fullExamQuestions.length;

  // Custom Exam Validation
  let customValidationError = null;
  let parsedCustomCount = 0;

  if (mode === 'custom') {
    if (bankTotal === 0 && !loadingFull) {
      customValidationError = 'No questions are available in the question bank.';
    } else if (isAllAvailable) {
      parsedCustomCount = bankTotal;
    } else {
      const valStr = String(customCountInput ?? '').trim();
      if (valStr === '') {
        customValidationError = 'Question count cannot be blank.';
      } else if (valStr.includes('.')) {
        customValidationError = 'Question count must be a whole number (no decimals).';
      } else {
        const num = Number(valStr);
        if (isNaN(num)) {
          customValidationError = 'Please enter a valid number.';
        } else if (num === 0) {
          customValidationError = 'Question count must be greater than 0.';
        } else if (num < 0) {
          customValidationError = 'Question count cannot be negative.';
        } else if (num > bankTotal) {
          customValidationError = `Question count cannot exceed the total available bank questions (${bankTotal}).`;
        } else {
          parsedCustomCount = num;
        }
      }
    }
  }

  // Active question set & loading state depending on mode
  const isLoading = mode === 'domain' ? (loadingFull || loadingTopic) : loadingFull;
  const activeQuestions = mode === 'domain' ? topicQuestions : fullExamQuestions;
  
  let activeQuestionsCount = 0;
  if (mode === 'full') {
    activeQuestionsCount = activeExam.id === 'aws-saa-c03' ? Math.min(65, bankTotal) : bankTotal;
  } else if (mode === 'domain') {
    activeQuestionsCount = topicQuestions.length;
  } else if (mode === 'custom') {
    activeQuestionsCount = customValidationError ? 0 : parsedCustomCount;
  }

  const handleQuickSelect = (value) => {
    if (value === 'all') {
      setIsAllAvailable(true);
      setCustomCountInput(String(bankTotal));
    } else {
      setIsAllAvailable(false);
      setCustomCountInput(String(value));
    }
  };

  const handleStart = () => {
    if (isLoading || error) return;
    if (mode === 'custom' && customValidationError) return;
    if (activeQuestions.length <= 0 && mode !== 'custom') return;

    try {
      if (mode === 'full') {
        const preparedQuestions = prepareFullMockForExam(activeExam.id, fullExamQuestions);
        onStartExam({
          mode: 'full',
          domainId: null,
          instantFeedback,
          enableTimer,
          questionCount: preparedQuestions.length,
          questions: preparedQuestions,
          fullPool: fullExamQuestions
        });
      } else if (mode === 'domain') {
        const preparedQuestions = prepareExamQuestions(topicQuestions);
        onStartExam({
          mode: 'domain',
          domainId: selectedDomainId,
          instantFeedback,
          enableTimer,
          questionCount: preparedQuestions.length,
          questions: preparedQuestions,
          fullPool: topicQuestions
        });
      } else if (mode === 'custom') {
        const selectionTypeParam = isAllAvailable ? 'all' : customSelectionType;
        const countParam = isAllAvailable ? 'all' : parsedCustomCount;

        const result = prepareCustomExamQuestions(fullExamQuestions, {
          count: countParam,
          selectionType: selectionTypeParam
        });

        const timeAllowedSeconds = customTimerType === 'timed'
          ? result.actualQuestionCount * 120
          : 0;

        onStartExam({
          mode: 'custom',
          selectionType: selectionTypeParam,
          timerType: customTimerType,
          requestedQuestionCount: result.requestedQuestionCount,
          actualQuestionCount: result.actualQuestionCount,
          timeAllowedSeconds,
          domainAllocation: result.domainAllocation,
          questionCount: result.questions.length,
          questions: result.questions,
          questionIds: result.questionIds,
          instantFeedback,
          enableTimer: customTimerType === 'timed'
        });
      }
    } catch (err) {
      console.error('Failed to prepare exam questions:', err);
      setError(err.message || 'Unable to prepare exam questions. Please try again.');
    }
  };

  const quickSelectOptions = [10, 25, 50, 65, 100, 'all'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 text-xs font-extrabold">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Practice Test Engine
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">
          Prepare for {activeExam.title}
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Test your service topic mastery with realistic multiple-choice questions, timed conditions, and instant rationale feedback.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Full Mock Exam Card */}
        <div
          onClick={() => setMode('full')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            mode === 'full'
              ? 'bg-indigo-950/50 border-indigo-500 shadow-2xl ring-2 ring-indigo-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              {mode === 'full' && (
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-100">Full Mock Exam</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {activeExam.id === 'aws-saa-c03'
                ? 'Covers all service topics in official weighted proportions. Draws 65 questions from the bank.'
                : `Covers every available topic using all ${bankTotal} questions in this exam bank.`}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1 text-indigo-300 font-extrabold">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> 
              {activeExam.id === 'aws-saa-c03' ? 65 : bankTotal} Questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> {activeExam.timeLimitMinutes || 130} Mins
            </span>
          </div>
        </div>

        {/* Domain / Topic Specific Quiz Card */}
        <div
          onClick={() => setMode('domain')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            mode === 'domain'
              ? 'bg-purple-950/50 border-purple-500 shadow-2xl ring-2 ring-purple-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 mb-4">
                <Target className="w-6 h-6" />
              </div>
              {mode === 'domain' && (
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-100">Targeted Topic Quiz</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Focus purely on a single targeted Service/Topic to address specific weak spots.
            </p>
            
            {/* Topic Dropdown Selector if domain/topic mode active */}
            {mode === 'domain' && (
              <div className="mt-4 pt-2" onClick={(e) => e.stopPropagation()}>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Target Service / Topic:
                </label>
                <select
                  value={selectedDomainId}
                  onChange={(e) => setSelectedDomainId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  {topicsList.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.code || 'Service'}: {topic.title} ({topic.weight || 10}%)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="text-purple-300 font-extrabold">Single Topic</span>
            <span className="text-slate-500">{topicQuestions.length} Questions</span>
          </div>
        </div>

        {/* Custom Exam Card */}
        <div
          onClick={() => setMode('custom')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            mode === 'custom'
              ? 'bg-pink-950/50 border-pink-500 shadow-2xl ring-2 ring-pink-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-pink-600/20 text-pink-400 mb-4">
                <Settings className="w-6 h-6" />
              </div>
              {mode === 'custom' && (
                <CheckCircle2 className="w-5 h-5 text-pink-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-100">Custom Exam</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Choose how many questions you want to study. Select a balanced exam or use fully random questions.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="text-pink-300 font-extrabold">Flexible Size</span>
            <span className="text-slate-500">1 to {bankTotal} Qs</span>
          </div>
        </div>

      </div>

      {/* Custom Exam Controls if mode === 'custom' */}
      {mode === 'custom' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-pink-900/50 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-pink-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Custom Exam Setup
              </h4>
            </div>
            <span className="text-xs font-bold text-pink-400 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-800/60">
              Available questions: {bankTotal}
            </span>
          </div>

          <div className="space-y-6">
            {/* Question Count Section */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Question Count (1 to {bankTotal}):
              </label>
              
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="number"
                  min="1"
                  max={bankTotal}
                  value={customCountInput}
                  disabled={isAllAvailable}
                  onChange={(e) => {
                    setIsAllAvailable(false);
                    setCustomCountInput(e.target.value);
                  }}
                  placeholder="e.g. 50"
                  className={`w-36 p-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm font-bold focus:outline-none focus:border-pink-500 disabled:opacity-50 ${
                    customValidationError ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />

                {/* Quick Select Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {quickSelectOptions.map((opt) => {
                    const isAll = opt === 'all';
                    const numVal = isAll ? bankTotal : opt;
                    const isDisabled = !isAll && numVal > bankTotal;
                    if (isDisabled) return null;

                    const isSelected = isAll ? isAllAvailable : (!isAllAvailable && String(customCountInput) === String(opt));

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleQuickSelect(opt)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                          isSelected
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isAll ? 'All Available' : opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Validation Error Message */}
              {customValidationError && (
                <div className="mt-2 text-xs font-bold text-rose-400 flex items-center gap-1.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{customValidationError}</span>
                </div>
              )}
            </div>

            {/* Toggles Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
              
              {/* Selection Type Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Question Selection Type:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomSelectionType('balanced')}
                    disabled={isAllAvailable}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      isAllAvailable
                        ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
                        : customSelectionType === 'balanced'
                          ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-slate-100 font-extrabold mb-0.5">Balanced</span>
                    <span className="text-[11px] text-slate-400 font-normal">Official domain weighting (30/26/24/20%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomSelectionType('random')}
                    disabled={isAllAvailable}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      isAllAvailable
                        ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
                        : customSelectionType === 'random'
                          ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-slate-100 font-extrabold mb-0.5">Fully Random</span>
                    <span className="text-[11px] text-slate-400 font-normal">Random draw from whole bank</span>
                  </button>
                </div>
              </div>

              {/* Timer Type Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Timer Setting:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomTimerType('untimed')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      customTimerType === 'untimed'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-slate-100 font-extrabold mb-0.5">Untimed</span>
                    <span className="text-[11px] text-slate-400 font-normal">Count elapsed time, no auto-submit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomTimerType('timed')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      customTimerType === 'timed'
                        ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-slate-100 font-extrabold mb-0.5">Timed</span>
                    <span className="text-[11px] text-slate-400 font-normal">2 mins per question countdown</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Configuration Preview Summary */}
            {!customValidationError && parsedCustomCount > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="font-extrabold text-slate-200">Custom Exam Configuration:</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-semibold flex-wrap">
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    Questions: <strong className="text-pink-300">{isAllAvailable ? `${bankTotal} (All Available)` : parsedCustomCount}</strong>
                  </span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    Selection: <strong className="text-indigo-300">{isAllAvailable ? 'All Available' : (customSelectionType === 'balanced' ? 'Balanced' : 'Random')}</strong>
                  </span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    Timer: <strong className="text-emerald-300">{customTimerType === 'timed' ? `Timed (${parsedCustomCount * 2} mins)` : 'Untimed'}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Options & Settings Customizer */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Quiz Execution Settings
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instant Feedback Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-sm font-bold text-slate-200 block">Instant Rationale Feedback</span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Show immediate answer evaluation & detailed explanation after each choice.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={instantFeedback}
                onChange={(e) => setInstantFeedback(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Countdown Timer Toggle (Standard for Full/Domain) */}
          <div className={`flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 ${mode === 'custom' ? 'opacity-50' : ''}`}>
            <div>
              <span className="text-sm font-bold text-slate-200 block">Timer Display</span>
              <span className="text-xs text-slate-400 block mt-0.5">
                {mode === 'custom' ? 'Timer setting is controlled under Custom Exam Setup.' : 'Display live countdown timer with pace warnings.'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                disabled={mode === 'custom'}
                checked={mode === 'custom' ? customTimerType === 'timed' : enableTimer}
                onChange={(e) => setEnableTimer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

        </div>
      </div>

      {/* Loading & Error State or Launch CTA Button */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">Loading questions...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-bold text-rose-200">{error}</p>
          <button
            onClick={() => {
              setLoadingFull(true);
              setLoadingTopic(true);
              setError(null);
            }}
            className="px-4 py-2 text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-100 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={activeQuestionsCount <= 0 || (mode === 'custom' && !!customValidationError)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-transform hover:scale-105 mx-auto disabled:opacity-50 disabled:pointer-events-none"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>
              {mode === 'custom' 
                ? `Start Custom Exam (${activeQuestionsCount} Questions)`
                : `Start Practice Exam (${activeQuestionsCount} Questions)`
              }
            </span>
          </button>
        </div>
      )}

      {/* Exam History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Exam History</h3>
          {loadingAttempts && (
            <Loader2 className="w-4 h-4 text-slate-500 animate-spin ml-auto" />
          )}
        </div>

        {!loadingAttempts && supabaseAttempts.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs font-semibold bg-slate-900/40 rounded-2xl border border-slate-800">
            No completed exam attempts yet. Start a practice exam to see your history here.
          </div>
        )}

        {supabaseAttempts.length > 0 && (
          <div className="space-y-3">
            {supabaseAttempts.map((attempt) => {
              const completedDate = new Date(attempt.completed_at);
              const dateStr = completedDate.toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
              });
              const timeStr = completedDate.toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit'
              });

              const timeUsedHours = Math.floor(attempt.time_used_seconds / 3600);
              const timeUsedMins = Math.floor((attempt.time_used_seconds % 3600) / 60);
              const timeUsedStr = timeUsedHours > 0
                ? `${timeUsedHours}h ${timeUsedMins}m`
                : `${timeUsedMins}m`;

              const modeLabel = attempt.exam_mode === 'full' 
                ? 'Full Mock Exam' 
                : (attempt.exam_mode === 'custom' ? 'Custom Exam' : 'Targeted Topic Quiz');
              const hasSnapshot = Array.isArray(attempt.question_snapshot) && attempt.question_snapshot.length > 0;

              return (
                <div
                  key={attempt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Score Badge */}
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                      attempt.passed
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-700 text-rose-300'
                    }`}>
                      <span className="text-lg font-black leading-none">{attempt.score_percent}%</span>
                      {attempt.passed
                        ? <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-400" />
                        : <XCircle className="w-3.5 h-3.5 mt-0.5 text-rose-400" />
                      }
                    </div>

                    {/* Attempt Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-100">{modeLabel}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          attempt.passed
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {attempt.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>{dateStr} at {timeStr}</span>
                        <span>•</span>
                        <span>{attempt.correct_count}/{attempt.total_questions} correct</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeUsedStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {hasSnapshot && onViewAttempt ? (
                      <button
                        onClick={() => onViewAttempt(attempt)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-indigo-600/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Results
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 text-[11px] font-semibold">
                        Summary only
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
