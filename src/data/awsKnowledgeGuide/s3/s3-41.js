import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-41",
  "title": "S3 Transfer Acceleration",
  "plainEnglish": "Amazon S3 Transfer Acceleration (S3TA) is a feature that enables fast, secure, and easy transfers of files over long distances between your client applications and an Amazon S3 bucket. S3TA utilizes Amazon CloudFront's globally distributed Edge Locations worldwide. When data is uploaded to an accelerated S3 bucket endpoint, traffic enters the nearest AWS edge location over public internet routing and is then routed to your destination S3 bucket over the optimized, congestion-free AWS private network backbone.",
  "whyItMatters": "Uploading large files (such as 10 GB media files or database backups) across continents over the public internet experiences high packet loss, jitter, and fluctuating throughput. S3 Transfer Acceleration routes international data onto AWS's private, dedicated fiber backbone at the nearest point of presence, increasing upload speeds by 50% to 500% over long-distance transfers.",
  "workplaceExample": "A global architecture firm has field offices in Sydney, London, and Tokyo that upload 50 GB 3D CAD models daily to a central S3 bucket in Virginia (`us-east-1`). By enabling S3 Transfer Acceleration, engineers in Sydney upload to `<bucket>.s3-accelerate.amazonaws.com`. Traffic immediately hits the Sydney CloudFront edge location and travels over AWS's optimized transpacific private backbone, reducing upload times from 4 hours to 45 minutes.",
  "examFocus": "Understand S3 Transfer Acceleration prerequisites and endpoint format: (1) Endpoint Format: Uses `<bucket-name>.s3-accelerate.amazonaws.com` (or dualstack). (2) Bucket Naming: Bucket name MUST conform to DNS naming requirements and CANNOT contain periods (dots `.` are prohibited for S3TA buckets). (3) Pricing & Speed Comparison: Charged an additional data transfer acceleration fee per GB; if S3TA does not accelerate the transfer compared to standard internet PUT, AWS does NOT charge the acceleration fee. (4) CloudFront Edge Network: Relies on CloudFront edge locations but does NOT cache data.",
  "keyPoints": [
    "Accelerates long-distance uploads and downloads by 50% to 500% across continents.",
    "Routes data into the nearest Amazon CloudFront Edge Location worldwide.",
    "Transfers data to the destination S3 bucket over the private AWS global network backbone.",
    "Uses the dedicated accelerated domain format `<bucket-name>.s3-accelerate.amazonaws.com`.",
    "Bucket names must not contain periods (`.`) to support SSL wildcard certificates on accelerated domains.",
    "Only bills the acceleration fee if S3TA actually accelerates the transfer speed over regular S3."
  ],
  "commonMistake": "Attempting to enable S3 Transfer Acceleration on a bucket named `my.company.data`. S3TA strictly forbids bucket names containing dots (`.`) because standard SSL certificates on `s3-accelerate.amazonaws.com` cannot match multi-level dot subdomains.",
  "example": "Enable S3 Transfer Acceleration on a bucket using the AWS CLI: aws s3api put-bucket-accelerate-configuration --bucket global-cad-models --accelerate-configuration Status=Enabled.",
  "sources": [
    {
      "title": "Amazon S3 Transfer Acceleration Overview",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html"
    },
    {
      "title": "Getting Started with S3 Transfer Acceleration",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration-getting-started.html"
    }
  ]
});
