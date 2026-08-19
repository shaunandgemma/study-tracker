import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService as defaultAuthService } from './authService.js';
import {
  DEMO_USER,
  hasStoredDemoSession,
  isAdminUser,
  isDemoModeEnabled,
  isDemoUser,
  resetDemoData,
  storeDemoSession
} from '../demo/demoMode.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children, service = defaultAuthService }) => {
  const demoModeEnabled = isDemoModeEnabled();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;
    let authEventReceived = false;

    if (demoModeEnabled && hasStoredDemoSession()) {
      setCurrentUser(DEMO_USER);
      setLoadingAuth(false);
      return () => { isActive = false; };
    }

    const unsubscribe = service.subscribeToAuthChanges((user, event) => {
      if (!isActive) return;
      const isInitialSession = event === 'INITIAL_SESSION';
      if (!isInitialSession) authEventReceived = true;
      setCurrentUser(user);
      setAuthError(null);
      if (!isInitialSession) setLoadingAuth(false);
    });

    const loadCurrentUser = async () => {
      setLoadingAuth(true);
      const result = await service.getCurrentUser();
      if (!isActive) return;

      if (!authEventReceived) {
        setCurrentUser(result.user || null);
        setAuthError(result.success ? null : result.error);
      }
      setLoadingAuth(false);
    };

    loadCurrentUser();

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [demoModeEnabled, service]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const signInWithEmail = useCallback(async (email, password) => {
    storeDemoSession(false);
    resetDemoData();
    const result = await service.signInWithEmail(email, password);
    if (result.success) {
      setCurrentUser(result.user || null);
      setAuthError(null);
    } else {
      setAuthError(result.error);
    }
    return result;
  }, [service]);

  const signUpWithEmail = useCallback(async (email, password) => {
    if (demoModeEnabled) {
      const result = { success: false, error: 'Public account creation is disabled while safe demo mode is enabled.' };
      setAuthError(result.error);
      return result;
    }
    storeDemoSession(false);
    resetDemoData();
    const result = await service.signUpWithEmail(email, password);
    if (result.success) {
      setCurrentUser(result.user || null);
      setAuthError(null);
    } else {
      setAuthError(result.error);
    }
    return result;
  }, [demoModeEnabled, service]);

  const signInAsDemo = useCallback(async () => {
    if (!demoModeEnabled) return { success: false, error: 'Demo mode is not enabled.' };
    const result = await service.signOut();
    if (!result.success) {
      setAuthError(result.error);
      return result;
    }
    resetDemoData();
    storeDemoSession(true);
    setCurrentUser(DEMO_USER);
    setAuthError(null);
    setIsAuthModalOpen(false);
    return { success: true, user: DEMO_USER };
  }, [demoModeEnabled, service]);

  const signOut = useCallback(async () => {
    if (isDemoUser(currentUser)) {
      storeDemoSession(false);
      resetDemoData();
      setCurrentUser(null);
      setAuthError(null);
      return { success: true };
    }
    const result = await service.signOut();
    if (result.success) {
      setCurrentUser(null);
      setAuthError(null);
    } else {
      setAuthError(result.error);
    }
    return result;
  }, [currentUser, service]);

  const value = useMemo(() => ({
    currentUser,
    loadingAuth,
    authError,
    demoModeEnabled,
    isDemoAccount: isDemoUser(currentUser),
    canManageContent: isAdminUser(currentUser),
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInAsDemo,
    signOut,
  }), [
    currentUser,
    loadingAuth,
    authError,
    demoModeEnabled,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInAsDemo,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
