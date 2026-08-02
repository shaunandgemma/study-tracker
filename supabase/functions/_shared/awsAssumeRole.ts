import { STSClient, AssumeRoleCommand, GetCallerIdentityCommand } from 'npm:@aws-sdk/client-sts@3';
import { mapAwsError } from './awsErrors.ts';

const DEFAULT_BACKEND_ROLE_ARN = 'arn:aws:iam::406760143388:role/StudyTrackerAwsValidationBackendRole';

export async function assumeTargetRole(roleArn: string, externalId: string, expectedAccountId: string) {
  const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1';
  const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
  const backendRoleArn = Deno.env.get('AWS_BACKEND_ROLE_ARN') || DEFAULT_BACKEND_ROLE_ARN;

  if (!accessKeyId || !secretAccessKey) {
    console.error('[awsAssumeRole] STAGE FAILED: base_identity - AWS credentials missing in environment secrets.');
    return {
      credentials: null,
      error: {
        status: 'simulation',
        userMessage: 'Backend execution role / AWS credentials missing on server.'
      }
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 1 & 2: Base IAM User credentials assume StudyTrackerAwsValidationBackendRole
  // ---------------------------------------------------------------------------
  const baseStsClient = new STSClient({
    region: awsRegion,
    credentials: { accessKeyId, secretAccessKey }
  });

  let backendCredentials: { accessKeyId: string; secretAccessKey: string; sessionToken?: string };

  try {
    const backendAssumeRes = await baseStsClient.send(new AssumeRoleCommand({
      RoleArn: backendRoleArn,
      RoleSessionName: 'StudyTrackerEdgeUserBackendSession',
      DurationSeconds: 900 // 15 minute short session
    }));

    if (!backendAssumeRes.Credentials?.AccessKeyId || !backendAssumeRes.Credentials?.SecretAccessKey) {
      console.error(`[awsAssumeRole] STAGE FAILED: backend_role_assumption - Empty credentials returned for ${backendRoleArn}`);
      return {
        credentials: null,
        error: { status: 'failed', userMessage: 'Backend role assumption returned empty credentials.' }
      };
    }

    backendCredentials = {
      accessKeyId: backendAssumeRes.Credentials.AccessKeyId,
      secretAccessKey: backendAssumeRes.Credentials.SecretAccessKey,
      sessionToken: backendAssumeRes.Credentials.SessionToken
    };

    console.log(`[awsAssumeRole] STAGE SUCCESS: backend_role_assumption - Assumed ${backendRoleArn}`);
  } catch (err: any) {
    const errCode = err.name || err.code || 'UnknownError';
    console.error(`[awsAssumeRole] STAGE FAILED: backend_role_assumption - Code: ${errCode}, RoleArn: ${backendRoleArn}`);
    const mapped = mapAwsError(err);
    mapped.userMessage = `Backend role assumption denied (${errCode}). ${mapped.userMessage}`;
    return { credentials: null, error: mapped };
  }

  // ---------------------------------------------------------------------------
  // STEP 3 & 4: Temporary Backend Role credentials assume target user StudyTrackerHandsOnRole
  // ---------------------------------------------------------------------------
  const backendStsClient = new STSClient({
    region: awsRegion,
    credentials: backendCredentials
  });

  let targetCredentials: { accessKeyId: string; secretAccessKey: string; sessionToken?: string };

  try {
    const targetAssumeRes = await backendStsClient.send(new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: 'StudyTrackerTargetRoleSession',
      ExternalId: externalId,
      DurationSeconds: 900 // 15 minute short session
    }));

    if (!targetAssumeRes.Credentials?.AccessKeyId || !targetAssumeRes.Credentials?.SecretAccessKey) {
      console.error(`[awsAssumeRole] STAGE FAILED: target_role_assumption - Empty credentials returned for ${roleArn}`);
      return {
        credentials: null,
        error: { status: 'failed', userMessage: 'Target role assumption returned empty credentials.' }
      };
    }

    targetCredentials = {
      accessKeyId: targetAssumeRes.Credentials.AccessKeyId,
      secretAccessKey: targetAssumeRes.Credentials.SecretAccessKey,
      sessionToken: targetAssumeRes.Credentials.SessionToken
    };

    console.log(`[awsAssumeRole] STAGE SUCCESS: target_role_assumption - Assumed ${roleArn}`);
  } catch (err: any) {
    const errCode = err.name || err.code || 'UnknownError';
    console.error(`[awsAssumeRole] STAGE FAILED: target_role_assumption - Code: ${errCode}, TargetRoleArn: ${roleArn}`);
    const mapped = mapAwsError(err);
    return { credentials: null, error: mapped };
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Call GetCallerIdentity using target credentials to verify Account ID
  // ---------------------------------------------------------------------------
  try {
    const targetStsClient = new STSClient({
      region: awsRegion,
      credentials: targetCredentials
    });

    const callerIdentity = await targetStsClient.send(new GetCallerIdentityCommand({}));
    const assumedAccount = callerIdentity.Account;

    if (expectedAccountId && assumedAccount !== expectedAccountId) {
      console.error(`[awsAssumeRole] STAGE FAILED: account_mismatch - Expected: ${expectedAccountId}, Returned: ${assumedAccount}`);
      return {
        credentials: null,
        error: {
          status: 'account_mismatch',
          userMessage: `Account ID mismatch: Expected ${expectedAccountId}, but assumed role belongs to ${assumedAccount}.`
        }
      };
    }

    console.log(`[awsAssumeRole] STAGE SUCCESS: caller_identity - Account: ${assumedAccount}, Arn: ${callerIdentity.Arn}`);
    return {
      credentials: targetCredentials,
      assumedAccountId: assumedAccount,
      assumedArn: callerIdentity.Arn,
      error: null
    };

  } catch (err: any) {
    const errCode = err.name || err.code || 'UnknownError';
    console.error(`[awsAssumeRole] STAGE FAILED: caller_identity - Code: ${errCode}`);
    const mapped = mapAwsError(err);
    return { credentials: null, error: mapped };
  }
}
