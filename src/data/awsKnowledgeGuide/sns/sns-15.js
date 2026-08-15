import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-15",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS Dead-Letter Queues",
  "status": "ready",
  "plainEnglish": "An Amazon SNS dead-letter queue (DLQ) is an Amazon Simple Queue Service (Amazon SQS) queue attached to an SNS subscription through its redrive policy. If SNS cannot deliver a notification and finishes the applicable retries, it can place the undelivered message in this queue instead of discarding it.",
  "whyItMatters": "A DLQ preserves evidence of delivery failures so a team can diagnose permission errors, unavailable endpoints, or invalid configuration and later reprocess messages safely. Because it is attached per subscription, it also identifies which delivery path failed while other subscribers may have succeeded.",
  "workplaceExample": "An HTTPS billing subscription uses a dedicated SQS DLQ. An alarm watches the queue, the runbook checks SNS delivery logs and endpoint responses, and an operator fixes the cause before an approved tool replays each message with duplicate protection and an audit record.",
  "examFocus": "The DLQ belongs to an SNS subscription, not directly to the topic, and it must be an SQS queue. The subscription and queue must be in the same account and Region. The queue policy must permit the SNS service principal to send messages and should restrict that permission to the intended source topic ARN.",
  "keyPoints": [
    "Configure the subscription's RedrivePolicy with the SQS queue ARN in deadLetterTargetArn.",
    "The SNS subscription and its SQS dead-letter queue must be in the same AWS account and Region.",
    "A Standard topic subscription uses a Standard SQS DLQ, while a FIFO topic subscription uses a FIFO SQS DLQ.",
    "The DLQ resource policy must allow sns.amazonaws.com to call SQS:SendMessage and should use an aws:SourceArn condition for the topic.",
    "The DLQ receives messages SNS could not deliver because of client errors or exhausted retries for server errors.",
    "An SNS DLQ does not capture a message that the endpoint accepted and then failed to process inside its own application.",
    "Monitor the queue's visible-message age and count, choose a retention period that supports investigation, and test alarms.",
    "Reprocessing is an explicit operational action; fix the cause first and replay with idempotency and audit controls."
  ],
  "commonMistake": "Do not confuse an SNS subscription DLQ with a consumer's own failure queue. The SNS DLQ covers unsuccessful delivery to the subscribed endpoint; once that endpoint accepts the message, its later processing failures require the endpoint's own retry or DLQ design.",
  "example": "Create a test SQS queue and policy allowing only the intended test topic to send. Attach it to a test subscription as deadLetterTargetArn, make the target unavailable, publish a synthetic message, wait for the relevant delivery policy to finish, verify the message and alarm in the DLQ, repair the target, replay once with an idempotency check, and complete approved cleanup.",
  "sources": [
    {
      "title": "Amazon SNS dead-letter queues",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html"
    },
    {
      "title": "Configuring an Amazon SNS dead-letter queue for a subscription",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-configure-dead-letter-queue.html"
    },
    {
      "title": "Amazon SNS message delivery retries",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html"
    }
  ]
});
