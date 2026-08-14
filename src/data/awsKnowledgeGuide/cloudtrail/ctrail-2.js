import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-2', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management',
  title: 'Organization Trails: Centralized S3 Bucket Logging with KMS Encryption & Digest Verification', status: 'ready',
  plainEnglish: 'An organization trail applies a common CloudTrail configuration to the management account and member accounts in AWS Organizations. Events can be delivered to a central S3 bucket, protected with an AWS KMS key, and accompanied by signed digest files used to detect later modification or deletion.',
  whyItMatters: 'Central ownership prevents every workload account from defining a different audit standard and keeps evidence in a controlled logging account away from ordinary administrators.',
  workplaceExample: 'A security account owns a multi-Region organization trail, a tightly controlled S3 bucket, and a customer-managed KMS key. Member accounts can see the trail but cannot change or delete it, while auditors validate digest chains during an investigation.',
  examFocus: 'An organization trail must be created by the management account or delegated administrator. Console-created organization trails are multi-Region. Member accounts cannot modify the organization trail and do not automatically receive access to its central S3 log files.',
  keyPoints: ['Organization trails create consistent logging across member accounts.', 'Central S3 policies must permit CloudTrail delivery while restricting readers.', 'SSE-KMS adds customer-controlled encryption permissions and auditability.', 'Integrity validation delivers signed digest files.', 'Multi-Region coverage captures activity across enabled Regions.'],
  commonMistake: 'Treating KMS encryption as proof that logs were never modified. Encryption protects confidentiality at rest; digest validation provides tamper-evidence.',
  example: 'Send all organization management events to a log-archive bucket, enable KMS encryption and validation, deny ordinary workload principals from deleting logs, and periodically run validate-logs.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'Working with CloudTrail trails', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trails.html' }, { title: 'Validating CloudTrail log file integrity', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html' }, { title: 'Data protection in CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/data-protection.html' }]
});
