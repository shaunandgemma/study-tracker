import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-16",
  "title": "Amazon S3 Glacier Flexible Retrieval",
  "plainEnglish": "Amazon S3 Glacier Flexible Retrieval (formerly known simply as S3 Glacier) is a low-cost, secure archive storage class designed for data that is accessed only a few times per year and can tolerate retrieval times ranging from a few minutes to several hours. Before objects stored in Glacier Flexible Retrieval can be read or downloaded, you must initiate an asynchronous restore request choosing one of three retrieval tiers: Expedited, Standard, or Bulk.",
  "whyItMatters": "Storing terabytes of old server backups, database snapshots, or end-of-year financial spreadsheets in active storage classes wastes IT budgets. Glacier Flexible Retrieval provides up to 80% cost savings compared to S3 Standard, offering flexible retrieval speed options including completely free bulk retrievals for batch processing.",
  "workplaceExample": "A regional hospital system retains patient diagnostic audit logs for 7 years to satisfy HIPAA compliance rules. The hospital configures an S3 Lifecycle Rule that transitions all log files older than 90 days to S3 Glacier Flexible Retrieval. When internal compliance auditors request a quarterly audit sample, the hospital initiates a free Bulk Restore request, making the requested logs available for analysis within 8 hours at zero retrieval charge.",
  "examFocus": "Understand Glacier Flexible Retrieval restore options and minimums: (1) Expedited Retrieval: 1 to 5 minutes (for urgent requests, highest cost). (2) Standard Retrieval: 3 to 5 hours (default). (3) Bulk Retrieval: 5 to 12 hours (FREE data retrieval for petabyte-scale jobs). (4) Minimums: 90-day minimum storage duration and 40 KB minimum billable object size. (5) Asynchronous Access: Direct GET requests fail with 403/400; must invoke `RestoreObject` first.",
  "keyPoints": [
    "Secure, low-cost archive storage for data that can tolerate retrieval times of minutes to hours.",
    "Requires submitting an asynchronous restore request (`RestoreObject`) before reading objects.",
    "Offers three retrieval tiers: Expedited (1-5 min), Standard (3-5 hr), and Bulk (5-12 hr, free retrieval).",
    "Provides 11 9s data durability across at least 3 Availability Zones.",
    "Enforces a minimum storage duration of 90 days and a 40 KB minimum billable object size.",
    "Supports S3 Object Lock for strict regulatory write-once-read-many (WORM) compliance."
  ],
  "commonMistake": "Attempting to download an object directly from S3 Glacier Flexible Retrieval using a standard `s3:GetObject` API call without restoring it first. S3 will reject the request with `InvalidObjectState`; you must initiate a restore request and wait for it to complete.",
  "example": "Restore an archived object using the Standard tier with 7 days of temporary availability via the AWS CLI: aws s3api restore-object --bucket company-archives --key logs/2023-audit.tar.gz --restore-request 'Days=7,GlacierJobParameters={Tier=Standard}'.",
  "sources": [
    {
      "title": "Amazon S3 Glacier Flexible Retrieval Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-glacier"
    },
    {
      "title": "Restoring Archived Objects in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html"
    }
  ]
});
