import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-7",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Savings Plans Budgets",
  "status": "ready",
  "plainEnglish": "Savings Plans Budgets in AWS Budgets allow you to track the performance and adoption of your AWS Savings Plans commitments (Compute Savings Plans, EC2 Instance Savings Plans, and SageMaker Savings Plans). Similar to RI budgets, there are two types: Savings Plans Utilization Budgets (which measure the percentage of your committed hourly dollar spend that is actively being used to discount compute) and Savings Plans Coverage Budgets (which measure the percentage of your eligible compute spend that is covered by Savings Plans).",
  "whyItMatters": "Savings Plans represent an ongoing financial commitment (e.g. committing to $50/hour for 1 or 3 years). If compute workloads are scaled down, containerized into smaller tasks, or migrated to serverless and your utilization falls below 100%, you still pay the full committed dollar amount every hour. Monitoring Savings Plans ensures maximum financial return on your commitments.",
  "workplaceExample": "An enterprise commits to $200/hour in Compute Savings Plans across AWS Lambda, AWS Fargate, and Amazon EC2. The cloud finance team configures a Savings Plans Utilization Budget with a 98% threshold. If monthly utilization drops to 92%, an SNS alert is sent to finance leads to analyze idle compute allocations.",
  "examFocus": "For SAA-C03, know that Savings Plans apply across EC2, Fargate, and Lambda (Compute Savings Plans) or specific EC2 instance families (EC2 Instance Savings Plans). Savings Plans Budgets monitor Utilization (ensuring you are getting full value for committed dollars) and Coverage (identifying uncommitted compute eligible for additional discount plans).",
  "keyPoints": [
    "Monitors commitment efficiency across Compute, EC2, and SageMaker Savings Plans.",
    "Savings Plans Utilization tracks the percentage of committed hourly spend actively applied.",
    "Savings Plans Coverage tracks the percentage of eligible compute spend receiving discounts.",
    "Alerts trigger when utilization or coverage falls BELOW a defined percentage threshold.",
    "Applies to commitments covering Amazon EC2, AWS Fargate, AWS Lambda, and Amazon SageMaker.",
    "Essential FinOps tool for continuous commitment optimization."
  ],
  "commonMistake": "Assuming that Savings Plans automatically apply to 100% of all workloads without monitoring. If new instance types or regions are launched that fall outside an EC2 Instance Savings Plan, you will silently pay full On-Demand rates unless a Coverage budget alerts you.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Savings Plans Utilization Budget.\nResources:\n  SpUtilizationBudget:\n    Type: AWS::Budgets::Budget\n    Properties:\n      Budget:\n        BudgetName: ComputeSavingsPlansUtilization\n        BudgetType: SAVINGS_PLANS_UTILIZATION\n        TimeUnit: MONTHLY\n        BudgetLimit:\n          Amount: 95\n          Unit: PERCENTAGE\n      NotificationsWithSubscribers:\n        - Notification:\n            NotificationType: ACTUAL\n            ComparisonOperator: LESS_THAN\n            Threshold: 95\n            ThresholdType: PERCENTAGE\n          Subscribers:\n            - SubscriptionType: EMAIL\n              Address: cloud-finops@example.com",
  "sources": [
    {
      "title": "Creating a Savings Plans Budget",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-sp-budget"
    },
    {
      "title": "Managing Savings Plans with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    }
  ]
});
