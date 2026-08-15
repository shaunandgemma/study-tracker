import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-14',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'IAM Access Control',
  status: 'ready',
  plainEnglish: 'IAM Access Control for Parameter Store uses AWS Identity and Access Management policies to restrict API access to specific parameters, parameter hierarchies, or operation types (`ssm:GetParameter`, `ssm:PutParameter`, `ssm:GetParametersByPath`). By combining IAM policies with parameter path hierarchies, security teams enforce strict least-privilege boundaries between environments.',
  whyItMatters: 'Without path-based IAM access control, a compromised development application could read production database passwords or API keys. IAM path scoping isolates development, staging, and production parameter access.',
  workplaceExample: 'A security engineer attaches an IAM policy to the `DevEC2Role` that grants `ssm:GetParameter` ONLY on `arn:aws:ssm:us-east-1:123456789012:parameter/app/dev/*`. Attempts to read `/app/prod/*` return an Access Denied error.',
  examFocus: 'SAA-C03 Parameter Store IAM Policy Design:\n- Resource-Level Permissions: Supports resource ARNs with path wildcards (e.g. `arn:aws:ssm:region:account:parameter/app/dev/*`).\n- Action Scoping: Differentiate `ssm:GetParameter` (read), `ssm:PutParameter` (write), and `ssm:GetParametersByPath` (bulk read).\n- KMS Key Dependency: For `SecureString` parameters, the IAM role MUST also have `kms:Decrypt` permissions on the KMS key ARN.',
  keyPoints: [
    'Enforces fine-grained least-privilege security access using IAM policies.',
    'Supports resource-level permissions using parameter path wildcards.',
    'Isolates environment parameters (e.g. restricts dev roles to `/app/dev/*`).',
    'Differentiates read (`GetParameter`) from write (`PutParameter`) permissions.',
    'Requires pairing with `kms:Decrypt` IAM permissions for SecureString parameters.'
  ],
  commonMistake: 'Granting `ssm:GetParameters` on `Resource: "*"` in a developer IAM policy, allowing development workloads to read sensitive production credentials.',
  example: 'Least-Privilege IAM Policy for Parameter Path Access:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["ssm:GetParameter", "ssm:GetParametersByPath"],\n    "Resource": "arn:aws:ssm:us-east-1:123456789012:parameter/study-tracker/dev/*"\n  }]\n}',
  sources: [
    { title: 'Authentication and access control for Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-access.html' }
  ]
});
