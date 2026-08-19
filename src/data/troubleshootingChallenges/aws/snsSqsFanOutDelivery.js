export default Object.freeze({
  id: 'aws-sns-sqs-fanout-delivery',
  examId: 'aws-saa-c03',
  order: 19,
  category: 'Amazon SNS and SQS',
  title: 'Repair SNS-to-SQS Fan-Out Delivery',
  difficulty: 'Intermediate',
  summary: 'Diagnose why one subscribed SQS queue does not receive messages from its SNS topic.',
  scenario: 'The fa-training-order-events SNS topic fans messages out to two SQS queues. The audit queue receives every published message, but the billing queue receives none even though its subscription is confirmed. The topic and subscription must remain in place, and the billing queue must accept messages only from the intended SNS topic.',
  task: 'Use the subscription and queue-policy evidence to identify why SNS delivery to the billing queue is denied, make the narrowest safe policy correction, and verify successful fan-out without opening the queue to unrelated senders.',
  evidence: [
    {
      id: 'subscription-status',
      title: 'SNS Subscription Status',
      kind: 'code',
      content: `Topic:
arn:aws:sns:eu-west-2:123456789012:fa-training-order-events

Subscriptions:
1. arn:aws:sqs:eu-west-2:123456789012:fa-training-order-audit
   Status: Confirmed

2. arn:aws:sqs:eu-west-2:123456789012:fa-training-order-billing
   Status: Confirmed

Test publishes: 5
Audit queue messages received: 5
Billing queue messages received: 0`
    },
    {
      id: 'billing-queue-policy',
      title: 'Billing Queue Access Policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowOrderEvents",
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:eu-west-2:123456789012:fa-training-order-billing",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:sns:eu-west-2:123456789012:fa-training-order-events-old"
        }
      }
    }
  ]
}`
    },
    {
      id: 'approved-policy-boundary',
      title: 'Approved Queue Policy Boundary',
      kind: 'text',
      content: 'The active topic ARN is arn:aws:sns:eu-west-2:123456789012:fa-training-order-events. The billing queue must allow sns.amazonaws.com to call sqs:SendMessage only when aws:SourceArn matches that active topic. Do not allow all principals or all SNS topics.'
    }
  ],
  successCriteria: [
    'The learner identifies the stale aws:SourceArn value in the billing queue policy as the delivery failure.',
    'The queue policy permits sns.amazonaws.com to call sqs:SendMessage only from the active fa-training-order-events topic ARN.',
    'The confirmed SNS subscription remains unchanged and the queue is not opened to unrelated senders.',
    'A final publish sends a message successfully to both the audit and billing queues.'
  ],
  hints: [
    'The billing subscription is already confirmed, so compare the active topic ARN with the condition in the billing queue resource policy.',
    'For SNS to deliver to SQS, the queue policy must allow the SNS service to perform sqs:SendMessage, and the permission can be restricted by aws:SourceArn.',
    'Replace the old topic ARN in the ArnEquals condition with arn:aws:sns:eu-west-2:123456789012:fa-training-order-events and publish another test message.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the billing queue receive no messages from the active SNS topic?',
      options: [
        { id: 'stale-source-arn', text: 'The SQS queue policy allows a different old SNS topic ARN in its aws:SourceArn condition.' },
        { id: 'subscription-pending', text: 'The billing queue subscription is still waiting for confirmation.' },
        { id: 'sns-needs-admin', text: 'The SNS topic needs AdministratorAccess before it can publish to SQS.' },
        { id: 'audit-intercepts', text: 'The audit queue consumes the SNS message before the billing queue can receive it.' }
      ],
      correctOptionId: 'stale-source-arn',
      explanation: 'The billing subscription is confirmed, but its queue policy restricts SendMessage to fa-training-order-events-old rather than the active topic ARN.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'correct-source-arn', text: 'Update the billing queue policy so sns.amazonaws.com can call sqs:SendMessage only when aws:SourceArn equals the active fa-training-order-events topic ARN.' },
        { id: 'allow-everyone', text: 'Set Principal to * and remove all conditions from the billing queue policy.' },
        { id: 'recreate-topic', text: 'Delete the working SNS topic and create a new one with the old name.' },
        { id: 'remove-policy', text: 'Remove the billing queue policy entirely and rely on the confirmed subscription.' }
      ],
      correctOptionId: 'correct-source-arn',
      explanation: 'Correcting the scoped SourceArn restores delivery from the intended topic while preventing unrelated SNS topics or principals from sending to the queue.'
    }
  ],
  solution: {
    rootCause: 'The billing SQS queue policy grants sns.amazonaws.com SendMessage permission only when aws:SourceArn equals the obsolete fa-training-order-events-old topic, so messages from the active fa-training-order-events topic are not authorized.',
    fix: 'Change the queue policy aws:SourceArn condition to arn:aws:sns:eu-west-2:123456789012:fa-training-order-events, keep the SNS service principal and sqs:SendMessage action scoped to the billing queue, and verify a test publish reaches both subscribed queues.',
    prevention: 'Manage SNS subscriptions and their corresponding SQS queue policies together so topic ARN changes automatically update the resource-policy SourceArn condition.'
  }
});
