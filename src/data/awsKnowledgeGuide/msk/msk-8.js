import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-8",
  "title": "Multi-AZ Broker Deployment",
  "plainEnglish": "A Multi-AZ Broker Deployment in Amazon MSK provisions and distributes Apache Kafka brokers evenly across two or three distinct Availability Zones (AZs) within an AWS Region. Each broker runs inside a dedicated private subnet in its assigned AZ, providing resilience against data center failures, physical hardware outages, and AZ-level network disruptions without customer intervention.",
  "whyItMatters": "Running all brokers in a single Availability Zone creates a single point of failure (SPOF) that leaves mission-critical streaming pipelines vulnerable to data loss and downtime during localized cloud outages. Multi-AZ deployment ensures that if an entire AZ becomes unavailable, brokers in surviving AZs continue processing producer writes and consumer reads seamlessly.",
  "workplaceExample": "A global payment gateway creates an Amazon MSK Provisioned cluster with 6 brokers deployed across 3 Availability Zones (2 brokers per AZ). During routine AWS data center maintenance in AZ-a, the 2 brokers in AZ-a temporarily reboot. Because all Kafka topics use a replication factor of 3, the partition leaders automatically fail over to healthy brokers in AZ-b and AZ-c, maintaining 100% application uptime.",
  "examFocus": "Understand MSK Multi-AZ architecture and best practices: (1) 3-AZ deployment is strongly recommended for production clusters (2-AZ is supported in Regions with only two AZs). (2) Total broker count must be a multiple of the number of AZs (e.g., 3, 6, 9 brokers across 3 AZs). (3) Client applications must configure multiple bootstrap brokers across all AZs in their connection string to ensure client failover resilience.",
  "keyPoints": [
    "Distributes brokers evenly across 2 or 3 distinct Availability Zones in the chosen AWS Region.",
    "Eliminates single points of failure by protecting against isolated data center or rack outages.",
    "Cluster broker count must be an exact multiple of the number of selected Availability Zones.",
    "Each broker attaches an Elastic Network Interface (ENI) within a designated private VPC subnet.",
    "Producers and consumers should configure connection strings with bootstrap brokers spanning all AZs.",
    "Cross-AZ data replication traffic between MSK brokers in the same cluster is managed automatically by AWS."
  ],
  "commonMistake": "Configuring client applications with only a single broker hostname in their `bootstrap.servers` connection property. If that single broker is rebooted during maintenance, the client will fail to connect; always supply multiple bootstrap broker endpoints spanning different AZs.",
  "example": "Inspect the multi-AZ bootstrap broker endpoints for an MSK cluster using the AWS CLI: aws kafka get-bootstrap-brokers --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd.",
  "sources": [
    {
      "title": "High Availability and Multi-AZ Deployment in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-ha.html"
    },
    {
      "title": "Creating an Amazon MSK Cluster Across Availability Zones",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-create-cluster.html"
    }
  ]
});
