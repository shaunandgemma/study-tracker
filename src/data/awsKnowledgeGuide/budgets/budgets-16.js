import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-16",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "AWS Budgets vs Cost Explorer",
  "status": "ready",
  "plainEnglish": "AWS Budgets and AWS Cost Explorer are complementary AWS Cost Management tools designed for different stages of cloud financial management. AWS Budgets is a proactive planning, alerting, and automated governance tool used to set financial and usage spending limits and notify teams before or as thresholds are breached. AWS Cost Explorer is an interactive visualization, historical analysis, and forecasting tool used to slice, dice, filter, chart, and understand where your money was spent across services, tags, accounts, and regions.",
  "whyItMatters": "Using Cost Explorer alone means you must log in and manually inspect charts to notice spending spikes after they happen. Using AWS Budgets ensures you are automatically notified in real-time when spending deviates from plans. Combining both gives organizations both automated guardrails (Budgets) and deep forensic investigation (Cost Explorer).",
  "workplaceExample": "An engineer receives an AWS Budgets email alert indicating that the development account has exceeded its forecasted monthly budget by 40%. The engineer opens AWS Cost Explorer, groups costs by 'Usage Type' and filters by the last 7 days, discovering that an unattached Amazon EBS GP3 volume and a NAT Gateway in an abandoned VPC were driving up costs.",
  "examFocus": "For SAA-C03, compare the two services: AWS Budgets is for setting custom budget limits, tracking actual vs budgeted spend, sending alerts (Email/SNS), and executing automated containment actions (Budget Actions). AWS Cost Explorer is for viewing visual reports, analyzing historical cost patterns (up to 12 months past), forecasting future costs (up to 12 months ahead), and getting Rightsizing / Savings Plans recommendations.",
  "keyPoints": [
    "AWS Budgets: Proactive alerting, custom target limits, and automated actions (IAM/EC2/RDS control).",
    "AWS Cost Explorer: Visual analytics, multi-dimensional filtering, historical reporting, and deep cost exploration.",
    "Cost Explorer provides up to 12 months of historical data and up to 12 months of predictive forecasting.",
    "Cost Explorer includes native recommendation engines for Rightsizing and Savings Plans.",
    "AWS Budgets tracks Cost, Usage, RI utilization/coverage, and Savings Plans utilization/coverage."
  ],
  "commonMistake": "Thinking AWS Cost Explorer can send automated alert emails when spending thresholds are breached. Cost Explorer is a reporting and charting interface; automated alerts and automated actions require AWS Budgets.",
  "example": "# Use AWS Budgets to establish proactive alerts for anomalies discovered in Cost Explorer:\nNotificationsWithSubscribers:\n  - Notification:\n      NotificationType: FORECASTED\n      ComparisonOperator: GREATER_THAN\n      Threshold: 100\n      ThresholdType: PERCENTAGE\n    Subscribers:\n      - SubscriptionType: EMAIL\n        Address: cost-management@example.com",
  "sources": [
    {
      "title": "What is AWS Cost Explorer?",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Managing Costs with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    }
  ]
});
