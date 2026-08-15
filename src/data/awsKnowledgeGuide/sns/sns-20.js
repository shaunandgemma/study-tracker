import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-20",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS vs SQS",
  "status": "ready",
  "plainEnglish": "Amazon Simple Notification Service (Amazon SNS) is a publish-and-subscribe service that pushes a copy of a topic message to each matching subscription. Amazon Simple Queue Service (Amazon SQS) stores messages in a queue until a consumer polls, processes, and deletes them. SNS broadcasts; SQS buffers work for controlled consumption.",
  "whyItMatters": "Choosing the wrong communication model can lose needed buffering or create unnecessary copies. SNS is useful when several destinations need the same event, while SQS is useful when workers need durable backlog, processing-rate control, and one logical work stream. They are often combined rather than treated as competitors.",
  "workplaceExample": "An order service publishes one event to SNS. The topic fans out to separate SQS queues for inventory, fulfilment, and analytics. Each team can pause, scale, retry, and monitor its own queue without slowing the publisher or causing another team to consume its copy.",
  "examFocus": "Choose SNS for push-based pub/sub and fan-out to multiple protocols. Choose SQS for pull-based queuing, buffering, visibility timeout, and worker decoupling. Choose SNS plus one SQS queue per consumer when every consumer needs its own durable copy. Standard and FIFO choices must also match ordering, deduplication, throughput, and subscriber requirements.",
  "keyPoints": [
    "SNS publishers send to a topic; SNS pushes notifications to matching subscriptions.",
    "SQS producers send to a queue; consumers poll and delete messages after successful processing.",
    "Multiple workers reading one SQS queue compete for its messages, while multiple SNS subscriptions each receive their own matching copy.",
    "SQS retains messages until they are consumed or expire and provides a visibility timeout for in-flight work.",
    "SNS supports destinations such as SQS, Lambda, HTTP/S, email, SMS, and mobile push, depending on topic type.",
    "SNS-to-SQS fan-out gives every consumer a separate durable buffer, retry controls, and backlog metrics.",
    "Both services have Standard and FIFO capabilities, but their delivery guarantees and supported integrations differ and must be checked separately.",
    "Use EventBridge when the central requirement is event-bus routing with rule-based matching and broad event-source integration; use Kinesis Data Streams for ordered shard-based streaming records, retention, and replay-oriented processing.",
    "Use Amazon MQ when an application requires supported ActiveMQ or RabbitMQ broker compatibility, and use Amazon SES for controlled transactional or campaign email rather than general publish-subscribe messaging."
  ],
  "commonMistake": "Do not say SNS always loses messages or SQS automatically broadcasts one message to every consumer. SNS has endpoint retries and optional subscription DLQs, while one SQS message is normally handled by one competing consumer; combine SNS with multiple SQS queues when both fan-out and buffering are required.",
  "example": "Model a test order event three ways: direct SNS subscriptions for immediate independent notifications, one SQS queue for a worker pool sharing tasks, and SNS fan-out to two SQS queues for two teams needing durable copies. Publish synthetic events, pause one queue consumer, inspect its backlog, resume safely, and compare the observed behavior with the requirements.",
  "sources": [
    {
      "title": "Amazon SQS, Amazon SNS, or Amazon EventBridge?",
      "url": "https://docs.aws.amazon.com/decision-guides/latest/sns-or-sqs-or-eventbridge/sns-or-sqs-or-eventbridge.html"
    },
    {
      "title": "Fanout Amazon SNS notifications to Amazon SQS queues for asynchronous processing",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"
    },
    {
      "title": "Amazon SNS features and capabilities",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/welcome-features.html"
    }
  ]
});
