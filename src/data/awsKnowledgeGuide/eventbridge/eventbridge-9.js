import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-9',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Event Patterns',
  status: 'ready',
  plainEnglish: 'An Event Pattern is a JSON structure defined inside an EventBridge rule that specifies the matching logic used to filter events. Event patterns mirror the structure of the JSON events they match. An event pattern can match on event fields like `source`, `detail-type`, and specific values inside `detail`. Event Patterns support matching operators such as exact matching, prefix matching, numeric range matching, presence matching, and anything-but matching.',
  whyItMatters: 'Event Patterns ensure that target services (like expensive Lambda functions or step functions) are triggered ONLY when specific business conditions are met, eliminating unnecessary invocations and lowering costs.',
  workplaceExample: 'A logistics app filters events so that only shipments marked as `status: "DELAYED"` and `priority: "CRITICAL"` trigger the customer support notification workflow.',
  examFocus: 'SAA-C03 Event Pattern Syntax:\n- Exact matching: `"source": ["aws.ec2"]`\n- Prefix matching: `"filename": [ { "prefix": "invoice_" } ]`\n- Anything-but matching: `"state": [ { "anything-but": "running" } ]`\n- Numeric range matching: `"price": [ { "numeric": [ ">=", 100, "<=", 500 ] } ]`\n- Multiple values in an array act as an OR condition.',
  keyPoints: [
    'JSON filtering rules matching incoming event payload structures.',
    'Fields in event patterns mirror the JSON structure of incoming events.',
    'Supports prefix, anything-but, numeric range, and existence matching operators.',
    'Multiple values in an array field evaluate as an OR condition.',
    'Eliminates unneeded target invocations by filtering unwanted events early.'
  ],
  commonMistake: 'Writing an event pattern with mismatched JSON key names (e.g. matching `detail-type` instead of `detailType`), causing the rule to silently ignore matching events.',
  example: 'Sample Event Pattern JSON:\n`{`\n`  "source": ["com.store.orders"],`\n`  "detail-type": ["OrderPlaced"],`\n`  "detail": {`\n`    "amount": [{ "numeric": [ ">=", 500 ] }],`\n`    "status": [{ "anything-but": "CANCELLED" }]`\n`  }`\n`}`',
  sources: [
    { title: 'Amazon EventBridge Event Patterns', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html' }
  ]
});
