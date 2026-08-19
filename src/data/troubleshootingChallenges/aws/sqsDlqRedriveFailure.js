export default Object.freeze({
  id: 'aws-sqs-dlq-redrive-failure',
  examId: 'aws-saa-c03',
  order: 18,
  category: 'Amazon SQS',
  title: 'Recover Messages Trapped in an SQS Dead-Letter Queue',
  difficulty: 'Intermediate',
  summary: 'Diagnose why corrected messages cannot be redriven from an SQS dead-letter queue.',
  scenario: 'A consumer defect caused valid order messages to reach the fa-training-orders-dlq dead-letter queue. The consumer bug has been fixed and new messages now process successfully, but an operator cannot start a DLQ redrive back to the source queue. The messages must be preserved and returned through the normal source queue rather than copied manually.',
  task: 'Use the redrive error and permission evidence to identify why the move task cannot start, apply the minimum required redrive permissions, and verify that DLQ messages return to the source queue for successful processing.',
  evidence: [
    {
      id: 'redrive-error',
      title: 'DLQ Redrive Attempt',
      kind: 'code',
      content: `Source queue:
arn:aws:sqs:eu-west-2:123456789012:fa-training-orders

Dead-letter queue:
arn:aws:sqs:eu-west-2:123456789012:fa-training-orders-dlq

DLQ messages available: 27

Redrive destination: fa-training-orders

Result:
AccessDenied: User is not authorized to perform:
sqs:StartMessageMoveTask
on resource:
arn:aws:sqs:eu-west-2:123456789012:fa-training-orders-dlq`
    },
    {
      id: 'operator-policy',
      title: 'Current Operator IAM Policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:GetQueueAttributes",
        "sqs:ReceiveMessage"
      ],
      "Resource": "arn:aws:sqs:eu-west-2:123456789012:fa-training-orders-dlq"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": "arn:aws:sqs:eu-west-2:123456789012:fa-training-orders"
    }
  ]
}`
    },
    {
      id: 'approved-boundary',
      title: 'Recovery Boundary',
      kind: 'text',
      content: 'The original consumer fault is resolved and the source queue is processing new messages normally. The operator may receive and delete messages from the DLQ, get its attributes, start a message move task, and send messages to the intended source queue. Do not grant sqs:* or manually copy and delete the 27 messages.'
    }
  ],
  successCriteria: [
    'The learner identifies the missing DLQ redrive IAM permissions as the reason the move task cannot start.',
    'The operator receives only the SQS actions required to redrive from fa-training-orders-dlq to fa-training-orders.',
    'The messages are moved through the SQS redrive mechanism rather than manually copied or discarded.',
    'A final verification shows the DLQ count fall and the recovered messages process successfully from the source queue.'
  ],
  hints: [
    'Start with the exact action named in the AccessDenied error and compare it with the operator policy.',
    'DLQ redrive requires permission to start the move task and to work with messages on the DLQ, plus permission to send to the destination queue.',
    'Add the missing StartMessageMoveTask and DeleteMessage permissions with the existing ReceiveMessage and GetQueueAttributes access on the DLQ, while keeping SendMessage scoped to fa-training-orders.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can the operator not start the DLQ redrive?',
      options: [
        { id: 'missing-redrive-actions', text: 'The operator policy is missing required redrive actions, including sqs:StartMessageMoveTask on the dead-letter queue.' },
        { id: 'bad-max-receive', text: 'The source queue maxReceiveCount is too high for a redrive task to start.' },
        { id: 'consumer-still-broken', text: 'The consumer must still be failing because messages remain in the DLQ.' },
        { id: 'dlq-empty', text: 'The dead-letter queue has no messages available to move.' }
      ],
      correctOptionId: 'missing-redrive-actions',
      explanation: 'The error explicitly denies sqs:StartMessageMoveTask, and that action is absent from the operator policy even though the DLQ contains messages and the consumer has been repaired.'
    },
    {
      id: 'safe-resolution',
      prompt: 'Which correction follows the approved least-privilege boundary?',
      options: [
        { id: 'bounded-redrive-policy', text: 'Allow StartMessageMoveTask, ReceiveMessage, DeleteMessage and GetQueueAttributes on the DLQ and SendMessage on the intended source queue, then start the redrive.' },
        { id: 'sqs-star', text: 'Grant sqs:* on every queue in the account.' },
        { id: 'manual-copy', text: 'Receive all DLQ messages, manually send copies, and delete the originals one by one.' },
        { id: 'purge-dlq', text: 'Purge the DLQ and rely on producers to recreate the lost orders.' }
      ],
      correctOptionId: 'bounded-redrive-policy',
      explanation: 'The bounded policy grants the actions needed for the approved redrive while keeping access limited to the affected DLQ and source queue.'
    }
  ],
  solution: {
    rootCause: 'The operator policy lacks the permissions required to start and complete an SQS DLQ redrive, with the immediate failure caused by missing sqs:StartMessageMoveTask on fa-training-orders-dlq.',
    fix: 'Grant StartMessageMoveTask, ReceiveMessage, DeleteMessage and GetQueueAttributes on fa-training-orders-dlq and SendMessage on fa-training-orders, start the redrive task, and verify the recovered messages leave the DLQ and process successfully through the source queue.',
    prevention: 'Define a reusable least-privilege recovery role for DLQ redrive and test its permissions before incidents so operators do not need emergency broad access.'
  }
});
