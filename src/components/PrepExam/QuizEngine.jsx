import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import { QuestionGrid } from './QuestionGrid';
import { 
  Flag, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Send,
  CheckSquare,
  LogOut,
  AlertOctagon
} from 'lucide-react';

export const QuizEngine = ({ config, onFinishExam, onCancelExam }) => {
  const { activeExam, flagged, toggleFlag, activeExamId } = useExam();
  
  const questions = config.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: number[] }
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  // Timer state
  const isTimedMode = config.mode === 'full' || (config.mode === 'custom' && config.timerType === 'timed');
  const initialAllowedSeconds = config.timeAllowedSeconds || (config.mode === 'full' ? 130 * 60 : 0);

  const [secondsRemaining, setSecondsRemaining] = useState(initialAllowedSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const handleCompleteSubmit = (isAutoSubmit = false) => {
    const finalDurationSeconds = isTimedMode
      ? (isAutoSubmit ? initialAllowedSeconds : Math.max(0, initialAllowedSeconds - secondsRemaining))
      : secondsElapsed;

    onFinishExam({
      config,
      userAnswers,
      durationSeconds: finalDurationSeconds,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    let timer;
    if (config.enableTimer || config.mode === 'custom') {
      timer = setInterval(() => {
        if (isTimedMode) {
          setSecondsRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              handleCompleteSubmit(true);
              return 0;
            }
            return prev - 1;
          });
        }
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [config.enableTimer, isTimedMode]);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const topicsList = activeExam?.topics || activeExam?.domains || [];
  const currentDomain = topicsList.find(d => d.id === (currentQuestion.topicId || currentQuestion.domainId));
  
  const correctAnswers = currentQuestion.correctAnswers || (typeof currentQuestion.correctAnswer === 'number' ? [currentQuestion.correctAnswer] : [0]);
  const isMultiSelect = currentQuestion.type === 'multiple' || correctAnswers.length > 1;
  const requiredCount = isMultiSelect ? correctAnswers.length : 1;

  let selectInstructionText = 'Select ONE.';
  if (isMultiSelect) {
    selectInstructionText = requiredCount === 3 ? 'Select THREE.' : 'Select TWO.';
  }

  const isCurrentFlagged = !!flagged[activeExamId]?.[currentQuestion.id];
  const currentAnswer = userAnswers[currentQuestion.id];
  const selectedArr = Array.isArray(currentAnswer) ? currentAnswer : (typeof currentAnswer === 'number' ? [currentAnswer] : []);

  // Selection Handler
  const handleSelectOption = (optIndex) => {
    if (isMultiSelect) {
      if (selectedArr.includes(optIndex)) {
        // Deselect option
        const updated = selectedArr.filter(i => i !== optIndex);
        setUserAnswers({ ...userAnswers, [currentQuestion.id]: updated });
      } else {
        // Select option if under required limit
        if (selectedArr.length < requiredCount) {
          const updated = [...selectedArr, optIndex];
          setUserAnswers({ ...userAnswers, [currentQuestion.id]: updated });
        }
      }
    } else {
      // Single selection
      setUserAnswers({ ...userAnswers, [currentQuestion.id]: [optIndex] });
    }
  };

  // Check correctness for Instant Feedback
  const isCurrentQuestionAnswered = selectedArr.length > 0;
  const isCurrentSelectionValid = selectedArr.length === requiredCount;

  let isCorrect = false;
  if (isCurrentSelectionValid) {
    const selectedSorted = [...selectedArr].sort((a, b) => a - b);
    const correctSorted = [...correctAnswers].sort((a, b) => a - b);
    isCorrect = selectedSorted.length === correctSorted.length && selectedSorted.every((val, idx) => val === correctSorted[idx]);
  }

  // Calculate overall answered count (valid complete answers)
  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    const q = questions.find(qItem => qItem.id === k);
    const req = q ? (q.type === 'multiple' || (q.correctAnswers && q.correctAnswers.length > 1) ? (q.correctAnswers?.length || 2) : 1) : 1;
    const arr = Array.isArray(val) ? val : (typeof val === 'number' ? [val] : []);
    return arr.length === req;
  }).length;

  const unansweredCount = questions.length - answeredCount;
  const currentExamFlags = flagged[activeExamId] || {};
  const flaggedCount = questions.filter(q => !!currentExamFlags[q.id]).length;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };



  // Format Countdown Timer text (HH:MM:SS)
  const formatTimeRemaining = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format Elapsed Timer text (MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer appearance styles based on remaining time
  let timerStyle = "bg-slate-950 border-slate-800 text-slate-300";
  if (isTimedMode) {
    if (secondsRemaining <= 300) {
      timerStyle = "bg-rose-950/90 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 animate-pulse font-extrabold shadow-lg shadow-rose-950/50";
    } else if (secondsRemaining <= 900) {
      timerStyle = "bg-amber-950/90 border-amber-500/80 text-amber-300 animate-pulse font-extrabold shadow-md shadow-amber-950/40";
    }
  }

  const showTimerWidget = config.enableTimer || config.mode === 'custom';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Controls & Navigation Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        
        {/* Question Counter & Domain Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGridOpen(true)}
            className="p-2 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Open Question Grid"
          >
            <Grid className="w-4 h-4" />
            <span>Grid</span>
          </button>
          
          <div>
            <span className="text-xs font-extrabold text-indigo-400 block">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-[11px] text-slate-400 block truncate max-w-[200px] sm:max-w-xs">
              {currentDomain ? `${currentDomain.code}: ${currentDomain.title}` : 'General Domain'}
            </span>
          </div>
        </div>

        {/* Center Timer */}
        {showTimerWidget && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${timerStyle}`}>
            <Clock className={`w-4 h-4 ${
              isTimedMode && secondsRemaining <= 300 ? 'text-rose-400 animate-spin-slow' :
              isTimedMode && secondsRemaining <= 900 ? 'text-amber-400 animate-spin-slow' :
              'text-purple-400 animate-spin-slow'
            }`} />
            <span>{isTimedMode ? formatTimeRemaining(secondsRemaining) : formatTime(secondsElapsed)}</span>
          </div>
        )}

        {/* Action Buttons: Flag & Quit */}
        <div className="flex items-center gap-2">
          {/* Flag Question Button */}
          <button
            onClick={() => toggleFlag(activeExamId, currentQuestion.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCurrentFlagged
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isCurrentFlagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>

          {/* Quit Exam Button */}
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 text-rose-400 border border-slate-800 hover:bg-rose-950/60 hover:border-rose-800/80 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Quit Exam"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Quit Exam</span>
          </button>
        </div>

      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentDomain?.code || 'Domain'}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
              currentQuestion.difficulty === 'Hard' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              currentQuestion.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {currentQuestion.difficulty || 'Medium'}
            </span>
          </div>
          
          <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/80 tracking-wide uppercase">
            {selectInstructionText}
          </span>
        </div>

        {/* Question Prompt Text */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-100 leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options List dynamically rendering A through F */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedArr.includes(optIdx);
            const isCorrectOption = correctAnswers.includes(optIdx);

            let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-indigo-600/60';
            
            if (config.instantFeedback && isCurrentSelectionValid) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 font-semibold shadow-lg shadow-emerald-950/40';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-100 font-semibold shadow-lg shadow-rose-950/40';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-950/80 border-indigo-500 text-indigo-100 font-semibold shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500';
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${optionStyle}`}
              >
                <div className="mt-0.5 shrink-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}>
                    {isMultiSelect ? (
                      isSelected ? <CheckSquare className="w-3.5 h-3.5 text-white" /> : String.fromCharCode(65 + optIdx)
                    ) : (
                      String.fromCharCode(65 + optIdx)
                    )}
                  </div>
                </div>
                
                <span className="text-xs sm:text-sm leading-relaxed font-medium">
                  {option}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selection Status Prompt */}
        {!isCurrentSelectionValid && (
          <p className="text-xs text-amber-400/90 font-semibold italic text-right">
            Please select {requiredCount - selectedArr.length} more option(s) ({selectedArr.length}/{requiredCount} selected)
          </p>
        )}

        {/* Instant Rationale Feedback Card */}
        {config.instantFeedback && isCurrentSelectionValid && (
          <div className={`p-5 rounded-2xl border animate-fadeIn ${
            isCorrect 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
              : 'bg-rose-950/40 border-rose-800 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-extrabold text-emerald-400">Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-sm font-extrabold text-rose-400">Incorrect Choice</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mt-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <strong className="text-indigo-400 block mb-1">Explanation Rationale:</strong>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Navigation & Submit Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-xs font-semibold text-slate-400">
          {answeredCount} of {questions.length} answered
        </span>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            Submit Exam <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Grid Modal */}
      <QuestionGrid
        isOpen={isGridOpen}
        onClose={() => setIsGridOpen(false)}
        questions={questions}
        answers={userAnswers}
        flaggedMap={flagged[activeExamId] || {}}
        currentIndex={currentIndex}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
      />

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-100">Submit exam?</h3>
              <div className="mt-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-2 text-left">
                <p className="font-bold text-slate-200 mb-1">You have:</p>
                <div className="flex items-center justify-between">
                  <span>• Unanswered questions:</span>
                  <span className={`font-extrabold ${unansweredCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {unansweredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Flagged for review:</span>
                  <span className={`font-extrabold ${flaggedCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {flaggedCount}
                  </span>
                </div>
              </div>
              {(unansweredCount > 0 || flaggedCount > 0) && (
                <p className="text-xs text-amber-400/90 mt-3 font-semibold">
                  Submit anyway?
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="w-1/2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleCompleteSubmit(false);
                }}
                className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-100">Quit exam?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your current exam progress will be lost.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="w-1/2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  onCancelExam();
                }}
                className="w-1/2 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 transition-transform hover:scale-105"
              >
                Quit Exam
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
