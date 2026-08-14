import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-24', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Conditional Writes', status: 'ready',
  plainEnglish: 'A conditional write changes an item only when a Boolean condition is true. Conditions can check whether an attribute exists, compare a version value, verify current state, or enforce another item-level rule before the write succeeds.',
  whyItMatters: 'Conditional writes prevent lost updates, duplicate creation, and invalid state transitions without a separate read-then-write race.',
  workplaceExample: 'An update changes an order from PENDING to PAID only if its current status is still PENDING and its version matches the version read by the caller.',
  examFocus: 'Use attribute_not_exists for create-if-absent and version attributes for optimistic locking. A failed condition raises ConditionalCheckFailedException. Conditions are evaluated server-side and still have capacity implications.',
  keyPoints: ['The condition is evaluated before the write.', 'A false condition prevents the change.', 'Optimistic locking uses a version attribute.', 'Conditional puts can prevent duplicate keys.', 'Transactions can combine conditions across multiple items.'],
  commonMistake: 'Reading an item, checking it in application code, and then writing without a condition, leaving a race between concurrent clients.',
  example: 'Update stock with condition quantity >= requested and atomically subtract the requested amount only when sufficient stock remains.',
  sources: [{ title: 'DynamoDB condition expressions', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html' }, { title: 'DynamoDB optimistic locking', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.OptimisticLocking.html' }]
});
