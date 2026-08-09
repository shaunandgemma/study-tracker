import React, { useEffect, useState } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { AuthProvider } from './features/auth/AuthContext';
import { AuthorEntry } from './features/followAlongAuthor/AuthorEntry.jsx';
import { isAuthorEntryRequested } from './features/followAlongAuthor/authorAccess.js';
import { AwsConnectionProvider } from './features/awsConnection/AwsConnectionContext';
import { useAwsConnection } from './features/awsConnection/useAwsConnection.js';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ChecklistView } from './components/StudyChecklist/ChecklistView';
import { ExamSetup } from './components/PrepExam/ExamSetup';
import { QuizEngine } from './components/PrepExam/QuizEngine';
import { ExamResults } from './components/PrepExam/ExamResults';
import { AwsSetupGuide } from './features/awsConnection/AwsSetupGuide.jsx';
import { VpcLearningPathView } from './components/VpcLearningPath/VpcLearningPathView';
import { FollowAlongsView } from './components/FollowAlongs/FollowAlongsView';
import { AddExamModal } from './components/Modals/AddExamModal';
import { ImportExportModal } from './components/Modals/ImportExportModal';
import { AuthModal } from './components/Modals/AuthModal';

import {
  prepareExamQuestions,
  prepareFullMockQuestions,
  prepareCustomExamQuestions
} from './utils/examUtils';
import { saveAttemptToSupabase, QUESTION_BANK_VERSION } from './services/attemptService';
import { getDomainForQuestion } from './data/saaC03DomainMapping';

