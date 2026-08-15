import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kin-3",
  "title": "Kinesis Data Analytics (Serverless SQL / Apache Flink over streaming data)",
  "plainEnglish": "Amazon Managed Service for Apache Flink (formerly Amazon Kinesis Data Analytics) is a fully managed, serverless stream-processing service that allows you to transform and analyze streaming data in real time using Apache Flink, Java, Scala, Python, or SQL. It processes high-throughput data streams with sub-second latencies, stateful time-windowed aggregations, and exactly-once processing semantics.",
  "whyItMatters": "Traditional analytics tools operate on static batch datasets stored in databases or data lakes, introducing minutes or hours of delay. Amazon Managed Service for Apache Flink processes events as they flow through the stream, allowing organizations to detect fraudulent transactions, compute rolling financial metrics, or trigger real-time anomaly alerts within milliseconds of event generation.",
  "workplaceExample": "A fintech trading platform ingests millions of live currency exchange quotes per second into Amazon Kinesis Data Streams. They deploy an Amazon Managed Service for Apache Flink application that calculates 1-minute rolling average price spreads across sliding windows. When a price anomaly exceeds 3 standard deviations, Flink immediately outputs an alert event to an Amazon SNS topic.",
  "examFocus": "Understand the role and naming of the service: Formerly known as Kinesis Data Analytics, now Amazon Managed Service for Apache Flink (and Managed Service for Apache Flink Studio). It executes stateful stream processing over streaming sources (Kinesis Data Streams, Amazon MSK) and emits results to destinations (Kinesis Streams, Firehose, OpenSearch, S3). Supports tumbling, sliding, and session time windows.",
  "keyPoints": [
    "Executes real-time stateful stream processing over continuous data streams using Apache Flink.",
    "Formerly named Amazon Kinesis Data Analytics for Apache Flink; renamed to Amazon Managed Service for Apache Flink.",
    "Supports tumbling windows (fixed-size, non-overlapping), sliding windows (overlapping time intervals), and session windows (gap-based activity).",
    "Provides end-to-end exactly-once processing semantics using automated checkpoints and application state snapshots stored in Amazon S3.",
    "Integrates seamlessly with input sources (Kinesis Data Streams, Amazon MSK) and output destinations (S3, OpenSearch, Redshift, Kinesis).",
    "Automatically provisions, patches, scales, and manages Apache Flink cluster infrastructure with zero server maintenance."
  ],
  "commonMistake": "Confusing Amazon Managed Service for Apache Flink with Amazon Athena. Athena queries static, stored data at rest in Amazon S3 using standard SQL; Managed Service for Apache Flink continuously processes live in-flight data streams in real time as records arrive.",
  "example": "Create a Managed Apache Flink application using the AWS CLI: aws kinesisanalyticsv2 create-application --application-name fx-realtime-analytics --runtime-environment FLINK-1_18 --service-execution-role arn:aws:iam::123456789012:role/FlinkAppRole --application-configuration file://flink-config.json.",
  "sources": [
    {
      "title": "What is Amazon Managed Service for Apache Flink?",
      "url": "https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html"
    },
    {
      "title": "Amazon Kinesis Data Analytics Overview",
      "url": "https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html"
    }
  ]
});
