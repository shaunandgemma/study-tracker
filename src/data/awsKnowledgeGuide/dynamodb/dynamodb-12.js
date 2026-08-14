import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-12', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Read and Write Capacity Units', status: 'ready',
  plainEnglish: 'For items up to 4 KB, one RCU supports one strongly consistent read per second or two eventually consistent reads per second. A transactional read consumes twice the normal amount. One WCU supports one write per second for an item up to 1 KB, and transactional writes consume twice the normal amount. Larger items round up in those size blocks.',
  whyItMatters: 'Capacity calculation connects item size, consistency, request rate, and transaction choice to throughput and cost.',
  workplaceExample: 'Reading an 8 KB item strongly consistently at 100 reads per second requires 200 RCUs because each read uses two 4 KB units.',
  examFocus: 'Reads round item size to 4 KB blocks; writes round to 1 KB blocks. Eventually consistent reads cost half of strong reads, and transactional operations double normal capacity. Query and Scan capacity is based on data evaluated, not just attributes returned.',
  keyPoints: ['RCU size unit is 4 KB.', 'WCU size unit is 1 KB.', 'Eventually consistent reads use half the strong-read capacity.', 'Transactional operations consume double capacity.', 'Item sizes are rounded up to the next unit boundary.'],
  commonMistake: 'Calculating Query capacity from the small number of filtered results rather than the items read before the filter is applied.',
  example: 'A 6 KB strongly consistent read uses two RCUs; the same eventually consistent read uses one RCU.',
  sources: [{ title: 'DynamoDB read and write operations', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html' }, { title: 'DynamoDB constraints', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html' }]
});