const MainContent = () => {
  const { viewMode, setViewMode, activeExam, activeExamId, recordExamResult, clearFlags, flagged, addSupabaseAttempt, legacyAutoOpenProgrammeId } = useExam();
  const { isSetupOpen, closeSetup } = useAwsConnection();

  // Main navigation remains usable while the shared AWS setup screen is open.
  useEffect(() => {
    closeSetup();
  }, [viewMode, closeSetup]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Prep Exam workflow state
  const [prepState, setPrepState] = useState('setup'); // 'setup' | 'quiz' | 'results'
  const [presetConfig, setPresetConfig] = useState(null);
  const [activeQuizConfig, setActiveQuizConfig] = useState(null);
  const [activeAttemptResult, setActiveAttemptResult] = useState(null);
  // When viewing a historical attempt: read-only mode
  const [isReadOnly, setIsReadOnly] = useState(false);
  // Whether the Supabase save failed for the current attempt
  const [attemptSaveError, setAttemptSaveError] = useState(false);

  // Handler when user triggers prep exam from Checklist mode
  const handleLaunchPrepExam = (preset) => {
    setViewMode('prep-exam');
    setPresetConfig(preset || null);
    setPrepState('setup');
    setIsReadOnly(false);
    setAttemptSaveError(false);
  };

  // Handler when user clicks Start Exam on Setup screen
  const handleStartExam = (config) => {
    clearFlags(activeExamId);
    setActiveQuizConfig(config);
    setIsReadOnly(false);
    setAttemptSaveError(false);
    setPrepState('quiz');
  };

  // Handler when user clicks Retake Exam on Results screen
  const handleRetakeExam = () => {
    if (activeQuizConfig && (activeQuizConfig.fullPool || activeQuizConfig.questions)) {
      try {
        const pool = activeQuizConfig.fullPool || activeQuizConfig.questions;
        let preparedQuestions = [];
        if (activeQuizConfig.mode === 'full') {
          preparedQuestions = prepareFullMockQuestions(pool);
        } else if (activeQuizConfig.mode === 'custom' && activeQuizConfig.fullPool) {
          const res = prepareCustomExamQuestions(activeQuizConfig.fullPool, {
            count: activeQuizConfig.requestedQuestionCount || activeQuizConfig.questions.length,
            selectionType: activeQuizConfig.selectionType
          });
          preparedQuestions = res.questions;
        } else {
          preparedQuestions = prepareExamQuestions(pool);
        }

        setActiveQuizConfig({
          ...activeQuizConfig,
          questionCount: preparedQuestions.length,
          questions: preparedQuestions
        });
      } catch (err) {
        console.error('Failed to prepare retake questions:', err);
        window.alert(err.message || 'Unable to prepare retake questions.');
        return;
      }
    }
    clearFlags(activeExamId);
    setIsReadOnly(false);
    setAttemptSaveError(false);
    setPrepState('quiz');
  };

  // Handler when user opens a historical attempt for read-only review
  const handleViewHistoricalAttempt = (savedAttempt) => {
    // Reconstruct attemptResult from the saved Supabase row
    const reconstructedResult = {
      config: {
        mode: savedAttempt.exam_mode,
        selectionType: savedAttempt.selection_type || (savedAttempt.exam_mode === 'custom' ? 'balanced' : null),
        timerType: savedAttempt.timer_type || (savedAttempt.time_allowed_seconds > 0 ? 'timed' : 'untimed'),
        requestedQuestionCount: savedAttempt.requested_question_count || savedAttempt.total_questions,
        actualQuestionCount: savedAttempt.actual_question_count || savedAttempt.total_questions,
        timeAllowedSeconds: savedAttempt.time_allowed_seconds,
        domainAllocation: savedAttempt.domain_allocation || null,
        domainId: savedAttempt.topic_id || null,
        questions: savedAttempt.question_snapshot,  // exact shuffled questions as presented
        instantFeedback: false,
        enableTimer: false
      },
      userAnswers: savedAttempt.answers,
      durationSeconds: savedAttempt.time_used_seconds,
      timestamp: savedAttempt.completed_at
    };

    // Store the original config for retake — use fullPool if available, else snapshot
    setActiveQuizConfig(prev => ({
      ...(prev || {}),
      mode: savedAttempt.exam_mode,
      selectionType: savedAttempt.selection_type || null,
      timerType: savedAttempt.timer_type || null,
      requestedQuestionCount: savedAttempt.requested_question_count || savedAttempt.total_questions,
      actualQuestionCount: savedAttempt.actual_question_count || savedAttempt.total_questions,
      timeAllowedSeconds: savedAttempt.time_allowed_seconds,
      domainAllocation: savedAttempt.domain_allocation || null,
      domainId: savedAttempt.topic_id || null,
      instantFeedback: true,
      enableTimer: savedAttempt.time_allowed_seconds > 0,
      fullPool: null,
      questions: savedAttempt.question_snapshot
    }));

    setActiveAttemptResult(reconstructedResult);
    setIsReadOnly(true);
    setAttemptSaveError(false);
    setPrepState('results');
  };

  // Handler when user submits exam in QuizEngine
  const handleFinishExam = async (result) => {
    setActiveAttemptResult(result);
    setIsReadOnly(false);

    const questions = result.config.questions;
    const total = questions.length;
    let correct = 0;

    // Calculate score and domain breakdown
    const domainResults = {};
    questions.forEach(q => {
      const userAns = result.userAnswers[q.id];
      const isAnswered = userAns !== undefined && userAns !== null && (Array.isArray(userAns) ? userAns.length > 0 : true);

      // Domain stats
      const dom = getDomainForQuestion(q);
      if (!domainResults[dom.id]) {
        domainResults[dom.id] = { correct: 0, total: 0 };
      }
      domainResults[dom.id].total += 1;

      if (isAnswered) {
        const selectedSorted = [...(Array.isArray(userAns) ? userAns : [userAns])].sort((a, b) => a - b);
        const correctSorted = [...q.correctAnswers].sort((a, b) => a - b);
        if (selectedSorted.length === correctSorted.length && selectedSorted.every((v, i) => v === correctSorted[i])) {
          correct += 1;
          domainResults[dom.id].correct += 1;
        }
      }
    });

    const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = scorePercentage >= activeExam.passingScore;
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const rawMode = result.config.mode;
    const examMode = rawMode === 'full' ? 'full' : (rawMode === 'custom' ? 'custom' : 'targeted');
    const isFullMode = examMode === 'full';
    const timeAllowed = result.config.timeAllowedSeconds !== undefined
      ? result.config.timeAllowedSeconds
      : (isFullMode ? 130 * 60 : 0);

    const topicId = examMode === 'targeted' ? (result.config.domainId || null) : null;

    // Get flagged question IDs for this exam
    const currentFlags = flagged[activeExamId] || {};
    const flaggedQuestionIds = questions.filter(q => !!currentFlags[q.id]).map(q => q.id);

    // Record summary in localStorage
    recordExamResult({
      id: attemptId,
      examId: activeExam.id,
      timestamp: result.timestamp,
      scorePercentage,
      passed,
      durationSeconds: result.durationSeconds,
      mode: examMode
    });

    // Build full attempt payload for Supabase
    const attemptPayload = {
      id: attemptId,
      examCode: activeExam.id,
      examMode,                          // 'full' | 'targeted' | 'custom'
      topicId,                           // topic ID for targeted quizzes, null for full/custom
      completedAt: result.timestamp,
      scorePercent: scorePercentage,
      correctCount: correct,
      totalQuestions: total,
      timeUsedSeconds: result.durationSeconds,
      timeAllowedSeconds: timeAllowed,
      passed,
      questionIds: questions.map(q => q.id),
      answers: result.userAnswers,
      flaggedQuestionIds,
      domainResults,
      questionSnapshot: questions,       // exact shuffled questions as presented
      questionBankVersion: QUESTION_BANK_VERSION,
      selectionType: result.config.selectionType,
      requestedQuestionCount: result.config.requestedQuestionCount,
      actualQuestionCount: result.config.actualQuestionCount || total,
      timerType: result.config.timerType,
      domainAllocation: result.config.domainAllocation
    };

    // Save to Supabase — non-blocking, errors don't crash results
    try {
      const { data, error } = await saveAttemptToSupabase(attemptPayload);
      if (error) {
        setAttemptSaveError(true);
      } else if (data) {
        // Prepend to in-memory Supabase attempts list (avoids refetch)
        addSupabaseAttempt(data);
      }
    } catch (err) {
      console.error('[App] Unexpected error saving attempt to Supabase:', err);
      setAttemptSaveError(true);
    }

    setPrepState('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar Header */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {isSetupOpen ? (
          <AwsSetupGuide />
        ) : (
          <>
            {viewMode === 'checklist' && (
              <ChecklistView onLaunchPrepExam={handleLaunchPrepExam} />
            )}

            {(viewMode === 'follow-alongs' || viewMode === 'vpc-learning-path') && (
              <FollowAlongsView
                initialProgrammeId={viewMode === 'vpc-learning-path' ? 'vpc-learning-path' : legacyAutoOpenProgrammeId}
              />
            )}

            {viewMode === 'prep-exam' && (
              <div>
                {prepState === 'setup' && (
                  <ExamSetup
                    onStartExam={handleStartExam}
                    presetConfig={presetConfig}
                    onViewAttempt={handleViewHistoricalAttempt}
                  />
                )}
                {prepState === 'quiz' && activeQuizConfig && (
                  <QuizEngine
                    config={activeQuizConfig}
                    onFinishExam={handleFinishExam}
                    onCancelExam={() => setPrepState('setup')}
                  />
                )}
                {prepState === 'results' && activeAttemptResult && (
                  <ExamResults
                    attemptResult={activeAttemptResult}
                    onRetake={handleRetakeExam}
                    onChangeMode={() => {
                      setIsReadOnly(false);
                      setPrepState('setup');
                    }}
                    isReadOnly={isReadOnly}
                    saveError={attemptSaveError}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ExamPulse Prep AI — Interactive Study & AWS Follow Alongs</span>
          <span>Local Storage Persisted & Offline Ready</span>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal />
      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <ImportExportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

    </div>
  );
};

const AuthenticatedApplication = () => {
  const [authorRequested, setAuthorRequested] = useState(() => isAuthorEntryRequested());

  useEffect(() => {
    const updateEntry = () => setAuthorRequested(isAuthorEntryRequested());
    globalThis.addEventListener?.('hashchange', updateEntry);
    return () => globalThis.removeEventListener?.('hashchange', updateEntry);
  }, []);

  if (authorRequested) return <AuthorEntry />;

  return (
    <AwsConnectionProvider enabled={true}>
      <ExamProvider>
        <MainContent />
      </ExamProvider>
    </AwsConnectionProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApplication />
    </AuthProvider>
  );
}
