import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-16',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Delay Queues',
  status: 'ready',
  plainEnglish: 'A Delay Queue in Amazon SQS postpones the initial visibility of newly added messages for a configurable delay period (from 0 seconds up to 15 minutes). When a message is sent to a Delay Queue, it remains invisible to all consumers for the duration of the `DelaySeconds` timer, becoming visible only after the timer expires.',
  whyItMatters: 'Delay Queues are useful when downstream application workers require a mandatory processing pause (e.g. allowing a database record to propagate or waiting for an external third-party webhook confirmation) before processing a queued job.',
  workplaceExample: 'A user registration flow sends an onboarding message to an SQS queue with `DelaySeconds = 900` (15 minutes). The delay gives the new user 15 minutes to verify their email before a background worker checks verification status and sends a follow-up reminder.',
  examFocus: 'SAA-C03 Delay Queue vs Visibility Timeout:\n- Delay Queue (`DelaySeconds`): Postpones INITIAL visibility when a message is FIRST sent to the queue (0 to 15 mins).\n- Visibility Timeout: Postpones RE-VISIBILITY AFTER a consumer has already received a message.\n- Per-Message Delay: Standard queues allow setting individual message delay timers using `DelaySeconds` in `SendMessage`.',
  keyPoints: [
    'Postpones initial message visibility when messages are first added to the queue.',
    'Delay duration is configurable from 0 seconds to 15 minutes (900 seconds).',
    'Does not affect messages already present in the queue prior to setting the attribute.',
    'Standard queues also support per-message delay timers on `SendMessage` calls.',
    'Useful for workflows requiring a mandatory propagation pause before processing.'
  ],
  commonMistake: 'Confusing Delay Queues (initial delay upon message send) with Visibility Timeout (invisibility period after a consumer receives a message).',
  example: 'Creating a Delay Queue with 15-Minute Delay via AWS CLI:\naws sqs create-queue --queue-name delayed-onboarding-queue --attributes DelaySeconds=900',
  sources: [
    { title: 'Amazon SQS Delay Queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html' }
  ]
});
