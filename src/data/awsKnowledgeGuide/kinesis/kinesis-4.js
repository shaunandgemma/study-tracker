import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-4",
  "title": "Kinesis Data Streams",
  "plainEnglish": "Amazon Kinesis Data Streams is a massively scalable and durable real-time streaming data service. It continuously collects and stores terabytes of data per hour from hundreds of thousands of concurrent sources—such as website clickstreams, financial transactions, social media feeds, IT telemetry logs, and location-tracking data—enabling real-time analytics and event-driven computing.",
  "whyItMatters": "Traditional batch architectures process data in scheduled intervals (e.g., hourly or daily), introducing significant data latency. Kinesis Data Streams enables modern real-time architectures where multiple downstream applications (such as fraud detection engines, real-time dashboards, and archival pipelines) process and analyze streaming data within 70 to 200 milliseconds of generation.",
  "workplaceExample": "A global gaming enterprise uses Kinesis Data Streams to ingest live player events (match scores, in-game purchases, player movement) from 10 million concurrent mobile devices. Three independent consumer applications consume the stream: a real-time leaderboard service, an anti-cheat anomaly detector, and an archival worker that stores all raw events into an Amazon S3 data lake.",
  "examFocus": "Understand core Kinesis Data Streams architecture: Data is ingested as records (up to 1 MB each) containing a sequence number, partition key, and data blob. Multiple consumers can read from the same stream concurrently without interfering with each other. Retention defaults to 24 hours (up to 365 days). Enhanced Fan-Out provides dedicated 2 MB/s read throughput per consumer per shard over HTTP/2 push.",
  "keyPoints": [
    "Durable, real-time streaming data service capable of ingesting gigabytes per second from thousands of producers.",
    "Data records consist of a Sequence Number, a Partition Key, and a Data Blob (payload up to 1 MB).",
    "Supports multiple concurrent consumer applications reading independently from the same stream at their own pace.",
    "Records are preserved for a configurable retention period (24 hours standard, up to 365 days), allowing consumers to re-read and replay data.",
    "Provides two reading architectures: Standard Shared Consumers (2 MB/s per shard shared pull) and Enhanced Fan-Out (2 MB/s dedicated push per consumer).",
    "Integrates natively with AWS Lambda via Event Source Mapping, Amazon Managed Service for Apache Flink, and the Kinesis Client Library (KCL)."
  ],
  "commonMistake": "Treating Kinesis Data Streams like a standard FIFO message queue (like Amazon SQS FIFO). In Kinesis, records are not deleted when read by a consumer; they remain in the stream until the retention window expires, enabling multiple applications to process and replay the exact same stream independently.",
  "example": "Ingest a real-time telemetry record using the AWS CLI PutRecord command: aws kinesis put-record --stream-name sensor-stream --partition-key sensor-994 --data '{\"temp\": 23.4, \"pressure\": 1013.25}'.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Key Concepts",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
    },
    {
      "title": "Getting Started with Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
    }
  ]
});
