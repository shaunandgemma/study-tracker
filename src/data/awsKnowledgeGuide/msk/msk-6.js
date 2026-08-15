import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-6",
  "title": "Kafka Brokers",
  "plainEnglish": "A Kafka Broker is an individual server node within an Apache Kafka cluster responsible for receiving data records from producers, writing them to durable storage disks, maintaining partition replicas, and serving read requests from consumer applications. In Amazon MSK Provisioned clusters, brokers run as managed EC2 instances distributed evenly across distinct Availability Zones.",
  "whyItMatters": "Brokers are the foundational compute and storage workhorses of an Apache Kafka cluster. The number, instance size, and distribution of brokers determine the total read/write throughput capacity, maximum partition limit, network bandwidth, and memory caching (page cache) available to your streaming pipelines.",
  "workplaceExample": "An IoT platform handles 30 MB/sec of continuous sensor telemetry. The architecture team provisions an Amazon MSK cluster with 3 `kafka.m5.xlarge` brokers (one in each of 3 Availability Zones). Each broker serves as the partition leader for a third of the topics and acts as an in-sync follower replica for the remaining partitions, ensuring that client read/write load is balanced uniformly across all 3 nodes.",
  "examFocus": "Understand broker sizing and management: (1) Sizing criteria: Network bandwidth, CPU utilization, and RAM (for OS page cache). (2) Recommended partition count per broker: Keep active partitions under recommended limits per instance size (e.g., up to 1,000–4,000 partitions per broker depending on instance type). (3) Broker replacement: AWS monitors broker health and automatically provisions and replaces unhealthy brokers without data loss or cluster downtime.",
  "keyPoints": [
    "Brokers receive, store, replicate, and serve streaming data records across topic partitions.",
    "Distributed evenly across 2 or 3 Availability Zones in your Virtual Private Cloud (VPC).",
    "Each broker attaches dedicated Amazon EBS storage volumes (gp3 or standard EBS).",
    "AWS monitors broker instances 24/7, automatically replacing failed hardware with zero manual intervention.",
    "Producers and consumers connect initially via bootstrap broker strings to discover the cluster topology.",
    "Supported instance families include general-purpose (m5, m7g) and burstable (t3) types."
  ],
  "commonMistake": "Overloading individual brokers with too many partitions (e.g., putting 10,000 partitions on a small `kafka.t3.small` broker). Excessive partitions per broker cause high memory pressure, slow leader elections, and degraded replication throughput.",
  "example": "Inspect broker node details and status using the AWS CLI: aws kafka list-nodes --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd.",
  "sources": [
    {
      "title": "Amazon MSK Broker Types and Sizing",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-create-cluster.html#broker-types"
    },
    {
      "title": "Best Practices for Right-Sizing MSK Brokers",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html#bestpractices-sizing"
    }
  ]
});
