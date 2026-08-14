import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-4",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "AWS Budgets Cost Budgets",
  "status": "ready",
  "plainEnglish": "A Cost Budget in AWS Budgets is a financial planning tool that lets you set a custom dollar spending limit on your AWS account over a recurring time period (monthly, quarterly, or annually). As your AWS usage incurs charges throughout the billing period, AWS Budgets tracks your spending against the budgeted limit and triggers email or Amazon SNS alerts whenever your actual or forecasted costs exceed your defined threshold percentages (such as 80% or 100%).",
  "whyItMatters": "Cloud spending can grow rapidly and unexpectedly when developers accidentally launch expensive instance types or forget to delete test resources. Setting up Cost Budgets provides financial visibility and guardrails that alert stakeholders before a minor configuration error turns into an astronomical monthly bill.",
  "workplaceExample": "A department manager sets a monthly Cost Budget of $5,000 USD for the Engineering account. They configure threshold alerts at 50% ($2,500), 80% ($4,000), and 100% ($5,000). On day 12 of the month, an alert fires indicating the account has hit 80% of budget due to an unindexed RDS database scaling up, allowing the team to fix the issue before exceeding $5,000.",
  "examFocus": "For SAA-C03, remember that Cost Budgets track dollar amounts ($ USD). They can track spending at the overall account level or be filtered by service, linked account, tag, cost category, or region. Up to 20,000 budgets can be created per account, and the first two budgets in each account are free of charge.",
  "keyPoints": [
    "Tracks monetary spending ($ USD) against custom monthly, quarterly, or annual targets.",
    "Triggers notifications based on both Actual spending and Forecasted spending.",
    "Can be scoped by service, linked account, resource tag, region, or cost category.",
    "Sends alerts to up to 10 email addresses and Amazon SNS topics per notification threshold.",
    "Supports automated Budget Actions to stop EC2/RDS instances when thresholds are breached."
  ],
  "commonMistake": "Only creating an alert for 100% actual spend. By the time an alert triggers at 100%, your budget has already been exhausted. Set multiple tiered alert thresholds (e.g. 50%, 80%, and a forecasted 100% alert) to give your team time to act.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Monthly AWS Cost Budget with 80% threshold notification.\nResources:\n  MonthlyEngineeringBudget:\n    Type: AWS::Budgets::Budget\n    Properties:\n      Budget:\n        BudgetName: MonthlyEngineeringBudget\n        BudgetType: COST\n        TimeUnit: MONTHLY\n        BudgetLimit:\n          Amount: 5000\n          Unit: USD\n      NotificationsWithSubscribers:\n        - Notification:\n            NotificationType: ACTUAL\n            ComparisonOperator: GREATER_THAN\n            Threshold: 80\n            ThresholdType: PERCENTAGE\n          Subscribers:\n            - SubscriptionType: EMAIL\n              Address: devops-alerts@example.com",
  "sources": [
    {
      "title": "Managing Costs with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    },
    {
      "title": "Creating a Cost Budget",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-cost-budget"
    }
  ]
});
