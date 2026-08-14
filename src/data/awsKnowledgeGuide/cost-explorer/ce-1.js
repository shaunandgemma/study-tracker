import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-1",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Visualize Historical & Forecasted AWS Cost and Usage Data",
  "status": "ready",
  "plainEnglish": "AWS Cost Explorer is a native visualization and financial analytics tool that allows you to view, analyze, and forecast your AWS spending and usage patterns over time. It provides interactive charts and tabular reports that let you examine historical spend up to the past 14 months, view daily or monthly costs, and generate machine-learning-based forecasts for up to the next 12 months.",
  "whyItMatters": "Cloud spending can grow unpredictably if teams lack visibility into which services, accounts, or teams are driving costs. Cost Explorer transforms complex AWS billing line items into intuitive visual dashboards, helping cloud architects identify runaway spending, spot cost anomalies, and budget accurately for future workloads.",
  "workplaceExample": "A Chief Financial Officer (CFO) notices the monthly AWS cloud bill jumped by 30%. Using Cost Explorer, the cloud operations team builds a monthly breakdown chart filtered to the last 6 months, instantly discovering that newly spun up Amazon OpenSearch clusters in the development account were left running unmonitored over the weekend.",
  "examFocus": "For SAA-C03, remember the key capabilities and limits of AWS Cost Explorer: (1) Historical data depth: Up to 14 months of historical cost and usage data. (2) Forecasting horizon: Forecasts future spend up to 12 months ahead with configurable prediction intervals (e.g. 80% confidence). (3) Granularity: Supports Monthly, Daily, and Hourly (when enabled for EC2/Savings Plans) granularity. (4) Not enabled by default—must be explicitly activated in the Billing console (free of charge).",
  "keyPoints": [
    "Interactive UI tool to visualize, understand, and manage AWS cost and usage over time.",
    "Provides up to 14 months of historical data and up to 12 months of future forecasting.",
    "Granularity options: Monthly, Daily, and Hourly (opt-in for hourly resource data).",
    "Enabled via AWS Billing and Cost Management console with no additional charge.",
    "Includes pre-built default reports: Monthly costs by service, Daily spend, and RI/SP coverage."
  ],
  "commonMistake": "Expecting Cost Explorer to have data immediately upon creating a new AWS account. Cost Explorer must be enabled first, and it typically takes up to 24 hours to generate its initial historical dataset.",
  "example": "# Query historical cost and usage data via AWS CLI for the last 30 days:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \"UsageQuantity\" \\\n  --group-by Type=DIMENSION,Key=SERVICE",
  "sources": [
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Forecasting with Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-forecast.html"
    }
  ]
});
