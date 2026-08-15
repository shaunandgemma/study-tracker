import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-43",
  "title": "S3 Lifecycle Transitions",
  "plainEnglish": "S3 Lifecycle Transitions are automated rules within an Amazon S3 Lifecycle configuration that automatically transfer your objects between different S3 storage classes as they age. By establishing transition timelines (such as moving objects from S3 Standard to Standard-IA after 30 days, and then to S3 Glacier Deep Archive after 90 days), organizations systematically reduce monthly storage costs without altering object URLs or rewriting application code.",
  "whyItMatters": "Object access frequency naturally declines over time—90% of objects are rarely accessed after 30 to 60 days. Manually moving terabytes or petabytes of data between storage tiers requires complex custom scripts and API calls. S3 Lifecycle Transitions automate this process entirely, ensuring older data moves seamlessly to cheaper storage tiers according to defined business schedules.",
  "workplaceExample": "A digital tax filing service generates millions of customer tax return PDFs every April. Taxpayers download their returns frequently for 30 days. The DevOps team sets up an S3 Lifecycle Transition: (1) At 30 days, PDFs transition to S3 Standard-IA, (2) At 90 days, PDFs transition to S3 Glacier Instant Retrieval, and (3) At 365 days, PDFs transition to S3 Glacier Deep Archive, reducing 7-year storage costs by over 90% without breaking customer download links.",
  "examFocus": "Understand valid S3 Lifecycle transition paths and minimums: (1) Transition Waterfall: Objects can only transition to colder, lower-cost storage classes (e.g., Standard -> Standard-IA -> Glacier Flexible -> Deep Archive); you cannot transition backwards from Glacier to Standard via lifecycle rules. (2) Minimum Days: Transitions to Standard-IA and One Zone-IA require at least 30 days in the previous tier. (3) 128 KB Size Constraint: S3 skips transitioning objects smaller than 128 KB to Standard-IA or Glacier unless explicitly configured.",
  "keyPoints": [
    "Automatically transfers aging objects to lower-cost storage tiers based on creation date or version age.",
    "Follows a unidirectional downward waterfall path (Standard -> IA -> Glacier -> Deep Archive).",
    "Requires at least 30 days in S3 Standard before transitioning to Standard-IA or One Zone-IA.",
    "Operates independently on current object versions and historical noncurrent versions in versioned buckets.",
    "Preserves object keys, metadata, version IDs, and bucket permissions across all transitions.",
    "Executed asynchronously in the background by Amazon S3 once per day at midnight UTC."
  ],
  "commonMistake": "Attempting to create a lifecycle transition from S3 Glacier Flexible Retrieval back to S3 Standard. S3 Lifecycle transitions are strictly one-way to colder tiers; restoring archived data to active tiers requires an explicit `RestoreObject` API request.",
  "example": "Configure a multi-stage transition rule in JSON moving active data to Standard-IA after 30 days and Glacier Deep Archive after 90 days: {\"Transitions\": [{\"Days\": 30, \"StorageClass\": \"STANDARD_IA\"}, {\"Days\": 90, \"StorageClass\": \"DEEP_ARCHIVE\"}]}.",
  "sources": [
    {
      "title": "General Considerations for Lifecycle Transitions in S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"
    },
    {
      "title": "Managing Your Storage Lifecycle in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
    }
  ]
});
