import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-17',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Role Trust Policies',
  status: 'ready',
  plainEnglish: 'An IAM Role Trust Policy is a resource-based JSON policy attached directly to an IAM Role that defines WHO is allowed to assume that role. The trust policy specifies the trusted entities (the `Principal`—such as an AWS service, an IAM User in another AWS account, or a SAML/OIDC federated identity provider) and optional conditions under which role assumption is allowed.',
  whyItMatters: 'Without a trust policy, an IAM role cannot be assumed by anyone. The trust policy acts as the gatekeeper, granting specific entities permission to call `sts:AssumeRole`.',
  workplaceExample: 'An engineer creates an IAM Role for EC2 instances. The role\'s Trust Policy specifies `"Principal": { "Service": "ec2.amazonaws.com" }` with action `sts:AssumeRole`. This permits EC2 compute nodes to assume the role and acquire temporary credentials.',
  examFocus: 'SAA-C03 Trust Policy Rules:\n- Action: MUST specify `sts:AssumeRole` (or `sts:AssumeRoleWithWebIdentity` / `sts:AssumeRoleWithSAML`).\n- Principal: Specifies the trusted entity (AWS Service, IAM User/Role ARN, AWS Account ID, or Identity Provider).\n- Trust Policy vs Permissions Policy: Trust Policy defines WHO can assume the role; Permissions Policy defines WHAT the role can do after assumption.',
  keyPoints: [
    'Resource-based JSON policy defining which entities can assume an IAM Role.',
    'Action must be `sts:AssumeRole` (or federated STS variant).',
    'Principal specifies trusted AWS services, account IDs, or identity providers.',
    'Supports Condition keys (such as `sts:ExternalId` or `aws:PrincipalOrgID`).',
    'Required component for creating any functional IAM Role.'
  ],
  commonMistake: 'Confusing an IAM Role Trust Policy with a Permissions Policy. Attaching permissions actions (like `s3:GetObject`) inside a Trust Policy causes a JSON policy error.',
  example: 'Sample EC2 Service Trust Policy JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "Service": "ec2.amazonaws.com" },\n    "Action": "sts:AssumeRole"\n  }]\n}',
  sources: [
    { title: 'How to use IAM roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html' }
  ]
});
