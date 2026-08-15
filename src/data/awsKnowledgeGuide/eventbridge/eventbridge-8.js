import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-8',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'EventBridge Rules',
  status: 'ready',
  plainEnglish: 'An EventBridge Rule evaluates incoming JSON events on an event bus in real-time. If an incoming event matches the criteria defined in the rule\'s Event Pattern (or matches a Scheduled Schedule Expression), EventBridge routes the event to up to 5 target destinations (such as Lambda functions, SQS queues, SNS topics, Kinesis streams, or Step Functions).',
  whyItMatters: 'Rules act as the intelligent routing engine of EventBridge. Without writing any routing code, rules inspect event fields, select relevant events, and fan out delivery to multiple independent target services.',
  workplaceExample: 'A fraud detection platform creates a rule on `PaymentsBus`. When an event arrives with `detail.amount > 10000`, the rule matches the pattern and routes the event to an AWS Step Functions workflow for manual fraud review.',
  examFocus: 'SAA-C03 Rule Limits and Capabilities:\n- A single rule can send events to up to 5 targets simultaneously.\n- Rules evaluate events asynchronously in real-time with near-zero latency.\n- Supports Input Transformers to customize or reformat the JSON payload before sending to target services.',
  keyPoints: [
    'Evaluates incoming events against Event Patterns or Schedule Expressions.',
    'Routes matching events to up to 5 targets concurrently.',
    'Supports Input Transformers to filter or modify the JSON payload before target delivery.',
    'Rules evaluate events asynchronously with high reliability.',
    'Can be enabled, disabled, or updated dynamically without downtime.'
  ],
  commonMistake: 'Attempting to add more than 5 targets to a single EventBridge rule. To send events to more than 5 targets, create additional rules matching the same event pattern.',
  example: 'Creating a Rule via AWS CLI:\n`aws events put-rule --name HighValueOrderRule --event-bus-name OrdersBus --event-pattern file://pattern.json`',
  sources: [
    { title: 'Amazon EventBridge Rules', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html' }
  ]
});
