import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-7",
  "title": "SNS FIFO Topics",
  "plainEnglish": "An SNS first-in, first-out (FIFO) topic adds message-group ordering and deduplication to publish-subscribe messaging. Every published message has a message group ID, and SNS preserves order within that group while different groups can progress independently. A deduplication ID, or supported content-based deduplication, identifies repeated publications within the documented scope.",
  "whyItMatters": "FIFO is useful when independent entity streams—such as updates for each order—must remain in sequence. Message groups let the system preserve each entity's order without forcing unrelated entities through one global sequence.",
  "workplaceExample": "An inventory service publishes product updates using the product identifier as the message group ID and a unique event identifier as the deduplication ID. Separate supported SQS subscribers update pricing and stock, and each consumer remains idempotent in case its own processing is retried.",
  "examFocus": "Ordering is per message group, not one global order across unrelated groups. Confirm current subscriber compatibility. Content-based deduplication hashes the supported message body and excludes message attributes, so use explicit deduplication IDs when attributes distinguish business events.",
  "keyPoints": [
    "FIFO topic names use the required .fifo suffix.",
    "A message group ID defines the boundary within which publication order is preserved.",
    "Different message groups can be delivered in parallel and have no shared total order.",
    "A publisher supplies a deduplication ID unless content-based deduplication supplies it.",
    "Content-based deduplication is calculated from the message body rather than every message attribute.",
    "Deduplication has a documented scope and interval and does not remove the need for application idempotency.",
    "FIFO topics support SQS FIFO and Standard queue subscriptions, but only FIFO queues preserve FIFO delivery characteristics.",
    "Supported FIFO topic archives can replay messages, but replay does not reverse side effects already performed."
  ],
  "commonMistake": "Putting every message into one group to obtain a supposed global order can serialize unrelated work and limit parallelism. Choose group IDs from the real business ordering boundary and never claim ordering between separate groups.",
  "example": "Confirm all subscriber types are currently supported, create a test FIFO topic and FIFO queues, use one group per harmless test entity, publish ordered events with deliberate duplicate IDs, verify per-group order, retry consumer processing, prove idempotency, and test replay only against disposable state.",
  "sources": [
    {
      "title": "Amazon SNS message grouping for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-grouping.html"
    },
    {
      "title": "Amazon SNS message deduplication for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-dedup.html"
    },
    {
      "title": "Amazon SNS message delivery for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-delivery.html"
    }
  ]
});
