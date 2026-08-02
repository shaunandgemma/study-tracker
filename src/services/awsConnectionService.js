/**
 * AWS Connection Service for Study Tracker Hands-On Tasks
 *
 * Reads/writes connection metadata strictly from/to Supabase user_aws_connections table.
 * Invokes Supabase Edge Functions (aws-test-connection, aws-validate-task) for live STS AssumeRole
 * and AWS SDK read-only resource inspection.
 *
 * REMOVED: localStorage usage completely.
 * CRITICAL RULE: "Connected" is displayed ONLY when the backend Edge Function confirms live STS AssumeRole.
 */

import { supabase } from '../lib/supabase.js';
import { getValidationContractsForTask } from '../data/taskValidationRegistry.js';

export function isSimulationModeEnabled() {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
  return env.VITE_AWS_SIMULATION_MODE === 'true' || env.VITE_AWS_SIMULATION_MODE === true;
}

export function parseEdgeFunctionError(error) {
  if (!error) return 'Edge Function execution failed.';
  const msg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));

  if (msg.includes('auth_required') || msg.includes('Sign in to Study Tracker')) {
    return 'Sign in to Study Tracker before connecting an AWS account.';
  }
  if (msg.includes('401') || msg.includes('JWT') || msg.includes('Unauthorized') || msg.includes('AuthApiError')) {
    return 'Supabase authentication required. Please sign in to connect your AWS account.';
  }
  if (msg.includes('404') || msg.includes('FunctionsFetchError') || msg.includes('not found')) {
    return 'Edge Function unavailable. Please ensure aws-test-connection is deployed.';
  }
  if (msg.includes('Backend AWS credentials missing') || msg.includes('InvalidClientTokenId')) {
    return 'Backend AWS credentials invalid. Configure AWS secrets on Supabase.';
  }
  if (msg.includes('BackendRole') && (msg.includes('AccessDenied') || msg.includes('AssumeRole'))) {
    return 'Backend role assumption denied. Check backend role policies.';
  }
  if (msg.includes('AccessDenied') || msg.includes('AssumeRole')) {
    return 'Target role assumption denied. Verify CloudFormation stack, role ARN, and External ID in AWS.';
  }
  if (msg.includes('AccountMismatch') || msg.includes('account mismatch') || msg.includes('mismatch')) {
    return 'Account ID mismatch. Form Account ID does not match assumed AWS account.';
  }
  if (msg.includes('ExternalId') || msg.includes('external id')) {
    return 'External ID mismatch. Check trust policy in AWS CloudFormation role.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch failed')) {
    return 'Network error: Failed to connect to Supabase Edge Function endpoint.';
  }

  return msg;
}

export function getRequiredPermissionsForTask(task) {
  const contracts = getValidationContractsForTask(task);
  const perms = new Set(['aws:GetCallerIdentity']);
  contracts.forEach(c => {
    if (c.requiredPermissions) {
      c.requiredPermissions.forEach(p => perms.add(p));
    }
  });
  return Array.from(perms);
}

export const ROLE_ARN_REGEX = /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/;
export const ACCOUNT_ID_REGEX = /^\d{12}$/;
export const REGION_REGEX = /^[a-z]{2}-[a-z]+-\d{1}$/;

export function validateRoleArnFormat(roleArn) {
  if (!roleArn || typeof roleArn !== 'string') return false;
  return ROLE_ARN_REGEX.test(roleArn.trim());
}

export function validateAccountIdFormat(accountId) {
  if (!accountId || typeof accountId !== 'string') return false;
  return ACCOUNT_ID_REGEX.test(accountId.trim());
}

export function validateRegionFormat(region) {
  if (!region || typeof region !== 'string') return false;
  return REGION_REGEX.test(region.trim());
}

