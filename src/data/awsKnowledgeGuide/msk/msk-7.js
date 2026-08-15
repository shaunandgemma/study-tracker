import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-7",
  "title": "Kafka Topics and Partitions",
  "plainEnglish": "In Apache Kafka and Amazon MSK, a Topic is a named logical category or feed to which records are published by producers and from which records are read by consumers. A topic is split into one or more Partitions—distributed, ordered, immutable commit logs that are spread across different brokers in the cluster to enable massive parallel processing and horizontal scalability.",
  "whyItMatters": "Partitions are the fundamental unit of parallelism and throughput in Apache Kafka. Having multiple partitions allows multiple consumer instances in the same consumer group to process messages concurrently in parallel. However, First-In, First-Out (FIFO) record ordering is strictly guaranteed only within an individual partition, not across different partitions of the same topic.",
  "workplaceExample": "An online retail store creates an `order-events` topic with 12 partitions distributed across 6 MSK brokers. Producers include the `customer_id` as the partition key. Because Kafka applies a hash function to the key, all orders for any specific customer always land on the exact same partition in strict chronological sequence, while orders from thousands of other customers are processed concurrently across all 12 partitions.",
  "examFocus": "Understand Kafka partitioning rules: (1) Ordering: Guaranteed strictly WITHIN A PARTITION for records with the same partition key; there is NO global ordering across multiple partitions. (2) Partition Assignment: Partitions map to consumers in a consumer group (1 consumer per partition maximum; excess consumers sit idle). (3) Partition Keys: High-cardinality keys distribute data evenly; poor key selection creates hot partitions. (4) Partitions can be increased dynamically, but cannot be decreased.",
  "keyPoints": [
    "Topics represent logical streaming channels; partitions are physical distributed commit logs.",
    "Strict FIFO record ordering is guaranteed only within an individual partition based on partition key hashing.",
    "Consumers within the same consumer group divide partition ownership for parallel processing.",
    "The maximum active consumer parallelism in a consumer group equals the total number of partitions on the topic.",
    "Producers specify a partition key (e.g., user_id, device_id) to ensure related records land on the same partition.",
    "Partition count can be increased dynamically on active topics, but partition count cannot be reduced."
  ],
  "commonMistake": "Assuming that a multi-partition Kafka topic guarantees global chronological message ordering across the entire topic. Records in Partition 0 and Partition 1 are processed concurrently and independently; ordering is only guaranteed within the boundaries of a single partition.",
  "example": "Create a Kafka topic with 6 partitions and a replication factor of 3 using standard Kafka CLI tools: kafka-topics.sh --bootstrap-server <bootstrap-string> --create --topic customer-orders --partitions 6 --replication-factor 3.",
  "sources": [
    {
      "title": "Working with Topics in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-working-with-topics.html"
    },
    {
      "title": "Partition and Sizing Best Practices in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html#bestpractices-partitions"
    }
  ]
});
