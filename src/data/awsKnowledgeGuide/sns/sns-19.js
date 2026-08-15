import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-19",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS FIFO with SQS FIFO",
  "status": "ready",
  "plainEnglish": "An Amazon SNS FIFO (first in, first out) topic can fan messages out to Amazon SQS FIFO queues while preserving order within each message group. Publishers supply a MessageGroupId and either a MessageDeduplicationId or use content-based deduplication. SNS passes the group and deduplication identifiers to subscribed FIFO queues.",
  "whyItMatters": "This pairing supports multiple independent consumers that need the same ordered event history without calling each other. Message groups allow unrelated entities to progress in parallel, while a queue gives each consumer durable buffering and control of its processing rate.",
  "workplaceExample": "An account-lifecycle publisher sends events to an SNS FIFO topic using the customer record key as MessageGroupId and the event identifier as MessageDeduplicationId. Separate SQS FIFO queues serve billing and compliance, and each consumer processes one customer in order while remaining idempotent during retries or recovery.",
  "examFocus": "Ordering is scoped to a message group, not globally across every group or subscriber. Use an SNS FIFO topic with SQS FIFO queues when fan-out plus ordered, deduplicated delivery is required. Queue permissions, visibility timeout, deletion after success, deduplication scope, and subscription filtering all affect end-to-end behavior.",
  "keyPoints": [
    "FIFO topic names and FIFO queue names use the .fifo suffix.",
    "Every FIFO publication needs a MessageGroupId, and ordering is maintained separately within each group.",
    "A MessageDeduplicationId identifies repeated publications, or content-based deduplication can hash the message body when enabled.",
    "Message attributes are not included in the content-based deduplication hash.",
    "The SQS queue policy must allow the SNS service principal to send from the intended FIFO topic ARN.",
    "Each subscribed FIFO queue maintains its own consumption progress; there is no ordering relationship between different subscribers.",
    "A consumer must delete a successfully processed SQS message before its visibility timeout ends and should still make business changes idempotent.",
    "Subscription filtering can intentionally remove messages and changes the documented deduplicated delivery conditions, so evaluate it carefully for ordered workflows."
  ],
  "commonMistake": "Do not assume FIFO creates one global sequence or removes the need for idempotent consumers. Choose stable message groups, unique business-event deduplication IDs, correct visibility and delete behavior, and test failures inside one group without relying on the progress of another group.",
  "example": "Create a test SNS FIFO topic and two SQS FIFO queues with least-privilege queue policies. Publish events 1, 2, and 3 for group customer-A and interleave events for customer-B, then verify each queue preserves order inside each group. Republish one event with the same deduplication ID, test a consumer retry safely, and perform approved cleanup.",
  "sources": [
    {
      "title": "Amazon SNS message delivery for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-delivery.html"
    },
    {
      "title": "Amazon SNS message grouping for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-grouping.html"
    },
    {
      "title": "Amazon SNS message deduplication for FIFO topics",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-dedup.html"
    }
  ]
});