export function validateResourceInputFormat(validationType, input) {
  if (!input || typeof input !== 'string') return true; // Optional empty input
  const val = input.trim();
  if (!val) return true;

  if (validationType.startsWith('s3.')) {
    return /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(val);
  }
  if (validationType === 'ec2.instance-exists' || validationType === 'ec2.instance-running') {
    return /^i-[0-9a-f]{8,17}$/.test(val);
  }
  if (validationType === 'ec2.vpc-exists' || validationType === 'ec2.subnet-exists') {
    return /^vpc-[0-9a-f]{8,17}$/.test(val);
  }
  if (validationType === 'ec2.security-group-rule-exists') {
    return /^sg-[0-9a-f]{8,17}$/.test(val);
  }
  if (validationType.startsWith('iam.')) {
    return /^[\w+=,.@-]+$/.test(val);
  }
  if (validationType.startsWith('rds.')) {
    return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(val);
  }
  if (validationType.startsWith('dynamodb.')) {
    return /^[a-zA-Z0-9_.-]+$/.test(val);
  }
  return true;
}

/**
 * Generates a unique UUID v4 for the External ID per user session
 */
export function generateExternalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Loads user AWS connection from Supabase database table `user_aws_connections`
 * Ensures a single persistent external_id exists per authenticated user.
 */
export async function loadUserAwsConnection(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('user_aws_connections')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[awsConnectionService] Error fetching connection from Supabase:', error.message);
    }

    if (data && data.external_id) {
      return {
        id: data.id,
        userId: data.user_id,
        awsAccountId: data.aws_account_id || '',
        roleArn: data.role_arn || '',
        externalId: data.external_id,
        status: data.status || 'disconnected',
        lastVerifiedAt: data.last_verified_at,
        backendVerified: data.status === 'connected'
      };
    }

    // Generate a single persistent External ID UUID for this user if none exists in DB yet
    const newExtId = generateExternalId();
    const initialPayload = {
      user_id: userId,
      aws_account_id: data?.aws_account_id || '',
      role_arn: data?.role_arn || '',
      external_id: newExtId,
      status: data?.status || 'disconnected',
      updated_at: new Date().toISOString()
    };

    const { data: upsertedData, error: upsertError } = await supabase
      .from('user_aws_connections')
      .upsert(initialPayload, { onConflict: 'user_id' })
      .select()
      .single();

    if (upsertError) {
      console.warn('[awsConnectionService] Failed to auto-persist initial externalId:', upsertError.message);
      return {
        id: null,
        userId,
        awsAccountId: '',
        roleArn: '',
        externalId: newExtId,
        status: 'disconnected',
        lastVerifiedAt: null,
        backendVerified: false
      };
    }

    return {
      id: upsertedData.id,
      userId: upsertedData.user_id,
      awsAccountId: upsertedData.aws_account_id || '',
      roleArn: upsertedData.role_arn || '',
      externalId: upsertedData.external_id,
      status: upsertedData.status || 'disconnected',
      lastVerifiedAt: upsertedData.last_verified_at,
      backendVerified: upsertedData.status === 'connected'
    };

  } catch (err) {
    console.error('[awsConnectionService] Exception fetching connection:', err);
    return null;
  }
}

/**
 * Regenerates External ID for user upon explicit confirmation
 */
