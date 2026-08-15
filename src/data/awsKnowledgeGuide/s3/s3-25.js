import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-25",
  "title": "S3 Multi-Region Access Points",
  "plainEnglish": "Amazon S3 Multi-Region Access Points (MRAP) provide a unified, global DNS endpoint that automatically routes client S3 object requests across multiple S3 buckets located in different AWS Regions worldwide. Using AWS Global Accelerator anycast IP routing under the hood, S3 Multi-Region Access Points dynamically direct each request over the high-speed AWS global network to the nearest active S3 bucket, delivering up to 60% faster multi-region data transfer speeds and automated disaster recovery failover.",
  "whyItMatters": "Global enterprises running applications across North America, Europe, and Asia traditionally had to build regional routing intelligence into their software and manually update connection endpoints whenever a region experienced downtime. S3 Multi-Region Access Points simplify global architectures by providing a single global endpoint ARN that automatically handles geographic routing and active-active or active-passive regional failover.",
  "workplaceExample": "A global mobile gaming backend replicates player save-state data across S3 buckets in Virginia (`us-east-1`), Frankfurt (`eu-central-1`), and Tokyo (`ap-northeast-1`). The mobile client writes save data to a single S3 Multi-Region Access Point alias (`global-saves.mrap.accesspoint.s3-global.amazonaws.com`). A player in Berlin is routed directly to Frankfurt, while a player in Kyoto is routed to Tokyo, ensuring sub-100ms save times globally.",
  "examFocus": "Understand S3 MRAP features and routing mechanisms: (1) AWS Global Accelerator Integration: Routes requests over AWS global fiber to the closest healthy regional bucket. (2) S3 MRAP Failover Controls: Allows administrators to shift 100% of read/write traffic away from an impaired region to secondary regions within minutes. (3) S3 Cross-Region Replication (CRR): Must be enabled between underlying buckets to keep object data synchronized. (4) Pricing: Charged for MRAP data routing fees per GB in addition to standard S3 request and storage pricing.",
  "keyPoints": [
    "Provides a single global S3 endpoint representing multiple underlying regional buckets.",
    "Uses AWS Global Accelerator anycast routing to achieve up to 60% acceleration for multi-region requests.",
    "Automatically directs client requests to the lowest-latency geographic S3 bucket.",
    "Includes S3 Multi-Region Access Point Failover Controls to shift traffic during disaster recovery.",
    "Requires Cross-Region Replication (CRR) to keep data consistent across the underlying regional buckets.",
    "Centralizes security governance via a single Multi-Region Access Point Policy."
  ],
  "commonMistake": "Believing that S3 Multi-Region Access Points automatically copy or synchronize data between regional buckets. MRAP is strictly an intelligent global routing endpoint; you must configure S3 Cross-Region Replication (CRR) to replicate objects between the underlying buckets.",
  "example": "View the status and routing configuration of a Multi-Region Access Point using the AWS CLI: aws s3control get-multi-region-access-point --account-id 123456789012 --name global-saves-mrap.",
  "sources": [
    {
      "title": "Multi-Region Access Points in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiRegionAccessPoints.html"
    },
    {
      "title": "Managing Multi-Region Access Point Routing and Failover",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MrapRouting.html"
    }
  ]
});
