import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-24',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Policy Conditions',
  status: 'ready',
  plainEnglish: 'An IAM Policy Condition block is an optional section within an IAM statement that specifies fine-grained rules under which the statement is in effect. Condition blocks evaluate contextual keys—such as the requester\'s IP address (`aws:SourceIp`), Multi-Factor Authentication status (`aws:MultiFactorAuthPresent`), request timestamp (`aws:CurrentTime`), SSL status (`aws:SecureTransport`), or AWS Organization ID (`aws:PrincipalOrgID`).',
  whyItMatters: 'Action and Resource elements alone cannot enforce contextual security rules. Condition blocks allow enforcing zero-trust constraints, like restricting access to corporate IP ranges or requiring HTTPS encryption for all S3 requests.',
  workplaceExample: 'A bank enforces strict network boundaries on administrative roles. They add a Condition block to all admin policies restricting role assumption to requests coming strictly from the corporate office IP range (`"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}`).',
  examFocus: 'SAA-C03 Key Condition Operators & Global Keys:\n- `StringEquals` / `StringLike`: String comparisons (e.g. `aws:PrincipalOrgID`).\n- `IpAddress` / `NotIpAddress`: CIDR IP restriction (`aws:SourceIp`).\n- `Bool`: Boolean checks (`aws:SecureTransport`, `aws:MultiFactorAuthPresent`).\n- `Null`: Checks whether a condition key is present in the request context.',
  keyPoints: [
    'Specifies fine-grained conditions under which a policy statement applies.',
    'Evaluates global condition keys (IP address, MFA status, SSL, Org ID, time).',
    'Supports string, numeric, date, IP address, and boolean condition operators.',
    'Enforces zero-trust context controls (e.g. require TLS 1.2+, restrict corporate CIDR).',
    'Multiple conditions in a block are evaluated using logical AND logic.'
  ],
  commonMistake: 'Using `aws:SourceIp` in a condition for an AWS service role (like CloudFormation or Lambda execution roles), causing operations to fail because AWS internal service calls do not originate from user IP addresses.',
  example: 'Sample Condition Block JSON (Enforce TLS Encryption):\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "EnforceTLS",\n    "Effect": "Deny",\n    "Principal": "*",\n    "Action": "s3:*",\n    "Resource": "arn:aws:s3:::<BUCKET_NAME>/*",\n    "Condition": {\n      "Bool": { "aws:SecureTransport": "false" }\n    }\n  }]\n}',
  sources: [
    { title: 'IAM JSON policy elements: Condition', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html' }
  ]
});
