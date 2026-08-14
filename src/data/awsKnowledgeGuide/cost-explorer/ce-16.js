import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-16",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost Anomaly Investigation",
  "status": "ready",
  "plainEnglish": "Cost Anomaly Investigation in AWS Cost Explorer is the troubleshooting workflow used to diagnose unexpected spending spikes detected by AWS Cost Anomaly Detection or spotted on daily cost charts. Using daily granularity, service filters, and usage-type groupings in Cost Explorer, you can drill down from an aggregate account-level cost jump to the exact AWS service, API operation, Region, and individual resource responsible.",
  "whyItMatters": "Unintended infrastructure leaks (such as runaway recursive Lambda functions, unclosed NAT Gateway data loops, or leaked secrets used for unauthorized crypto-mining) can cost thousands of dollars within hours. A structured anomaly investigation workflow pinpoints the root cause rapidly before bills spiral out of control.",
  "workplaceExample": "AWS Cost Anomaly Detection fires an alert: Amazon DynamoDB spend spiked by $4,000 yesterday in account `112233445566`. The engineer opens Cost Explorer, filters by that account and DynamoDB, sets daily granularity, and groups by `UsageType`. They immediately discover `TimedStorage-ByteHrs` did not change, but `PayPerRequestThroughput` exploded due to a recursive polling loop in a newly deployed ECS task.",
  "examFocus": "For SAA-C03, understand the triage sequence for unexpected billing spikes: (1) Check AWS Cost Anomaly Detection for root-cause summaries and affected resource ARNs. (2) Open Cost Explorer with Daily granularity to determine the exact start date of the spike. (3) Group by `Service` to find the culprit product. (4) Filter to that service and group by `UsageType` / `API Operation` to isolate the exact technical activity.",
  "keyPoints": [
    "Troubleshooting workflow to diagnose root causes of unexpected billing spikes.",
    "Combines daily granularity with multi-dimensional filtering (Service, Account, Region).",
    "Group by UsageType and Operation to identify specific API calls driving spend.",
    "Integrates with AWS Cost Anomaly Detection (which uses ML to flag anomalies automatically).",
    "Allows comparing pre-anomaly vs post-anomaly spending baselines."
  ],
  "commonMistake": "Stopping the investigation after identifying the service (e.g. knowing Amazon S3 is the culprit). You must group by `UsageType` to see whether S3 costs are driven by Storage, PUT API requests, or Data Transfer Out.",
  "example": "# Query daily cost for a specific anomalous service over a 7-day window:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-08-01,End=2026-08-08 \\\n  --granularity DAILY \\\n  --metrics \"UnblendedCost\" \\\n  --filter '{\"Dimensions\": {\"Key\": \"SERVICE\", \"Values\": [\"Amazon DynamoDB\"]}}' \\\n  --group-by Type=DIMENSION,Key=USAGE_TYPE",
  "sources": [
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Using AWS Cost Anomaly Detection",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/CostAnomalyDetection.html"
    }
  ]
});
