import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-7",
  "title": "Partition Keys",
  "plainEnglish": "A Partition Key is a Unicode string (up to 256 characters) specified by a producer application when adding a record to an Amazon Kinesis data stream. Kinesis uses an MD5 hash function on the partition key to map the record to a specific shard within the stream, ensuring that all records sharing the exact same partition key are routed to the same shard in strict sequential order.",
  "whyItMatters": "The choice of partition key directly dictates data distribution, parallel processing efficiency, and system reliability. Using a high-cardinality, well-distributed partition key (like a UUID or customer ID) spreads traffic evenly across all shards. Conversely, a poor partition key (like a static country code or low-cardinality enum) routes all traffic to a single shard, creating a 'hot shard' bottleneck that throttles writes.",
  "workplaceExample": "A banking application processes debit card transactions across 10 shards in Kinesis Data Streams. The engineering team uses `account_id` as the partition key. Because account IDs are highly diverse and evenly distributed, transactions spread evenly across all 10 shards, while all transactions for any single bank account arrive sequentially at the same shard for strict chronological balance processing.",
  "examFocus": "Understand partition key mechanics: (1) Determines shard routing via MD5 hash mapped to the shard's hash key range. (2) Guarantees strict FIFO record ordering within a shard for records with the same partition key. (3) Low-cardinality partition keys cause hot shards and `ProvisionedThroughputExceededException` errors. (4) Explicit hash keys can override standard MD5 hash routing when using the Kinesis Producer Library (KPL).",
  "keyPoints": [
    "Partition keys are Unicode strings (maximum 256 characters) provided with every PutRecord or PutRecords call.",
    "Kinesis applies an MD5 hash to the partition key to map the record to a specific shard's 128-bit hash key range.",
    "All records with the same partition key are guaranteed to land on the same shard in strict sequential order.",
    "High-cardinality keys (e.g., user_id, device_id, transaction_uuid) distribute traffic uniformly across shards.",
    "Low-cardinality keys (e.g., region_name, status) lead to 'hot shards' and throughput throttling even if the overall stream has excess capacity.",
    "The Kinesis Producer Library (KPL) can assign explicit hash keys to distribute aggregated records uniformly across shards."
  ],
  "commonMistake": "Using a static or low-cardinality string (such as the string constant 'ORDERS' or date '2026-08-15') as the partition key. This routes 100% of stream traffic into one single shard, causing severe throttling while all other shards sit idle.",
  "example": "Put a record into Kinesis using a high-cardinality partition key (user UUID): aws kinesis put-record --stream-name user-activity --partition-key 'usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' --data '{\"action\": \"click\", \"item_id\": 1024}'.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Key Concepts - Partition Keys",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#partition-key"
    },
    {
      "title": "Adding Data to a Stream in Amazon Kinesis",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-add-data-to-stream.html"
    }
  ]
});
