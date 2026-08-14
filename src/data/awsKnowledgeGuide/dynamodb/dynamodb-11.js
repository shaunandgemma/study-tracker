import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-11', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Auto Scaling', status: 'ready',
  plainEnglish: 'DynamoDB auto scaling uses Application Auto Scaling target tracking to adjust provisioned read or write capacity between configured minimum and maximum values while aiming for a target utilization percentage.',
  whyItMatters: 'It follows gradual workload changes without requiring an operator to update capacity manually throughout the day.',
  workplaceExample: 'An online store scales table and GSI write capacity during daytime order traffic and reduces it overnight while retaining a safe minimum.',
  examFocus: 'Auto scaling applies to provisioned mode and must be configured for table and GSI dimensions separately. It reacts to observed utilization and is not instant protection against a sudden zero-to-massive spike.',
  keyPoints: ['Target tracking maintains a chosen utilization.', 'Minimum and maximum capacity bound scaling.', 'Read and write scaling policies are separate.', 'Each GSI needs its own scaling configuration.', 'CloudWatch metrics drive scaling decisions.'],
  commonMistake: 'Setting maximum capacity below a known peak and expecting auto scaling to exceed that boundary.',
  example: 'Configure a 70 percent target, a safe minimum, a quota-aware maximum, and alarms for throttles during scale-out delay.',
  sources: [{ title: 'Managing throughput automatically with auto scaling', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html' }, { title: 'DynamoDB read/write capacity modes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html' }]
});