export async function regenerateUserExternalId(userId, currentAccountId = '', currentRoleArn = '') {
  if (!userId) {
    return { success: false, error: 'Sign in to Study Tracker before regenerating External ID.' };
  }
  try {
    const newExtId = generateExternalId();
    const payload = {
      user_id: userId,
      aws_account_id: (currentAccountId || '').trim(),
      role_arn: (currentRoleArn || '').trim(),
      external_id: newExtId,
      status: 'disconnected', // Require re-verification after External ID change
      last_verified_at: null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_aws_connections')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('[awsConnectionService] Supabase DB regenerate error:', error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        awsAccountId: data.aws_account_id || '',
        roleArn: data.role_arn || '',
        externalId: data.external_id,
        status: data.status || 'disconnected',
        lastVerifiedAt: null,
        backendVerified: false
      }
    };
  } catch (err) {
    console.error('[awsConnectionService] Exception regenerating external ID:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Saves/upserts user AWS connection metadata in Supabase `user_aws_connections`
 */
export async function saveUserAwsConnection(userId, connectionData) {
  if (!userId) {
    return { success: false, error: 'Sign in to Study Tracker before connecting an AWS account.' };
  }
  try {
    const payload = {
      user_id: userId,
      aws_account_id: connectionData.awsAccountId,
      role_arn: connectionData.roleArn,
      external_id: connectionData.externalId,
      status: connectionData.status || 'disconnected',
      last_verified_at: connectionData.lastVerifiedAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_aws_connections')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('[awsConnectionService] Supabase DB upsert error:', error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        awsAccountId: data.aws_account_id,
        roleArn: data.role_arn,
        externalId: data.external_id,
        status: data.status,
        lastVerifiedAt: data.last_verified_at,
        backendVerified: data.status === 'connected'
      }
    };
  } catch (err) {
    console.error('[awsConnectionService] Exception saving connection to Supabase:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Deletes user AWS connection record from Supabase `user_aws_connections`
 */
export async function deleteUserAwsConnection(userId) {
  if (!userId) return { success: true };
  try {
    const { error } = await supabase
      .from('user_aws_connections')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[awsConnectionService] Supabase DB delete error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[awsConnectionService] Exception deleting connection from Supabase:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Invokes Edge Function `aws-test-connection` to test real AWS STS AssumeRole
 */
export async function testAwsConnection({ accountId, roleArn, externalId }) {
  const cleanAccount = (accountId || '').trim();
  const cleanArn = (roleArn || '').trim();
  const cleanExtId = (externalId || '').trim();

  // 1. Client-side Format Validation
  if (!validateAccountIdFormat(cleanAccount)) {
    return {
      success: false,
      status: 'failed',
      error: 'Invalid AWS Account ID format. Must be exactly 12 digits (e.g. 123456789012).'
    };
  }

  if (!validateRoleArnFormat(cleanArn)) {
    return {
      success: false,
      status: 'failed',
      error: 'Invalid IAM Role ARN format. Must match arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME.'
    };
  }

  if (!cleanExtId) {
    return {
      success: false,
      status: 'failed',
      error: 'External ID is required.'
    };
  }

  const arnAccount = cleanArn.split(':')[4];
  if (arnAccount !== cleanAccount) {
    return {
      success: false,
      status: 'account_mismatch',
      error: `Account ID mismatch: Form Account ID (${cleanAccount}) does not match Role ARN Account ID (${arnAccount}).`
    };
  }

  // 2. Explicit Simulation Mode check (only if VITE_AWS_SIMULATION_MODE === 'true')
  if (isSimulationModeEnabled()) {
    return {
      success: true,
      status: 'simulation',
      lastVerifiedAt: new Date().toISOString(),
      message: 'Simulation Mode Active: Role format valid. Development mode enabled via VITE_AWS_SIMULATION_MODE.',
      backendVerified: false
    };
  }

  // 3. Auth Check: Confirm Supabase Session before Edge Function invocation
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        success: false,
        status: 'auth_required',
        error: 'Sign in to Study Tracker before connecting an AWS account.'
      };
    }
  } catch (authErr) {
    return {
      success: false,
      status: 'auth_required',
      error: 'Sign in to Study Tracker before connecting an AWS account.'
    };
  }

  // 4. Production Mode: Invoke Supabase Edge Function `aws-test-connection`
  try {
    const { data, error } = await supabase.functions.invoke('aws-test-connection', {
      body: {
        awsAccountId: cleanAccount,
        roleArn: cleanArn,
        externalId: cleanExtId
      }
    });

    if (error) {
      console.error('[awsConnectionService] Edge Function invoke error:', error);
      const userMessage = parseEdgeFunctionError(error);
      return {
        success: false,
        status: 'failed',
        error: userMessage
      };
    }

    if (data && data.status === 'connected') {
      return {
        success: true,
        status: 'connected',
        lastVerifiedAt: data.lastVerifiedAt || new Date().toISOString(),
        message: data.message || 'Successfully assumed IAM Role via STS backend function!',
        backendVerified: true
      };
    }

    const failedMessage = data?.error || data?.message || 'AWS STS AssumeRole connection failed.';
    return {
      success: false,
      status: data?.status || 'failed',
      error: parseEdgeFunctionError(failedMessage)
    };

  } catch (err) {
    console.error('[awsConnectionService] Edge Function network exception:', err);
    return {
      success: false,
      status: 'failed',
      error: parseEdgeFunctionError(`Network error: ${err.message || 'Unable to reach Supabase Edge Function endpoint.'}`)
    };
  }
}

/**
 * Invokes Edge Function `aws-validate-task` to run read-only resource inspection
 */
export async function validateTaskResource(
  task,
  connection,
  resourceInput = '',
  invokeValidation = (functionName, options) => supabase.functions.invoke(functionName, options)
) {
  if (!connection) {
    return {
      status: 'not_connected',
      message: 'No AWS Account connected. Click "Connect AWS Account" to configure setup.',
      results: []
    };
  }

  const contracts = getValidationContractsForTask(task);
  if (contracts.length === 0) {
    return {
      status: 'validation_unavailable',
      isSimulation: false,
      message: 'Live validation is not yet available for this lab.',
      results: [],
      requiredPermissions: []
    };
  }
  const requiredPermissions = Array.from(new Set(
    contracts.flatMap(contract => contract.requiredPermissions || [])
  ));
  const cleanInput = (resourceInput || '').trim();

  // Explicit simulation mode check (only if VITE_AWS_SIMULATION_MODE === 'true' or connection status explicitly simulation)
  if (isSimulationModeEnabled() || connection.status === 'simulation') {
    const results = contracts.map((c, idx) => ({
      id: `verify-${idx + 1}`,
      type: c.type,
      text: c.description || `Verify ${c.type}`,
      passed: true,
      mode: 'simulation',
      message: `[Simulation Contract] Requires ${c.requiredPermissions.join(', ')}.${cleanInput ? ` Target Resource: ${cleanInput}` : ''}`
    }));

    return {
      status: 'simulation_passed',
      isSimulation: true,
      message: 'Simulation Contract Verified — Development mode active.',
      results,
      requiredPermissions
    };
  }

  // Production Mode: validate every contract independently. Each invocation uses
  // the same resource input and preserves the response for its matching contract.
  const results = await Promise.all(contracts.map(async (contract, idx) => {
    try {
      const { data, error } = await invokeValidation('aws-validate-task', {
        body: {
          roleArn: connection.roleArn,
          externalId: connection.externalId,
          awsAccountId: connection.awsAccountId,
          validationType: contract.type,
          resourceInput: cleanInput,
          region: task.region || 'eu-west-2'
        }
      });

      if (error || !data || !data.success) {
        const errorMsg = parseEdgeFunctionError(data?.error || error?.message || 'AWS API inspection failed');
        return {
          id: `verify-${idx + 1}`,
          type: contract.type,
          text: contract.description || `Verify ${contract.type}`,
          passed: false,
          mode: 'failed',
          message: `[Live AWS Failed] ${errorMsg}`
        };
      }

      return {
        id: `verify-${idx + 1}`,
        type: contract.type,
        text: contract.description || `Verify ${contract.type}`,
        passed: data.result?.passed === true,
        mode: 'live',
        message: data.result?.message || data.message || `[Live AWS Failed] ${contract.type} returned no validation message.`
      };
    } catch (err) {
      const errorMsg = parseEdgeFunctionError(err?.message || String(err));
      return {
        id: `verify-${idx + 1}`,
        type: contract.type,
        text: contract.description || `Verify ${contract.type}`,
        passed: false,
        mode: 'failed',
        message: `[Live AWS Error] ${errorMsg}`
      };
    }
  }));

  const allPassed = results.length > 0 && results.every(result => result.passed);
  const passedCount = results.filter(result => result.passed).length;

  return {
    status: allPassed ? 'live_passed' : 'live_failed',
    isSimulation: false,
    message: allPassed
      ? `Live AWS Resource Inspection Complete: all ${results.length} checks passed.`
      : `Live AWS Resource Inspection Failed: ${passedCount} of ${results.length} checks passed.`,
    results,
    requiredPermissions
  };
}
