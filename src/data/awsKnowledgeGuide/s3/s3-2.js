import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-2",
  "title": "S3 Express One Zone (Directory Buckets for sub-millisecond data access)",
  "plainEnglish": "Amazon S3 Express One Zone is a high-performance, single-Availability Zone storage class that delivers consistent single-digit millisecond data access speeds (up to 10x faster than S3 Standard) with 50% lower request costs. S3 Express One Zone organizes data in specialized 'Directory Buckets' located in the same Availability Zone as your compute resources (such as Amazon EC2, ECS, and EKS), making it ideal for latency-sensitive machine learning training, financial modeling, and real-time analytics.",
  "whyItMatters": "Demanding computational workloads like AI model checkpointing, PyTorch distributed training, and real-time query engines spend substantial time waiting on object storage I/O and incur high API request fees on millions of tiny read/write operations. S3 Express One Zone eliminates this latency bottleneck by co-locating high-throughput directory buckets in a single AZ with sub-millisecond latency and massively reduced per-request pricing.",
  "workplaceExample": "An autonomous vehicle engineering team trains deep neural networks on AWS Trainium and GPU clusters in `us-east-1a`. They create an S3 Express One Zone directory bucket named `training-checkpoints--use1-az1--x-s3` in the exact same Availability Zone. The training framework writes intermediate model checkpoints every 60 seconds with sub-millisecond latency, accelerating overall training epoch completion by 40%.",
  "examFocus": "Understand S3 Express One Zone architecture: (1) Bucket Type: Uses 'Directory Buckets' (distinct from general-purpose buckets) with a specific naming format ending in `--[azid]--x-s3`. (2) Durability & Availability: Stored redundantly within a SINGLE Availability Zone (designed for 99.999999999% / 11 9s durability within that single AZ, 99.95% availability). (3) Performance: Single-digit millisecond latency, hundreds of thousands of requests per second per bucket. (4) Authentication: Uses fast session-based credentials via `CreateSession` API.",
  "keyPoints": [
    "High-performance S3 storage class delivering consistent single-digit millisecond data access.",
    "Uses specialized Directory Buckets deployed in a dedicated, single Availability Zone.",
    "Reduces API request costs by 50% compared to S3 Standard storage class.",
    "Provides 11 9s durability within a single AZ and 99.95% availability.",
    "Directory bucket names follow a mandatory naming scheme ending with `--[azid]--x-s3`.",
    "Optimized for machine learning training, AI inference, real-time analytics, and high-frequency trading."
  ],
  "commonMistake": "Using S3 Express One Zone as the primary long-term disaster recovery repository for irreplaceable enterprise data. Because S3 Express One Zone stores data within a single Availability Zone, it does not survive the physical loss of that entire AZ; replicate critical outputs to multi-AZ S3 Standard.",
  "example": "Create an S3 Express One Zone directory bucket in `us-east-1` AZ 1 using the AWS CLI: aws s3control create-bucket --account-id 123456789012 --bucket 'analytics-cache--use1-az1--x-s3' --create-bucket-configuration 'Location={Type=AvailabilityZone,Name=use1-az1},Bucket={DataRedundancy=SingleAvailabilityZone,Type=Directory}'.",
  "sources": [
    {
      "title": "What is Amazon S3 Express One Zone?",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html"
    },
    {
      "title": "Directory Buckets Overview in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html"
    }
  ]
});
