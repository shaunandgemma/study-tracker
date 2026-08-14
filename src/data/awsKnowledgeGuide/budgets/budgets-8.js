import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-8",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Actual Cost Alerts",
  "status": "ready",
  "plainEnglish": "An Actual Cost Alert in AWS Budgets is a notification rule that triggers only when the actual, realized spend in your AWS account crosses a specific threshold (e.g., when your accrued charges exceed 80% or 100% of your allocated budget amount). Unlike forecasted alerts, which predict future spend, actual cost alerts fire only after the charges have already been billed to your account.",
  "whyItMatters": "Actual cost alerts provide concrete checkpoints throughout the billing cycle. Having notifications at milestones like 50%, 75%, 90%, and 100% ensures that finance teams and system owners have factual visibility into real money spent to date.",
  "workplaceExample": "A company allocates a $10,000 monthly budget to its machine learning training account. They configure Actual Cost Alerts at $5,000 (50%), $8,000 (80%), and $10,000 (100%). When GPU training jobs push actual monthly spend over $8,000 on the 20th of the month, an alert notifies the engineering manager to prioritize remaining compute jobs.",
  "examFocus": "For SAA-C03, understand the difference between Actual Cost Alerts (triggers when real incurred cost >= threshold) and Forecasted Cost Alerts (triggers when AWS predicts cost will exceed threshold by the end of the billing period). Actual cost alerts verify real past spend; forecasted alerts provide proactive early warning before spending occurs.",
  "keyPoints": [
    "Triggers notifications when real, incurred AWS spending crosses a defined threshold.",
    "Thresholds can be defined as an absolute dollar amount (e.g., $500) or a percentage (e.g., 80%).",
    "Comparison operators include GREATER_THAN, EQUAL_TO, and LESS_THAN.",
    "Can deliver alerts via direct email to multiple recipients or publish to Amazon SNS topics.",
    "Provides verified milestone tracking of actual financial burn rate throughout the month."
  ],
  "commonMistake": "Relying solely on Actual Cost Alerts without setting Forecasted Cost Alerts. If an actual cost alert triggers at 100% on the 10th day of the month, you are already out of budget. Pair actual cost alerts with forecasted cost alerts for proactive protection.",
  "example": "NotificationsWithSubscribers:\n  - Notification:\n      NotificationType: ACTUAL\n      ComparisonOperator: GREATER_THAN\n      Threshold: 85\n      ThresholdType: PERCENTAGE\n    Subscribers:\n      - SubscriptionType: EMAIL\n        Address: finance-alerts@example.com",
  "sources": [
    {
      "title": "Setting Budget Alerts and Notifications",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html#manage-budget-alerts"
    },
    {
      "title": "Notification Types in AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-budget-notifications"
    }
  ]
});
