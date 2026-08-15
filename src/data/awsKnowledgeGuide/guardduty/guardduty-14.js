import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-14",
  "title": "GuardDuty EventBridge Integration",
  "plainEnglish": "Amazon GuardDuty integrates natively with Amazon EventBridge (formerly CloudWatch Events) by automatically emitting finding events to the default event bus in near-real time. This event-driven integration allows you to build fine-grained alerting rules, fan out notifications to ticketing systems (like Jira or ServiceNow), publish alerts to communication channels (Slack, Microsoft Teams, PagerDuty), and trigger automated remediation scripts.",
  "whyItMatters": "Without automated event routing, security teams must manually poll dashboards or check consoles for new findings. By routing GuardDuty finding events through EventBridge, organizations achieve instant visibility, filter alerts by severity or finding type, and automate immediate containment workflows without human delay.",
  "workplaceExample": "A cloud security engineering team deploys an EventBridge rule matching all GuardDuty findings with severity >= 4.0. The rule routes events to an Amazon SNS topic for email alerts, while a second rule matching High-severity findings (severity >= 7.0) invokes an AWS Step Functions state machine to automatically contain affected infrastructure and open a priority-1 incident ticket.",
  "examFocus": "Know how to craft EventBridge event patterns for GuardDuty: match 'source: [\"aws.guardduty\"]', 'detail-type: [\"GuardDuty Finding\"]', and filter on fields within 'detail' such as 'severity', 'type', or 'accountId'. Understand that finding updates are emitted to EventBridge after the initial finding and subsequent occurrences based on the finding aggregation interval.",
  "keyPoints": [
    "GuardDuty automatically publishes all generated findings to the default Amazon EventBridge bus as JSON event payloads.",
    "EventBridge rules filter findings by attributes including severity (numerical threshold), finding type prefix, account ID, and region.",
    "Targets can include AWS Lambda, Amazon SNS, Amazon SQS, AWS Step Functions, AWS Systems Manager, and third-party SaaS webhooks.",
    "Finding notification frequency in GuardDuty settings controls how quickly subsequent updates to an existing finding are re-published (every 15 minutes, 1 hour, or 6 hours; defaults to 6 hours).",
    "Initial finding generation is published to EventBridge in near-real time (within minutes of detection).",
    "Enables centralized cross-account finding aggregation by routing events from member accounts to a central security account's event bus."
  ],
  "commonMistake": "Filtering EventBridge rules on the root-level 'detail.severity' as a string instead of a numeric value. GuardDuty severity in the EventBridge event detail is a numeric float (e.g., 7.5), requiring numeric comparison syntax in event patterns.",
  "example": "Create an EventBridge rule pattern for Medium and High GuardDuty findings: {\"source\": [\"aws.guardduty\"], \"detail-type\": [\"GuardDuty Finding\"], \"detail\": {\"severity\": [{\"numeric\": [\">=\", 4.0]}]}}.",
  "sources": [
    {
      "title": "Monitoring GuardDuty Findings with Amazon EventBridge",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html"
    },
    {
      "title": "Amazon GuardDuty Finding Event Schema",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html#guardduty_findings_cloudwatch_format"
    }
  ]
});
