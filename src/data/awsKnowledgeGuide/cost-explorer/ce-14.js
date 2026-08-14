import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-14",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Savings Plans Utilization and Coverage",
  "status": "ready",
  "plainEnglish": "Savings Plans Utilization and Coverage are two core reporting tools in AWS Cost Explorer designed to track and optimize your commitment-based compute discounts (Compute Savings Plans, EC2 Instance Savings Plans, and SageMaker Savings Plans). (1) Savings Plans Utilization shows the percentage of your committed hourly dollar spend (e.g. $10/hour commitment) that is actively applied to eligible AWS usage. (2) Savings Plans Coverage shows the percentage of your total eligible compute spend that is covered by your Savings Plans discounts versus being billed at standard On-Demand rates.",
  "whyItMatters": "Savings Plans offer up to 72% discounts on Amazon EC2, AWS Fargate, AWS Lambda, and Amazon SageMaker in exchange for a committed hourly spend (e.g., $15/hour for 1 or 3 years). Tracking utilization ensures you are not paying for unused commitment dollars, while tracking coverage reveals whether you have uncovered compute spend that could benefit from additional Savings Plans.",
  "workplaceExample": "A cloud architect reviews the Savings Plans reports in Cost Explorer. The Utilization report indicates 99.8% utilization (near-perfect efficiency). However, the Coverage report shows that only 55% of the company's daily EC2 and Fargate compute spend is covered. By committing to an additional $8/hour Compute Savings Plan, the company saves an extra $2,800 per month.",
  "examFocus": "For SAA-C03, compare Savings Plans with Reserved Instances: (1) Savings Plans commit to a dollar amount per hour ($/hr), whereas standard RIs commit to specific instance types/quantities. (2) Compute Savings Plans automatically apply across EC2, Fargate, and Lambda regardless of instance family, OS, Region, or tenancy. (3) EC2 Instance Savings Plans apply to a specific instance family in a specific Region (e.g. `m5` in `us-east-1`).",
  "keyPoints": [
    "Utilization tracks the percentage of your hourly dollar commitment actively consumed.",
    "Coverage tracks the percentage of eligible compute spend discounted by Savings Plans.",
    "Compute Savings Plans automatically cover EC2, Fargate, and Lambda across Regions.",
    "EC2 Instance Savings Plans offer higher discounts for a specific instance family in a Region.",
    "Cost Explorer provides automated recommendations for optimal Savings Plans commitment amounts."
  ],
  "commonMistake": "Purchasing a Savings Plan that covers 100% of peak scaling traffic. Savings Plans should cover stable baseline compute spend; variable spiky workloads above the baseline should be handled by Spot Instances or On-Demand to avoid paying for unused commitment during off-peak hours.",
  "example": "# Query Savings Plans coverage data for the past 30 days:\naws ce get-savings-plans-coverage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY",
  "sources": [
    {
      "title": "Understanding Savings Plans in Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-sp.html"
    },
    {
      "title": "Using Savings Plans Reports in AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-utilization-coverage.html"
    }
  ]
});
