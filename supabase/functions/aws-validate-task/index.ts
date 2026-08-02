import { corsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser } from '../_shared/auth.ts';
import { assumeTargetRole } from '../_shared/awsAssumeRole.ts';
import { validateS3Task } from '../_shared/awsTaskValidators/s3Validators.ts';
import { validateEC2Task } from '../_shared/awsTaskValidators/ec2Validators.ts';
import { validateIAMTask } from '../_shared/awsTaskValidators/iamValidators.ts';
import { validateRDSTask } from '../_shared/awsTaskValidators/rdsValidators.ts';
import { validateDynamoDBTask } from '../_shared/awsTaskValidators/dynamodbValidators.ts';
import { validateCloudWatchTask } from '../_shared/awsTaskValidators/cloudWatchValidators.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, status: 'unauthorized', error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      roleArn,
      externalId,
      awsAccountId,
      validationType,
      resourceInput,
      region = 'eu-west-2'
    } = body;

    if (!roleArn || !externalId || !awsAccountId || !validationType) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'failed',
          error: 'roleArn, externalId, awsAccountId, and validationType are required.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Assume target role via STS
    const assumeResult = await assumeTargetRole(roleArn, externalId, awsAccountId);

    if (assumeResult.error || !assumeResult.credentials) {
      return new Response(
        JSON.stringify({
          success: false,
          status: assumeResult.error?.status || 'failed',
          isSimulation: false,
          error: assumeResult.error?.userMessage || 'STS AssumeRole failed.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const creds = assumeResult.credentials;

    // 2. Dispatch to specific validator module based on validationType prefix
    let checkResult = { passed: false, message: 'Unsupported validation type.' };

    if (validationType.startsWith('s3.')) {
      checkResult = await validateS3Task(creds, region, validationType, resourceInput);
    } else if (validationType.startsWith('ec2.')) {
      checkResult = await validateEC2Task(creds, region, validationType, resourceInput);
    } else if (validationType.startsWith('iam.')) {
      checkResult = await validateIAMTask(creds, region, validationType, resourceInput);
    } else if (validationType.startsWith('rds.')) {
      checkResult = await validateRDSTask(creds, region, validationType, resourceInput);
    } else if (validationType.startsWith('dynamodb.')) {
      checkResult = await validateDynamoDBTask(creds, region, validationType, resourceInput);
    } else if (validationType.startsWith('cloudwatch.')) {
      checkResult = await validateCloudWatchTask(creds, region, validationType, resourceInput);
    }

    return new Response(
      JSON.stringify({
        success: true,
        isSimulation: false,
        status: checkResult.passed ? 'live_passed' : 'live_failed',
        result: checkResult,
        message: checkResult.message
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 'failed',
        error: `Validation error: ${err.message || String(err)}`
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
