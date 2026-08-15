import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-11",
  "title": "Stream Consumers",
  "plainEnglish": "A Stream Consumer in Amazon Kinesis Data Streams is any custom application, serverless function, or AWS service that retrieves, processes, and acts upon data records stored in a Kinesis stream. Consumers read records using standard pull-based APIs (GetRecords), serverless event-source mappings with AWS Lambda, the Kinesis Client Library (KCL), or dedicated HTTP/2 push with Enhanced Fan-Out.",
  "whyItMatters": "Multiple independent consumer applications can process the same streaming data concurrently for different business purposes. For example, one consumer can run real-time anomaly detection, a second consumer can update operational dashboards, and a third consumer can deliver records to Amazon S3 for long-term storage, all reading from the same stream without interfering with one another.",
  "workplaceExample": "A cybersecurity company processes network flow records from a 20-shard Kinesis stream. They deploy two consumer architectures: an AWS Lambda event-source mapping that filters and triggers immediate alerts for blacklisted IP addresses, and an EC2-based Java Kinesis Client Library (KCL) cluster that computes rolling 1-hour connection graphs and stores checkpoints in an Amazon DynamoDB lease table.",
  "examFocus": "Know the consumer options and their characteristics: (1) AWS Lambda: Serverless consumer with Event Source Mapping, polling shards and invoking functions with batches of records. (2) Kinesis Client Library (KCL): Java/multi-language framework that manages shard load balancing, lease coordination, and checkpointing via an Amazon DynamoDB table. (3) Standard vs Enhanced Fan-Out: Standard shares 2 MB/s read per shard (GetRecords); Enhanced Fan-Out provides dedicated 2 MB/s per consumer per shard (SubscribeToShard).",
  "keyPoints": [
    "Consumers process records continuously from Kinesis Data Streams without removing or altering data in the stream.",
    "AWS Lambda consumes streams serverlessly via Event Source Mappings, scaling from 1 to multiple parallel instances per shard (ParallelizationFactor).",
    "The Kinesis Client Library (KCL) automates shard discovery, distributed worker coordination, and checkpointing using Amazon DynamoDB.",
    "Standard consumers use the HTTP GetRecords pull model, sharing the shard's 2 MB/sec read limit across all standard consumers.",
    "Enhanced Fan-Out consumers use HTTP/2 push (SubscribeToShard), receiving a dedicated 2 MB/sec throughput per consumer per shard.",
    "Consumers must be designed to handle duplicate records idempotently, as network retries and worker rebalancing can cause at-least-once delivery duplicates."
  ],
  "commonMistake": "Building custom shard-coordination logic from scratch in EC2 worker applications instead of using the Kinesis Client Library (KCL). The KCL handles complex distributed tasks like shard rebalancing, lease expiration, and checkpointing automatically via DynamoDB.",
  "example": "Configure an AWS Lambda function as a Kinesis consumer via Event Source Mapping: aws lambda create-event-source-mapping --function-name process-telemetry --event-source-arn arn:aws:kinesis:us-east-1:123456789012:stream/telemetry-stream --batch-size 100 --starting-position LATEST.",
  "sources": [
    {
      "title": "Developing Consumers Using the Amazon Kinesis Data Streams API",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/building-consumers.html"
    },
    {
      "title": "Developing Consumers with the Kinesis Client Library (KCL)",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-consumers.html"
    }
  ]
});
