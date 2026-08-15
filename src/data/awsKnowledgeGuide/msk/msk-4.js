import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-4",
  "title": "MSK Provisioned Clusters",
  "plainEnglish": "An MSK Provisioned Cluster is an Amazon MSK deployment model where you choose the specific broker instance types (such as `kafka.m5.large`, `kafka.m7g.xlarge`, or `kafka.t3.small`), specify the total number of broker nodes, and configure dedicated Amazon Elastic Block Store (Amazon EBS) storage per broker across two or three Availability Zones. Provisioned clusters offer granular control over broker performance, custom Kafka configurations, and authentication mechanisms.",
  "whyItMatters": "High-throughput, steady-state enterprise streaming workloads (such as financial trade processing or multi-terabyte log aggregation) benefit from dedicated broker resources, predictable monthly billing, custom memory tuning, and specialized authentication protocols (like mutual TLS or SASL/SCRAM with custom Kafka ACLs).",
  "workplaceExample": "A streaming media platform provisions an Amazon MSK cluster with 6 `kafka.m7g.2xlarge` brokers distributed across 3 Availability Zones (2 brokers per AZ) with 2 TB of gp3 EBS storage per broker. They configure custom broker properties (`log.retention.hours=168` for 7-day retention) and enable Storage Auto Scaling to absorb peak streaming events during major live sporting broadcasts.",
  "examFocus": "Understand MSK Provisioned cluster sizing and capabilities: (1) Broker distribution: Brokers are distributed evenly across either 2 or 3 Availability Zones (e.g., a 6-broker cluster across 3 AZs places 2 brokers in each AZ). (2) Storage: Backed by Amazon EBS volumes per broker, expandable with Storage Auto Scaling. (3) Tiered Storage: Supports offloading older log segments to low-cost tiered storage. (4) Authentication options: mTLS, SASL/SCRAM, SASL/IAM, and unauthenticated.",
  "keyPoints": [
    "Dedicated broker instances provisioned across 2 or 3 Availability Zones for high availability.",
    "Offers a wide selection of broker instance types including general-purpose (m5, m7g) and burstable (t3) types.",
    "Storage per broker is managed via Amazon EBS volumes (from 100 GB to 16 TiB per broker).",
    "Supports Storage Auto Scaling to automatically expand EBS storage when disk utilization exceeds configured thresholds.",
    "Allows custom broker configurations via MSK Configuration Revisions (overriding server.properties).",
    "Supports MSK Tiered Storage to decouple compute from long-term storage, reducing costs by up to 50%."
  ],
  "commonMistake": "Attempting to shrink broker EBS storage in an MSK Provisioned cluster. EBS storage in Amazon MSK can only be scaled UP; it cannot be scaled down. To reduce storage, you must configure shorter retention periods, use tiered storage, or recreate the cluster.",
  "example": "Update broker instance types on an active MSK Provisioned cluster using the AWS CLI: aws kafka update-broker-type --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd --target-instance-type kafka.m5.2xlarge --current-version K13V1IB3VIYZZH.",
  "sources": [
    {
      "title": "Creating an Amazon MSK Provisioned Cluster",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-create-cluster.html"
    },
    {
      "title": "Best Practices for Amazon MSK Provisioned Clusters",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html"
    }
  ]
});
