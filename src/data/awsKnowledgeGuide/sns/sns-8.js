import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-8",
  "title": "SNS Subscriptions",
  "plainEnglish": "An SNS subscription connects a topic to one endpoint and protocol. It contains delivery choices that belong to that recipient, such as a filter policy, filter scope, raw message delivery for supported protocols, a retry policy where configurable, or an Amazon SQS dead-letter queue. Some protocols and ownership flows require the endpoint owner to confirm before delivery begins.",
  "whyItMatters": "Per-subscription settings let one topic serve consumers with different routing and reliability needs. Confirmation prevents an owner from sending notifications to an endpoint that did not consent, while filtering avoids charging every consumer with irrelevant work.",
  "workplaceExample": "A data-events topic has three subscriptions: an SQS queue receives all events, a second queue filters for approved billing events, and an HTTPS test webhook receives raw bodies. The endpoint owners confirm required subscriptions and each team monitors its own delivery failures.",
  "examFocus": "Topic ownership and subscription ownership can be different, especially across accounts. A PendingConfirmation subscription does not receive normal notifications. Standard topics support the broad protocol set; FIFO compatibility must follow current SNS documentation.",
  "keyPoints": [
    "A subscription identifies one topic, protocol, and destination endpoint.",
    "Supported endpoint types include SQS, Lambda, HTTP/S, email, SMS, mobile application endpoints, and Firehose delivery streams.",
    "Some subscriptions require confirmation before their subscription ARN becomes active.",
    "Pending confirmation means normal published messages are not delivered to that subscription.",
    "Filter policies can inspect message attributes or a JSON message body according to FilterPolicyScope.",
    "Raw delivery removes the usual SNS JSON envelope for supported protocols but not the need to validate messages.",
    "A subscription redrive policy can send exhausted SNS delivery failures to an SQS dead-letter queue."
  ],
  "commonMistake": "Creating an email or HTTP subscription and immediately testing publication can look like delivery is broken while the endpoint is still pending. Complete the documented confirmation flow and verify the subscription ARN before troubleshooting retries.",
  "example": "Create a test subscription using an endpoint you own, complete confirmation if required, add a narrow filter, publish matching and nonmatching harmless messages, verify raw-versus-envelope behavior if supported, test delivery monitoring, and remove the subscription when the exercise ends.",
  "sources": [
    {
      "title": "Creating a subscription to an Amazon SNS topic",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html"
    },
    {
      "title": "Confirm an Amazon SNS HTTP/S subscription",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.confirm.html"
    }
  ]
});
