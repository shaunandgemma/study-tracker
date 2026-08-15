import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-17",
  "title": "Ordering within a Shard",
  "plainEnglish": "Amazon Kinesis Data Streams strictly guarantees First-In, First-Out (FIFO) record ordering within each individual shard. Every record ingested into a shard is assigned a monotonically increasing sequence number by Kinesis, ensuring that consumer applications process records in the exact chronological sequence they arrived at that shard.",
  "whyItMatters": "Many streaming applications—such as banking ledgers, stock trade logs, inventory updates, and IoT device state machines—require events for a specific entity (like an account ID or user ID) to be processed in exact chronological order. By assigning that entity ID as the partition key, all its events are hashed to the same shard and processed sequentially without race conditions.",
  "workplaceExample": "An online retail inventory system processes item stock updates in Kinesis. The producer sets `item_sku` as the partition key. Because all inventory adjustments for a specific SKU land on the exact same shard in order, the consumer processes 'Item Added (+10)' before 'Item Purchased (-1)', preventing false out-of-stock anomalies.",
  "examFocus": "Remember that ordering in Kinesis Data Streams is GUARANTEED PER SHARD, NOT GLOBALLY across the entire multi-shard stream. To guarantee ordering for related records, you must use the same Partition Key so they map to the same shard. If a consumer fails during a batch, it must re-read from the last checkpoint to preserve strict ordering.",
  "keyPoints": [
    "Strict FIFO (First-In, First-Out) ordering is guaranteed within an individual shard, but NOT across different shards.",
    "Each record written to a shard receives a unique, monotonically increasing Sequence Number assigned by Kinesis.",
    "Records sharing the same Partition Key are guaranteed to be routed to the same shard and processed in order.",
    "Consumers (like AWS Lambda or KCL) process records sequentially within each shard by reading sequence numbers in order.",
    "When a shard splits or merges, parent shards are closed and must be read to completion before child shards are processed to maintain ordering.",
    "Applications should be idempotent to safely handle duplicate processing if consumer retries occur."
  ],
  "commonMistake": "Assuming that a multi-shard Kinesis data stream guarantees global chronological ordering across all shards. Records in Shard A and Shard B are processed in parallel and independently; there is no cross-shard order guarantee.",
  "example": "Verify record sequence numbers when putting records with the same partition key: aws kinesis put-record --stream-name stock-trades --partition-key 'AAPL' --data '{\"price\": 182.50}', which returns a unique SequenceNumber string representing its ordered position in the shard.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Key Concepts - Sequence Numbers",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#sequence-number"
    },
    {
      "title": "Handling Duplicate Records and Ordering in Amazon Kinesis",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html"
    }
  ]
});
