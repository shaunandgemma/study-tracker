import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-45",
  "title": "S3 Incomplete Multipart Upload Cleanup",
  "plainEnglish": "S3 Incomplete Multipart Upload Cleanup is an Amazon S3 Lifecycle rule action (`AbortIncompleteMultipartUpload`) that automatically aborts multipart uploads that fail to complete within a designated number of days after initiation. When a multipart upload is initiated, uploaded parts are stored on S3 disks and accrue standard monthly storage costs. If a client crashes or disconnects mid-upload, this lifecycle rule ensures that unfinished parts are permanently deleted, eliminating phantom storage charges.",
  "whyItMatters": "Incomplete multipart uploads are invisible to standard S3 bucket list operations and web console file explorers, but they continue consuming disk space and incurring storage costs every month. Without an automated incomplete multipart upload abort rule, high-throughput buckets can silently accumulate terabytes of orphaned, useless upload chunks, inflating cloud storage bills.",
  "workplaceExample": "A media streaming platform uploads thousands of 20 GB video files daily. Due to mobile network disconnections and worker process crashes, roughly 3% of multipart uploads are abandoned halfway through. By enabling an S3 Lifecycle rule with `AbortIncompleteMultipartUpload: DaysAfterInitiation=7`, S3 automatically purges all orphaned video chunks after 7 days, saving the company over $3,500 every month in hidden storage fees.",
  "examFocus": "Understand the importance and configuration of `AbortIncompleteMultipartUpload`: (1) Cost Impact: Incomplete uploaded parts incur standard S3 storage fees until explicitly aborted or completed. (2) Rule Action: `AbortIncompleteMultipartUpload` with `DaysAfterInitiation` (recommended 7 days). (3) Best Practice: AWS strongly recommends enabling this rule on EVERY Amazon S3 bucket that receives multipart uploads.",
  "keyPoints": [
    "Automatically deletes uploaded parts from abandoned or failed multipart uploads.",
    "Eliminates hidden 'phantom' storage costs from incomplete multipart upload data chunks.",
    "Configured via the `AbortIncompleteMultipartUpload` action in an S3 Lifecycle Rule.",
    "Specifies `DaysAfterInitiation` (e.g., 7 days) to give active uploads sufficient time to complete.",
    "Uploaded parts are invisible to standard `s3:ListObjectsV2` calls but accrue full storage fees.",
    "AWS security and cost optimization best practice for all production S3 buckets."
  ],
  "commonMistake": "Assuming that failed or disconnected multipart uploads clean themselves up automatically. Amazon S3 never deletes incomplete multipart upload parts automatically unless you configure an `AbortIncompleteMultipartUpload` lifecycle rule.",
  "example": "Configure an S3 Lifecycle rule to abort incomplete multipart uploads after 7 days in JSON: {\"Rules\": [{\"ID\": \"AbortIncompleteUploadsAfter7Days\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"\"}, \"AbortIncompleteMultipartUpload\": {\"DaysAfterInitiation\": 7}}]}",
  "sources": [
    {
      "title": "Aborting Incomplete Multipart Uploads Using a Lifecycle Configuration",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html"
    },
    {
      "title": "Uploading and Copying Objects Using Multipart Upload",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
    }
  ]
});
