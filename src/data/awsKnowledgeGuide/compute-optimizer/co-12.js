import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-12",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Rightsizing for Cost and Performance",
  "status": "ready",
  "plainEnglish": "Rightsizing for Cost and Performance is the continuous architectural process of aligning your cloud compute, storage, and serverless resources with actual demand while achieving the lowest possible cost. In AWS Compute Optimizer, rightsizing goes beyond simple server downsizing; it involves migrating to newer instance generations (e.g. m5 to m6i/m7g), switching to specialized silicon (like AWS Graviton or AWS Inferentia), tuning provisioned EBS IOPS, and optimizing container/serverless memory allocations.",
  "whyItMatters": "Rightsizing is the primary pillar of the AWS Well-Architected Cost Optimization framework. Organizations that practice systematic rightsizing consistently reduce their AWS infrastructure spend by 25% to 40% while simultaneously boosting application performance by leveraging modern AWS custom silicon.",
  "workplaceExample": "A SaaS engineering team establishes a bi-weekly rightsizing sprint. Using Compute Optimizer exports in Amazon QuickSight, they rightsize 200 EC2 instances and 80 ECS tasks, migrating suitable workloads to AWS Graviton3 (c7g instances) and saving $25,000 per month while improving p99 API response times by 18%.",
  "examFocus": "For SAA-C03, remember that rightsizing should always be performed BEFORE purchasing long-term pricing commitments (such as 1-year or 3-year Reserved Instances or Savings Plans). If you purchase commitments on oversized instances, you lock in the cost of unused capacity for years.",
  "keyPoints": [
    "Continuous process of matching resource allocations to real-world workload demand.",
    "Combines downsizing, generational instance upgrades, and architecture migrations (e.g. Graviton).",
    "Should always be completed BEFORE purchasing Reserved Instances or Savings Plans commitments.",
    "Balances financial savings against operational performance risk.",
    "Applies across EC2, Auto Scaling groups, EBS volumes, Lambda functions, and ECS on Fargate."
  ],
  "commonMistake": "Purchasing 3-year All Upfront Reserved Instances or Savings Plans before rightsizing your infrastructure. Always rightsize first with Compute Optimizer, then commit to Savings Plans for the optimized baseline.",
  "example": "# Filter and summarize monthly savings potential across an organization:\naws compute-optimizer get-enrollment-statuses-for-organization \\\n  --query 'accountEnrollmentStatuses[*].[accountId,status]'",
  "sources": [
    {
      "title": "AWS Well-Architected Framework: Cost Optimization Pillar - Rightsizing",
      "url": "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/right-sizing.html"
    },
    {
      "title": "Getting Started with AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/getting-started.html"
    }
  ]
});
