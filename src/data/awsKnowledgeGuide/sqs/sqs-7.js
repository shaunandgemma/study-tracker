import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-7',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'At-Least-Once Delivery',
  status: 'ready',
  plainEnglish: 'At-Least-Once Delivery is the default delivery model for Amazon SQS Standard Queues. SQS stores message copies across multiple redundant servers in its distributed architecture. Highly occasionally, network retries or server sync timings can cause a copy of a message to be delivered more than once to a consumer.',
  whyItMatters: 'Because Standard Queues guarantee that no message is ever lost (At-Least-Once), consumer microservices must be engineered to handle duplicate messages safely without corrupting database state or sending duplicate customer emails.',
  workplaceExample: 'A payment notification service receives a message from an SQS Standard Queue. The consumer checks a DynamoDB `processed_message_ids` table before sending an email. If the message ID was already processed, the duplicate is safely ignored.',
  examFocus: 'SAA-C03 At-Least-Once & Idempotency Rules:\n- Standard Queue Guarantee: Every sent message is delivered AT LEAST ONCE; zero messages are lost.\n- Duplicate Cause: Distributed architecture redundancies and network retries.\n- Architectural Solution: Implement IDEMPOTENT consumers (using unique transaction IDs or deduplication tables in DynamoDB/RDS).',
  keyPoints: [
    'Default message delivery guarantee for SQS Standard Queues.',
    'Guarantees zero message loss across distributed SQS storage servers.',
    'Allows occasional duplicate message deliveries under high traffic or network retries.',
    'Requires consumer microservices to be designed idempotently.',
    'Idempotency can be achieved using unique message IDs and tracking tables.'
  ],
  commonMistake: 'Designing SQS Standard Queue consumers that blindly increment database balances without checking if a message ID was already processed.',
  example: 'Idempotent Consumer Logic Pattern Pseudocode:\nasync function processMessage(msg) {\n  const exists = await db.checkIfProcessed(msg.MessageId);\n  if (exists) return; // Skip duplicate\n  await executeBusinessLogic(msg.Body);\n  await db.recordProcessed(msg.MessageId);\n}',
  sources: [
    { title: 'At-least-once delivery in Amazon SQS', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ]
});
