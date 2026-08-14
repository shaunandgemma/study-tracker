import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-6",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Reserved Instance Budgets",
  "status": "ready",
  "plainEnglish": "Reserved Instance (RI) Budgets in AWS Budgets help you monitor the efficiency and ROI of your upfront commitment investments across Amazon EC2, Amazon RDS, Amazon Redshift, Amazon ElastiCache, and OpenSearch. There are two types of RI budgets: RI Utilization Budgets (which track the percentage of your purchased RI hours that are actively being consumed by running instances) and RI Coverage Budgets (which track the percentage of your total running instance hours that are covered by discount RIs).",
  "whyItMatters": "Reserved Instances offer steep discounts (up to 72%) compared to On-Demand pricing, but you pay for them whether they are running or idle. If your RI utilization drops below 90%, you are wasting committed capital. If your RI coverage drops below 80%, you are paying expensive On-Demand rates for workloads that should be covered by commitments.",
  "workplaceExample": "A cloud FinOps team purchases 50 m5.large Amazon EC2 Reserved Instances. They create an RI Utilization Budget with a threshold of 95%. If application teams migrate workloads to newer m6g instances and the m5.large utilization drops to 80%, AWS Budgets alerts the FinOps team to modify the RIs or sell them on the RI Marketplace.",
  "examFocus": "For SAA-C03, distinguish between the two RI budget metrics: (1) RI Utilization: % of your purchased RIs that are actually in use (target: near 100% to avoid paying for idle commitments). (2) RI Coverage: % of your total running workload hours that receive RI discounts (target: high % to avoid paying standard On-Demand rates).",
  "keyPoints": [
    "Tracks commitment efficiency for Amazon EC2, RDS, Redshift, ElastiCache, and OpenSearch.",
    "RI Utilization Budget monitors how many of your purchased RI hours are actively used.",
    "RI Coverage Budget monitors how much of your total running fleet is discounted by RIs.",
    "Alerts fire when utilization or coverage falls BELOW a desired target threshold percentage.",
    "Prevents waste of committed capital and identifies uncommitted on-demand workloads.",
    "Supports daily, monthly, quarterly, or annual tracking intervals."
  ],
  "commonMistake": "Purchasing dozens of 3-year Reserved Instances and never monitoring utilization. If application architectures evolve, unused RIs continue billing every hour. Use RI Utilization Budgets to catch underutilized commitments immediately.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS RI Utilization Budget alerting when usage drops below 90%.\nResources:\n  Ec2RiUtilizationBudget:\n    Type: AWS::Budgets::Budget\n    Properties:\n      Budget:\n        BudgetName: ProductionEc2RiUtilization\n        BudgetType: RI_UTILIZATION\n        TimeUnit: MONTHLY\n        BudgetLimit:\n          Amount: 90\n          Unit: PERCENTAGE\n        CostFilters:\n          Service: 'Amazon Elastic Compute Cloud - Compute'\n      NotificationsWithSubscribers:\n        - Notification:\n            NotificationType: ACTUAL\n            ComparisonOperator: LESS_THAN\n            Threshold: 90\n            ThresholdType: PERCENTAGE\n          Subscribers:\n            - SubscriptionType: EMAIL\n              Address: finops@example.com",
  "sources": [
    {
      "title": "Creating an RI Utilization or Coverage Budget",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-ri-budget"
    },
    {
      "title": "Managing RI Utilization with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    }
  ]
});
