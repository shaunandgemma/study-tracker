import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-44",
  "title": "S3 Lifecycle Expiration",
  "plainEnglish": "S3 Lifecycle Expiration is an automated action in an Amazon S3 Lifecycle configuration that permanently deletes objects, noncurrent object versions, or lingering delete markers when they reach a specified age. In unversioned buckets, expiration permanently deletes the object from disk. In versioned buckets, expiration can be configured to add a delete marker to the current version, permanently purge noncurrent versions after X days, or clean up expired object delete markers.",
  "whyItMatters": "Accumulating millions of obsolete temporary files, expired log files, or old noncurrent object versions consumes petabytes of storage, resulting in huge monthly AWS bills. S3 Lifecycle Expiration enforces corporate data retention policies and automatically purges old data without running custom batch deletion scripts.",
  "workplaceExample": "A microservices platform generates 500 GB of debug trace logs per day in an S3 bucket (`service-traces`). The compliance team mandates that debug logs should only be retained for 14 days. The DevOps engineer sets an S3 Lifecycle Expiration rule with `Expiration: Days=14`. S3 automatically purges trace files older than 14 days every night, keeping the bucket lean and eliminating unnecessary storage costs.",
  "examFocus": "Understand S3 Lifecycle Expiration in unversioned vs versioned buckets: (1) Unversioned Bucket: Expiration permanently deletes the object immediately. (2) Versioned Bucket - Current Version: Expiration adds a Delete Marker (making the object appear deleted while preserving historical versions). (3) Versioned Bucket - Noncurrent Versions: `NoncurrentVersionExpiration` permanently purges old versions after a specified number of days (e.g., `NoncurrentDays=30`). (4) `ExpiredObjectDeleteMarkers`: Automatically removes delete markers when all previous versions have been deleted.",
  "keyPoints": [
    "Automates the permanent deletion of objects and object versions based on age.",
    "Permanently removes objects in unversioned buckets when the expiration threshold is reached.",
    "Inserts a Delete Marker for current versions in versioned buckets, preserving past versions.",
    "Permanently purges historical noncurrent versions using 'NoncurrentVersionExpiration'.",
    "Cleans up standalone, orphaned delete markers using 'ExpiredObjectDeleteMarkers: true'.",
    "Essential for enforcing data retention compliance schedules and minimizing storage bills."
  ],
  "commonMistake": "Configuring standard object expiration on a versioned bucket expecting it to permanently delete files. Standard expiration on a versioned bucket only adds a Delete Marker; to permanently delete past versions, you must configure a `NoncurrentVersionExpiration` action.",
  "example": "Configure a lifecycle rule to delete noncurrent versions after 30 days and clean up expired delete markers in JSON: {\"Rules\": [{\"ID\": \"CleanOldVersions\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"\"}, \"NoncurrentVersionExpiration\": {\"NoncurrentDays\": 30}, \"Expiration\": {\"ExpiredObjectDeleteMarker\": true}}]}",
  "sources": [
    {
      "title": "General Considerations for Expiring Objects in S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html"
    },
    {
      "title": "Examples of S3 Lifecycle Expiration Configurations",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html"
    }
  ]
});
