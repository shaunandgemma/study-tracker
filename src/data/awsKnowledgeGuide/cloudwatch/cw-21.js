import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-21',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Alarm Actions',
  status: 'ready',
  plainEnglish: 'An alarm action is a configured response to an alarm state transition. Depending on the alarm and metric, CloudWatch can notify an SNS topic, invoke Lambda, perform supported EC2 actions, run an Auto Scaling policy, or create supported operational items or incidents. Actions can be associated with transitions into ALARM, OK, or INSUFFICIENT_DATA. Most actions run when the state changes, not repeatedly while it stays unchanged; Auto Scaling actions have different continuing behavior.',
  whyItMatters: 'Actions turn detection into communication or remediation. They shorten response time and make repeatable low-risk recovery automatic while allowing high-impact steps to remain human-controlled.',
  workplaceExample: 'A high-latency alarm publishes to an SNS topic for on-call notification and invokes a narrowly scoped Lambda function that gathers diagnostic context. The team does not terminate resources automatically because that response would be too destructive for this signal.',
  examFocus: 'Match the action to the requirement: SNS for fan-out notification, Lambda for custom automation, EC2 actions for supported EC2 metric alarms, and scaling actions for capacity changes. Alarm state changes are also sent to EventBridge, where rules can route them into broader event workflows. Confirm which transition invokes the action and ensure CloudWatch or the integrated service has the required permission.',
  keyPoints: [
    'Actions can be configured for transitions into ALARM, OK, or INSUFFICIENT_DATA.',
    'SNS provides notification fan-out to confirmed subscribers and endpoints.',
    'Lambda enables custom automated handling of alarm transitions.',
    'Eligible EC2 alarms can stop, terminate, reboot, or recover an instance.',
    'CloudWatch alarm state changes are delivered as EventBridge events.'
  ],
  commonMistake: 'Assuming an action repeats every minute while an alarm remains in ALARM can produce a flawed workflow. Design for state-transition behavior, understand the special behavior of scaling actions, and make automated remediation idempotent so duplicate invocation is safe.',
  example: 'Configure an ALARM transition to an SNS topic and an OK transition to the same topic for recovery notice. Replace the topic with its real ARN, confirm the alarm is allowed to publish, and confirm endpoint subscriptions. Test safely and verify both the alarm history and delivered messages.',
  sources: [
    { title: 'Alarm actions', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-actions.html' },
    { title: 'Alarm events and EventBridge', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-and-eventbridge.html' }
  ]
});
