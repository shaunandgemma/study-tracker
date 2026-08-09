import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  importBackupJSON
} from '../utils/storage';
import { fetchAttemptsFromSupabase } from '../services/attemptService';

const ExamContext = createContext();

export const normalizeMainViewMode = (mode) => (
  mode === 'vpc-learning-path'
    ? 'follow-alongs'
    : mode
);

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState(() => loadExams());
  const [activeExamId, setActiveExamIdState] = useState(() => loadActiveExamId());
  const [viewModeRaw, setViewModeRaw] = useState('checklist'); // 'checklist' | 'prep-exam' | 'follow-alongs'
  const [legacyAutoOpenProgrammeId, setLegacyAutoOpenProgrammeId] = useState(null);

  const setViewMode = useCallback((mode) => {
    if (mode === 'vpc-learning-path') {
      setLegacyAutoOpenProgrammeId('vpc-learning-path');
      setViewModeRaw('follow-alongs');
    } else {
      const normalizedMode = normalizeMainViewMode(mode);
      if (normalizedMode !== 'follow-alongs') {
        setLegacyAutoOpenProgrammeId(null);
      }
      setViewModeRaw(normalizedMode);
    }
  }, []);

  const viewMode = normalizeMainViewMode(viewModeRaw);
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [checklist, setChecklist] = useState(() => loadChecklistState());
  const [flagged, setFlagged] = useState(() => loadFlaggedState());
  const [examHistory, setExamHistory] = useState(() => loadExamHistory());
  const [highlightedTopicId, setHighlightedTopicId] = useState(null);

  // Supabase-persisted attempt history (full snapshots)
  const [supabaseAttempts, setSupabaseAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

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
    setActiveExamIdState(id);
    saveActiveExamId(id);
  };

  const activeExam = exams.find(e => e.id === activeExamId) || exams[0];

  // Load Supabase attempts whenever the active exam changes
  const loadAttempts = useCallback(async (examCode) => {
    const code = examCode || activeExam?.id;
    if (!code) return;
    setLoadingAttempts(true);
    try {
      const rows = await fetchAttemptsFromSupabase(code);
      setSupabaseAttempts(rows);
    } catch (err) {
      console.error('[ExamContext] Failed to load Supabase attempts:', err);
    } finally {
      setLoadingAttempts(false);
    }
  }, [activeExam?.id]);

  useEffect(() => {
    if (activeExam?.id) {
      loadAttempts(activeExam.id);
    }
  }, [activeExam?.id]);

  // Prepend a newly saved attempt to in-memory list (avoids refetch round-trip)
  const addSupabaseAttempt = (attempt) => {
    setSupabaseAttempts(prev => [attempt, ...prev]);
  };

  // Helper to persist exams state change
  const updateExamsState = (updater) => {
    setExams(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      saveExams(updated);
      return updated;
    });
  };

  // Checklist Task toggle checkmark
  const toggleTask = (examId, taskId) => {
    setChecklist(prev => {
      const examTasks = prev[examId] || {};
      const updated = {
        ...prev,
        [examId]: {
          ...examTasks,
          [taskId]: !examTasks[taskId]
        }
      };
      saveChecklistState(updated);
      return updated;
    });
  };

  // Bulk check/uncheck tasks in a checklist group
  const checkGroupTasks = (examId, taskIds, shouldCheck = true) => {
    setChecklist(prev => {
      const examTasks = prev[examId] || {};
      const updatedExamTasks = { ...examTasks };
      taskIds.forEach(id => {
        updatedExamTasks[id] = shouldCheck;
      });
      const updated = {
        ...prev,
        [examId]: updatedExamTasks
      };
      saveChecklistState(updated);
      return updated;
    });
  };

  // Flag Question toggle
  const toggleFlag = (examId, questionId) => {
    setFlagged(prev => {
      const examFlags = prev[examId] || {};
      const updated = {
        ...prev,
        [examId]: {
          ...examFlags,
          [questionId]: !examFlags[questionId]
        }
      };
      saveFlaggedState(updated);
      return updated;
    });
  };

  // Clear all flags for an exam
  const clearFlags = (examId) => {
    setFlagged(prev => {
      const updated = {
        ...prev,
        [examId]: {}
      };
      saveFlaggedState(updated);
      return updated;
    });
  };

  // Record Quiz Result
  const recordExamResult = (result) => {
    setExamHistory(prev => {
      const updated = [result, ...prev];
      saveExamHistory(updated);
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
    updateExamsState(prev => [...prev, newExam]);
    setActiveExamId(newExam.id);
  };

  // ==========================================
  // SINGLE-LEVEL CHECKLIST CRUD OPERATORS
  // ==========================================

  // Level 1: Add Topic / Service Header
  const addTopic = (examId, topicData) => {
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
    exportBackupJSON();
  };

  // Reset progress for current exam
  const resetExamProgress = (examId) => {
    setChecklist(prev => {
      const updated = { ...prev, [examId]: {} };
      saveChecklistState(updated);
      return updated;
    });
    setFlagged(prev => {
      const updated = { ...prev, [examId]: {} };
      saveFlaggedState(updated);
      return updated;
    });
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        activeExam,
        activeExamId,
        setActiveExamId,
        viewMode,
        setViewMode,
        legacyAutoOpenProgrammeId,
        theme,
        toggleTheme,
        checklist,
        toggleTask,
        checkGroupTasks,
        flagged,
        toggleFlag,
        clearFlags,
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
