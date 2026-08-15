import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-42",
  "title": "S3 Lifecycle Rules",
  "plainEnglish": "Amazon S3 Lifecycle Rules are automated policy configurations attached to an S3 bucket that automatically manage your objects throughout their lifecycle. A lifecycle configuration consists of rules that define two primary types of actions: (1) Transition Actions (which automatically move objects between lower-cost storage classes as they age, such as Standard -> Standard-IA -> Glacier Flexible Retrieval), and (2) Expiration Actions (which automatically delete expired objects, old noncurrent versions, or incomplete multipart uploads).",
  "whyItMatters": "Manual data deletion and storage tiering across millions of objects is practically impossible and error-prone. S3 Lifecycle Rules automate storage cost optimization and regulatory compliance retention schedules, ensuring old data is automatically archived or permanently purged without manual intervention or running external cron scripts.",
  "workplaceExample": "A financial data platform establishes an automated 7-year storage lifecycle: (1) Raw financial logs land in S3 Standard, (2) After 30 days, a lifecycle rule transitions logs to S3 Standard-IA, (3) After 90 days, the rule transitions logs to S3 Glacier Deep Archive (slashing storage costs by 95%), and (4) After 2,555 days (7 years), S3 automatically expires and deletes the objects permanently to adhere to corporate data retention guidelines.",
  "examFocus": "Understand S3 Lifecycle configuration elements and timing: (1) Actions: Transition Actions (move between storage classes) and Expiration Actions (delete objects, noncurrent versions, or expired delete markers). (2) Scope Filters: Can apply to the entire bucket, specific Key Prefixes (e.g., `logs/`), Object Tags (e.g., `Archive=True`), or Object Sizes (e.g., objects >= 128 KB). (3) Versioning Support: Separate transition/expiration rules for Current Versions and Noncurrent Versions. (4) Asynchronous Processing: Lifecycle actions execute asynchronously once daily; they do not trigger at an exact minute.",
  "keyPoints": [
    "Automates object transitions between storage classes and object deletions over time.",
    "Supports Transition actions (Standard -> Standard-IA -> Glacier Instant/Flexible -> Deep Archive).",
    "Supports Expiration actions (deletes current objects, noncurrent versions, and incomplete multipart uploads).",
    "Scope can be filtered by key prefixes, object tags, and minimum/maximum object size thresholds.",
    "Operates independently on current object versions and noncurrent object versions in versioned buckets.",
    "Runs asynchronously in the background at midnight UTC without application performance impact."
  ],
  "commonMistake": "Transitioning objects smaller than 128 KB to Standard-IA or Glacier via lifecycle rules. Because Standard-IA and Glacier have minimum billable size constraints (128 KB for IA, 40 KB for Glacier), archiving tiny 5 KB files will increase storage costs rather than decrease them.",
  "example": "Configure an S3 Lifecycle rule transitioning objects to Standard-IA after 30 days and Glacier after 90 days in JSON: {\"Rules\": [{\"ID\": \"TierAndArchiveLogs\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"logs/\"}, \"Transitions\": [{\"Days\": 30, \"StorageClass\": \"STANDARD_IA\"}, {\"Days\": 90, \"StorageClass\": \"GLACIER\"}], \"Expiration\": {\"Days\": 365}}]}",
  "sources": [
    {
      "title": "Managing Your Storage Lifecycle in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
    },
    {
      "title": "Examples of S3 Lifecycle Configurations",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"
    }
  ]
});
