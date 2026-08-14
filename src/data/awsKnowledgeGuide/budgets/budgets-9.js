import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-9",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Forecasted Cost Alerts",
  "status": "ready",
  "plainEnglish": "A Forecasted Cost Alert in AWS Budgets uses predictive machine learning models based on your historical and current usage trends to estimate your total spend by the end of the billing period. If AWS algorithms forecast that your total monthly spend will exceed your budgeted threshold (e.g. 100% of your $1,000 budget), the alert triggers immediately—even if your actual spend is only $300 on day 5 of the month.",
  "whyItMatters": "Waiting for actual spend to breach a budget means the money has already been spent and cannot be un-spent. Forecasted alerts act as an early-warning radar system, allowing engineering and finance teams to intervene early in the billing cycle by rightsizing instances or stopping unneeded test environments before budget overruns occur.",
  "workplaceExample": "A development team has a monthly sandbox budget of $2,000. On day 3 of the month, an engineer launches an unreserved 32-node EMR cluster. Although the current spend is only $150, AWS Budgets projects that the current daily run rate will total $4,800 by month-end and sends an immediate Forecasted Cost Alert, prompting the team to shut down the cluster.",
  "examFocus": "For SAA-C03, know that Forecasted Cost Alerts trigger when AWS projects that your spend will exceed a defined threshold before the end of the billing period. If an exam question asks how to get early warning notifications before a budget is exceeded, the answer is AWS Budgets with Forecasted notifications.",
  "keyPoints": [
    "Predicts end-of-period total spend based on statistical usage trends and current run rate.",
    "Triggers proactively before the actual budget threshold is physically breached.",
    "Available for Cost Budgets and Usage Budgets.",
    "Allows teams to take corrective action early in the billing cycle to prevent overspending.",
    "Can deliver alerts via email and publish to Amazon SNS topics or trigger automated Budget Actions."
  ],
  "commonMistake": "Ignoring Forecasted alerts because current actual spending appears low. If an environment's burn rate is projected to exceed budget by month-end, taking action early avoids unexpected month-end billing surprises.",
  "example": "NotificationsWithSubscribers:\n  - Notification:\n      NotificationType: FORECASTED\n      ComparisonOperator: GREATER_THAN\n      Threshold: 100\n      ThresholdType: PERCENTAGE\n    Subscribers:\n      - SubscriptionType: EMAIL\n        Address: cloud-governance@example.com",
  "sources": [
    {
      "title": "Setting Forecasted Budget Alerts in AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html#forecasted-budget"
    },
    {
      "title": "How AWS Budgets Forecasts Cost and Usage",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#forecasted-notifications"
    }
  ]
});
