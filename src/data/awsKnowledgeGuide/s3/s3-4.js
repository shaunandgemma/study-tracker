import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-4",
  "title": "S3 Multi-Region Access Points (MRAP) & Route 53 Global Accelerator Anycast routing",
  "plainEnglish": "Amazon S3 Multi-Region Access Points (MRAP) provide a single, global network hostname (endpoint) that automatically routes client S3 object requests across multiple S3 buckets in different AWS Regions. Powered by AWS Global Accelerator anycast IP routing, MRAP directs global user requests over the high-speed AWS private network backbone to the closest, lowest-latency active S3 bucket, delivering up to 60% faster multi-region data transfer speeds with automated multi-region failover.",
  "whyItMatters": "Global multi-region applications previously had to build complex client-side routing logic, maintain dynamic region mappings, and handle regional failover manually whenever an entire AWS Region became degraded. S3 MRAP abstracts multiple regional buckets behind a single global endpoint ARN, handling dynamic routing and regional failover transparently.",
  "workplaceExample": "A multinational media company operates S3 buckets replicated across three regions: `us-east-1` (N. Virginia), `eu-west-1` (Ireland), and `ap-southeast-1` (Singapore). They configure an S3 Multi-Region Access Point. A video producer in London uploads 4K raw video to the MRAP endpoint: AWS Global Accelerator routes the upload to `eu-west-1` at maximum speed. If the European region experiences an outage, MRAP shifts uploads to `us-east-1` automatically.",
  "examFocus": "Understand S3 MRAP architecture and controls: (1) Anycast Routing: Uses AWS Global Accelerator to route client requests to the closest regional bucket over the AWS global network. (2) Active-Active & Active-Passive: Supports failover controls via S3 MRAP Failover Controls to shift 100% of read/write traffic away from an impaired region within minutes. (3) Endpoint Format: Unique global alias formatted as `<alias>.mrap.accesspoint.s3-global.amazonaws.com`.",
  "keyPoints": [
    "Provides a single global S3 endpoint spanning multiple regional S3 buckets.",
    "Accelerates multi-region throughput by up to 60% using AWS Global Accelerator anycast routing.",
    "Automatically directs requests to the geographically closest, lowest-latency healthy S3 bucket.",
    "Includes S3 Multi-Region Access Point Failover Controls to manually shift traffic during disaster recovery.",
    "Requires Cross-Region Replication (CRR) between underlying regional buckets to keep data synchronized.",
    "Governed by a centralized Multi-Region Access Point policy to control cross-region IAM access."
  ],
  "commonMistake": "Assuming that creating an S3 Multi-Region Access Point automatically synchronizes objects across regional buckets. MRAP provides the unified routing endpoint; you must configure S3 Cross-Region Replication (CRR) separately to keep data synchronized across the underlying buckets.",
  "example": "Create an S3 Multi-Region Access Point spanning buckets in us-east-1 and eu-west-1 using the AWS CLI: aws s3control create-multi-region-access-point --account-id 123456789012 --details '{\"Name\": \"global-media-mrap\", \"Regions\": [{\"Bucket\": \"media-us-east-1\"}, {\"Bucket\": \"media-eu-west-1\"}]}'.",
  "sources": [
    {
      "title": "Multi-Region Access Points in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPoints.html"
    },
    {
      "title": "Routing Traffic with S3 Multi-Region Access Points",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MrapRouting.html"
    }
  ]
});
