import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-9",
  "title": "SNS to SQS Fanout",
  "plainEnglish": "SNS-to-SQS fan-out combines push-based publication with durable queues. A publisher sends one event to an SNS topic; SNS places a copy on each subscribed Amazon Simple Queue Service (Amazon SQS) queue, and each independent consumer polls its own queue at its own pace.",
  "whyItMatters": "A temporary consumer outage does not have to block publishers or other consumers because its queue retains work according to SQS configuration. Separate queues also isolate backlog, scaling, retry, and dead-letter behavior for each business function.",
  "workplaceExample": "A product-catalog service publishes change events once. Search indexing, recommendations, and audit processing each receive a separate queue. A surge creates a backlog only for the slower recommendations consumer, while search and audit continue independently.",
  "examFocus": "Choose SNS for fan-out and SQS for durable pull-based processing; combine them when several consumers need their own queues. The queue resource policy must allow the SNS service principal to send from the intended topic, preferably constrained by the source topic ARN.",
  "keyPoints": [
    "Each subscribed SQS queue receives its own copy of a matching topic message.",
    "Consumers poll queues; they do not poll the SNS topic.",
    "A queue policy must authorize the intended SNS topic to call SendMessage.",
    "Subscription filters can route different event subsets to different queues.",
    "Raw message delivery can send the original body without the normal SNS envelope when that contract is desired.",
    "Standard-topic and Standard-queue consumers must be idempotent because duplicate delivery is possible.",
    "An SQS consumer dead-letter queue handles failed processing separately from an SNS subscription dead-letter queue for failed delivery."
  ],
  "commonMistake": "Using one shared queue for unrelated consumer teams creates competing consumers, so only one normally receives a given queued message. Give each independent processing function its own subscribed queue when every function needs the event.",
  "example": "Identify a harmless publisher event, create a test topic and separate queues, subscribe each queue, restrict every queue policy to the intended topic, add narrow filters where needed, publish matching and nonmatching messages, verify idempotent processing, configure delivery and consumer dead-letter paths, monitor delivery and backlog, then clean up safely.",
  "sources": [
    {
      "title": "Fan out Amazon SNS notifications to Amazon SQS queues",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"
    },
    {
      "title": "Subscribing an Amazon SQS queue to an Amazon SNS topic",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html"
    }
  ]
});
