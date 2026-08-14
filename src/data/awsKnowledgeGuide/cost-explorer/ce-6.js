import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-6",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost Forecasting",
  "status": "ready",
  "plainEnglish": "Cost Forecasting in AWS Cost Explorer uses machine learning (ML) models trained on your historical usage and spending patterns to predict your future AWS bills up to 12 months ahead. Cost Explorer automatically calculates prediction confidence intervals (e.g. 80% confidence upper and lower bounds), adjusting for day-of-week trends and ongoing growth rates.",
  "whyItMatters": "Cloud billing surprises often happen at the end of the month when invoices arrive. Cost Forecasting allows finance and engineering managers to see where their spend is headed mid-month, enabling them to make proactive adjustments before overspending their allocated budget.",
  "workplaceExample": "On day 10 of the billing cycle, a startup's engineering director checks the Cost Explorer forecast. Based on early-month database traffic, the forecast projects an end-of-month spend of $18,000 against a $12,000 budget. The director discovers unindexed queries overloading Aurora read replicas and deploys query caching, bringing the forecasted total back to $11,500.",
  "examFocus": "For SAA-C03, know the key parameters of Cost Explorer Forecasting: (1) Forecasts up to 12 months into the future. (2) Requires at least a full current billing cycle of historical data to generate accurate forecasts. (3) You can forecast filtered scopes (e.g. forecast spend for Amazon EC2 in `us-east-1` for a specific Linked Account). (4) Prediction interval (e.g. 80%) shows expected variance.",
  "keyPoints": [
    "Uses machine learning to forecast future AWS costs and usage up to 12 months ahead.",
    "Calculates prediction intervals (upper and lower bounds) based on historical variance.",
    "Supports forecasting for specific services, linked accounts, tags, and Regions.",
    "Requires sufficient historical data (at least 1 full billing cycle) for reliable models.",
    "Integrates with AWS Budgets to alert when forecasted spend exceeds budget limits."
  ],
  "commonMistake": "Assuming Cost Explorer forecasting accounts for future planned workload changes. Forecasting is purely statistical extrapolation based on past usage; it cannot anticipate a planned new product launch next week unless you account for it manually.",
  "example": "# Retrieve cost forecast for the remainder of the current month via AWS CLI:\naws ce get-cost-forecast \\\n  --time-period Start=2026-08-15,End=2026-08-31 \\\n  --metric UNBLENDED_COST \\\n  --granularity MONTHLY \\\n  --prediction-interval-level 80",
  "sources": [
    {
      "title": "Forecasting with Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-forecast.html"
    },
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    }
  ]
});
