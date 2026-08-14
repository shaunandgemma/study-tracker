import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-29', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Standard vs Standard-Infrequent Access Table Classes', status: 'ready',
  plainEnglish: 'DynamoDB Standard is the default table class and is designed for typical storage and request-cost patterns. Standard-Infrequent Access reduces storage cost but charges more for reads and writes, making it suitable when table storage is the dominant cost and data is accessed infrequently.',
  whyItMatters: 'The same table performance and features can have different cost economics depending on how much data is stored compared with how often it is accessed.',
  workplaceExample: 'A large historical records table is rarely queried and spends far more on storage than requests, so analysis shows Standard-IA is cheaper. An active session table remains Standard.',
  examFocus: 'Choose from actual storage and request costs, not the name alone. Standard-IA does not automatically archive individual old items and is not equivalent to S3 storage classes. Capacity mode and table class are separate settings.',
  keyPoints: ['Standard is the default table class.', 'Standard-IA lowers storage price.', 'Standard-IA has higher request pricing.', 'Features and performance remain available.', 'CloudWatch and Cost Explorer data should guide the decision.'],
  commonMistake: 'Moving a request-heavy table to Standard-IA merely because some items are old, increasing total cost.',
  example: 'Compare the previous month storage, read, write, backup, and replication costs before changing the entire table class.',
  sources: [{ title: 'DynamoDB table classes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TableClasses.html' }, { title: 'Choosing a DynamoDB table class', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CostOptimization_TableClass.html' }]
});
