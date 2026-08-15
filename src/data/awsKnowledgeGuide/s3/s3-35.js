import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-35",
  "title": "S3 Bucket Keys",
  "plainEnglish": "Amazon S3 Bucket Keys for SSE-KMS is a cost-optimization feature that reduces AWS Key Management Service (AWS KMS) request fees by up to 99% when encrypting objects in Amazon S3. Instead of making an individual, billable API call to AWS KMS for every single object read or write request, Amazon S3 generates an intermediate, time-limited bucket-level encryption key from AWS KMS, using it to encrypt and decrypt multiple objects in the same bucket locally within S3.",
  "whyItMatters": "High-throughput data pipelines, IoT streaming ingests, and Athena data lake queries processing millions of objects encrypted with SSE-KMS can generate substantial AWS KMS API costs ($0.03 per 10,000 requests) and risk hitting AWS KMS account request per-second throttling limits. S3 Bucket Keys slash KMS API request volume and costs by up to 99% while maintaining enterprise-grade SSE-KMS security.",
  "workplaceExample": "A data engineering team ingests 50 million telemetry objects per day into an S3 data lake encrypted with SSE-KMS. Without Bucket Keys, 50 million daily uploads generated $150/day in KMS API fees and caused periodic KMS rate-limit throttling during batch Spark jobs. By enabling S3 Bucket Keys on the bucket, KMS request volume drops from 50,000,000 requests/day to just 2,000 requests/day, saving over $4,000 monthly and eliminating throttling completely.",
  "examFocus": "Understand S3 Bucket Key mechanics: (1) Cost Reduction: Decreases KMS API calls and fees by up to 99% for SSE-KMS workloads. (2) Throttling Prevention: Eliminates KMS request rate quota bottlenecks during high-throughput parallel data processing. (3) Security Equivalent: Uses the same underlying KMS Customer Managed Key or AWS managed key (`aws/s3`). (4) Replications: S3 Bucket Keys are also supported for S3 Same-Region and Cross-Region Replication.",
  "keyPoints": [
    "Reduces AWS KMS request traffic and API costs by up to 99% for SSE-KMS encrypted data.",
    "Uses an intermediate, time-limited bucket-level key generated from AWS KMS.",
    "Prevents AWS KMS account-level request-rate throttling during large batch operations.",
    "Fully compatible with both Customer Managed Keys (CMKs) and AWS managed keys (`aws/s3`).",
    "Enabled easily via the bucket default encryption configuration with a single boolean flag.",
    "Best practice for all S3 data lakes, analytics buckets, and high-frequency PUT/GET workloads."
  ],
  "commonMistake": "Thinking S3 Bucket Keys replace AWS KMS or alter your key policies. S3 Bucket Keys use your existing AWS KMS keys and respect all KMS key policies; they simply cache an intermediate data key inside S3 to avoid making a billable KMS API call for every individual object.",
  "example": "Enable S3 Bucket Keys on a bucket with default SSE-KMS encryption using the AWS CLI: aws s3api put-bucket-encryption --bucket telemetry-lake --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\",\"KMSMasterKeyId\":\"arn:aws:kms:us-east-1:123456789012:key/telemetry-key\"},\"BucketKeyEnabled\":true}]}'.",
  "sources": [
    {
      "title": "Reducing the Cost of SSE-KMS with Amazon S3 Bucket Keys",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"
    },
    {
      "title": "Using S3 Bucket Keys with AWS KMS",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/kms-bucket-key.html"
    }
  ]
});
