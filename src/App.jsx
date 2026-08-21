import React, { useEffect, useState } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { AuthProvider } from './features/auth/AuthContext';
import { useAuth } from './features/auth/useAuth.js';
import { DemoAccessGate } from './features/demo/DemoAccessGate.jsx';
import { DemoAnnualAccessBanner } from './features/demo/DemoAnnualAccessPromotion.jsx';
import { AuthorEntry } from './features/followAlongAuthor/AuthorEntry.jsx';
import { isAuthorEntryRequested } from './features/followAlongAuthor/authorAccess.js';
import { PaymentReturnEntry } from './features/payments/PaymentReturnEntry.jsx';
import { getPaymentRoute } from './features/payments/paymentRoutes.js';
import { Navbar } from './components/Navbar';
import { ChecklistView } from './components/StudyChecklist/ChecklistView';
import { ExamSetup } from './components/PrepExam/ExamSetup';
import { QuizEngine } from './components/PrepExam/QuizEngine';
import { ExamResults } from './components/PrepExam/ExamResults';
import { FollowAlongsView } from './components/FollowAlongs/FollowAlongsView';
import { TroubleshootingView } from './components/Troubleshooting/TroubleshootingView.jsx';
import { AppLandingPage } from './components/Landing/AppLandingPage.jsx';
import { ExamLandingPage } from './components/Landing/ExamLandingPage.jsx';
import { ExamWorkspaceHeader } from './components/Landing/ExamWorkspaceHeader.jsx';
import { LearnerProgressImportPanel } from './components/Progress/LearnerProgressImportPanel.jsx';
import { AddExamModal } from './components/Modals/AddExamModal';
import { ImportExportModal } from './components/Modals/ImportExportModal';
import { AuthModal } from './components/Modals/AuthModal';

import {
  prepareExamQuestions,
  prepareFullMockForExam,
  prepareCustomExamQuestions
} from './utils/examUtils';
import { saveAttemptToSupabase, QUESTION_BANK_VERSION } from './services/attemptService';
import { getDomainForQuestion } from './data/saaC03DomainMapping';
import { isExamPreviewOnly } from './features/access/applicationAccessPolicy.js';

