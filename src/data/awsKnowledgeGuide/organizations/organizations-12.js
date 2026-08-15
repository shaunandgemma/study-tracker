import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-12',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Explicit Deny in SCPs',
  status: 'ready',
  plainEnglish: 'An explicit `Deny` statement in a Service Control Policy overrides any `Allow` statement in any IAM Identity Policy, IAM Role, or Resource Policy within affected member accounts. When an SCP explicitly denies an action (e.g. `"Effect": "Deny", "Action": "s3:DeleteBucket"`), no user or role in that member account—including the account root user—can perform that action.',
  whyItMatters: 'Explicit Deny statements in SCPs are the most powerful guardrails in AWS. They ensure immutable corporate compliance rules (such as enforcing encryption or blocking unapproved Regions) that member account admins cannot bypass.',
  workplaceExample: 'A security team attaches an SCP containing an explicit `Deny` on `organizations:LeaveOrganization` to all member accounts. Even if a compromised admin credentials attempt to remove the account from the organization, the explicit Deny in the SCP blocks the request.',
  examFocus: 'SAA-C03 Explicit Deny Evaluation Rules:\n- Priority Rule: Explicit Deny ALWAYS overrides any explicit Allow in IAM policies or resource policies.\n- Root User Impact: Member account root users are restricted by explicit Deny SCP statements.\n- Scope of Impact: Applies to all IAM users, federated roles, and service roles in the member account.\n- Exception: Explicit Deny SCPs do NOT apply to the Management Account.',
  keyPoints: [
    'An explicit `Deny` in an SCP overrides ALL explicit `Allow` statements.',
    'Restricts all IAM users, IAM roles, and member account root users.',
    'Used to enforce immutable compliance guardrails across member accounts.',
    'Cannot be overridden by member account administrators or local IAM policies.',
    'Management Account is exempt from SCP explicit Deny statements.'
  ],
  commonMistake: 'Attempting to grant an administrator in a member account access to an action explicitly denied by an SCP by attaching an `AdministratorAccess` IAM policy locally.',
  example: 'Explicit Deny SCP Blocking Unencrypted S3 Bucket Creation:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "DenyUnencryptedS3Creation",\n    "Effect": "Deny",\n    "Action": "s3:CreateBucket",\n    "Resource": "*",\n    "Condition": {\n      "Bool": {\n        "s3:x-amz-acl": "true"\n      }\n    }\n  }]\n}',
  sources: [
    { title: 'SCP evaluation logic and explicit deny', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html' }
  ]
});
