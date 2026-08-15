import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-9",
  "title": "Replication and High Availability",
  "plainEnglish": "Replication in Amazon MSK is the process of automatically copying partition logs across multiple brokers located in different Availability Zones. Every topic partition has one designated Leader broker (which handles all client write and read requests) and multiple Follower replicas (which passively synchronize data from the leader). Replicas that are completely caught up with the leader are termed In-Sync Replicas (ISR).",
  "whyItMatters": "Hardware failures, broker restarts, and network partitions are inevitable in large-scale distributed systems. Configuring an adequate Replication Factor (RF=3) and setting `min.insync.replicas=2` paired with `acks=all` ensures that even if a broker crashes unexpectedly, zero committed records are lost and a follower replica immediately assumes leadership without interrupting stream processing.",
  "workplaceExample": "A banking core ledger deploys an MSK cluster with 3 brokers across 3 AZs. For their `financial-ledger` topic, they enforce `replication.factor=3` and `min.insync.replicas=2`. Producer microservices write with `acks=all`. When Broker 1 crashes, writes continue successfully because Brokers 2 and 3 acknowledge receipt, meeting the minimum in-sync threshold and preventing transaction loss.",
  "examFocus": "Understand the three pillars of Kafka durability and high availability: (1) Replication Factor (RF): Recommended RF=3 in 3-AZ clusters. (2) `min.insync.replicas` (default 2): Minimum number of in-sync replicas that must acknowledge a write for it to be considered successful. (3) Producer Acknowledgment (`acks`): `acks=all` (or `acks=-1`) ensures all in-sync replicas write the record to disk before acknowledging; `acks=1` only waits for leader; `acks=0` fire-and-forget.",
  "keyPoints": [
    "Replication Factor (RF) specifies the total number of partition copies maintained across brokers (RF=3 recommended).",
    "Each partition has one Leader broker handling I/O and multiple Follower replicas synchronizing data in the background.",
    "In-Sync Replicas (ISR) are follower replicas that are actively caught up with the partition leader's latest offset.",
    "Setting `acks=all` (acks=-1) ensures data durability by requiring all in-sync replicas to confirm writes.",
    "`min.insync.replicas=2` guarantees that at least two replicas must acknowledge a write, preventing data loss during broker failure.",
    "If the leader broker fails, Kafka automatically elects an in-sync follower replica as the new partition leader."
  ],
  "commonMistake": "Setting `replication.factor=1` in production to save disk space. A topic with RF=1 has zero redundancy; if the single broker holding that partition fails, that partition becomes immediately offline and unavailable until the broker recovers.",
  "example": "Set topic durability properties in a Java Kafka producer configuration: props.put('acks', 'all'); props.put('retries', 3); props.put('enable.idempotence', 'true'); to ensure zero data loss across in-sync replicas.",
  "sources": [
    {
      "title": "Amazon MSK High Availability and Replication",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-ha.html"
    },
    {
      "title": "Topic Replication and In-Sync Replicas Best Practices",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html#bestpractices-replication"
    }
  ]
});
