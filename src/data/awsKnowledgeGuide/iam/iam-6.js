import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-6',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Users',
  status: 'ready',
  plainEnglish: 'An IAM User is an identity created within your AWS account that represents a specific person or application that interacts with AWS services. An IAM User consists of a friendly name, credentials (a console password for AWS Management Console access, or long-term Access Key Pairs for CLI/API access), and attached permissions policies defining what AWS actions the user is authorized to perform.',
  whyItMatters: 'IAM Users allow you to grant individual human operators or legacy applications unique credentials and least-privilege permissions, ensuring that individual actions in AWS can be audited back to a specific identity in CloudTrail.',
  workplaceExample: 'A system administrator creates an IAM User named `alice-dev` for a junior developer. They configure a console password, enforce MFA at first login, and attach permissions allowing read-only access to specific S3 development buckets.',
  examFocus: 'SAA-C03 Core Concept for IAM Users:\n- Long-Term Credentials: Console password and up to 2 active Access Key Pairs (Access Key ID + Secret Access Key).\n- Best Practice Shift: Human workforce users should use IAM Identity Center (SAML 2.0 / OIDC federation) rather than permanent IAM users where practical.\n- Applications running on AWS (EC2, ECS, Lambda) should NEVER use IAM User access keys; they MUST use IAM Roles and temporary STS credentials.',
  keyPoints: [
    'Represents a persistent identity within an AWS account for a person or application.',
    'Has long-term credentials (password for Management Console, access keys for CLI/SDK).',
    'Supports up to 2 active Access Key Pairs simultaneously for credential rotation.',
    'Best Practice: Require Multi-Factor Authentication (MFA) for all console users.',
    'AWS Recommendation: Prefer IAM Identity Center for workforce users and IAM Roles for workloads.'
  ],
  commonMistake: 'Embedding long-term IAM User Access Keys (`AKIA...`) inside application source code or public Git repositories, exposing the AWS account to unauthorized access.',
  example: 'IAM User Configuration via AWS CLI:\naws iam create-user --user-name alice-dev\naws iam create-access-key --user-name alice-dev',
  sources: [
    { title: 'IAM Users', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html' }
  ]
});
