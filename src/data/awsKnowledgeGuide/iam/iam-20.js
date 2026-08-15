import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-20',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Role Assumption',
  status: 'ready',
  plainEnglish: 'IAM Role Assumption is the process by which an authenticated identity (such as a user, application, or AWS service) exchanges its current identity for an IAM Role. During role assumption, AWS STS verifies that the requesting identity is permitted by the role\'s Trust Policy, and if authorized, returns temporary security credentials granting the permissions defined in the role\'s permissions policies.',
  whyItMatters: 'Role assumption allows principals to dynamically adopt temporary elevated permissions only when needed, enforcing strict context boundaries and auditing role session actions in CloudTrail.',
  workplaceExample: 'A system administrator logs into AWS with a daily low-privilege user account. When they need to modify production VPC routing, they use the AWS Management Console role switcher to assume the `NetworkAdminRole` for 30 minutes.',
  examFocus: 'SAA-C03 Role Assumption Mechanics:\n- Role Switching: Users switch roles in the AWS Console or use `aws sts assume-role` in the CLI.\n- Credential Context: While assuming a role, the principal forfeits their original user permissions and adopts ONLY the role\'s permissions.\n- Role Chaining: Assuming Role A, then using Role A to assume Role B (limited to a maximum session duration of 1 hour).\n- Session Policies: Optional inline session policy passed during `assume-role` to further restrict permissions for that specific session.',
  keyPoints: [
    'Process of acquiring temporary credentials by assuming an IAM Role.',
    'Verified against the target role\'s Trust Policy by AWS STS.',
    'Replaces the requesting entity\'s original permissions with the role\'s permissions.',
    'Supports Role Chaining (assuming one role from another, max 1 hour session).',
    'Supports Session Policies to dynamically filter session permissions.'
  ],
  commonMistake: 'Attempting to perform role chaining across 3 roles and expecting a 12-hour session duration. Role chaining limits the maximum session duration to 1 hour.',
  example: 'Role Assumption in AWS CLI:\naws sts assume-role --role-arn "arn:aws:iam::<ACCOUNT_ID>:role/NetworkAdminRole" --role-session-name "VPCMaintenanceSession"',
  sources: [
    { title: 'Using IAM roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html' }
  ]
});
