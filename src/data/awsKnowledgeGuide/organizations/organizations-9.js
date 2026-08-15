import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-9',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Service Control Policies - SCPs',
  status: 'ready',
  plainEnglish: 'Service Control Policies (SCPs) are JSON governance policies that define the maximum available permissions for IAM users and roles across member accounts in an organization. SCPs set permission guardrails; they do NOT grant any permissions by themselves. An action must be allowed by both an SCP and an IAM policy for a user to perform it.',
  whyItMatters: 'Even if an IAM user in a member account is granted `AdministratorAccess`, an SCP attached to their account can block specific dangerous actions (like disabling CloudTrail or leaving the organization), enforcing enterprise security boundaries.',
  workplaceExample: 'A security architect attaches an SCP to the `Sandbox OU` that denies the `ec2:RunInstances` action for expensive instance types (e.g. `*.32xlarge`). Developers in sandbox accounts cannot launch expensive GPU instances regardless of their local IAM permissions.',
  examFocus: 'SAA-C03 SCP Evaluation & Behavior Rules:\n- Maximum Available Permissions: SCPs specify guardrail boundaries; they do NOT grant permissions.\n- Affected Identities: SCPs apply to all IAM users, IAM roles, and member account root users.\n- Management Account Exemption: SCPs do NOT restrict the Management Account.\n- Explicit Deny Rule: An explicit `Deny` in an SCP overrides any IAM `Allow` policy in member accounts.',
  keyPoints: [
    'JSON policies that define maximum available permission guardrails across member accounts.',
    'Do NOT grant permissions directly; an IAM policy must still explicitly allow the action.',
    'Apply to all IAM users, IAM roles, and root users in member accounts.',
    'Do NOT restrict actions taken inside the Management Account.',
    'An explicit `Deny` in an SCP overrides any IAM `Allow` statement.'
  ],
  commonMistake: 'Expecting an SCP with `"Effect": "Allow"` to grant permissions to a user who lacks an IAM identity policy allowing the action.',
  example: 'Sample SCP Denying Account Root User Access:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "DenyRootUserActions",\n    "Effect": "Deny",\n    "Action": "*",\n    "Resource": "*",\n    "Condition": {\n      "StringLike": {\n        "aws:PrincipalArn": "arn:aws:iam::*:root"\n      }\n    }\n  }]\n}',
  sources: [
    { title: 'Service Control Policies (SCPs)', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' }
  ]
});
