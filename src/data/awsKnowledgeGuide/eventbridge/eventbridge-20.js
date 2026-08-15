import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-20',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'EventBridge vs SNS',
  status: 'ready',
  plainEnglish: 'Amazon EventBridge and Amazon SNS (Simple Notification Service) are both messaging services used for event fan-out, but they serve different architectural needs:\n- Amazon EventBridge: A rich, content-based EVENT BUS service. Designed for complex event routing, payload filtering, schema registry, archiving, replay, and 3rd-party SaaS partner integrations. Latency is typically around 500ms.\n- Amazon SNS: A high-throughput PUB/SUB notification topic service. Designed for ultra-high throughput (millions of messages/sec), ultra-low latency (sub-100ms), and direct user notifications (SMS, Email, Push notifications, HTTP webhooks).',
  whyItMatters: 'Understanding when to use EventBridge vs SNS is essential for cloud system design. Use EventBridge for complex event filtering, cross-account event routing, and SaaS integrations. Use SNS for ultra-low latency fan-out or sending mobile push notifications and SMS.',
  workplaceExample: 'An application uses SNS to send instant SMS OTP passwords to mobile phones in 50 milliseconds. For order processing, it uses EventBridge to filter JSON order attributes and route events to 10 different internal microservices.',
  examFocus: 'SAA-C03 Decision Matrix:\n- Complex JSON event pattern filtering, Schema Registry, Archive & Replay, SaaS Partner integration -> Amazon EventBridge.\n- Ultra-high throughput, sub-100ms latency, direct SMS/Email/Mobile Push notifications -> Amazon SNS.\n- Note: EventBridge and SNS can be combined (e.g. EventBridge rule triggering an SNS topic target for email notifications).',
  keyPoints: [
    'EventBridge: Content-based JSON routing, 25+ targets, Schema Registry, Archive/Replay, SaaS partners.',
    'SNS: Pub/Sub topic fan-out, ultra-low latency (<100ms), SMS, Email, Mobile Push.',
    'EventBridge rules support rich JSON field matching and transformation.',
    'SNS supports millions of subscribers with high throughput.',
    'EventBridge and SNS are often combined in hybrid event architectures.'
  ],
  commonMistake: 'Selecting SNS when complex content filtering based on nested JSON event fields is required. EventBridge supports far richer JSON payload pattern matching than SNS.',
  example: 'Selection Guide:\n- "Route events based on nested JSON values and store 30-day replay archive" -> Amazon EventBridge.\n- "Send immediate SMS alerts to 50,000 mobile subscribers" -> Amazon SNS.',
  sources: [
    { title: 'What is Amazon EventBridge?', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html' }
  ]
});
