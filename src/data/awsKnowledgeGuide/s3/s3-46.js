import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-46",
  "title": "S3 Event Notifications",
  "plainEnglish": "Amazon S3 Event Notifications is a messaging feature that enables your S3 bucket to automatically send notification messages to supported destination services whenever specific events occur within the bucket (such as when an object is created, deleted, restored from Glacier, or replicated). S3 Event Notifications can publish directly to Amazon Simple Queue Service (SQS) queues, Amazon Simple Notification Service (SNS) topics, and AWS Lambda functions.",
  "whyItMatters": "Event-driven architectures eliminate the need for compute servers to constantly poll S3 buckets for new files. By using S3 Event Notifications, downstream microservices, image resizing functions, or automated ETL workflows are triggered instantaneously only when new data is uploaded, maximizing developer velocity and lowering compute costs.",
  "workplaceExample": "A digital photography application configures an S3 Event Notification for `s3:ObjectCreated:*` with prefix filter `uploads/` and suffix filter `.png`. When a user uploads a new PNG photo, S3 immediately triggers an AWS Lambda function that resizes the image into three mobile thumbnail resolutions, extracts EXIF metadata, and writes the results to an Amazon DynamoDB table.",
  "examFocus": "Understand S3 Event Notification destinations and filtering rules: (1) Supported Classic Destinations: Amazon SQS Standard queues, Amazon SNS topics, and AWS Lambda functions. (2) Event Types: `s3:ObjectCreated:*`, `s3:ObjectRemoved:*`, `s3:ObjectRestore:*`, `s3:Replication:*`, `s3:LifecycleExpiration:*`. (3) Filtering: Only supports key Prefix (e.g., `raw/`) and Suffix (e.g., `.csv`) filtering; cannot filter on object content. (4) Resource Policies: Target SQS/SNS/Lambda must grant S3 service principal (`s3.amazonaws.com`) permission to publish events.",
  "keyPoints": [
    "Automatically triggers actions when objects are created, deleted, restored, or replicated in S3.",
    "Classic destinations: Amazon SQS queues, Amazon SNS topics, and AWS Lambda functions.",
    "Supports event filtering based on object key Prefix (e.g., `images/`) and Suffix (e.g., `.jpg`).",
    "Requires attaching resource policies to the destination SQS/SNS/Lambda allowing `s3.amazonaws.com`.",
    "Event delivery is at-least-once; downstream consumers must implement idempotent processing.",
    "Avoid recursive loops: writing output objects back into the same prefix that triggers the notification causes infinite execution loops."
  ],
  "commonMistake": "Creating a recursive event loop where an AWS Lambda function triggered by an `s3:ObjectCreated:*` event in a bucket writes its processed output file back into the same bucket with the same prefix. This triggers another event notification, causing an infinite loop that spikes Lambda and S3 billing.",
  "example": "Configure an S3 Event Notification sending object-creation events to an SQS queue in JSON: {\"QueueConfigurations\": [{\"QueueArn\": \"arn:aws:sqs:us-east-1:123456789012:image-processing-queue\", \"Events\": [\"s3:ObjectCreated:*\"], \"Filter\": {\"Key\": {\"FilterRules\": [{\"Name\": \"prefix\", \"Value\": \"raw/\"}, {\"Name\": \"suffix\", \"Value\": \".jpg\"}]}}}]}.",
  "sources": [
    {
      "title": "Amazon S3 Event Notifications Overview",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html"
    },
    {
      "title": "Supported Event Types and Destinations in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html"
    }
  ]
});
