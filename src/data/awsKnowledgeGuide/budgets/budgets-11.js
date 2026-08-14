import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-11",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Budget Thresholds",
  "status": "ready",
  "plainEnglish": "A Budget Threshold is the trigger condition defined inside an AWS Budget that determines exactly when a notification alert or automated action will be fired. A threshold consists of a target value (specified as either a percentage of the total budget or an absolute dollar/unit amount), a threshold type (PERCENTAGE or ABSOLUTE_VALUE), a notification type (ACTUAL spend or FORECASTED spend), and a comparison operator (GREATER_THAN, EQUAL_TO, or LESS_THAN).",
  "whyItMatters": "Setting multiple tiered thresholds across a single budget creates a structured escalation ladder. Early thresholds (e.g. 50%) provide routine status updates to developers, moderate thresholds (e.g. 80%) alert team leads to review run rates, and critical thresholds (e.g. 100% or 120%) page executive management and trigger automated containment actions.",
  "workplaceExample": "A company creates a $20,000 monthly budget with three thresholds: 50% Actual (sends an informational email to developers), 85% Forecasted (emails the engineering director to freeze non-essential scaling), and 100% Actual (triggers a Budget Action applying an IAM deny policy on new EC2 provisioning).",
  "examFocus": "For SAA-C03, understand that a single AWS budget can contain up to 5 notification thresholds. Thresholds can be defined as PERCENTAGE (e.g., 85% of budget limit) or ABSOLUTE_VALUE (e.g., $8,500). Thresholds can trigger on ACTUAL metric values or FORECASTED values.",
  "keyPoints": [
    "Defines the exact trigger condition for alerts and automated actions in AWS Budgets.",
    "Supports threshold types: PERCENTAGE (e.g. 80%) or ABSOLUTE_VALUE (e.g. $4,000 USD).",
    "Supports notification types: ACTUAL (incurred spend) and FORECASTED (projected end-of-period spend).",
    "Comparison operators include GREATER_THAN, EQUAL_TO, and LESS_THAN.",
    "A single budget can support up to 5 distinct notification threshold rules."
  ],
  "commonMistake": "Configuring only a single 100% threshold. If spending surges rapidly mid-month, you receive no advance warning before the budget is completely exhausted. Always configure progressive thresholds (e.g. 50%, 80%, and 100% forecasted).",
  "example": "NotificationsWithSubscribers:\n  - Notification:\n      NotificationType: ACTUAL\n      ComparisonOperator: GREATER_THAN\n      Threshold: 50\n      ThresholdType: PERCENTAGE\n    Subscribers:\n      - SubscriptionType: EMAIL\n        Address: dev-team@example.com\n  - Notification:\n      NotificationType: FORECASTED\n      ComparisonOperator: GREATER_THAN\n      Threshold: 100\n      ThresholdType: PERCENTAGE\n    Subscribers:\n      - SubscriptionType: EMAIL\n        Address: finance-lead@example.com",
  "sources": [
    {
      "title": "Configuring Budget Thresholds in AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-budget-notifications"
    },
    {
      "title": "AWS::Budgets::Budget Notification Property Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notification.html"
    }
  ]
});
