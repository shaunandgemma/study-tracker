import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mac-2',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'S3 Bucket Security Assessment (Public Access & Encryption Audit)',
  status: 'ready',
  plainEnglish: 'Macie maintains a Regional inventory of S3 general purpose buckets and evaluates security and access information such as public and shared access and encryption statistics. A policy finding flags a potential S3 security or privacy issue. Macie reports the concern; S3 Block Public Access, IAM, bucket policies, access control lists (ACLs), object ownership, and AWS Key Management Service (AWS KMS) settings enforce the actual controls.',
  whyItMatters: 'A bucket can hold sensitive records while an overly broad policy or disabled public-access safeguard exposes them. Combining access posture with data sensitivity helps security teams focus on configurations that create the greatest potential impact.',
  workplaceExample: 'Macie reports that Block Public Access was disabled for a bucket that also has an external sharing path. The responder verifies the account, Region, bucket policy, ACLs, and business integration, preserves the finding evidence, then removes only the unintended access through an approved change.',
  examFocus: 'A Macie policy finding describes a potential S3 policy or privacy problem; it is not a sensitive-data finding and it does not prove data exposure. Macie does not replace S3 access controls. Use Block Public Access, IAM and bucket policies to enforce access, S3 and KMS settings for encryption, and CloudTrail for API auditing.',
  keyPoints: [
    'Macie evaluates security-posture metadata for S3 general purpose buckets in the current Region.',
    'Policy findings can report potential public access, shared access, encryption, or related bucket-security concerns.',
    'S3 Block Public Access provides preventive controls and is not replaced by Macie monitoring.',
    'IAM policies, bucket policies, ACLs, and object ownership settings participate in authorization decisions.',
    'Default encryption and KMS key configuration protect data at rest but do not by themselves restrict all access.',
    'CloudTrail records relevant API activity for investigation and auditing.'
  ],
  commonMistake: 'Immediately deleting objects after a public-access finding can violate retention or legal requirements and destroy evidence. Confirm genuine sensitivity and access first, preserve context, remove unintended access, improve encryption where needed, and move, redact, or delete only through approved data governance.',
  example: 'Confirm the finding account, Region, bucket, and affected policy details; review who can access the data and whether the content is sensitive; preserve the finding and CloudTrail context; then correct confirmed public or cross-account access, apply approved encryption controls, verify the finding status, and record the preventive policy change.',
  sources: [
    { title: 'Analyzing your Amazon S3 security posture with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-s3-inventory.html' },
    { title: 'How Macie monitors Amazon S3 data security', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-s3-how-it-works.html' },
    { title: 'Types of Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-types.html' },
    { title: 'Blocking public access to Amazon S3 storage', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html' }
  ]
});
