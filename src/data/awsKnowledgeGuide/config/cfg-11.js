import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-11',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Automatic Remediation with Systems Manager Automation',
  status: 'ready',
  plainEnglish: 'Automatic Remediation with Systems Manager (SSM) Automation allows AWS Config to automatically fix non-compliant resources the moment they are detected. When an AWS Config rule flags a resource as NON_COMPLIANT, AWS Config triggers a designated AWS Systems Manager Automation runbook (such as encrypting an unencrypted S3 bucket, revoking an open security group rule, or enabling EBS default encryption) without human intervention.',
  whyItMatters: 'Manual remediation introduces delays during which misconfigured resources remain exposed to cyber threats. Automatic remediation closes the window of vulnerability instantly, enforcing security compliance 24/7.',
  workplaceExample: 'A developer accidentally creates an unencrypted S3 bucket. AWS Config evaluates the bucket, flags it NON_COMPLIANT, and automatically executes the SSM Automation runbook AWS-EnableS3BucketEncryption. Within seconds, default AES-256 encryption is applied to the bucket automatically.',
  examFocus: 'For SAA-C03, understand the combination: AWS Config detects non-compliance (detective control) -> Systems Manager Automation runbook executes remediation (remedial control). Remediation can be triggered automatically or initiated manually by an administrator in the AWS Config Console.',
  keyPoints: [
    'Pairs AWS Config Rules with AWS Systems Manager (SSM) Automation runbooks.',
    'Automatically resolves non-compliant resources without human intervention.',
    'Supports AWS-managed SSM runbooks or custom SSM documents.',
    'Can be set to execute automatically or configured for manual one-click remediation.',
    'Requires an IAM role with permissions to perform the target remediation actions.'
  ],
  commonMistake: 'Forgetting to assign an IAM Automation Role to the remediation configuration. Without an IAM role containing necessary execution permissions, SSM Automation cannot remediate the non-compliant resource.',
  example: 'Remediation Configuration:\nRule: `s3-bucket-server-side-encryption-enabled`\nTarget Action: `AWS-EnableS3BucketEncryption`\nParameters: `SSEAlgorithm: AES256`\nAutomatic Remediation: Enabled (Retries: 5 times).',
  sources: [
    { title: 'Remediating Noncompliant Resources with AWS Config Rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/remediation-ssm-automation-approaches.html' }
  ]
});
