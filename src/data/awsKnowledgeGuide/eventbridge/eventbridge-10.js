import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-10',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'Event Targets',
  status: 'ready',
  plainEnglish: 'An Event Target is an AWS service or external HTTP endpoint that EventBridge invokes when an event matches a rule. EventBridge supports over 25+ AWS targets—including AWS Lambda functions, Amazon SQS queues, Amazon SNS topics, AWS Step Functions state machines, Kinesis Data Streams, Amazon EC2 Systems Manager, API Gateway endpoints, and external API Destinations.',
  whyItMatters: 'Extensive target support allows a single event to trigger diverse automated responses—such as running serverless code (Lambda), queuing async jobs (SQS), sending notifications (SNS), or calling 3rd-party REST APIs (API Destinations).',
  workplaceExample: 'An event rule matches an `AccountCreated` event and fans out to 4 targets:\n1. AWS Lambda: Provisions default user directory.\n2. Amazon SQS: Queues welcoming email job.\n3. Amazon SNS: Sends Slack alert to sales team.\n4. API Destination: Calls external HubSpot CRM API.',
  examFocus: 'SAA-C03 Target capabilities:\n- Single rule can invoke up to 5 targets concurrently.\n- Targets require an IAM Role allowing EventBridge to invoke the target (e.g. `sqs:SendMessage`, `lambda:InvokeFunction`).\n- API Destinations: Allows EventBridge to invoke external 3rd-party HTTP REST endpoints directly with OAuth/Basic authentication.',
  keyPoints: [
    'Destinations invoked by EventBridge when an event matches a rule.',
    'Supports 25+ AWS service targets (Lambda, SQS, SNS, Step Functions, Kinesis).',
    'Supports external HTTP REST endpoints via API Destinations.',
    'Supports up to 5 targets per EventBridge rule.',
    'Uses IAM Roles or Resource Policies for secure target invocation.'
  ],
  commonMistake: 'Configuring an SQS queue as an EventBridge target without granting EventBridge permission to call `sqs:SendMessage` in the SQS queue access policy, causing event delivery failures.',
  example: 'Adding a Lambda Target to a Rule via CLI:\n`aws events put-targets --rule HighValueOrderRule --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:123456789012:function:ProcessHighValueOrder"`',
  sources: [
    { title: 'Amazon EventBridge Targets', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html' }
  ]
});
