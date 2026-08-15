import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-39",
  "title": "S3 Multipart Upload",
  "plainEnglish": "Amazon S3 Multipart Upload is an API feature that allows you to upload a single large object as a set of independent parts. Each part can be uploaded in parallel and in any sequence. If the upload of an individual part fails due to a network glitch, your application only needs to retransmit that specific failed part rather than restarting the entire multi-gigabyte upload from the beginning. Once all parts are uploaded, Amazon S3 reassembles them into the original object in order.",
  "whyItMatters": "Uploading large objects (such as 50 GB database dumps, high-resolution video masters, or large genomic datasets) over a single continuous HTTP PUT stream is brittle and slow. Multipart upload maximizes network throughput via parallel TCP streams and guarantees upload resilience across spotty or high-latency network connections.",
  "workplaceExample": "A media production pipeline uploads 100 GB 4K video files to S3. Using the AWS CLI (which automatically uses multipart upload for files > 8 MB), the file is split into 1,000 parallel 100 MB chunks. Multiple worker threads stream parts simultaneously, fully saturating a 10 Gbps network connection. When a transient network hiccup causes Part #421 to fail, only that 100 MB chunk is retried, finishing the upload in under two minutes.",
  "examFocus": "Understand S3 Multipart Upload thresholds and lifecycle: (1) Recommended Threshold: Recommended for objects >= 100 MB. (2) Mandatory Threshold: REQUIRED for any single object upload exceeding 5 GB (single PUT limit is 5 GB; max object size is 5 TB). (3) Part Size Limits: Individual parts can range from 5 MB to 5 GB (last part can be < 5 MB); maximum 10,000 parts per object. (4) Three Steps: Initiate -> Upload Parts -> Complete (or Abort). (5) Incomplete Parts: Unfinished multipart uploads consume storage and incur ongoing costs until aborted.",
  "keyPoints": [
    "Uploads large objects as independent, parallel parts ranging from 5 MB to 5 GB.",
    "Recommended for objects larger than 100 MB; strictly required for objects larger than 5 GB.",
    "Supports up to 10,000 individual parts per object (maximum single object size is 5 TB).",
    "Improves throughput via parallel TCP streams and provides fault-tolerant retry for failed parts.",
    "Three-phase lifecycle: Initiate Multipart Upload, Upload Parts, Complete (or Abort) Upload.",
    "Incomplete multipart uploads must be cleaned up via S3 Lifecycle rules to avoid phantom storage costs."
  ],
  "commonMistake": "Failing to configure an S3 Lifecycle rule to abort incomplete multipart uploads. If a multipart upload is initiated but never completed or aborted, the uploaded parts remain in S3 indefinitely, accumulating monthly storage fees while remaining invisible to standard list operations.",
  "example": "Manually complete a multipart upload via the AWS CLI: aws s3api complete-multipart-upload --bucket media-vault --key movie.mp4 --upload-id abcd1234efgh --multipart-upload 'Parts=[{ETag:\"1234\",PartNumber:1},{ETag:\"5678\",PartNumber:2}]'.",
  "sources": [
    {
      "title": "Uploading and Copying Objects Using Multipart Upload",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
    },
    {
      "title": "Amazon S3 Quotas and Limits",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html"
    }
  ]
});
