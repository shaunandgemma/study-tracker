import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-23', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB Transactions', status: 'ready',
  plainEnglish: 'DynamoDB transactions group multiple supported read or write operations into one ACID all-or-nothing request. TransactWriteItems can combine Put, Update, Delete, and ConditionCheck operations across items and tables in the same AWS account and Region.',
  whyItMatters: 'Transactions protect business invariants when several items must change together, such as an order, inventory count, and idempotency record.',
  workplaceExample: 'Placing an order decrements inventory only if stock remains, creates the order item, and records the request token in one transaction.',
  examFocus: 'Transactional operations consume twice the capacity of equivalent standard operations and have limits. An item cannot be targeted by two operations in the same transaction. Use idempotency tokens and handle transaction cancellation and conflicts.',
  keyPoints: ['Transactions are ACID and all or nothing.', 'They can span tables in one account and Region.', 'Transactional capacity cost is doubled.', 'Conditions can protect business rules.', 'Client request tokens support idempotent write requests.'],
  commonMistake: 'Using separate ordinary writes for related state and assuming application retries cannot leave partial results.',
  example: 'Use TransactWriteItems to create an order and reduce stock only when the inventory version and quantity conditions both pass.',
  sources: [{ title: 'DynamoDB transactions', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html' }, { title: 'DynamoDB constraints', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html' }]
});
