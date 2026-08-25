import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authService as defaultAuthService } from './authService.js';
import { examEntitlementService as defaultExamEntitlementService } from '../../services/examEntitlementService.js';
import {
  DEMO_USER,
  hasStoredDemoSession,
  isDemoModeEnabled,
  isDemoUser,
  resetDemoData,
  storeDemoSession
} from '../demo/demoMode.js';
import {
  buildApplicationAccessPolicy,
  getNextExamEntitlementBoundary
} from '../access/applicationAccessPolicy.js';
import { resolveEntitlementRefreshResult } from '../access/entitlementRefreshPolicy.js';

export const AuthContext = createContext(null);

const MAX_ENTITLEMENT_TIMER_DELAY_MS = 2_147_000_000;
const ENTITLEMENT_BOUNDARY_GRACE_MS = 1_000;

export const AuthProvider = ({
  children,
  service = defaultAuthService,
  entitlementService = defaultExamEntitlementService
}) => {
  const demoModeEnabled = isDemoModeEnabled();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [verifiedEntitlements, setVerifiedEntitlements] = useState([]);
  const [entitlementsLoading, setEntitlementsLoading] = useState(false);
  const [entitlementError, setEntitlementError] = useState(null);
  const [accessEvaluationTime, setAccessEvaluationTime] = useState(() => Date.now());
  const entitlementRequestIdRef = useRef(0);
  const currentUserId = currentUser?.id || null;
  const currentUserIsDemo = isDemoUser(currentUser);

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

  const refreshEntitlements = useCallback(async ({ blocking = false } = {}) => {
    const requestId = entitlementRequestIdRef.current + 1;
    entitlementRequestIdRef.current = requestId;
    const userId = currentUserId;

    setAccessEvaluationTime(Date.now());

    if (!userId || currentUserIsDemo) {
      setVerifiedEntitlements([]);
      setEntitlementsLoading(false);
      setEntitlementError(null);
      return { success: true, verified: true, rows: [] };
    }

    if (blocking) {
      setVerifiedEntitlements([]);
      setEntitlementsLoading(true);
    }
    setEntitlementError(null);

    try {
      const result = await entitlementService.loadOwnEntitlements({ userId });
      if (requestId !== entitlementRequestIdRef.current) return { ...result, stale: true };

      setAccessEvaluationTime(Date.now());
      const decision = resolveEntitlementRefreshResult(result);
      if (decision.accepted) {
        setVerifiedEntitlements(decision.rows);
        setEntitlementError(null);
      } else {
        setVerifiedEntitlements([]);
        setEntitlementError(decision.error);
      }
      return result;
    } catch (error) {
      if (requestId !== entitlementRequestIdRef.current) {
        return { success: false, verified: false, rows: [], stale: true };
      }
      setAccessEvaluationTime(Date.now());
      setVerifiedEntitlements([]);
      setEntitlementError(error?.message || 'Unable to verify exam access.');
      return { success: false, verified: false, rows: [], error: error?.message || 'Unable to verify exam access.' };
    } finally {
      if (requestId === entitlementRequestIdRef.current) setEntitlementsLoading(false);
    }
  }, [currentUserId, currentUserIsDemo, entitlementService]);

  useEffect(() => {
    refreshEntitlements({ blocking: true });

    return () => {
      entitlementRequestIdRef.current += 1;
    };
  }, [refreshEntitlements]);

  useEffect(() => {
    if (!currentUserId || currentUserIsDemo) return undefined;

    const refreshOnFocus = () => {
      setAccessEvaluationTime(Date.now());
      refreshEntitlements({ blocking: false });
    };

    globalThis.addEventListener?.('focus', refreshOnFocus);
    return () => globalThis.removeEventListener?.('focus', refreshOnFocus);
  }, [currentUserId, currentUserIsDemo, refreshEntitlements]);

  useEffect(() => {
    if (!currentUserId || currentUserIsDemo) return undefined;

    const now = Date.now();
    const nextBoundary = getNextExamEntitlementBoundary(verifiedEntitlements, now);
    if (nextBoundary === null) return undefined;

    const delay = Math.min(
      Math.max(nextBoundary - now + ENTITLEMENT_BOUNDARY_GRACE_MS, 0),
      MAX_ENTITLEMENT_TIMER_DELAY_MS
    );
    const timer = globalThis.setTimeout?.(() => {
      setAccessEvaluationTime(Date.now());
      refreshEntitlements({ blocking: false });
    }, delay);

    return () => {
      if (timer !== undefined) globalThis.clearTimeout?.(timer);
    };
  }, [currentUserId, currentUserIsDemo, refreshEntitlements, verifiedEntitlements]);

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

  const accessPolicy = useMemo(
    () => buildApplicationAccessPolicy(currentUser, {
      verifiedEntitlements,
      now: accessEvaluationTime
    }),
    [accessEvaluationTime, currentUser, verifiedEntitlements]
  );

  const value = useMemo(() => ({
    currentUser,
    loadingAuth,
    authError,
    entitlementsLoading,
    entitlementError,
    verifiedEntitlements,
    refreshEntitlements,
    demoModeEnabled,
    isDemoAccount: isDemoUser(currentUser),
    accessPolicy,
    accountType: accessPolicy.accountType,
    canUseAccountProgress: accessPolicy.canUseAccountProgress,
    canAccessAuthor: accessPolicy.canAccessAuthor,
    canAccessApprovals: accessPolicy.canAccessApprovals,
    canManageContent: accessPolicy.canManageContent,
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
    accessPolicy,
    entitlementsLoading,
    entitlementError,
    verifiedEntitlements,
    refreshEntitlements,
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
