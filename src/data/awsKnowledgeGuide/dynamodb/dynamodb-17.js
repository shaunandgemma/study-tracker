import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-17', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Global Tables', status: 'ready',
  plainEnglish: 'A DynamoDB global table is one logical table replicated across multiple AWS Regions. Applications can use a nearby replica for low-latency access and continue in another Region when the architecture and failover process support it.',
  whyItMatters: 'Global tables support multi-Region applications without requiring teams to build their own DynamoDB replication system.',
  workplaceExample: 'A global customer-preference service writes to regional replicas in Europe and North America, while DynamoDB replicates updates between them.',
  examFocus: 'Use current Global Tables version 2019.11.21. Understand multi-Region eventual consistency conflict behaviour, replication latency, replicated write cost, and Region-specific application failover. Global replication does not automatically redirect clients or repair bad writes.',
  keyPoints: ['Replica tables exist in multiple Regions.', 'Replication is managed by DynamoDB.', 'Applications must route to the intended regional endpoint.', 'Conflicting concurrent writes require model-aware handling.', 'CloudWatch ReplicationLatency helps monitor propagation.'],
  commonMistake: 'Assuming adding a replica automatically provides DNS failover and makes every application operation globally strongly consistent.',
  example: 'Deploy identical application stacks in two Regions, use a current global table, monitor replication, and define controlled client failover and conflict-safe writes.',
  sources: [{ title: 'How current DynamoDB global tables work', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html' }, { title: 'DynamoDB global tables', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html' }]
});
