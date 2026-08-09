import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/useAuth.js';
import {
  loadUserAwsConnection,
  saveUserAwsConnection,
  deleteUserAwsConnection,
  regenerateUserExternalId,
  testAwsConnection as testAwsConnectionService,
} from '../../services/awsConnectionService.js';

export const AwsConnectionContext = createContext(null);

export const defaultAwsConnectionServices = Object.freeze({
  loadUserAwsConnection,
  saveUserAwsConnection,
  deleteUserAwsConnection,
  regenerateUserExternalId,
  testAwsConnection: testAwsConnectionService,
});

const STANDBY_ERROR = 'The independent AWS connection provider is in standby during migration.';

export const AwsConnectionProvider = ({
  children,
  enabled = false,
  services = defaultAwsConnectionServices,
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || null;
  const [awsConnection, setAwsConnection] = useState(null);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [testConnectionResult, setTestConnectionResult] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const standbyResult = useCallback(() => ({ success: false, error: STANDBY_ERROR }), []);
  const openSetup = useCallback(() => setIsSetupOpen(true), []);
  const closeSetup = useCallback(() => setIsSetupOpen(false), []);

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setAwsConnection(null);
      setLoadingConnection(false);
      setTestConnectionResult(null);
      setConnectionError(null);
      return () => { isActive = false; };
    }

    if (!userId) {
      setAwsConnection(null);
      setLoadingConnection(false);
      setTestConnectionResult(null);
      setConnectionError(null);
      return () => { isActive = false; };
    }

    const loadConnection = async () => {
      setLoadingConnection(true);
      setConnectionError(null);
      try {
        const connection = await services.loadUserAwsConnection(userId);
        if (isActive) setAwsConnection(connection);
      } catch (error) {
        if (isActive) {
          setAwsConnection(null);
          setConnectionError(error?.message || 'Unable to load the AWS connection.');
        }
      } finally {
        if (isActive) setLoadingConnection(false);
      }
    };

    loadConnection();
    return () => { isActive = false; };
  }, [enabled, services, userId]);

  const refreshConnection = useCallback(async () => {
    if (!enabled) return standbyResult();
    if (!userId) {
      setAwsConnection(null);
      return { success: false, error: 'Authentication required. Please sign in to load your AWS connection.' };
    }

    setLoadingConnection(true);
    setConnectionError(null);
    try {
      const connection = await services.loadUserAwsConnection(userId);
      setAwsConnection(connection);
      return { success: true, connection };
    } catch (error) {
      const message = error?.message || 'Unable to load the AWS connection.';
      setConnectionError(message);
      return { success: false, error: message };
    } finally {
      setLoadingConnection(false);
    }
  }, [enabled, services, standbyResult, userId]);

  const testConnection = useCallback(async ({ accountId, roleArn, externalId }) => {
    if (!enabled) return standbyResult();
    const result = await services.testAwsConnection({ accountId, roleArn, externalId });
    setTestConnectionResult(result);
    return result;
  }, [enabled, services, standbyResult]);

  const saveConnection = useCallback(async ({ accountId, roleArn, externalId }) => {
    if (!enabled) return standbyResult();
    if (!userId) {
      const result = { success: false, error: 'Authentication required. Please sign in to save your AWS connection.' };
      setTestConnectionResult(result);
      return result;
    }

    const testResult = await services.testAwsConnection({ accountId, roleArn, externalId });
    setTestConnectionResult(testResult);
    if (!testResult.success) return { success: false, error: testResult.error };

    const saveResult = await services.saveUserAwsConnection(userId, {
      awsAccountId: accountId.trim(),
      roleArn: roleArn.trim(),
      externalId: externalId.trim(),
      status: testResult.status,
      lastVerifiedAt: testResult.lastVerifiedAt,
    });

    if (!saveResult.success) return { success: false, error: saveResult.error };
    setAwsConnection(saveResult.data);
    return { success: true, connection: saveResult.data };
  }, [enabled, services, standbyResult, userId]);

  const disconnectConnection = useCallback(async () => {
    if (!enabled) return standbyResult();
    const result = userId
      ? await services.deleteUserAwsConnection(userId)
      : { success: true };
    if (result?.success === false) return result;
    setAwsConnection(null);
    setTestConnectionResult(null);
    setConnectionError(null);
    return { success: true };
  }, [enabled, services, standbyResult, userId]);

  const regenerateExternalId = useCallback(async ({ accountId, roleArn }) => {
    if (!enabled) return standbyResult();
    if (!userId) return { success: false, error: 'Sign in to Study Tracker before regenerating External ID.' };

    const result = await services.regenerateUserExternalId(userId, accountId, roleArn);
    if (result.success) {
      setAwsConnection(result.data);
      setTestConnectionResult({
        status: 'disconnected',
        message: 'External ID regenerated. Please update your AWS CloudFormation stack with the new External ID parameter and re-test your connection.',
      });
    }
    return result;
  }, [enabled, services, standbyResult, userId]);

  const connectionStatus = awsConnection?.status || 'disconnected';
  const value = useMemo(() => ({
    enabled,
    awsConnection,
    connectionStatus,
    loadingConnection,
    testConnectionResult,
    connectionError,
    isSetupOpen,
    openSetup,
    closeSetup,
    refreshConnection,
    testConnection,
    saveConnection,
    disconnectConnection,
    regenerateExternalId,
  }), [
    enabled,
    awsConnection,
    connectionStatus,
    loadingConnection,
    testConnectionResult,
    connectionError,
    isSetupOpen,
    openSetup,
    closeSetup,
    refreshConnection,
    testConnection,
    saveConnection,
    disconnectConnection,
    regenerateExternalId,
  ]);

  return <AwsConnectionContext.Provider value={value}>{children}</AwsConnectionContext.Provider>;
};
