import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-14',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Cross-Account Access',
  status: 'ready',
  plainEnglish: 'ECR Cross-Account Access allows IAM principals (roles or users) in one AWS account to push, pull, or manage container images stored in an ECR repository belonging to a different AWS account. This cross-account mechanism relies on combining an ECR Repository Policy (on the source repository) with an IAM Policy (on the target principal).',
  whyItMatters: 'In multi-account enterprise architectures (AWS Organizations), build pipelines operate in a CI/CD tools account while compute clusters run in separate Production and Staging accounts. Cross-account access connects these environments seamlessly.',
  workplaceExample: 'An enterprise builds container images in Account A (`111111111111`). Account B (`222222222222`) runs an EKS cluster. By configuring an ECR Repository Policy in Account A allowing Account B\'s node role to read images, the EKS cluster pulls images directly from Account A during pod startup.',
  examFocus: 'SAA-C03 Cross-Account Access checklist:\n1. Source Account: ECR Repository Policy must explicitly trust Target Account ID / Role Principal for `ecr:BatchGetImage` & `ecr:GetDownloadUrlForLayer`.\n2. Target Account: Target IAM Role must have IAM permissions to perform ECR actions (`ecr:BatchGetImage`, `ecr:GetAuthorizationToken`).\n3. Note: `ecr:GetAuthorizationToken` is executed in the target principal\'s own account to authenticate.',
  keyPoints: [
    'Enables secure container image sharing across different AWS accounts.',
    'Requires permissions in both resource policy (Repository Policy) and identity policy (IAM Role).',
    'Supports sharing single repositories or entire AWS Organizations using `aws:PrincipalOrgID`.',
    'Eliminates duplicate image pushes to multiple account registries.',
    'Works seamlessly with ECS, EKS, and AWS Fargate cross-account task execution.'
  ],
  commonMistake: 'Attempting to configure cross-account pull access by modifying only the IAM role in Account B without updating the ECR Repository Policy in Account A to trust Account B.',
  example: 'AWS Organization-wide Repository Policy Statement:\n`"Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }`',
  sources: [
    { title: 'Repository policy statements for Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html' }
  ]
});
