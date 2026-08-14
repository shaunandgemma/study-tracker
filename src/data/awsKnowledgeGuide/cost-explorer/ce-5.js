import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-5",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Historical Cost Analysis",
  "status": "ready",
  "plainEnglish": "Historical Cost Analysis in AWS Cost Explorer is the capability to inspect, compare, and analyze up to 14 months of past AWS billing and usage data. You can examine spending trends over time, compare month-over-month or quarter-over-quarter growth, identify seasonal cost peaks, and trace the financial impact of past architectural or deployment migrations.",
  "whyItMatters": "Without historical cost data, engineering leaders cannot tell if a sudden $5,000 increase in Amazon RDS costs is part of normal cyclical quarter-end traffic or an unintended infrastructure leak. Multi-month historical trends provide context for budget planning and capacity forecasting.",
  "workplaceExample": "A SaaS provider reviews its last 12 months of AWS spend before negotiating an enterprise discount. By analyzing historical daily spend trends across all member accounts, they discover that compute spend reliably doubles every December due to holiday retail traffic and drops back down in February.",
  "examFocus": "For SAA-C03, remember: (1) Cost Explorer stores up to 14 months of historical cost and usage records. (2) You can view data at monthly or daily granularity (and hourly for up to 14 days if hourly granularity is enabled). (3) Allows filtering by time periods to compare year-over-year or month-over-month trends.",
  "keyPoints": [
    "Stores and visualizes up to 14 months of historical billing and usage records.",
    "Enables month-over-month, quarter-over-quarter, and seasonal spend comparisons.",
    "Supports daily granularity across the entire 14-month historical period.",
    "Hourly granularity available for the last 14 days (with opt-in activation).",
    "Helps evaluate the ROI of architectural migrations and cost-optimization efforts."
  ],
  "commonMistake": "Assuming historical data is retained forever in Cost Explorer. AWS Cost Explorer retains data for 14 months; if long-term multi-year historical archives are required for compliance or tax auditing, export AWS Cost and Usage Reports (CUR) to Amazon S3.",
  "example": "# Compare costs across two distinct historical months via AWS CLI:\naws ce get-cost-and-usage \\\n  --time-period Start=2025-08-01,End=2026-08-01 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=DIMENSION,Key=SERVICE",
  "sources": [
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Understanding Your Costs Using Cost Explorer Reports",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-reports.html"
    }
  ]
});
