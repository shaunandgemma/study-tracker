import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-14',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Configuration Change Notifications',
  status: 'ready',
  plainEnglish: 'Configuration Change Notifications are real-time events published by AWS Config whenever a resource configuration item (CI) changes or a compliance evaluation status changes. AWS Config sends these notification streams directly to an Amazon Simple Notification Service (SNS) topic and Amazon EventBridge, allowing external systems, Slack/Teams bots, or Lambda functions to react immediately.',
  whyItMatters: 'Real-time notifications ensure security operations teams learn about critical misconfigurations or compliance violations within seconds of occurrence, rather than waiting for daily reports.',
  workplaceExample: 'A security team sets up an SNS topic subscribed to AWS Config Configuration Change Notifications. When an engineer opens SSH port 22 on a production security group, AWS Config publishes a notification to SNS, triggering a PagerDuty alert and sending a Slack message to the security team channel.',
  examFocus: 'SAA-C03 integration patterns: AWS Config -> SNS Topic (for email/PagerDuty/Slack notifications) or AWS Config -> EventBridge -> Lambda (for automated custom workflows).',
  keyPoints: [
    'Real-time streaming of resource change events and compliance status changes.',
    'Delivered to Amazon SNS topics and Amazon EventBridge.',
    'Triggers immediate alerts (email, SMS, ChatOps, SIEM tools).',
    'Enables event-driven architecture for custom security automation.',
    'Event payload includes detailed Configuration Item (CI) JSON metadata.'
  ],
  commonMistake: 'Confusing AWS Config notifications (which alert on configuration state changes) with CloudWatch Alarms (which alert on numerical metric threshold breaches).',
  example: 'EventBridge Rule Pattern for Non-Compliant Config Events:\n{\n  "source": ["aws.config"],\n  "detail-type": ["Config Rules Compliance Change"],\n  "detail": { "newEvaluationResult": { "complianceType": ["NON_COMPLIANT"] } }\n}',
  sources: [
    { title: 'AWS Config Notifications', url: 'https://docs.aws.amazon.com/config/latest/developerguide/notifications-demystified.html' }
  ]
});
