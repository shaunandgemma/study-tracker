import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-10', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Provisioned Capacity Mode', status: 'ready',
  plainEnglish: 'Provisioned mode assigns read capacity units and write capacity units to a table and each global secondary index. The application can consume that throughput, and requests may be throttled when demand exceeds available or per-partition capacity.',
  whyItMatters: 'Predictable workloads can control cost by provisioning known demand and using auto scaling or reserved capacity where appropriate.',
  workplaceExample: 'A business application has stable weekday traffic. It provisions its normal baseline, enables auto scaling for changes, and alarms on throttled requests and consumed-capacity percentage.',
  examFocus: 'Provision capacity separately for reads and writes and for GSIs. Auto scaling uses target tracking but is not instantaneous. Burst and adaptive capacity help, but neither replaces correct sizing and partition-key distribution.',
  keyPoints: ['RCUs and WCUs are configured explicitly.', 'GSIs have independent provisioned throughput.', 'Unused capacity can contribute to burst behaviour.', 'Auto scaling can adjust provisioned values.', 'Throttling can still occur on a hot partition.'],
  commonMistake: 'Increasing only table capacity when writes are throttled on an under-provisioned global secondary index.',
  example: 'Monitor consumed capacity and throttles for both the base table and each GSI before adjusting provisioned settings.',
  sources: [{ title: 'DynamoDB read/write capacity modes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html' }, { title: 'DynamoDB burst and adaptive capacity', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/burst-adaptive-capacity.html' }]
});
