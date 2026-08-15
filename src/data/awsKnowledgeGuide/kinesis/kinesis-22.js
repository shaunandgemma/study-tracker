import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-22",
  "title": "Kinesis Data Streams vs Data Firehose",
  "plainEnglish": "Amazon Kinesis Data Streams and Amazon Data Firehose are two core AWS streaming services built for different architectural requirements. Kinesis Data Streams is a low-latency, real-time data streaming service where custom consumers read and replay ordered records. Amazon Data Firehose is an automated, serverless delivery service that buffers, transforms, and loads streaming data directly into storage repositories and analytics destinations with zero code.",
  "whyItMatters": "Choosing between Kinesis Data Streams and Data Firehose depends on latency requirements and consumer complexity. If your architecture requires sub-second processing, multiple custom consumer applications reading the same data, and record replay capability, choose Kinesis Data Streams. If you simply need to load streaming events directly into Amazon S3, Redshift, OpenSearch, or Snowflake in near-real time without writing consumer applications, choose Firehose.",
  "workplaceExample": "A smart home company uses both services in tandem: IoT devices publish live telemetry into Kinesis Data Streams for sub-second real-time alerting (triggering AWS Lambda if a fire alarm trips). Concurrently, an Amazon Data Firehose delivery stream is attached directly to the Kinesis data stream as a consumer, buffering all incoming events and writing daily Parquet files into an Amazon S3 data lake for long-term analytics.",
  "examFocus": "Compare Kinesis Data Streams vs Data Firehose: (1) Latency: Data Streams = Real-time (sub-second, ~70-200ms); Firehose = Near-real-time (buffered 60-900s). (2) Management: Data Streams = Shard management (Provisioned or On-Demand); Firehose = Completely serverless. (3) Consumers: Data Streams = Multiple custom consumers (Lambda, KCL, Flink); Firehose = Automated destination delivery only. (4) Data Replay: Data Streams = Replayable up to 365 days; Firehose = Non-replayable after delivery.",
  "keyPoints": [
    "Kinesis Data Streams provides real-time, sub-second (70–200ms) stream processing for custom consumers.",
    "Amazon Data Firehose provides near-real-time (60–900s) automated delivery to S3, Redshift, OpenSearch, and SaaS destinations.",
    "Data Streams retains records for 1 to 365 days, enabling multiple consumers to re-read and replay historical data.",
    "Data Firehose does not store records for replay; data is buffered in memory and deleted once delivered to the destination.",
    "Data Streams requires capacity mode selection (On-Demand or Provisioned shards); Firehose scales automatically with zero capacity management.",
    "Firehose can consume directly from a Kinesis Data Stream to provide automated S3/Redshift archiving alongside real-time consumers."
  ],
  "commonMistake": "Attempting to build a multi-consumer application on Amazon Data Firehose. Firehose does not expose consumer APIs or sharded partitions; for multiple independent consumer applications, route traffic through Kinesis Data Streams.",
  "example": "Use Kinesis Data Streams for sub-second fraud detection with an Apache Flink consumer, while using Amazon Data Firehose to stream the raw transaction logs directly into Amazon S3 for long-term Athena SQL querying.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Overview",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
    },
    {
      "title": "What is Amazon Data Firehose?",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"
    }
  ]
});
