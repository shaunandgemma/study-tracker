import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-6",
  "title": "SNS Standard Topics",
  "plainEnglish": "An SNS Standard topic is designed for high-throughput fan-out to the broad set of supported SNS endpoint protocols. Delivery is at least once and ordering is best effort, so a subscriber can receive a duplicate or observe messages in a different order from publication.",
  "whyItMatters": "Standard topics suit alerts and event distribution when scale and endpoint choice matter more than strict sequence. Their delivery model keeps the service available and scalable, but moves duplicate tolerance and order-independent processing into subscriber design.",
  "workplaceExample": "A monitoring platform publishes service-health changes to a Standard topic. Email recipients receive human alerts, a Lambda function enriches events, and an SQS queue buffers incident automation. The automation records event identifiers so a duplicate cannot open a second incident.",
  "examFocus": "Standard means high throughput, best-effort ordering, and at-least-once delivery—not exactly once. Use it for protocol flexibility and fan-out; consider FIFO with compatible subscribers when message-group ordering and deduplication are required.",
  "keyPoints": [
    "Standard topics support the broad range of SNS application and person notification protocols.",
    "A Standard topic can deliver a published message more than once.",
    "Messages might arrive in a different order from the order in which they were published.",
    "Subscribers should use idempotency keys or state checks before repeating side effects.",
    "Each subscription can have its own filter policy and supported delivery settings.",
    "Adding an SQS subscription provides durable queue-based consumption without changing Standard-topic delivery semantics."
  ],
  "commonMistake": "Using arrival order as a transaction sequence can corrupt state when Standard delivery reorders messages. Put an explicit business version in the event and make the consumer reject stale updates, or choose an appropriate FIFO design.",
  "example": "Publish several harmless Standard-topic events containing unique event IDs and business versions to a test SQS subscriber. Process them with an idempotency record and version check, deliberately retry one event, and demonstrate that repeated delivery does not repeat the business effect.",
  "sources": [
    {
      "title": "Amazon SNS features and capabilities",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/welcome-features.html"
    },
    {
      "title": "Amazon SNS event destinations",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-event-destinations.html"
    }
  ]
});
