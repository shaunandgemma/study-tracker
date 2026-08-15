import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-23",
  "title": "Kinesis vs SQS",
  "plainEnglish": "Amazon Kinesis Data Streams and Amazon Simple Queue Service (Amazon SQS) are both foundational messaging and ingestion services on AWS, but they target fundamentally different architectural patterns. Amazon SQS is a distributed message queue where competing worker consumers pull and delete individual messages after processing. Amazon Kinesis Data Streams is a real-time streaming data service where multiple independent consumer applications read, process, and replay ordered data records across sharded data partitions.",
  "whyItMatters": "Selecting between Kinesis and SQS dictates how your application scales, handles errors, and decouples microservices. SQS is ideal for decoupled asynchronous task queues, work distribution across competing worker pools, and per-message retry with dead-letter queues. Kinesis is ideal for big-data streaming analytics, ordered event processing per partition key, multi-consumer data pipelines, and historical stream replay.",
  "workplaceExample": "An e-commerce backend uses Amazon SQS for order fulfillment: when a customer buys an item, an 'order-created' message is placed on an SQS queue where 10 worker EC2 instances compete to process orders, each deleting the message once completed. Simultaneously, the company sends user web clickstream telemetry into Amazon Kinesis Data Streams so three separate analytics systems can analyze user navigation paths concurrently in real time.",
  "examFocus": "Compare Kinesis Data Streams vs Amazon SQS: (1) Consumption Model: SQS = Competing consumers (one consumer processes and deletes each message); Kinesis = Multi-consumer stream (multiple apps read same records). (2) Ordering: SQS Standard = Best-effort (SQS FIFO supports strict order up to 300-3000 msgs/s); Kinesis = Strict order per partition key per shard at massive throughput. (3) Replayability: SQS = Deleted messages cannot be replayed; Kinesis = Replayable within retention window (up to 365 days). (4) Scaling: SQS = Scales automatically to infinite messages; Kinesis = Shard-based capacity.",
  "keyPoints": [
    "Amazon SQS is a point-to-point message queuing service for asynchronous task decoupling and work distribution.",
    "Amazon Kinesis Data Streams is a high-throughput real-time streaming service for multi-consumer analytics.",
    "In SQS, messages are deleted from the queue upon successful processing by one worker.",
    "In Kinesis, records persist for the retention window (1–365 days) and can be consumed simultaneously by multiple independent applications.",
    "SQS uses a competing-consumer model with message visibility timeouts and per-message Dead Letter Queues (DLQs).",
    "Kinesis uses a shard-based partition model where record order is strictly guaranteed per partition key."
  ],
  "commonMistake": "Using Kinesis Data Streams when you need a simple asynchronous task queue where individual background workers pick up jobs and delete them upon completion. For individual job task queues with per-message acknowledgement, Amazon SQS is much simpler and more cost-effective.",
  "example": "Use Amazon SQS to distribute asynchronous video encoding jobs to an auto-scaling fleet of worker EC2 instances; use Amazon Kinesis Data Streams to ingest millions of live video playback QoS telemetry metrics per second for real-time dashboard analytics.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams vs Amazon SQS",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/real-time-analytics-on-aws/amazon-kinesis-vs-amazon-sqs.html"
    },
    {
      "title": "What is Amazon Simple Queue Service (Amazon SQS)?",
      "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html"
    }
  ]
});
