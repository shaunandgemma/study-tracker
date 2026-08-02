export function mapAwsError(err: any) {
  const name = err?.name || err?.code || '';
  const message = err?.message || String(err);

  if (name === 'AccessDenied' || name === 'AccessDeniedException' || message.includes('AccessDenied')) {
    return {
      status: 'access_denied',
      userMessage: 'Access Denied: The IAM role trust policy or permission policy does not grant access. Verify External ID and trust relationship.'
    };
  }

  if (name === 'InvalidClientTokenId' || name === 'ExpiredToken' || message.includes('token')) {
    return {
      status: 'expired',
      userMessage: 'Security Token Error: Backend credentials or session tokens are invalid or expired.'
    };
  }

  if (name === 'AccountMismatch' || message.includes('mismatch')) {
    return {
      status: 'account_mismatch',
      userMessage: 'Account Mismatch: Assumed role Account ID does not match the target AWS Account ID.'
    };
  }

  if (name === 'NoSuchEntity' || name === 'ResourceNotFoundException' || message.includes('not found')) {
    return {
      status: 'role_unavailable',
      userMessage: 'Role Unavailable: The specified IAM role ARN does not exist in the target AWS account.'
    };
  }

  return {
    status: 'failed',
    userMessage: `AWS STS AssumeRole Error: ${message.slice(0, 120)}`
  };
}
