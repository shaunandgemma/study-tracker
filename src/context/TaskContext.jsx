import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loadTaskProgressState,
  saveTaskProgressState
} from '../utils/storage.js';
import {
  getTasks,
  saveProgressToSupabase,
  fetchProgressFromSupabase,
  mergeGuestProgressIntoSupabase
} from '../services/taskService.js';
import {
  loadUserAwsConnection,
  saveUserAwsConnection,
  deleteUserAwsConnection,
  regenerateUserExternalId,
  testAwsConnection as apiTestAwsConnection
} from '../services/awsConnectionService.js';
import { supabase } from '../lib/supabase.js';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskLoadError, setTaskLoadError] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeMode, setActiveMode] = useState('console'); // 'console' | 'cli'
  const [taskProgress, setTaskProgress] = useState(() => loadTaskProgressState());

  // AWS Connection State (persisted strictly in Supabase DB, kept in memory)
  const [awsConnection, setAwsConnection] = useState(null);
  const [subView, setSubView] = useState('list'); // 'list' | 'guide' | 'aws-setup'
  const [testConnectionResult, setTestConnectionResult] = useState(null);

  // Filter States
  const [selectedExamFilter, setSelectedExamFilter] = useState('aws-saa-c03');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // User Auth State & Modal Control
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReturnView, setAuthModalReturnView] = useState(null);

  const openAuthModal = (returnView = null) => {
    if (returnView) setAuthModalReturnView(returnView);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setCurrentUser(data.user);
      if (data.user) {
        refreshAwsConnection(data.user.id);
      }

      if (authModalReturnView === 'aws-setup') {
        setSubView('aws-setup');
      }

      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to sign in.' };
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setCurrentUser(data.user);
        refreshAwsConnection(data.user.id);
      }

      if (authModalReturnView === 'aws-setup') {
        setSubView('aws-setup');
      }

      const message = data.session
        ? 'Account created and signed in successfully!'
        : 'Account created! Please check your email inbox to confirm registration.';

      return { success: true, user: data.user, message };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create account.' };
    }
  };

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setAwsConnection(null);
      setTestConnectionResult(null);
    } catch (err) {
      console.error('[TaskContext] Error signing out:', err);
    }
  };

  // Derived connection status
  const connectionStatus = awsConnection ? (awsConnection.status || 'simulation') : 'disconnected';

  // Load published tasks
  const refreshTasks = useCallback(async () => {
    setLoadingTasks(true);
    setTaskLoadError(null);
    try {
      const fetched = await getTasks(selectedExamFilter === 'all' ? null : selectedExamFilter);
      setTasks(fetched);
    } catch (err) {
      console.error('[TaskContext] Error loading tasks:', err);
      setTasks([]);
      setTaskLoadError(err?.message || 'Unable to load hands-on tasks from Supabase.');
    } finally {
      setLoadingTasks(false);
    }
  }, [selectedExamFilter]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Fallback guard if an invalid/removed topic filter is loaded
  useEffect(() => {
    if (tasks.length > 0 && selectedTopicFilter !== 'all') {
      const isValid = tasks.some(t => t.topicId === selectedTopicFilter);
      if (!isValid) {
        setSelectedTopicFilter('all');
      }
    }
  }, [tasks, selectedTopicFilter]);

  // Load AWS connection from Supabase DB for active user
  const refreshAwsConnection = useCallback(async (userId) => {
    if (!userId) {
      setAwsConnection(null);
      return;
    }
    const conn = await loadUserAwsConnection(userId);
    setAwsConnection(conn);
  }, []);

  // Auth state listener & remote progress / connection sync
  useEffect(() => {
    const initAuth = async () => {
      setLoadingAuth(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        refreshAwsConnection(user?.id || null);

        if (user) {
          const localProgress = loadTaskProgressState();
          await mergeGuestProgressIntoSupabase(user.id, localProgress);

          const remoteRecords = await fetchProgressFromSupabase(user.id);
          const remoteMap = {};
          remoteRecords.forEach(r => {
            remoteMap[r.taskId] = r;
          });
          setTaskProgress(remoteMap);
          saveTaskProgressState(remoteMap);
        }
      } catch (err) {
        refreshAwsConnection(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      refreshAwsConnection(user?.id || null);

      if (user) {
        const localProgress = loadTaskProgressState();
        await mergeGuestProgressIntoSupabase(user.id, localProgress);

        const remoteRecords = await fetchProgressFromSupabase(user.id);
        const remoteMap = {};
        remoteRecords.forEach(r => {
          remoteMap[r.taskId] = r;
        });
        setTaskProgress(remoteMap);
        saveTaskProgressState(remoteMap);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [refreshAwsConnection]);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  // AWS Connection Actions
  const openAwsSetup = () => {
    setSubView('aws-setup');
  };

  const closeAwsSetup = () => {
    setSubView(activeTaskId ? 'guide' : 'list');
  };

  const handleTestAwsConnection = async ({ accountId, roleArn, externalId }) => {
    const result = await apiTestAwsConnection({ accountId, roleArn, externalId });
    setTestConnectionResult(result);
    return result;
  };

  const handleSaveAwsConnection = async ({ accountId, roleArn, externalId }) => {
    const userId = currentUser?.id;
    if (!userId) {
      const result = { success: false, error: 'Authentication required. Please sign in to save your AWS connection.' };
      setTestConnectionResult(result);
      return result;
    }
    const result = await apiTestAwsConnection({ accountId, roleArn, externalId });
    if (result.success) {
      const connectionData = {
        awsAccountId: accountId.trim(),
        roleArn: roleArn.trim(),
        externalId: externalId.trim(),
        status: result.status, // 'simulation' or 'connected'
        lastVerifiedAt: result.lastVerifiedAt
      };
      const saveRes = await saveUserAwsConnection(userId, connectionData);
      if (saveRes.success) {
        setAwsConnection(saveRes.data);
        setTestConnectionResult(result);
        return { success: true, connection: saveRes.data };
      }
      return { success: false, error: saveRes.error };
    }
    setTestConnectionResult(result);
    return { success: false, error: result.error };
  };

  const handleDisconnectAwsConnection = async () => {
    const userId = currentUser?.id;
    if (userId) {
      await deleteUserAwsConnection(userId);
    }
    setAwsConnection(null);
    setTestConnectionResult(null);
  };

  const handleRegenerateAwsExternalId = async ({ accountId, roleArn }) => {
    const userId = currentUser?.id;
    if (!userId) {
      return { success: false, error: 'Sign in to Study Tracker before regenerating External ID.' };
    }
    const res = await regenerateUserExternalId(userId, accountId, roleArn);
    if (res.success) {
      setAwsConnection(res.data);
      setTestConnectionResult({
        status: 'disconnected',
        message: 'External ID regenerated. Please update your AWS CloudFormation stack with the new External ID parameter and re-test your connection.'
      });
    }
    return res;
  };

  // Persist progress helper
  const updateTaskProgressRecord = useCallback((taskId, updater) => {
    setTaskProgress(prev => {
      const currentRecord = prev[taskId] || {
        taskId,
        selectedMode: 'console',
        consoleCompletedItems: [],
        cliCompletedItems: [],
        verificationCompletedItems: [],
        cleanupCompletedItems: [],
        isCompleted: false,
        startedAt: new Date().toISOString()
      };

      const updatedRecord = typeof updater === 'function' ? updater(currentRecord) : { ...currentRecord, ...updater };
      updatedRecord.updatedAt = new Date().toISOString();

      const nextState = {
        ...prev,
        [taskId]: updatedRecord
      };

      saveTaskProgressState(nextState);

      if (currentUser?.id) {
        saveProgressToSupabase(currentUser.id, updatedRecord).catch(err => {
          console.error('[TaskContext] Failed to sync progress to Supabase:', err);
        });
      }

      return nextState;
    });
  }, [currentUser]);

  // Open a task guide
  const selectTask = (taskId, mode = 'console') => {
    setActiveTaskId(taskId);
    setActiveMode(mode);
    setSubView('guide');
  };

  // Close task guide and return to task list
  const closeTask = () => {
    setActiveTaskId(null);
    setSubView('list');
  };

  // Synchronize item checkbox toggles
  const toggleItemCompletion = (taskId, section, itemId) => {
    updateTaskProgressRecord(taskId, (record) => {
      const fieldMap = {
        console: 'consoleCompletedItems',
        cli: 'cliCompletedItems',
        verification: 'verificationCompletedItems',
        cleanup: 'cleanupCompletedItems'
      };

      const fieldName = fieldMap[section] || 'consoleCompletedItems';
      const existingItems = new Set(record[fieldName] || []);

      if (existingItems.has(itemId)) {
        existingItems.delete(itemId);
      } else {
        existingItems.add(itemId);
      }

      return {
        ...record,
        [fieldName]: Array.from(existingItems)
      };
    });
  };

  // Synchronize main step completion
  const toggleMainStepCompletion = (taskId, mode, stepId, shouldCheck) => {
    const taskObj = tasks.find(t => t.id === taskId);
    if (!taskObj) return;

    const steps = mode === 'cli' ? taskObj.cliSteps : taskObj.consoleSteps;
    const targetStep = steps ? steps.find(s => s.id === stepId) : null;
    if (!targetStep) return;

    const fieldName = mode === 'cli' ? 'cliCompletedItems' : 'consoleCompletedItems';

    updateTaskProgressRecord(taskId, (record) => {
      const existingItems = new Set(record[fieldName] || []);
      const childItems = targetStep.instructions ? targetStep.instructions.map(i => i.id) : [targetStep.id];

      if (shouldCheck) {
        childItems.forEach(id => existingItems.add(id));
      } else {
        childItems.forEach(id => existingItems.delete(id));
      }

      return {
        ...record,
        [fieldName]: Array.from(existingItems)
      };
    });
  };

  // Reset progress for a single task
  const resetTaskProgress = (taskId) => {
    updateTaskProgressRecord(taskId, () => ({
      taskId,
      selectedMode: 'console',
      consoleCompletedItems: [],
      cliCompletedItems: [],
      verificationCompletedItems: [],
      cleanupCompletedItems: [],
      isCompleted: false,
      startedAt: new Date().toISOString(),
      completedAt: null
    }));
  };

  // Explicitly mark a task complete
  const completeTask = (taskId) => {
    updateTaskProgressRecord(taskId, (record) => ({
      ...record,
      isCompleted: true,
      completedAt: new Date().toISOString()
    }));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadingTasks,
        taskLoadError,
        activeTaskId,
        activeTask,
        activeMode,
        taskProgress,
        subView,
        awsConnection,
        connectionStatus,
        testConnectionResult,
        selectedExamFilter,
        selectedTopicFilter,
        selectedDifficultyFilter,
        selectedStatusFilter,
        searchQuery,
        currentUser,
        loadingAuth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        setSelectedExamFilter,
        setSelectedTopicFilter,
        setSelectedDifficultyFilter,
        setSelectedStatusFilter,
        setSearchQuery,
        selectTask,
        closeTask,
        openAwsSetup,
        closeAwsSetup,
        testAwsConnection: handleTestAwsConnection,
        saveAwsConnection: handleSaveAwsConnection,
        disconnectAwsConnection: handleDisconnectAwsConnection,
        regenerateAwsExternalId: handleRegenerateAwsExternalId,
        setActiveMode,
        toggleItemCompletion,
        toggleMainStepCompletion,
        resetTaskProgress,
        completeTask,
        refreshTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};
