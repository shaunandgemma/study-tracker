import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-8",
  "title": "Offline Data Transfer to and from Amazon S3",
  "plainEnglish": "Offline Data Transfer to and from Amazon S3 using the AWS Snow Family enables you to migrate massive datasets into or out of Amazon S3 buckets without routing traffic over the internet. For Import jobs, data copied onto a local Snow device is securely transported and ingested directly into your target S3 bucket in your chosen AWS Region. For Export jobs, AWS copies objects from your S3 bucket onto a Snow device and ships it directly to your on-premises facility.",
  "whyItMatters": "Transferring hundreds of terabytes over corporate WANs can take months, congest business operations, and incur high data transfer costs. Snow Family offline S3 transfer provides a predictable, high-throughput physical mechanism for one-time data lake migrations, historical data center archives, or exporting massive cloud datasets to remote field stations.",
  "workplaceExample": "A film studio finishing visual effects for a major motion picture needs to transfer 120 terabytes of raw 8K video footage from local post-production SAN storage to an S3 bucket in `us-west-2`. The studio creates an AWS Snowball Edge Import job. Over a 10 GbE network connection, the media files are copied to the Snowball using the local S3 adapter in 24 hours. Once received at the AWS facility, AWS ingests the footage into `s3://studio-master-vault/` and verifies checksums.",
  "examFocus": "Understand S3 Import and Export mechanics: (1) Import Job: Copies on-premises files into specified Amazon S3 buckets and prefixes upon arrival at AWS; source files are validated against S3 checksums. (2) Export Job: S3 automatically copies specified objects/prefixes onto a Snow device before shipping it to the customer. (3) S3 Storage Class: Imported data defaults to S3 Standard (lifecycle rules can subsequently transition objects to colder tiers). (4) Validation: AWS generates a detailed Job Completion Report and Success/Failure log for every object.",
  "keyPoints": [
    "Transfers large datasets directly into (Import) or out of (Export) Amazon S3 buckets.",
    "Bypasses public internet and congested corporate network connections entirely.",
    "Imported data lands in Amazon S3 Standard by default with customizable key prefixes.",
    "Export jobs allow organizations to retrieve massive S3 datasets for local on-premises use.",
    "Generates detailed S3 job completion and verification reports listing all transferred keys.",
    "Preserves object integrity using automated MD5/SHA256 checksum validations during ingest."
  ],
  "commonMistake": "Assuming that small-file transfers (e.g., 50 million 2 KB files) transfer at the same speed as large files. Small files incur filesystem overhead; batch or tar small files into larger archives before copying to a Snow device to maximize throughput.",
  "example": "Copy local files to a Snowball Edge using the AWS CLI configured with the local S3 endpoint: aws s3 sync /local/san/video-archive/ s3://my-snowball-bucket/video/ --endpoint-url http://192.168.1.50:8080.",
  "sources": [
    {
      "title": "Transferring Data to and from Amazon S3 with AWS Snowball",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/transfer-data-snowball.html"
    },
    {
      "title": "How AWS Snowball Edge Data Transfer Works",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/how-snowball-works.html"
    }
  ]
});
