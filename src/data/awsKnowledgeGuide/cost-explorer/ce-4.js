import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-4",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost Explorer Cost and Usage Analysis",
  "status": "ready",
  "plainEnglish": "Cost Explorer Cost and Usage Analysis is the core reporting interface in AWS Cost Explorer that allows you to slice, dice, and evaluate your infrastructure spend using diverse financial cost metrics (such as Unblended Costs, Amortized Costs, Net Unblended Costs, and Net Amortized Costs) and usage types (such as GB-hours, IOPS, data transfer gigabytes, and vCPU-hours).",
  "whyItMatters": "Raw dollar figures alone don't explain why a bill changed. Cost and Usage Analysis lets you distinguish between price changes (like purchasing a Reserved Instance) and consumption changes (like doubling data egress traffic), giving engineers actionable insights to eliminate idle waste.",
  "workplaceExample": "A fintech company experiences high Amazon S3 costs. Using Cost and Usage Analysis, the team switches the chart metric to `UsageQuantity` and groups by `UsageType`. They discover that 80% of S3 costs are driven by `DataTransfer-Out-Bytes` (egress traffic to third-party APIs) rather than storage volume, prompting them to implement CloudFront caching.",
  "examFocus": "For SAA-C03, understand the key metric definitions: (1) `Unblended Cost`: The actual cash cost charged on the day of the invoice. (2) `Amortized Cost`: Spreads upfront or recurring Reserved Instance / Savings Plans commitment fees evenly across the reservation term. (3) `Blended Cost`: Average rate across linked accounts in AWS Organizations consolidated billing.",
  "keyPoints": [
    "Analyzes AWS spending across both financial cost and physical usage quantity metrics.",
    "Unblended Cost represents cash accounting charges as billed on the invoice date.",
    "Amortized Cost distributes upfront/recurring reservation fees evenly over time.",
    "Blended Cost averages rates across member accounts in consolidated billing.",
    "Allows deep inspection of specific usage types (e.g. data transfer, IOPS, storage GB-Mo)."
  ],
  "commonMistake": "Analyzing upfront Reserved Instance purchases using Unblended Cost alone. An all-upfront RI will show a massive spike on Day 1 and $0 for the remaining 364 days; use Amortized Cost to see the true daily operating cost of the reserved servers.",
  "example": "# Query amortized costs grouped by service for the previous month:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-06-01,End=2026-06-30 \\\n  --granularity MONTHLY \\\n  --metrics \"AmortizedCost\" \\\n  --group-by Type=DIMENSION,Key=SERVICE",
  "sources": [
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Reading the Cost Explorer Data Table and Metrics",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-table.html"
    }
  ]
});
