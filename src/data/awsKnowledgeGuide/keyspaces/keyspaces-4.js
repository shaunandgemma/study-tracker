import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-4",
  "title": "Keyspaces Serverless Architecture",
  "plainEnglish": "Amazon Keyspaces is built on a modern serverless architecture that completely decouples database compute processing from persistent underlying storage. Unlike traditional Apache Cassandra where each node is a virtual or physical server storing a slice of data on attached disks, Keyspaces runs as a distributed multi-tenant service where compute layers handle request parsing and routing while high-durability storage layers replicate data across three Availability Zones.",
  "whyItMatters": "In self-managed Cassandra, adding or removing nodes requires massive data streaming over the network (rebalancing the token ring), which can cause severe performance degradation during high-traffic events. The serverless architecture of Amazon Keyspaces scales compute resources instantly without data re-shuffling, ensuring predictable single-digit millisecond latency at virtually any scale.",
  "workplaceExample": "A logistics enterprise experiences sudden 10x traffic surges on Black Friday for package tracking queries. With Amazon Keyspaces' serverless architecture, the database handles the 10x increase instantly without dropping connections, requiring zero pre-warmed EC2 instances, and automatically scales back down when traffic returns to normal.",
  "examFocus": "Know how Keyspaces achieves high availability and fault tolerance: Every write is synchronously committed and replicated across three distinct Availability Zones in the AWS Region before acknowledging success to the client. There are no EC2 instances to size, no OS patches to apply, no storage volume expansions to schedule, and no nodetool repair operations required.",
  "keyPoints": [
    "Decouples compute processing from durable storage layers, enabling independent, instantaneous scaling.",
    "Data is synchronously replicated across three Availability Zones in the AWS Region by default for 99.99% availability.",
    "Eliminates traditional Cassandra operational bottlenecks: no token ring rebalancing, no compaction pauses, and no anti-entropy repairs.",
    "Serverless storage automatically scales with your data size with no upper storage limits or manual disk volume provisioning.",
    "Built-in integration with AWS Key Management Service (KMS) ensures all stored blocks and transaction logs are encrypted at rest.",
    "Supports automatic Point-in-Time Recovery (PITR) to restore table data to any second within the past 35 days without impacting running workloads."
  ],
  "commonMistake": "Thinking you need to configure replication factor (e.g., replication_factor = 3) manually in your keyspace DDL for high availability. In Amazon Keyspaces, 3-AZ high availability replication is built-in automatically by the underlying architecture under SingleRegionStrategy or MultiRegionStrategy.",
  "example": "Create a serverless keyspace in CQL with built-in 3-AZ resilience: CREATE KEYSPACE logistics WITH replication = {'class': 'SingleRegionStrategy'};, then immediately create tables without configuring server clusters or storage volumes.",
  "sources": [
    {
      "title": "Amazon Keyspaces Architecture and Resilience",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
    },
    {
      "title": "Fault Tolerance and Availability in Amazon Keyspaces",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/fault-tolerance.html"
    }
  ]
});
