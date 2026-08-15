import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-28',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Access Analyzer',
  status: 'ready',
  plainEnglish: 'IAM Access Analyzer is an automated reasoning security feature in AWS IAM that continuously analyzes policies attached to your resources (such as S3 buckets, KMS keys, SQS queues, Secrets Manager secrets, and IAM roles) to identify resources accessible from outside your account or AWS Organization. Access Analyzer also validates IAM policies against security best practices and automatically generates least-privilege policies based on actual CloudTrail activity logs.',
  whyItMatters: 'Resource policies can easily be misconfigured to grant unintended public or cross-account access. IAM Access Analyzer alerts security teams to public or external access findings within minutes, allowing immediate remediation.',
  workplaceExample: 'An engineer accidentally configures an S3 Bucket Policy with `"Principal": "*"`. IAM Access Analyzer immediately generates a high-severity finding: "Public Access Granted to S3 Bucket". The security team receives an EventBridge alert and revokes the public access rule instantly.',
  examFocus: 'SAA-C03 IAM Access Analyzer Capabilities:\n- External Access Findings: Uses logic-based mathematical reasoning to detect resources shared publicly or with external accounts/organizations.\n- Policy Validation: Checks policy syntax and flags security risks (e.g. overly permissive wildcard permissions).\n- Policy Generation: Analyzes CloudTrail activity logs for a specified user/role and generates a scoped least-privilege IAM policy automatically.',
  keyPoints: [
    'Automated reasoning tool detecting public and cross-account resource access.',
    'Scans S3, KMS, SQS, Secrets Manager, IAM roles, and Lambda resource policies.',
    'Generates least-privilege policies based on actual historical CloudTrail activity.',
    'Validates policy JSON syntax and security best practice compliance during editing.',
    'Integrates with EventBridge and Security Hub for automated incident remediation.'
  ],
  commonMistake: 'Ignoring IAM Access Analyzer findings, allowing publicly accessible S3 buckets or KMS keys to remain exposed to external accounts indefinitely.',
  example: 'Listing External Access Findings via AWS CLI:\naws accessanalyzer list-findings --analyzer-arn "arn:aws:access-analyzer:us-east-1:123456789012:analyzer/ConsoleAnalyzer"',
  sources: [
    { title: 'Using AWS IAM Access Analyzer', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html' }
  ]
});
