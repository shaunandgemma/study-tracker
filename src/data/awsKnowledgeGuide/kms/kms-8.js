import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-8',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'AWS Managed KMS Keys',
  status: 'ready',
  plainEnglish: 'An AWS Managed KMS Key is a KMS key created automatically in your account by an AWS service (such as Amazon S3, EBS, RDS, or DynamoDB) when you enable encryption using an AWS-managed option. AWS Managed Keys are named following the format `aws/service-name` (e.g. `aws/s3`, `aws/ebs`, `aws/rds`). AWS manages their key policy, rotation, and lifecycle on your behalf.',
  whyItMatters: 'AWS Managed Keys provide zero-effort encryption at rest. They allow you to secure data in S3 or EBS instantly without paying monthly key fees or manually writing complex Key Policies.',
  workplaceExample: 'A developer launches an EC2 instance and checks "Encrypt EBS Volume". AWS automatically provisions the AWS Managed Key `aws/ebs` in the account and encrypts the volume disk without requiring the developer to configure KMS policies.',
  examFocus: 'SAA-C03 AWS Managed Key Characteristics:\n- Naming Convention: `aws/s3`, `aws/ebs`, `aws/dynamodb`, `aws/rds`.\n- Cost: No monthly key fee ($0/month per key); you pay only for API requests.\n- Key Policy Control: You CANNOT modify the Key Policy of an AWS Managed Key.\n- Cross-Account Access: CANNOT be shared across different AWS accounts.\n- Automatic Rotation: Automatically rotated by AWS every 3 years (1,095 days).',
  keyPoints: [
    'Created automatically by AWS services in your account (e.g. `aws/s3`, `aws/ebs`).',
    'No monthly key fee (free monthly key storage); subject to API request charges.',
    'Key Policies are managed by AWS and cannot be modified by users.',
    'CANNOT be shared with external AWS accounts.',
    'Automatically rotated by AWS every 3 years.'
  ],
  commonMistake: 'Attempting to edit the Key Policy of `aws/s3` or grant an external partner account permission to use `aws/s3`. AWS Managed Keys cannot be shared across accounts.',
  example: 'Viewing an AWS Managed Key via AWS CLI:\naws kms describe-key --key-id alias/aws/s3',
  sources: [
    { title: 'AWS managed keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-managed-cmk' }
  ]
});
