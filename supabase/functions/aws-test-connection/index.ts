import { corsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser } from '../_shared/auth.ts';
import { assumeTargetRole } from '../_shared/awsAssumeRole.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
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
    const awsAccountId = (body.awsAccountId || '').trim();
    const roleArn = (body.roleArn || '').trim();
    const externalId = (body.externalId || '').trim();

    if (!awsAccountId || !roleArn || !externalId) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'failed',
          error: 'awsAccountId, roleArn, and externalId are required.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate ARN account matches provided account ID
    const arnAccount = roleArn.split(':')[4];
    if (arnAccount !== awsAccountId) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 'account_mismatch',
          error: `Account ID mismatch: Form Account ID (${awsAccountId}) does not match Role ARN Account ID (${arnAccount}).`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call AWS STS AssumeRole & GetCallerIdentity
    const assumeResult = await assumeTargetRole(roleArn, externalId, awsAccountId);

    if (assumeResult.error) {
      return new Response(
        JSON.stringify({
          success: false,
          status: assumeResult.error.status,
          error: assumeResult.error.userMessage
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Success — NEVER return credentials!
    return new Response(
      JSON.stringify({
        success: true,
        status: 'connected',
        awsAccountId: assumeResult.assumedAccountId,
        assumedArn: assumeResult.assumedArn,
        lastVerifiedAt: new Date().toISOString(),
        message: 'Successfully assumed IAM Role via STS backend proxy!'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        status: 'failed',
        error: `Unexpected server error: ${err.message || String(err)}`
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
