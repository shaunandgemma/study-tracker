import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-6",
  "title": "Kinesis Data Streams Shards",
  "plainEnglish": "A Shard is the fundamental base unit of throughput and capacity in an Amazon Kinesis data stream. Each shard provides a fixed, dedicated capacity for data ingestion (writes) and data consumption (reads). A Kinesis data stream is composed of one or more shards, and the total capacity of the stream is the sum of the capacities of all its active shards.",
  "whyItMatters": "Understanding shard limits is crucial for stream sizing, performance tuning, and preventing data loss. Ingesting more data than a shard's capacity allows triggers ProvisionedThroughputExceededException throttling errors, while having too many underutilized shards increases infrastructure costs unnecessarily. Managing shards via splitting or merging allows streams to adapt to changing throughput demands.",
  "workplaceExample": "A logistics fleet tracks 50,000 trucks generating 3.5 MB/sec of telemetry. Because a single shard provides 1 MB/sec write throughput, the architecture team provisions a Kinesis data stream with 4 shards (4 MB/sec total write capacity). During a flash delivery event where traffic reaches 7 MB/sec, they reshard the stream to 8 shards dynamically to prevent write throttling.",
  "examFocus": "Memorize shard throughput limits for certification exams: (1) Ingestion/Write: 1 MB/sec OR 1,000 records/sec per shard. (2) Standard Read (shared pull): 2 MB/sec per shard (shared across all standard consumers). (3) Enhanced Fan-Out Read (dedicated push): 2 MB/sec per shard PER registered consumer over HTTP/2. Resharding operations include Shard Splitting (doubles capacity) and Shard Merging (halves capacity).",
  "keyPoints": [
    "A shard is the core scaling and throughput unit of a Kinesis data stream.",
    "Write capacity per shard: 1 MB/sec or 1,000 records/sec (whichever limit is reached first).",
    "Read capacity per shard: 2 MB/sec shared across all standard consumers using GetRecords.",
    "Enhanced Fan-Out provides dedicated 2 MB/sec read throughput per registered consumer per shard over HTTP/2.",
    "Resharding allows scaling stream capacity up (Shard Splitting) or down (Shard Merging) without interrupting in-flight records.",
    "When a parent shard is split or merged, it transitions to the CLOSED state and remains available until all buffered records are read by consumers."
  ],
  "commonMistake": "Exceeding the 1,000 records/second limit even when total payload size is far below 1 MB/second (e.g., sending 1,500 records of 100 bytes each per second into a single shard). Both the 1 MB/s and 1,000 records/s limits apply independently.",
  "example": "Split an existing hot shard into two new child shards using the AWS CLI: aws kinesis split-shard --stream-name vehicle-telemetry --shard-to-split shardId-000000000000 --new-starting-hash-key 170141183460469231731687303715884105728.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Key Concepts - Shards",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#what-is-a-shard"
    },
    {
      "title": "Resharding a Stream in Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-resharding.html"
    }
  ]
});
