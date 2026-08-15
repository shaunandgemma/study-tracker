import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-11",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS HTTP and HTTPS Endpoints",
  "status": "ready",
  "plainEnglish": "Amazon SNS can push notifications to a web endpoint by sending an HTTP POST request. Before notifications begin, the endpoint receives a SubscriptionConfirmation message and must confirm the subscription. HTTPS encrypts traffic in transit and should be preferred over unencrypted HTTP.",
  "whyItMatters": "HTTP/S subscriptions connect SNS to webhooks and applications that are not represented by a native AWS endpoint. They also make the receiving team responsible for endpoint security, availability, response codes, duplicate handling, and capacity during traffic spikes.",
  "workplaceExample": "A partner integration exposes a dedicated HTTPS webhook for shipment events. It validates the SNS signature and expected topic ARN, quickly stores each accepted message for idempotent processing, returns a successful response, and uses a subscription dead-letter queue to retain notifications SNS cannot deliver.",
  "examFocus": "Expect questions about confirmation, signature verification, HTTPS, and retry behavior. Only HTTP/S subscriptions allow a customer-defined SNS delivery policy. SNS retries retryable failures according to that policy, but permanent responses are not handled like transient server failures.",
  "keyPoints": [
    "The endpoint must handle SNS HTTP POST message types, including SubscriptionConfirmation, Notification, and UnsubscribeConfirmation.",
    "Confirm only an expected topic subscription; do not blindly visit a SubscribeURL from untrusted input.",
    "Verify the SNS message signature, validate the certificate URL and trust chain, and reject an unexpected TopicArn before processing.",
    "Use HTTPS to protect the request in transit and apply normal web controls such as timeouts, logging, and rate protection.",
    "Return an appropriate response promptly; long processing is safer after durable handoff to a queue or data store.",
    "HTTP/S delivery policies can control retry phases and delivery throttling for the endpoint.",
    "Make processing idempotent because a retry can deliver the same notification again, and attach a subscription dead-letter queue when undelivered messages must be retained."
  ],
  "commonMistake": "Do not trust a request merely because its JSON resembles an SNS notification. Validate the signature, signing certificate location, certificate chain, message type, and expected topic before confirming or acting on it.",
  "example": "In a non-production environment, expose a test HTTPS endpoint that parses SNS POST bodies. Subscribe it to a test topic, validate and confirm the expected request, publish a synthetic message, verify its signature and topic ARN, deliberately return a retryable error to observe retries, then restore success and review delivery logs without storing secrets in the endpoint URL.",
  "sources": [
    {
      "title": "Preparing an HTTP or HTTPS endpoint to process Amazon SNS messages",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.prepare.html"
    },
    {
      "title": "Verifying the signatures of Amazon SNS messages",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html"
    },
    {
      "title": "Amazon SNS message delivery retries",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html"
    }
  ]
});
