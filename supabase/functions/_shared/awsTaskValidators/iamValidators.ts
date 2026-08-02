import { IAMClient, GetRoleCommand } from 'npm:@aws-sdk/client-iam@3';

export async function validateIAMTask(credentials: any, region: string, type: string, resourceInput: string) {
  const iamClient = new IAMClient({ region, credentials });
  const roleName = (resourceInput || '').trim();

  if (!roleName) {
    return { passed: false, message: 'Role name resource input is required for IAM validation.' };
  }

  try {
    if (type === 'iam.role-exists') {
      const res = await iamClient.send(new GetRoleCommand({ RoleName: roleName }));
      if (res.Role?.Arn) {
        return { passed: true, message: `Live AWS Verified: IAM Role '${roleName}' exists.` };
      }
      return { passed: false, message: `IAM Role '${roleName}' does not exist.` };
    }
    return { passed: false, message: `Unsupported IAM validation type '${type}'.` };
  } catch (err: any) {
    return { passed: false, message: `IAM Resource Check Failed: ${err.message || String(err)}` };
  }
}
