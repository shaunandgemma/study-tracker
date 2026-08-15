import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-4",
  "title": "SNS Publish-Subscribe Messaging",
  "plainEnglish": "Amazon Simple Notification Service (Amazon SNS) is a managed publish-and-subscribe service. A publisher sends a message to a topic, which is a named communication channel. SNS then pushes a copy to each matching subscription endpoint, allowing one event to reach several applications or people without the publisher calling them individually.",
  "whyItMatters": "Publish-subscribe messaging separates event producers from consumers. Teams can add an independent subscriber without changing the publisher, and a slow consumer can use an Amazon Simple Queue Service (Amazon SQS) subscription so its work does not block other recipients.",
  "workplaceExample": "An order service publishes an order-created event once. SNS fans it out to separate SQS queues for fulfilment and analytics and invokes a lightweight fraud-check function. Each team owns its consumer, retry handling, monitoring, and idempotent business processing.",
  "examFocus": "SNS is primarily push-based fan-out; SQS is a queue that consumers poll. Standard topics favor broad protocol support and high throughput with at-least-once, best-effort-ordered delivery, while FIFO topics add documented grouping, ordering, and deduplication capabilities for supported subscribers.",
  "keyPoints": [
    "Publishers send messages to a topic rather than directly coordinating every subscriber.",
    "A subscription connects one topic to an endpoint such as SQS, Lambda, HTTP/S, email, SMS, mobile push, or supported Firehose delivery.",
    "Fan-out gives each matching subscription its own delivered copy of a published message.",
    "Subscription filter policies can prevent nonmatching messages from reaching a particular endpoint.",
    "Delivery behavior, confirmation requirements, and retry policy depend on the endpoint protocol.",
    "Consumers must validate messages, handle duplicates where applicable, and monitor their own business processing."
  ],
  "commonMistake": "Do not treat successful Publish as proof that every subscriber completed its business action. It confirms SNS accepted the publication; separately monitor SNS delivery, queue backlogs or function errors, and the consumer's application outcome.",
  "example": "Publish a harmless test event to a test topic with one SQS subscription and one Lambda subscription. Confirm permissions, observe the SNS envelope or configured raw body, verify both endpoints receive the event, repeat the publication to test idempotency, and remove the test resources through the approved cleanup process.",
  "sources": [
    {
      "title": "Amazon SNS features and capabilities",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/welcome-features.html"
    },
    {
      "title": "Publishing an Amazon SNS message",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-publishing.html"
    }
  ]
});
