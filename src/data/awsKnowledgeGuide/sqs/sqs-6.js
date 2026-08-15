import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-6',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'SQS FIFO Queues',
  status: 'ready',
  plainEnglish: 'Amazon SQS FIFO (First-In-First-Out) Queues preserve the exact order in which messages are sent and received, ensuring that messages are processed once and only once in strict chronological sequence. FIFO queue names MUST end with the `.fifo` suffix (e.g. `orders.fifo`) and use Message Group IDs to manage ordered processing threads.',
  whyItMatters: 'Financial transactions, stock trades, and inventory allocation systems cannot tolerate out-of-order message delivery or duplicate processing. SQS FIFO Queues guarantee strict message sequencing and built-in deduplication.',
  workplaceExample: 'A banking application queues ledger entries (`Deposit $100`, `Withdraw $50`) into `account-ledger.fifo`. SQS FIFO guarantees that `Deposit` is processed before `Withdraw`, preventing false account overdrafts.',
  examFocus: 'SAA-C03 FIFO Queue Requirements & Limits:\n- Naming Requirement: Queue name MUST end with `.fifo` (e.g. `payroll-queue.fifo`).\n- Exactly-Once Processing: Guarantees strict ordering and eliminates duplicate delivery within the deduplication window.\n- Throughput Limits: 300 transactions/sec (or up to 3,000 tps with batching; high-throughput mode supports higher limits).\n- Required Parameters: Every message sent to a FIFO queue requires a `MessageGroupId` (and `MessageDeduplicationId` if content-based deduplication is off).',
  keyPoints: [
    'Guarantees strict First-In-First-Out (FIFO) message ordering.',
    'Provides Exactly-Once message processing and built-in deduplication.',
    'Queue name MUST explicitly end with the `.fifo` suffix.',
    'Requires `MessageGroupId` parameter on all sent messages for ordered grouping.',
    'Ideal for financial ledgers, inventory updates, and order sequencing systems.'
  ],
  commonMistake: 'Attempting to create an SQS FIFO Queue without the mandatory `.fifo` suffix in the queue name, resulting in a API validation error.',
  example: 'Creating a SQS FIFO Queue via AWS CLI:\naws sqs create-queue --queue-name financial-ledger.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true',
  sources: [
    { title: 'Amazon SQS FIFO Queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html' }
  ]
});
