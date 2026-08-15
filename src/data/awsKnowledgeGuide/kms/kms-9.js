import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-9',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'AWS Owned Keys',
  status: 'ready',
  plainEnglish: 'An AWS Owned Key is a collection of KMS keys that an AWS service owns and manages in its own service accounts to protect your data across multiple AWS accounts. AWS Owned Keys are not located in your AWS account, do not appear in your KMS console key lists, incur no KMS fees, and do not count against your account KMS API request quotas.',
  whyItMatters: 'AWS Owned Keys provide seamless background encryption for AWS service infrastructure (such as S3 bucket default encryption or DynamoDB default tables) without impacting your account\'s KMS key limits or monthly bill.',
  workplaceExample: 'An S3 bucket is configured with default SSE-S3 encryption. Under the hood, Amazon S3 uses an AWS Owned Key located in S3\'s internal service account to encrypt uploaded objects, incurring zero KMS API charges for the customer.',
  examFocus: 'SAA-C03 Key Classification Hierarchy:\n- Customer Managed Keys: In your account, full control, monthly fee, cross-account capable.\n- AWS Managed Keys: In your account (`aws/service`), viewable, no monthly fee, no policy edits, single account.\n- AWS Owned Keys: Outside your account (in AWS service accounts), invisible in KMS, no monthly fee, no KMS API quota consumption.',
  keyPoints: [
    'Owned and maintained by AWS services in internal AWS accounts.',
    'Do NOT reside in your AWS account and are not visible in your KMS key list.',
    'Incur zero KMS monthly storage fees and zero KMS API request charges.',
    'Do not count against your account KMS API request quotas.',
    'Used for default infrastructure encryption (e.g. S3 SSE-S3, DynamoDB default encryption).'
  ],
  commonMistake: 'Searching for an AWS Owned Key ARN inside your account\'s IAM or KMS console. AWS Owned Keys reside in internal AWS service accounts and cannot be audited in your KMS console.',
  example: 'S3 Default Bucket Encryption using AWS Owned Key (SSE-S3):\naws s3api put-bucket-encryption --bucket <BUCKET_NAME> --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}\'',
  sources: [
    { title: 'AWS owned keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-owned-cmk' }
  ]
});
