import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-10",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS to Lambda",
  "status": "ready",
  "plainEnglish": "An AWS Lambda function can subscribe to an Amazon Simple Notification Service (Amazon SNS) topic. When the topic publishes a matching notification, SNS invokes the function asynchronously and supplies an event containing the SNS message and metadata. This is useful for short, event-driven processing that should start without a server continuously polling for work.",
  "whyItMatters": "The integration lets one publication trigger several independent functions or other subscribers. The publisher stays separate from the processing code, while Lambda automatically scales function invocations within its configured concurrency and service limits.",
  "workplaceExample": "A monitoring system publishes a service-health event to an SNS topic. One subscribed Lambda function enriches the event and opens an internal incident, while another subscription sends the original event to an SQS queue for later reporting. Each function records the SNS message ID and makes repeated processing safe.",
  "examFocus": "Know that SNS pushes an event to Lambda and invokes the function asynchronously. The function needs a resource-based policy allowing the sns.amazonaws.com service principal to call lambda:InvokeFunction; restrict the permission with the source topic ARN. At-least-once delivery means the function should be idempotent.",
  "keyPoints": [
    "The Lambda subscription uses the lambda protocol and targets a function Amazon Resource Name (ARN).",
    "SNS places the notification inside the Lambda event's Records structure, so code must read the SNS message from that envelope.",
    "A Lambda resource-based policy must permit Amazon SNS to invoke the function.",
    "A source ARN condition limits that permission to the intended SNS topic.",
    "SNS invokes Lambda asynchronously, and duplicate event delivery can occur, so business operations should be idempotent.",
    "Subscription filters can stop irrelevant messages before they invoke the function and consume Lambda capacity.",
    "Monitor SNS delivery metrics and Lambda errors, throttles, duration, and concurrency because acceptance by Lambda is not the same as successful business processing."
  ],
  "commonMistake": "Do not assume that adding an SNS subscription alone grants invocation permission or that a successful SNS delivery metric proves the function completed its work. Configure the Lambda resource policy and observe both services' failure paths.",
  "example": "Create a test topic and a Lambda function that safely logs only a test event type. Add lambda:InvokeFunction permission for sns.amazonaws.com with the test topic as SourceArn, subscribe the function, publish a synthetic message, inspect the event envelope and logs, publish the same logical event again to verify idempotency, and then use the approved cleanup process.",
  "sources": [
    {
      "title": "Fanout Amazon SNS notifications to Lambda functions for automated processing",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-lambda-as-subscriber.html"
    },
    {
      "title": "Invoking Lambda functions with Amazon SNS notifications",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-sns.html"
    }
  ]
});
