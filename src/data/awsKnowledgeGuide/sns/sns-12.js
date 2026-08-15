import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-12",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS Email Notifications",
  "status": "ready",
  "plainEnglish": "An Amazon SNS Standard topic can send a topic notification to an email or email-json subscription. The recipient must confirm the subscription before it becomes active. This is a simple way to deliver operational notifications to people, not a complete system for designed, personalized, or large-scale email campaigns.",
  "whyItMatters": "Email subscriptions make alarms and low-volume operational events visible without building a mail sender. Their human confirmation and limited delivery controls mean they should be governed carefully and not treated as a durable machine-processing channel.",
  "workplaceExample": "A non-production CloudWatch alarm publishes to an SNS Standard topic subscribed by an approved team distribution list. A team owner confirms it, a filter limits messages to actionable severities, and the runbook explains how to unsubscribe or change ownership when the team changes.",
  "examFocus": "Email and email-json are supported by Standard topics, and the subscription remains pending until the recipient confirms it. Choose Amazon Simple Email Service (Amazon SES), rather than a basic SNS email subscription, when the scenario requires application email such as branded transactional messages, newsletters, sender-domain controls, or email campaign capabilities.",
  "keyPoints": [
    "SNS email endpoints subscribe to Standard topics, not FIFO topics.",
    "The recipient must use the confirmation message before SNS starts delivering topic notifications.",
    "The email protocol produces a human-readable notification, while email-json delivers the SNS notification as JSON.",
    "Subscription filter policies can reduce irrelevant email by delivering only matching topic messages.",
    "Email delivery is for notifications; do not design a workflow that requires a person to receive or act within a guaranteed time.",
    "Use an approved team-controlled destination and maintain an owner, escalation route, and unsubscribe process.",
    "Use SES when an application needs richer control over outgoing email identities, formatting, transactional mail, or marketing mail."
  ],
  "commonMistake": "Do not publish an alarm and assume an unconfirmed email subscription will receive it. Check that the subscription is confirmed, test with harmless content, and avoid using SNS email as a durable or guaranteed work queue.",
  "example": "Create a test Standard topic, add an approved test mailbox as an email subscription, have its owner confirm it, publish a harmless notification with no personal or confidential data, verify receipt, test an optional severity filter, and remove the test subscription through the approved process.",
  "sources": [
    {
      "title": "Subscribing an endpoint to an Amazon SNS topic",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html"
    },
    {
      "title": "Amazon SNS features and capabilities",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/welcome-features.html"
    },
    {
      "title": "What is Amazon Simple Email Service?",
      "url": "https://docs.aws.amazon.com/ses/latest/dg/Welcome.html"
    }
  ]
});
