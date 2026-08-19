export default Object.freeze({
  id: 'aws-sqs-duplicate-processing',
  examId: 'aws-saa-c03',
  order: 17,
  category: 'Amazon SQS',
  title: 'Stop Duplicate SQS Message Processing',
  difficulty: 'Intermediate',
  summary: 'Diagnose why valid SQS messages are being processed by more than one consumer.',
  scenario: 'The fa-training-orders queue feeds two application workers. Orders complete successfully, but some are processed twice during normal load. The queue is a standard SQS queue, consumers delete messages after successful processing, and no producer retries are recorded for the duplicated order IDs.',
  task: 'Use the timing and queue evidence to identify why another worker can receive a message before the first worker finishes, make the smallest safe correction, and verify that normal processing no longer creates avoidable duplicate work.',
  evidence: [
    {
      id: 'queue-settings',
      title: 'SQS Queue Settings',
      kind: 'code',
      content: `Queue: fa-training-orders
Type: Standard
Visibility timeout: 30 seconds
Receive message wait time: 20 seconds
Message retention period: 4 days

Consumer behaviour:
- Receive message
- Process order
- Delete message after processing succeeds`
    },
    {
      id: 'consumer-timing',
      title: 'Consumer Processing Log',
      kind: 'code',
      content: `Message ID: msg-training-1001
Order ID: order-training-501

Worker A
12:00:00 ReceiveMessage
12:00:30 Message visibility timeout expires
12:01:34 Processing completed
12:01:35 DeleteMessage

Worker B
12:00:38 ReceiveMessage for the same message
12:01:10 Processing completed
12:01:11 DeleteMessage

Measured processing times:
p50: 72 seconds
p95: 96 seconds
maximum observed: 118 seconds`
    },
    {
      id: 'change-boundary',
      title: 'Approved Change Boundary',
      kind: 'text',
      content: 'The workers are healthy and must continue using the existing standard queue. The application already deletes messages after successful processing. The approved correction may increase the queue visibility timeout or extend message visibility while long-running work is in progress.'
    }
  ],
  successCriteria: [
    'The learner identifies the visibility timeout expiring before normal processing finishes as the cause of avoidable duplicate processing.',
    'The visibility timeout is set above the expected processing duration or consumers extend visibility while work is still active.',
    'The existing queue and successful delete behaviour remain in place without granting broader permissions.',
    'A final test shows a message stays invisible to the second worker while the first healthy worker is still processing it.'
  ],
  hints: [
    'Compare the 30-second visibility timeout with the measured consumer processing times and the timestamps from both workers.',
    'An SQS message becomes available for another receive when its visibility timeout expires if it has not yet been deleted.',
    'Set visibility long enough for normal processing, or call ChangeMessageVisibility while work continues, so the message does not reappear before the first worker finishes.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is causing the avoidable duplicate processing shown in the logs?',
      options: [
        { id: 'short-visibility', text: 'The 30-second visibility timeout expires well before normal processing finishes, allowing another worker to receive the same message.' },
        { id: 'long-polling', text: 'The 20-second long-poll setting causes SQS to deliver every message twice.' },
        { id: 'retention', text: 'The four-day retention period forces messages to be processed more than once.' },
        { id: 'missing-delete-permission', text: 'The workers cannot delete messages after successful processing.' }
      ],
      correctOptionId: 'short-visibility',
      explanation: 'The first worker is still processing after 30 seconds, and the second worker receives the same message shortly after the visibility timeout expires.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'adjust-visibility', text: 'Set the visibility timeout above normal processing time or extend visibility dynamically while a worker is still processing the message.' },
        { id: 'disable-delete', text: 'Stop deleting successful messages so SQS can track which worker handled them.' },
        { id: 'admin-access', text: 'Grant the workers AdministratorAccess so only one worker receives messages.' },
        { id: 'shorter-visibility', text: 'Reduce the visibility timeout to five seconds so failed messages retry more quickly.' }
      ],
      correctOptionId: 'adjust-visibility',
      explanation: 'The correction keeps an in-progress message hidden for long enough to finish and be deleted, directly addressing the timing problem without broadening access.'
    }
  ],
  solution: {
    rootCause: 'The queue visibility timeout is only 30 seconds while normal order processing commonly takes 72 to 118 seconds, so messages become visible and can be received by another consumer before the original worker deletes them.',
    fix: 'Increase the visibility timeout to safely cover expected processing time or have consumers extend visibility with ChangeMessageVisibility while work is active, then verify a second worker cannot receive the same message during normal processing.',
    prevention: 'Monitor real processing duration against the configured visibility timeout and use dynamic visibility extension for workloads whose processing time can vary significantly.'
  }
});
