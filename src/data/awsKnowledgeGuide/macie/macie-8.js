import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-8',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'S3 Bucket Inventory',
  status: 'ready',
  plainEnglish: 'In each Region where Macie is enabled, it maintains an inventory of S3 general purpose buckets for the account and, for an administrator, associated member accounts. The inventory summarizes bucket ownership, public and shared access, encryption, object counts, storage classes, file types, classifiable data, discovery coverage, jobs, and sensitivity information where applicable.',
  whyItMatters: 'The inventory turns a large S3 estate into a searchable security map. Teams can locate buckets with public access, weak encryption posture, large amounts of classifiable data, unsupported objects, or missing discovery coverage before deciding what to investigate.',
  workplaceExample: 'A cloud security engineer filters the inventory for externally shared buckets with many classifiable objects and no recent discovery job. They validate the bucket owner and replication design, estimate a targeted job, and ask the data steward to approve the analysis scope.',
  examFocus: 'Macie inventory is Regional and focuses on S3 general purpose buckets; it is not a live list of arbitrary storage across all AWS services. Inventory metadata helps assess posture and plan discovery, while S3 remains the enforcement service. Macie monitors relevant S3 changes, including certain CloudTrail events, to maintain its view.',
  keyPoints: [
    'The inventory is maintained for S3 general purpose buckets in each Region where Macie is used.',
    'A Macie administrator can view inventory information for associated member accounts.',
    'Bucket details include public and shared access and encryption summaries.',
    'Object statistics distinguish classifiable and unclassifiable data based on supported conditions.',
    'Job, automated-discovery, sensitivity, and coverage data can guide deeper analysis.',
    'Replication, permissions, encryption keys, storage class, and file format can affect the interpretation of inventory data.'
  ],
  commonMistake: 'Reading a zero classifiable-object count as proof that a bucket is empty or harmless ignores unsupported storage classes, formats, permissions, and inventory timing. Inspect the detailed counts and coverage reasons before drawing a security conclusion.',
  example: 'Filter a test account\'s inventory by public-access status and encryption type, open one bucket, and compare total, classifiable, and unclassifiable object statistics. Check job and automated-discovery coverage, confirm replication and ownership context, and document whether a targeted job or an access-control change is warranted.',
  sources: [
    { title: 'Analyzing your Amazon S3 security posture with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-s3-inventory.html' },
    { title: 'How Macie monitors Amazon S3 data security', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-s3-how-it-works.html' },
    { title: 'Supported storage classes and formats', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-supported-storage.html' },
    { title: 'Logging Macie API calls with AWS CloudTrail', url: 'https://docs.aws.amazon.com/macie/latest/user/macie-cloudtrail.html' }
  ]
});
