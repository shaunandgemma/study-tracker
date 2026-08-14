import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-14', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Encryption with AWS KMS', status: 'ready',
  plainEnglish: 'CloudTrail log and digest files in S3 are encrypted at rest. SSE-KMS uses a customer-controlled symmetric KMS key, whose policy must allow CloudTrail to generate data keys and must grant approved readers permission to decrypt in addition to their S3 access.',
  whyItMatters: 'KMS provides control and auditing over who can decrypt sensitive records that describe identities, resources, request parameters, and account activity.',
  workplaceExample: 'A security account owns the log bucket and KMS key. CloudTrail can encrypt new objects, auditors can decrypt them, and workload administrators have neither decrypt nor bucket-read permission.',
  examFocus: 'S3 read permission alone is insufficient for SSE-KMS objects; the reader also needs KMS decrypt authorization. The KMS key used for trail log delivery must be in the same Region as the destination S3 bucket. CloudTrail supports symmetric KMS keys for this purpose.',
  keyPoints: ['SSE-S3 protects delivered logs if SSE-KMS is not selected.', 'SSE-KMS adds customer-controlled key policy and audit records.', 'CloudTrail requires GenerateDataKey and related permissions.', 'Readers require both S3 and KMS permissions.', 'Encryption does not replace log file integrity validation.'],
  commonMistake: 'Updating the trail to a KMS key before granting CloudTrail and intended readers the required key-policy permissions.',
  example: 'Use a symmetric key in the bucket Region, restrict the policy with the trail encryption context where appropriate, and test both delivery and authorized retrieval.',
  sources: [{ title: 'Encrypting CloudTrail logs with AWS KMS', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/encrypting-cloudtrail-log-files-with-aws-kms.html' }, { title: 'How CloudTrail uses AWS KMS', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-kms-works-with-cloudtrail.html' }, { title: 'Data protection in CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/data-protection.html' }]
});
