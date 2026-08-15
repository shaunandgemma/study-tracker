import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-14",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "Message Delivery Retries",
  "status": "ready",
  "plainEnglish": "When Amazon SNS cannot deliver a message to a subscribed endpoint, it follows a delivery policy for that endpoint protocol. A policy defines retry attempts and delays, often using backoff so an unavailable endpoint has time to recover. If retries end without delivery, SNS discards the message unless the subscription has a dead-letter queue.",
  "whyItMatters": "Retries absorb temporary outages, throttling, and service interruptions, but they also create repeated delivery attempts and delayed recovery traffic. Operators must understand the target protocol's policy, make receivers idempotent, and retain exhausted deliveries when losing them is unacceptable.",
  "workplaceExample": "A webhook occasionally returns HTTP 503 while being deployed. Its SNS subscription uses a delivery policy with backoff and a rate appropriate for the server, while an SQS dead-letter queue stores notifications that still cannot be delivered. Dashboards distinguish retrying delivery from accepted requests whose later application work failed.",
  "examFocus": "Retry behavior depends on the delivery protocol. AWS-managed endpoints such as SQS and Lambda use an SNS-defined policy; only HTTP/S supports a customer-defined delivery policy. Retryable HTTP/S responses include 5XX and 429, while other responses are treated as permanent failures. A subscription DLQ preserves delivery failures after the policy is exhausted.",
  "keyPoints": [
    "Every subscription protocol has an SNS delivery policy, so there is no single retry schedule for every endpoint type.",
    "Only HTTP/S supports a customer-defined delivery policy; policies for other protocols are controlled by SNS.",
    "HTTP/S policies can include immediate, pre-backoff, backoff, and post-backoff phases.",
    "SNS adds jitter to retry timing to reduce synchronized retry spikes.",
    "For HTTP/S, 5XX and 429 responses are retryable, while other response codes are treated as permanent failures.",
    "Delivery throttling can protect an HTTP/S subscriber, but its maximum receive rate is an average rather than a strict per-second cap.",
    "Duplicate delivery is possible, so the endpoint should use an idempotency key or another safe repeat-processing design.",
    "Attach and monitor a subscription dead-letter queue when a message must survive exhausted delivery attempts."
  ],
  "commonMistake": "Do not assume SNS keeps retrying forever or that every HTTP error is retried. Read the protocol policy, return accurate status codes, configure an HTTP/S policy only within documented limits, and use a DLQ where exhausted delivery must be investigated.",
  "example": "Use a test HTTP/S subscription with a dead-letter queue. Make the endpoint return a retryable 503 for a synthetic message, observe repeated attempts and timing, then return success and confirm idempotent handling. Separately test a permanent response so the runbook records the different behavior without affecting production traffic.",
  "sources": [
    {
      "title": "Amazon SNS message delivery retries",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html"
    },
    {
      "title": "Amazon SNS dead-letter queues",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html"
    }
  ]
});
