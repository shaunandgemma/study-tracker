import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-47",
  "title": "S3 EventBridge Integration",
  "plainEnglish": "Amazon S3 EventBridge Integration allows you to send Amazon S3 bucket events directly to Amazon EventBridge's default event bus. Instead of managing complex point-to-point S3 Event Notifications to individual SQS, SNS, or Lambda targets, S3 sends standardized JSON cloud events to EventBridge, allowing you to use advanced event pattern matching (filtering by object size, metadata, or specific actions) and route single S3 events to over 30 distinct AWS and SaaS targets simultaneously.",
  "whyItMatters": "Classic S3 Event Notifications have strict limitations: you cannot configure overlapping prefix/suffix filters for the same event type across multiple destinations, cannot filter events based on object size or tags, and cannot route events to targets like AWS Step Functions, EventBridge API destinations, or Kinesis. S3 EventBridge integration removes all these limitations with enterprise-grade event routing and event replay capabilities.",
  "workplaceExample": "An enterprise fintech platform processes insurance claim documents. They enable EventBridge on their S3 claims bucket. Using EventBridge rules, they create three parallel automated workflows from a single `Object Created` event: (1) Files > 10 MB route to an AWS Step Functions workflow for asynchronous virus scanning, (2) PDF files trigger an Amazon Textract OCR pipeline, and (3) An audit log event is sent directly to Amazon Kinesis Data Firehose for compliance ingestion.",
  "examFocus": "Compare S3 EventBridge Integration vs Classic S3 Event Notifications: (1) Target Capabilities: EventBridge routes to 30+ targets (Step Functions, Kinesis, ECS, API Destinations, etc.); Classic S3 notifications only support SQS, SNS, and Lambda. (2) Advanced Filtering: EventBridge filters on object size, exact prefix, file extension, and event metadata; Classic S3 only supports basic prefix/suffix. (3) Multi-Destination: EventBridge allows multiple rules matching the exact same prefix without overlap conflicts. (4) Configuration: Enabled on the bucket via `EventBridgeConfiguration: {}`.",
  "keyPoints": [
    "Publishes S3 object and bucket events directly to the Amazon EventBridge default event bus.",
    "Routes a single S3 event to over 30 distinct AWS services, third-party SaaS apps, and API destinations.",
    "Supports advanced event pattern matching based on object size, metadata, and detail type.",
    "Eliminates classic S3 event notification prefix overlap restrictions and queue policy complexities.",
    "Enables event archiving, tracing via AWS X-Ray, and event replay for disaster recovery.",
    "Enabled via a single flag (`EventBridgeConfiguration: {}`) on the S3 bucket notification configuration."
  ],
  "commonMistake": "Struggling with classic S3 notification errors caused by overlapping prefix/suffix rules targeting multiple Lambda functions. Instead of managing complex SNS fanout architectures, simply enable S3 EventBridge integration and create independent EventBridge rules.",
  "example": "Enable EventBridge notifications on an S3 bucket using the AWS CLI: aws s3api put-bucket-notification-configuration --bucket my-enterprise-bucket --notification-configuration '{\"EventBridgeConfiguration\": {}}'.",
  "sources": [
    {
      "title": "Using Amazon EventBridge with Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html"
    },
    {
      "title": "Amazon S3 EventBridge Event Types and Schema",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html"
    }
  ]
});
