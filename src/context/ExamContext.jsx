import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  loadExams,
  saveExams,
  loadChecklistState,
  saveChecklistState,
  loadFlaggedState,
  saveFlaggedState,
  loadExamHistory,
  saveExamHistory,
  loadActiveExamId,
  saveActiveExamId,
  getStoredTheme,
  saveStoredTheme,
  exportBackupJSON,
  importBackupJSON,
  removeRetiredCustomExams
} from '../utils/storage';
import { fetchAttemptsFromSupabase } from '../services/attemptService';
import {
  learnerChecklistFlagProgress,
  mergeLearnerAccountProgress,
  supportsLearnerAccountProgress
} from '../services/learnerChecklistFlagProgress.js';
import { DEFAULT_EXAMS } from '../data/examData.js';
import { useAuth } from '../features/auth/useAuth.js';
import {
  buildDemoAttempts,
  cloneDemoChecklist,
  cloneDemoExamHistory
} from '../features/demo/demoMode.js';
import { isExamPreviewOnly } from '../features/access/applicationAccessPolicy.js';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const { currentUser, isDemoAccount, canManageContent, accessPolicy } = useAuth();
  const [exams, setExams] = useState(() => isDemoAccount ? structuredClone(DEFAULT_EXAMS) : loadExams());
  const [requestedActiveExamId, setActiveExamIdState] = useState(() => isDemoAccount ? 'aws-saa-c03' : loadActiveExamId());
  const [viewModeRaw, setViewModeRaw] = useState('app-home'); // 'app-home' | 'exam-home' | exam tools

  const setViewMode = useCallback((mode) => {
    setViewModeRaw(mode);
  }, []);

  const viewMode = viewModeRaw;
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [checklist, setChecklist] = useState(() => isDemoAccount ? cloneDemoChecklist() : loadChecklistState());
  const [flagged, setFlagged] = useState(() => isDemoAccount ? {} : loadFlaggedState());
  const checklistRef = useRef(checklist);
  const flaggedRef = useRef(flagged);
  const progressMutationRevisionRef = useRef(0);
  const progressWriteSequenceRef = useRef(0);
  const [progressSyncError, setProgressSyncError] = useState(null);
  const [examHistory, setExamHistory] = useState(() => isDemoAccount ? cloneDemoExamHistory() : loadExamHistory());
  const [highlightedTopicId, setHighlightedTopicId] = useState(null);

  // Supabase-persisted attempt history (full snapshots)
  const [supabaseAttempts, setSupabaseAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  useEffect(() => {
    checklistRef.current = checklist;
  }, [checklist]);

  useEffect(() => {
    flaggedRef.current = flagged;
  }, [flagged]);

  // Apply dark theme class to root html/body
  useEffect(() => {
    saveStoredTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setActiveExamId = (id) => {
    if (!exams.some(exam => exam.id === id)) return false;
    setActiveExamIdState(id);
    if (!isDemoAccount) saveActiveExamId(id);
    return true;
  };

  const activeExam = exams.find(e => e.id === requestedActiveExamId) || exams[0];
  const activeExamId = activeExam?.id || null;
  const isPreviewAccess = isExamPreviewOnly(accessPolicy, activeExam?.id);
  const progressUserId = !isDemoAccount && currentUser?.id ? currentUser.id : null;
  const accountProgressEnabled = Boolean(progressUserId && supportsLearnerAccountProgress(activeExam?.id));

  useEffect(() => {
    if (!activeExamId || requestedActiveExamId === activeExamId) return;
    setActiveExamIdState(activeExamId);
    if (!isDemoAccount) saveActiveExamId(activeExamId);
  }, [activeExamId, isDemoAccount, requestedActiveExamId]);

  useEffect(() => {
    if (!accountProgressEnabled) {
      setProgressSyncError(null);
      return undefined;
    }

    let cancelled = false;
    const mutationRevisionAtLoadStart = progressMutationRevisionRef.current;
    const loadPrivateProgress = async () => {
      const result = await learnerChecklistFlagProgress.loadExamProgress({
        userId: progressUserId,
        examId: activeExam.id
      });

      if (cancelled || mutationRevisionAtLoadStart !== progressMutationRevisionRef.current) return;
      if (!result.success) {
        setProgressSyncError('Your account progress could not be loaded. Your existing browser progress is unchanged.');
        return;
      }

      const merged = mergeLearnerAccountProgress({
        checklist: checklistRef.current,
        flagged: flaggedRef.current,
        examId: activeExam.id,
        rows: result.rows
      });
      checklistRef.current = merged.checklist;
      flaggedRef.current = merged.flagged;
      setChecklist(merged.checklist);
      setFlagged(merged.flagged);
      setProgressSyncError(null);
    };

    loadPrivateProgress();
    return () => {
      cancelled = true;
    };
  }, [accountProgressEnabled, activeExam?.id, progressUserId]);

  const commitChecklist = useCallback((updated) => {
    progressMutationRevisionRef.current += 1;
    checklistRef.current = updated;
    setChecklist(updated);
    if (!isDemoAccount) saveChecklistState(updated);
  }, [isDemoAccount]);

  const commitFlags = useCallback((updated) => {
    progressMutationRevisionRef.current += 1;
    flaggedRef.current = updated;
    setFlagged(updated);
    if (!isDemoAccount) saveFlaggedState(updated);
  }, [isDemoAccount]);

  const verifyAccountWrites = useCallback(async (operations) => {
    if (!accountProgressEnabled || operations.length === 0) return;
    const writeSequence = progressWriteSequenceRef.current + 1;
    progressWriteSequenceRef.current = writeSequence;
    try {
      const results = await Promise.all(operations);
      if (writeSequence !== progressWriteSequenceRef.current) return;
      const failed = results.find(result => !result?.success || !result?.verified);
      setProgressSyncError(failed
        ? 'This change is saved in this browser, but could not be verified in your account.'
        : null);
    } catch (error) {
      console.error('[ExamContext] Failed to verify learner progress:', error);
      if (writeSequence !== progressWriteSequenceRef.current) return;
      setProgressSyncError('This change is saved in this browser, but could not be verified in your account.');
    }
  }, [accountProgressEnabled]);

  const saveChecklistItemsToAccount = useCallback((examId, items) => {
    if (!accountProgressEnabled || examId !== activeExam?.id) return;
    void verifyAccountWrites(items.map(({ contentId, completed }) => (
      learnerChecklistFlagProgress.saveChecklistItem({
        userId: progressUserId,
        examId,
        contentId,
        completed
      })
    )));
  }, [accountProgressEnabled, activeExam?.id, progressUserId, verifyAccountWrites]);

  const saveQuestionFlagsToAccount = useCallback((examId, items) => {
    if (!accountProgressEnabled || examId !== activeExam?.id) return;
    void verifyAccountWrites(items.map(({ contentId, flagged: isFlagged }) => (
      learnerChecklistFlagProgress.saveQuestionFlag({
        userId: progressUserId,
        examId,
        contentId,
        flagged: isFlagged
      })
    )));
  }, [accountProgressEnabled, activeExam?.id, progressUserId, verifyAccountWrites]);

  // Load Supabase attempts whenever the active exam changes
  const loadAttempts = useCallback(async (examCode) => {
    const code = examCode || activeExam?.id;
    if (!code) return;
    setLoadingAttempts(true);
    try {
      const rows = isDemoAccount
        ? buildDemoAttempts(exams.find(exam => exam.id === code))
        : await fetchAttemptsFromSupabase(code);
      setSupabaseAttempts(rows);
    } catch (err) {
      console.error('[ExamContext] Failed to load Supabase attempts:', err);
    } finally {
      setLoadingAttempts(false);
    }
  }, [activeExam?.id, exams, isDemoAccount]);

  useEffect(() => {
    if (activeExam?.id) {
      loadAttempts(activeExam.id);
    }
  }, [activeExam?.id, loadAttempts]);

  // Prepend a newly saved attempt to in-memory list (avoids refetch round-trip)
  const addSupabaseAttempt = (attempt) => {
    setSupabaseAttempts(prev => [attempt, ...prev]);
  };

  // Helper to persist exams state change
  const updateExamsState = (updater) => {
    if (!canManageContent) return false;
    setExams(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      const retained = removeRetiredCustomExams(updated);
      saveExams(retained);
      return retained;
    });
    return true;
  };

  // Checklist Task toggle checkmark
  const toggleTask = (examId, taskId) => {
    const current = checklistRef.current;
    const examTasks = current[examId] || {};
    const completed = !examTasks[taskId];
    commitChecklist({
      ...current,
      [examId]: { ...examTasks, [taskId]: completed }
    });
    saveChecklistItemsToAccount(examId, [{ contentId: taskId, completed }]);
  };

  // Bulk check/uncheck tasks in a checklist group
  const checkGroupTasks = (examId, taskIds, shouldCheck = true) => {
    const current = checklistRef.current;
    const updatedExamTasks = { ...(current[examId] || {}) };
    taskIds.forEach(id => {
      updatedExamTasks[id] = shouldCheck;
    });
    commitChecklist({ ...current, [examId]: updatedExamTasks });
    saveChecklistItemsToAccount(examId, taskIds.map(contentId => ({ contentId, completed: shouldCheck })));
  };

  // Flag Question toggle
  const toggleFlag = (examId, questionId) => {
    const current = flaggedRef.current;
    const examFlags = current[examId] || {};
    const isFlagged = !examFlags[questionId];
    commitFlags({
      ...current,
      [examId]: { ...examFlags, [questionId]: isFlagged }
    });
    saveQuestionFlagsToAccount(examId, [{ contentId: questionId, flagged: isFlagged }]);
  };

  // Clear all flags for an exam
  const clearFlags = (examId) => {
    const current = flaggedRef.current;
    const questionIds = Object.keys(current[examId] || {});
    commitFlags({ ...current, [examId]: {} });
    saveQuestionFlagsToAccount(examId, questionIds.map(contentId => ({ contentId, flagged: false })));
  };

  // Record Quiz Result
  const recordExamResult = (result) => {
    setExamHistory(prev => {
      const updated = [result, ...prev];
      if (!isDemoAccount) saveExamHistory(updated);
      return updated;
    });
  };

  // Diagnostic jump trigger to Study Checklist mode
  const jumpToTopicChecklist = (topicId) => {
    setHighlightedTopicId(topicId);
    setViewMode('checklist');
    setTimeout(() => {
      setHighlightedTopicId(null);
    }, 4000);
  };

  // Add Custom Exam
  const addCustomExam = (newExam) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prev => [...prev, newExam]);
    setActiveExamId(newExam.id);
    return { success: true };
  };

  // ==========================================
  // SINGLE-LEVEL CHECKLIST CRUD OPERATORS
  // ==========================================

  // Level 1: Add Topic / Service Header
  const addTopic = (examId, topicData) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const newTopic = {
          id: `topic-${Date.now()}`,
          code: topicData.code || 'Service',
          title: topicData.title || 'New Service / Topic Header',
          weight: Number(topicData.weight) || 10,
          description: topicData.description || 'Custom service checklist.',
          items: []
        };
        const topics = ex.topics || ex.domains || [];
        return { ...ex, topics: [...topics, newTopic] };
      });
    });
  };

  // Level 1: Edit Topic Header
  const editTopic = (examId, topicId, topicData) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            title: topicData.title !== undefined ? topicData.title : t.title,
            code: topicData.code !== undefined ? topicData.code : t.code,
            description: topicData.description !== undefined ? topicData.description : t.description
          };
        });
        return { ...ex, topics };
      });
    });
  };

  // Level 1: Delete Topic Header
  const deleteTopic = (examId, topicId) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).filter(t => t.id !== topicId);
        return { ...ex, topics };
      });
    });
  };

  // Level 2: Add Single Item
  const addItem = (examId, topicId, text) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).map(t => {
          if (t.id !== topicId) return t;
          const newItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            text: text || 'New checklist item'
          };
          const existingItems = t.items || [];
          return { ...t, items: [...existingItems, newItem] };
        });
        return { ...ex, topics };
      });
    });
  };

  // Level 2: Add Bulk Items (Newline-Separated Paste)
  const addBulkItems = (examId, topicId, linesArray) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    if (!linesArray || !linesArray.length) return;
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).map(t => {
          if (t.id !== topicId) return t;
          const newItems = linesArray
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((text, idx) => ({
              id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
              text
            }));
          const existingItems = t.items || [];
          return { ...t, items: [...existingItems, ...newItems] };
        });
        return { ...ex, topics };
      });
    });
  };

  // Level 2: Edit Item
  const editItem = (examId, topicId, itemId, text) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).map(t => {
          if (t.id !== topicId) return t;
          const items = (t.items || []).map(itm => {
            if (itm.id !== itemId) return itm;
            return { ...itm, text };
          });
          return { ...t, items };
        });
        return { ...ex, topics };
      });
    });
  };

  // Level 2: Delete Item
  const deleteItem = (examId, topicId, itemId) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required.' };
    updateExamsState(prevExams => {
      return prevExams.map(ex => {
        if (ex.id !== examId) return ex;
        const topics = (ex.topics || ex.domains || []).map(t => {
          if (t.id !== topicId) return t;
          const items = (t.items || []).filter(itm => itm.id !== itemId);
          return { ...t, items };
        });
        return { ...ex, topics };
      });
    });
  };

  // Import Backup JSON
  const importData = (jsonStr) => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required to import app data.' };
    const res = importBackupJSON(jsonStr);
    if (res.success) {
      setExams(loadExams());
      setChecklist(loadChecklistState());
      setFlagged(loadFlaggedState());
      setExamHistory(loadExamHistory());
    }
    return res;
  };

  // Export Backup JSON
  const exportData = () => {
    if (!canManageContent) return { success: false, message: 'Administrator access is required to export app data.' };
    exportBackupJSON();
    return { success: true };
  };

  // Reset progress for current exam
  const resetExamProgress = (examId) => {
    const taskIds = Object.keys(checklistRef.current[examId] || {});
    const questionIds = Object.keys(flaggedRef.current[examId] || {});
    commitChecklist({ ...checklistRef.current, [examId]: {} });
    commitFlags({ ...flaggedRef.current, [examId]: {} });
    saveChecklistItemsToAccount(examId, taskIds.map(contentId => ({ contentId, completed: false })));
    saveQuestionFlagsToAccount(examId, questionIds.map(contentId => ({ contentId, flagged: false })));
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        canManageContent,
        isDemoAccount,
        isPreviewAccess,
        activeExam,
        activeExamId,
        setActiveExamId,
        viewMode,
        setViewMode,
        theme,
        toggleTheme,
        checklist,
        toggleTask,
        checkGroupTasks,
        flagged,
        toggleFlag,
        clearFlags,
        progressSyncError,
        dismissProgressSyncError: () => setProgressSyncError(null),
        examHistory,
        recordExamResult,
        supabaseAttempts,
        loadingAttempts,
        loadAttempts,
        addSupabaseAttempt,
        highlightedTopicId,
        jumpToTopicChecklist,
        addCustomExam,
        addTopic,
        editTopic,
        deleteTopic,
        addItem,
        addBulkItems,
        editItem,
        deleteItem,
        importData,
        exportData,
        resetExamProgress
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within an ExamProvider');
  return context;
};
