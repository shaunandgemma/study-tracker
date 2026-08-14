import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-27', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Adaptive Capacity and Hot Partitions', status: 'ready',
  plainEnglish: 'A hot partition occurs when one storage partition or partition-key value receives much more traffic than others. DynamoDB adaptive capacity automatically shifts available throughput toward heavily used partitions and can isolate frequently accessed items, within the table and partition limits.',
  whyItMatters: 'Uneven keys can cause throttling even when the table overall appears to have unused capacity.',
  workplaceExample: 'A celebrity profile suddenly receives most application reads. Adaptive capacity helps that key, while a read cache and redesigned access pattern protect against sustained demand beyond one item capacity.',
  examFocus: 'Adaptive capacity is automatic and applies to both capacity modes, but it cannot exceed table capacity or physical partition maximums. Burst capacity is temporary stored unused capacity; adaptive capacity responds to uneven ongoing traffic.',
  keyPoints: ['Hot partitions receive disproportionate activity.', 'Adaptive capacity is enabled automatically.', 'It redistributes available throughput.', 'Per-partition and table limits still apply.', 'LSIs can restrict item-collection splitting behaviour.'],
  commonMistake: 'Relying on adaptive capacity as permission to choose a single constant partition key for the entire workload.',
  example: 'Monitor throttled requests and Contributor Insights, identify the hot key, then add sharding, caching, or a better access pattern when adaptive capacity is insufficient.',
  sources: [{ title: 'DynamoDB burst and adaptive capacity', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/burst-adaptive-capacity.html' }, { title: 'Partition key design best practices', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html' }]
});
