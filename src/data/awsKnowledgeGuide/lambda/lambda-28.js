import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-28",
  "title": "Lambda with DynamoDB Streams",
  "plainEnglish": "Integrating AWS Lambda with Amazon DynamoDB Streams creates an automated Change Data Capture (CDC) pipeline where any item-level modification (INSERT, MODIFY, or REMOVE) in a DynamoDB table emits a stream record that triggers a Lambda function. Lambda polls the stream shards, batches modification events, and invokes your function synchronously in strict chronological order.",
  "whyItMatters": "DynamoDB Streams combined with Lambda enables reactive serverless patterns such as real-time search indexing in OpenSearch, automated cache invalidation in ElastiCache, cross-region replication, audit logging, and triggering asynchronous downstream notifications immediately when database rows change.",
  "workplaceExample": "An e-commerce platform enables DynamoDB Streams on its `Orders` table with stream view type `NEW_AND_OLD_IMAGES`. When an order status changes to 'SHIPPED', a triggered Lambda function reads the old and new images, generates a tracking confirmation email via Amazon SES, and indexes the updated order into an Amazon OpenSearch cluster for customer support searches.",
  "examFocus": "Understand DynamoDB Streams integration mechanics: (1) Stream View Types: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, and NEW_AND_OLD_IMAGES. (2) Stream retention is strictly 24 hours (cannot be extended). (3) Concurrency: 1 Lambda instance per shard by default, expandable up to 10 instances per shard with `ParallelizationFactor`. (4) If Lambda fails processing a batch, it blocks that shard until the batch succeeds, expires (24 hours), or is bisected and routed to an On-Failure destination.",
  "keyPoints": [
    "Captures item-level table changes (INSERT, MODIFY, REMOVE) in a chronological, time-ordered sequence.",
    "Stream View Types dictate payload contents: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES.",
    "DynamoDB Streams records are retained for strictly 24 hours before automatic deletion.",
    "Lambda processes records from each stream shard in strict chronological sequence (FIFO).",
    "Supports 'ParallelizationFactor' (1–10) to process multiple partition keys in a shard concurrently.",
    "Error-handling controls (BisectBatchOnFunctionError, MaximumRetryAttempts, On-Failure destinations) prevent poisoned records from blocking shards."
  ],
  "commonMistake": "Allowing a Lambda function attached to DynamoDB Streams to write back to the exact same DynamoDB table without a conditional check. This can trigger an infinite invocation loop, causing massive function executions and database write throttling.",
  "example": "Create an Event Source Mapping between a DynamoDB stream and a Lambda function using the AWS CLI: aws lambda create-event-source-mapping --function-name index-orders --event-source-arn arn:aws:dynamodb:us-east-1:123456789012:table/Orders/stream/2026-08-15T00:00:00.000 --starting-position LATEST --batch-size 25.",
  "sources": [
    {
      "title": "Using AWS Lambda with Amazon DynamoDB Streams",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html"
    },
    {
      "title": "Change Data Capture for DynamoDB Streams",
      "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html"
    }
  ]
});
