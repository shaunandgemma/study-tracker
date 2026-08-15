import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-18',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Cross-Account IAM Roles',
  status: 'ready',
  plainEnglish: 'A Cross-Account IAM Role is an IAM role created in one AWS account (e.g. Account B) that trusts an IAM identity in a different AWS account (e.g. Account A) to assume it. Cross-account roles enable secure inter-account delegation without sharing permanent access keys or creating duplicate user accounts across environments.',
  whyItMatters: 'Enterprise cloud architectures divide workloads across dozens of dedicated AWS accounts (Dev, Staging, Production, Security). Cross-account roles allow engineers and deployment pipelines in a central DevOps account to access target accounts securely using temporary credentials.',
  workplaceExample: 'An automated CI/CD pipeline runs in Deployment Account `111111111111`. To deploy code to Production Account `222222222222`, the pipeline calls `sts:AssumeRole` to assume `ProdDeployerRole` in Account B. The trust policy in Account B uses `sts:ExternalId` to protect against Confused Deputy attacks.',
  examFocus: 'SAA-C03 Cross-Account Role Setup:\n1. Target Account B: Create Role `CrossAccountRole` with Trust Policy trusting Account A (`arn:aws:iam::111111111111:root`).\n2. Source Account A: Grant User/Role permission to call `sts:AssumeRole` on Target Account B Role ARN.\n3. Confused Deputy Protection: Always enforce `sts:ExternalId` in the trust policy condition when granting 3rd-party SaaS vendor access.',
  keyPoints: [
    'Enables secure access delegation across different AWS accounts.',
    'Requires an ALLOW in BOTH the source identity policy AND the target role trust policy.',
    'Uses temporary credentials issued by AWS Security Token Service (STS).',
    'Confused Deputy Mitigation: Use `sts:ExternalId` condition for 3rd-party SaaS integrations.',
    'Eliminates sharing static access keys across AWS accounts.'
  ],
  commonMistake: 'Configuring a cross-account role trust policy in Account B, but failing to grant `sts:AssumeRole` permission in the source user\'s identity policy in Account A, causing role assumption to fail.',
  example: 'Cross-Account Trust Policy JSON with External ID:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "AWS": "arn:aws:iam::<ACCOUNT_A_ID>:root" },\n    "Action": "sts:AssumeRole",\n    "Condition": { "StringEquals": { "sts:ExternalId": "UniqueSecretId123" } }\n  }]\n}',
  sources: [
    { title: 'Providing access to an IAM user in another AWS account that you own', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_aws-accounts.html' }
  ]
});
