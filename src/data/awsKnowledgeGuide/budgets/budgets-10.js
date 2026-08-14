import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-10",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Email and SNS Notifications",
  "status": "ready",
  "plainEnglish": "Email and SNS Notifications are the alerting delivery mechanisms built into AWS Budgets. Whenever an actual or forecasted spending/usage threshold is crossed, AWS Budgets can dispatch formatted email alerts to up to 10 email addresses per notification rule, and/or publish a notification message to an Amazon Simple Notification Service (Amazon SNS) topic. Publishing to SNS allows you to trigger automated downstream workflows, such as invoking AWS Lambda functions, posting to Slack/Microsoft Teams, or opening Jira tickets.",
  "whyItMatters": "Sending email alerts ensures human stakeholders are notified of budget anomalies, while publishing to SNS allows programmatic automation. With SNS, engineering teams can automatically run serverless scripts to pause development clusters, revoke IAM launch permissions, or post real-time alerts into ChatOps channels.",
  "workplaceExample": "A company configures an AWS Budget with both email and SNS subscribers on an 85% cost threshold. When triggered, it emails the FinOps distribution list and publishes a JSON payload to an SNS topic. The SNS topic triggers an AWS Lambda function that posts an alert to the `#aws-cost-alerts` Slack channel.",
  "examFocus": "For SAA-C03, remember that AWS Budgets supports up to 10 email recipients and 1 Amazon SNS topic per notification rule. To publish to an SNS topic, the SNS topic access policy must explicitly grant the AWS Budgets service principal (`budgets.amazonaws.com`) permission to perform `sns:Publish`.",
  "keyPoints": [
    "Delivers alerts to up to 10 email addresses and 1 Amazon SNS topic per threshold.",
    "Email alerts provide human-readable summaries of budget limits and current spending.",
    "Amazon SNS integration enables automated downstream workflows via AWS Lambda or HTTPS webhooks.",
    "The SNS topic access policy must explicitly allow `budgets.amazonaws.com` to publish messages.",
    "Can be integrated with AWS Chatbot to send notifications directly into Slack or Microsoft Teams."
  ],
  "commonMistake": "Configuring an SNS topic ARN in an AWS Budget notification without updating the SNS topic access policy. By default, SNS denies cross-service publish requests unless an explicit resource policy allows `budgets.amazonaws.com` to publish.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: SNS Topic Policy allowing AWS Budgets to publish alerts.\nResources:\n  BudgetAlertsTopic:\n    Type: AWS::SNS::Topic\n    Properties:\n      TopicName: BudgetAlertsTopic\n  BudgetAlertsTopicPolicy:\n    Type: AWS::SNS::TopicPolicy\n    Properties:\n      Topics:\n        - !Ref BudgetAlertsTopic\n      PolicyDocument:\n        Version: '2012-10-17'\n        Statement:\n          - Sid: AWSBudgetsSNSPublishingPermissions\n            Effect: Allow\n            Principal:\n              Service: budgets.amazonaws.com\n            Action: sns:Publish\n            Resource: !Ref BudgetAlertsTopic",
  "sources": [
    {
      "title": "Configuring Amazon SNS Notifications for AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-sns-policy.html"
    },
    {
      "title": "Managing Budget Alerts in AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html#manage-budget-alerts"
    }
  ]
});
