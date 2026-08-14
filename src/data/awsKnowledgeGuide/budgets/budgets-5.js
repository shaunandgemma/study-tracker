import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-5",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Usage Budgets",
  "status": "ready",
  "plainEnglish": "A Usage Budget in AWS Budgets allows you to monitor and limit non-monetary resource consumption quantities rather than raw dollars. You set thresholds on quantitative usage metrics such as Amazon S3 Gigabyte-Months of storage, Amazon EC2 instance hours, data transfer out in gigabytes, or AWS Lambda request counts. When your actual or forecasted resource consumption exceeds your target threshold, AWS Budgets sends an alert.",
  "whyItMatters": "Certain AWS services (such as cross-region data transfer or S3 storage) can accumulate vast quantities of usage before billing metrics update. Tracking pure usage volume helps platform engineers spot anomalous data generation, runaway logging, or unexpected traffic spikes before dollar costs escalate.",
  "workplaceExample": "A data analytics platform sets an S3 Usage Budget limiting S3 Standard storage to 50,000 GB-Months (50 TB) and outbound internet data transfer to 10,000 GB. When an uncompressed backup job suddenly uploads 20 TB of data in a single day, the 80% usage threshold alert fires immediately.",
  "examFocus": "For SAA-C03, know the difference between Cost Budgets and Usage Budgets: Cost Budgets measure money ($ USD), while Usage Budgets measure specific technical service consumption metrics (e.g., S3 GB-Hours, EC2 running hours, Data Transfer GB, API request counts). Both support Actual and Forecasted notification alerts.",
  "keyPoints": [
    "Tracks physical usage quantities (e.g. GB-Hours, running instance hours, request counts).",
    "Complements financial cost budgets by alerting on raw consumption spikes.",
    "Supports multiple service usage types (S3 storage, EC2 hours, DynamoDB capacity units, Data Transfer).",
    "Triggers notifications based on Actual or Forecasted usage thresholds.",
    "Can be scoped with filters by service, availability zone, instance type, or tags."
  ],
  "commonMistake": "Attempting to track data egress gigabytes using a Cost Budget. In variable pricing tiers, monitoring raw data transfer volume with a Usage Budget gives clearer operational insights and quicker alerting.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Usage Budget for S3 Storage.\nResources:\n  S3StorageUsageBudget:\n    Type: AWS::Budgets::Budget\n    Properties:\n      Budget:\n        BudgetName: MonthlyS3StorageLimit\n        BudgetType: USAGE\n        TimeUnit: MONTHLY\n        BudgetLimit:\n          Amount: 50000\n          Unit: GBN\n        CostFilters:\n          Service: 'Amazon Simple Storage Service'",
  "sources": [
    {
      "title": "Creating a Usage Budget in AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html#create-usage-budget"
    },
    {
      "title": "Managing Costs and Usage with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    }
  ]
});
