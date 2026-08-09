import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService as defaultAuthService } from './authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children, service = defaultAuthService }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;
    let authEventReceived = false;

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
  }, [service]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const signInWithEmail = useCallback(async (email, password) => {
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
    const result = await service.signUpWithEmail(email, password);
    if (result.success) {
      setCurrentUser(result.user || null);
      setAuthError(null);
    } else {
      setAuthError(result.error);
    }
    return result;
  }, [service]);

  const signOut = useCallback(async () => {
    const result = await service.signOut();
    if (result.success) {
      setCurrentUser(null);
      setAuthError(null);
    } else {
      setAuthError(result.error);
    }
    return result;
  }, [service]);

  const value = useMemo(() => ({
    currentUser,
    loadingAuth,
    authError,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }), [
    currentUser,
    loadingAuth,
    authError,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
