import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sqs-19',
  topicId: 'topic-sqs',
  topicTitle: 'Amazon SQS',
  objectiveCode: 'Integration',
  title: 'Queue Access Policies',
  status: 'ready',
  plainEnglish: 'SQS Queue Access Policies are resource-based JSON access control policies attached directly to an SQS queue. They grant or restrict API permissions (`sqs:SendMessage`, `sqs:ReceiveMessage`, `sqs:DeleteMessage`) to AWS IAM principals, external AWS accounts, or integrated AWS service principals (such as Amazon SNS, Amazon S3, or EventBridge).',
  whyItMatters: 'Resource-based queue policies are essential for cross-account access and service integrations (e.g. allowing an SNS topic in Account A to publish messages to an SQS queue in Account B). Condition keys prevent unauthorized confused-deputy access.',
  workplaceExample: 'An S3 bucket publishes event notifications (`s3:ObjectCreated:*`) to an SQS queue. The SQS Queue Access Policy grants `sqs:SendMessage` to `s3.amazonaws.com` conditioned on `aws:SourceArn` matching the specific S3 bucket ARN.',
  examFocus: 'SAA-C03 Queue Access Policy & Security Rules:\n- Resource-Based Policy: Attached directly to the SQS queue; works alongside IAM identity-based policies.\n- Confused Deputy Prevention: Always include `aws:SourceArn` or `aws:SourceAccount` condition keys when granting access to service principals (SNS, S3).\n- Cross-Account Sharing: Explicitly grant `sqs:SendMessage` or `sqs:ReceiveMessage` to foreign AWS Account IDs.',
  keyPoints: [
    'Resource-based JSON policies attached directly to Amazon SQS queues.',
    'Grants permissions to IAM principals, cross-account AWS accounts, and AWS service principals.',
    'Required for SNS-to-SQS fan-out, S3 event notifications, and EventBridge targets.',
    'Enforces `aws:SourceArn` condition keys to prevent confused-deputy security attacks.',
    'Evaluated alongside IAM identity policies (an explicit Deny in either policy overrides allows).'
  ],
  commonMistake: 'Granting `sqs:SendMessage` to `Principal: "*"` without adding an `aws:SourceArn` condition, allowing any AWS user in the world to push messages to your queue.',
  example: 'SQS Queue Access Policy Allowing SNS Topic Invocation:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "AllowSNSTopicPublish",\n    "Effect": "Allow",\n    "Principal": {\n      "Service": "sns.amazonaws.com"\n    },\n    "Action": "sqs:SendMessage",\n    "Resource": "arn:aws:sqs:us-east-1:123456789012:my-queue",\n    "Condition": {\n      "ArnEquals": {\n        "aws:SourceArn": "arn:aws:sns:us-east-1:123456789012:my-topic"\n      }\n    }\n  }]\n}',
  sources: [
    { title: 'Amazon SQS Queue Access Policies', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-creating-custom-policies.html' }
  ]
});
