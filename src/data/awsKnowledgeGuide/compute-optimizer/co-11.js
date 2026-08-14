import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-11",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "CloudWatch Metrics Analysis",
  "status": "ready",
  "plainEnglish": "CloudWatch Metrics Analysis is the underlying telemetry ingestion and processing engine that powers AWS Compute Optimizer. Compute Optimizer automatically connects to Amazon CloudWatch to ingest historical metric streams across your resources. By default, it processes the standard 14-day CloudWatch metrics history at 5-minute intervals. If you activate the Enhanced Infrastructure Metrics paid feature, Compute Optimizer extends its analysis window to 93 days (3 months) of historical CloudWatch data.",
  "whyItMatters": "Workloads that have monthly or quarterly cyclical patterns (such as end-of-month financial payroll runs or quarterly tax filings) can appear idle during a standard 14-day window. Long-term metric analysis prevents Compute Optimizer from recommending a downsizing that would cripple a monthly or quarterly batch processing event.",
  "workplaceExample": "A company runs accounting batch servers that only spin up heavy CPU on the last 3 days of every month. By enabling Enhanced Infrastructure Metrics in Compute Optimizer, the ML model reviews 90 days of CloudWatch data, successfully detects the monthly end-of-period spikes, and avoids incorrectly classifying the instances as over-provisioned.",
  "examFocus": "For SAA-C03, know that standard Compute Optimizer analyzes 14 consecutive days of CloudWatch metrics (with a minimum of 30 hours of data needed before first recommendations appear). Enhanced Infrastructure Metrics is a paid add-on that extends the analysis period to 3 months (93 days) for cyclical or seasonal workloads.",
  "keyPoints": [
    "Standard analysis processes 14 days of CloudWatch historical metrics at 5-minute resolution.",
    "Requires a minimum of 30 hours of continuous metric data to generate initial recommendations.",
    "Enhanced Infrastructure Metrics extends the lookback period to 93 days (3 months).",
    "Analyzes CPU, memory, local disk, EBS I/O, and network metrics from CloudWatch.",
    "Can ingest custom memory metrics published by the unified CloudWatch Agent or partner APM agents."
  ],
  "commonMistake": "Analyzing highly seasonal or monthly billing workloads using only the default 14-day lookback period, which may lead to premature downsizing before month-end processing spikes. Enable Enhanced Infrastructure Metrics for 3-month lookback.",
  "example": "# Enable Enhanced Infrastructure Metrics for an account in Compute Optimizer:\naws compute-optimizer update-enrollment-status \\\n  --status Active \\\n  --include-member-accounts",
  "sources": [
    {
      "title": "CloudWatch Metrics Analyzed by AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html"
    },
    {
      "title": "Enhanced Infrastructure Metrics in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/enhanced-infrastructure-metrics.html"
    }
  ]
});
