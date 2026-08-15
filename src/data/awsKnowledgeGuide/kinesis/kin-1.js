import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kin-1",
  "title": "Kinesis Data Streams (Real-time ingestion via Shards, Provisioned vs On-Demand capacity)",
  "plainEnglish": "Amazon Kinesis Data Streams is a serverless, real-time data streaming service that captures, buffers, and processes gigabytes of data per second from hundreds of thousands of sources. Data is organized into shards (units of capacity) and can run in either On-Demand capacity mode (which automatically scales capacity up and down to match fluctuating workloads) or Provisioned capacity mode (where you specify the exact number of shards).",
  "whyItMatters": "Modern applications (such as financial stock tickers, IoT sensor fleets, and gaming clickstreams) generate continuous torrents of events that must be processed with sub-second latency. Kinesis Data Streams decouples data producers from multiple real-time consumers, guaranteeing record ordering per partition key and retaining data for replay.",
  "workplaceExample": "A ride-sharing platform ingests continuous GPS coordinate pings from 150,000 active drivers into Amazon Kinesis Data Streams. Two independent downstream consumer applications read from the same stream simultaneously: an AWS Lambda function calculating live driver-rider matching in real time, and an Amazon Managed Service for Apache Flink application calculating regional surge-pricing heatmaps.",
  "examFocus": "Understand Kinesis Data Streams capacity modes: (1) On-Demand Mode: Automatically scales throughput up to 200 MB/s write and 400 MB/s read by default without managing shards, ideal for unpredictable traffic. (2) Provisioned Mode: You allocate explicit shards (each shard provides 1 MB/s or 1,000 records/s write, and 2 MB/s read). Data is retained for 24 hours by default (configurable up to 365 days).",
  "keyPoints": [
    "Captures, buffers, and processes streaming data records in real time with sub-second latency.",
    "Supports multiple concurrent consumers reading from the same stream independently without data loss.",
    "Offers two capacity modes: On-Demand (automatic throughput scaling) and Provisioned (manual shard sizing).",
    "Each provisioned shard supports up to 1 MB/sec or 1,000 records/sec write ingestion and 2 MB/sec read output.",
    "Default data retention period is 24 hours, extendable up to 8760 hours (365 days) for long-term stream replay.",
    "Maintains strict FIFO (First-In, First-Out) record ordering within each individual shard based on partition key hashing."
  ],
  "commonMistake": "Assuming Kinesis Data Streams guarantees global ordering across all shards in a multi-shard stream. Ordering is strictly guaranteed only within the boundaries of a single shard for records sharing the same partition key.",
  "example": "Create a Kinesis Data Stream in On-Demand capacity mode using the AWS CLI: aws kinesis create-stream --stream-name live-telemetry --stream-mode-details StreamMode=ON_DEMAND.",
  "sources": [
    {
      "title": "What is Amazon Kinesis Data Streams?",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
    },
    {
      "title": "Choosing Stream Capacity Mode in Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html"
    }
  ]
});
