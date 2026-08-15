import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-9',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'S3 Security and Access Evaluation',
  status: 'ready',
  plainEnglish: 'Macie evaluates S3 bucket metadata to highlight potential security and privacy concerns, including effective public or shared access and encryption posture. It uses a service-linked IAM role to retrieve authorized S3 information and objects for its features. Restrictive bucket policies and customer-managed KMS keys can require suitable permissions before Macie can inspect data.',
  whyItMatters: 'A correct security review must separate detection from enforcement and access from encryption. Macie can show that a bucket may be shared or that analysis is blocked, but only the relevant S3, IAM, ACL, object-ownership, and KMS configurations determine who can access and decrypt the objects.',
  workplaceExample: 'A discovery job cannot analyze objects encrypted with a customer-managed KMS key. The storage and security teams verify the Macie service-linked role, bucket policy, key policy, object ownership, and replication destination, then grant only the documented access required for the approved analysis.',
  examFocus: 'Macie reports potential S3 issues and discovery access failures; it does not replace S3 Block Public Access or repair policies automatically. IAM and bucket policies authorize requests, ACLs and object ownership can affect control, and KMS policies control customer-managed key use. Macie uses `AWSServiceRoleForAmazonMacie` for supported actions.',
  keyPoints: [
    'Macie evaluates effective public and shared access information for S3 buckets.',
    'S3 Block Public Access, IAM policies, bucket policies, and ACLs enforce access rather than Macie.',
    'S3 Object Ownership settings influence how ACL-based ownership and access are handled.',
    'Macie uses the AWSServiceRoleForAmazonMacie service-linked role for documented monitoring and discovery actions.',
    'Restrictive bucket policies can deny Macie unless the documented service-linked-role access is permitted.',
    'Objects protected by supported customer-managed KMS keys require suitable key access for analysis.'
  ],
  commonMistake: 'Adding a broad bucket-policy exception for the Macie service principal without reviewing the documented role and conditions can weaken access controls. Grant only the required role access, constrain it to the intended resources, and test discovery with a non-sensitive object.',
  example: 'For an analysis-access error, confirm the account, Region, bucket, object, encryption type, and owning account; inspect the job result and full policy context; review the Macie service-linked role, bucket policy, KMS key policy, ownership, and replication; apply the least-privilege correction; then rerun a controlled test and audit the change in CloudTrail.',
  sources: [
    { title: 'Allowing Macie to access S3 buckets and objects', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-restrictive-s3-buckets.html' },
    { title: 'Analyzing encrypted Amazon S3 objects', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-supported-encryption-types.html' },
    { title: 'Using service-linked roles for Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/service-linked-roles.html' },
    { title: 'How Macie works with IAM', url: 'https://docs.aws.amazon.com/macie/latest/user/security_iam_service-with-iam.html' },
    { title: 'Logging Macie API calls with AWS CloudTrail', url: 'https://docs.aws.amazon.com/macie/latest/user/macie-cloudtrail.html' }
  ]
});