const MainContent = () => {
  const { exams, viewMode, setViewMode, activeExam, activeExamId, setActiveExamId, recordExamResult, clearFlags, flagged, addSupabaseAttempt, progressSyncError, dismissProgressSyncError } = useExam();
  const { isDemoAccount, canManageContent, accessPolicy, entitlementError } = useAuth();
  const isPreviewAccess = isExamPreviewOnly(accessPolicy, activeExamId);
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

  const handleSelectExam = (examId) => {
    if (!setActiveExamId(examId)) return;
    setPrepState('setup');
    setPresetConfig(null);
    setViewMode('exam-home');
  };

  const handleSelectExamTool = (toolId) => {
    if (toolId === 'prep-exam') {
      setPrepState('setup');
      setPresetConfig(null);
      setIsReadOnly(false);
      setAttemptSaveError(false);
    }
    setViewMode(toolId);
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
          preparedQuestions = isPreviewAccess
            ? prepareExamQuestions(pool)
            : prepareFullMockForExam(activeExamId, pool);
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

    // Demo attempts remain in memory and never reach Supabase.
    if (!isDemoAccount) {
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
    }

    setPrepState('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar Header */}
      <Navbar
        onGoHome={() => setViewMode('app-home')}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <>
            {isPreviewAccess && viewMode !== 'app-home' && <DemoAnnualAccessBanner />}

            {isPreviewAccess && entitlementError && (
              <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100" role="status">
                <p className="font-semibold">Exam access could not be verified</p>
                <p className="mt-1 text-amber-200/90">Preview access is shown safely. Your signed-in progress can still be saved.</p>
              </div>
            )}

            {progressSyncError && (
              <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100" role="status">
                <div>
                  <p className="font-semibold">Account progress needs attention</p>
                  <p className="mt-1 text-amber-200/90">{progressSyncError}</p>
                </div>
                <button
                  type="button"
                  onClick={dismissProgressSyncError}
                  className="shrink-0 rounded-lg border border-amber-400/40 px-3 py-1.5 font-semibold hover:bg-amber-400/10"
                >
                  Dismiss
                </button>
              </div>
            )}

            {viewMode === 'app-home' && (
              <AppLandingPage
                exams={exams}
                onSelectExam={handleSelectExam}
                onAddExam={() => setIsAddModalOpen(true)}
                canManageContent={canManageContent}
                accessPolicy={accessPolicy}
              />
            )}

            {viewMode === 'exam-home' && (
              <>
                <ExamLandingPage
                  exam={activeExam}
                  onBack={() => setViewMode('app-home')}
                  onSelectTool={handleSelectExamTool}
                  previewOnly={isPreviewAccess}
                  accessPolicy={accessPolicy}
                />
                <LearnerProgressImportPanel examId={activeExamId} />
              </>
            )}

            {viewMode === 'checklist' && (
              <>
                <ExamWorkspaceHeader exam={activeExam} viewMode={viewMode} onBack={() => setViewMode('exam-home')} />
                <ChecklistView onLaunchPrepExam={handleLaunchPrepExam} />
              </>
            )}

            {viewMode === 'knowledge-guide' && (activeExamId === 'terraform-associate-004' || activeExamId === 'aws-saa-c03') && (
              <>
                <ExamWorkspaceHeader exam={activeExam} viewMode={viewMode} onBack={() => setViewMode('exam-home')} />
                <ChecklistView
                  onLaunchPrepExam={handleLaunchPrepExam}
                  startKnowledgeGuide
                  onExitKnowledgeGuide={() => setViewMode('exam-home')}
                />
              </>
            )}

            {viewMode === 'troubleshooting' && (activeExamId === 'terraform-associate-004' || activeExamId === 'aws-saa-c03') && (
              <>
                <ExamWorkspaceHeader exam={activeExam} viewMode={viewMode} onBack={() => setViewMode('exam-home')} />
                <TroubleshootingView examId={activeExamId} examCode={activeExam?.code} />
              </>
            )}

            {viewMode === 'follow-alongs' && (
              <>
                <ExamWorkspaceHeader exam={activeExam} viewMode="follow-alongs" onBack={() => setViewMode('exam-home')} />
                <FollowAlongsView
                  examId={activeExamId}
                  examCode={activeExam?.code}
                />
              </>
            )}

            {viewMode === 'prep-exam' && (
              <div>
                <ExamWorkspaceHeader exam={activeExam} viewMode={viewMode} onBack={() => setViewMode('exam-home')} />
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>LATT — Learning All Things Tech</span>
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
  const [paymentRoute, setPaymentRoute] = useState(() => getPaymentRoute());
  const { currentUser, loadingAuth, entitlementsLoading, demoModeEnabled, isDemoAccount, signInAsDemo, openAuthModal } = useAuth();

  useEffect(() => {
    const updateEntry = () => {
      setAuthorRequested(isAuthorEntryRequested());
      setPaymentRoute(getPaymentRoute());
    };
    globalThis.addEventListener?.('hashchange', updateEntry);
    return () => globalThis.removeEventListener?.('hashchange', updateEntry);
  }, []);

  if (authorRequested) return <AuthorEntry />;

  if (loadingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-slate-300">Checking safe access...</div>;
  }

  if (paymentRoute) {
    return (
      <PaymentReturnEntry
        route={paymentRoute}
        signedIn={Boolean(currentUser)}
        onReturnHome={() => { globalThis.location.hash = ''; }}
      />
    );
  }

  if (!currentUser) {
    return (
      <DemoAccessGate
        demoEnabled={demoModeEnabled}
        onSignIn={openAuthModal}
        onEnterDemo={signInAsDemo}
      />
    );
  }

  if (currentUser && !isDemoAccount && entitlementsLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-slate-300">Checking exam access...</div>;
  }

  return (
    <ExamProvider key={currentUser?.id || 'guest'}>
      <MainContent />
    </ExamProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApplication />
    </AuthProvider>
  );
}
