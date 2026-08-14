import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-17",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost Explorer vs AWS Budgets",
  "status": "ready",
  "plainEnglish": "AWS Cost Explorer and AWS Budgets are two complementary AWS financial management services that serve different operational purposes. (1) AWS Cost Explorer is an exploratory, retrospective, and analytical tool used for visual inspection, multi-dimensional filtering, and deep-dive root-cause analysis of historical and forecasted spending. (2) AWS Budgets is a proactive governance and alerting tool that lets you set custom financial spending thresholds and automatically triggers notifications (via email or SNS) or automated remediation actions (such as stopping EC2 instances or applying restrictive IAM policies) when actual or forecasted spend exceeds your budget limit.",
  "whyItMatters": "Using only Cost Explorer requires manual human review—meaning you only notice overspending when someone logs in to look at charts. AWS Budgets acts as an automated 24/7 financial sentry that alerts you the instant spending crosses budget thresholds, while Cost Explorer is the tool you open to investigate why the alert fired.",
  "workplaceExample": "A company sets an AWS Budget of $10,000 for the staging account with an alert set at 80% ($8,000). On day 18, the budget triggers an email notification to the engineering lead that forecasted spend will hit $11,200. The engineer opens Cost Explorer to investigate which service caused the spike, finds an unneeded RDS replica, and terminates it before exceeding the monthly budget.",
  "examFocus": "For SAA-C03, compare the two services: (1) Choose AWS Budgets when the question asks for automated alerts, thresholds, proactive notifications (email/SNS), or automated budget actions (stopping instances). (2) Choose AWS Cost Explorer when the question asks to visualize historical trends, generate graphs, drill into multi-month breakdowns, or view RI/Savings Plans coverage and rightsizing recommendations.",
  "keyPoints": [
    "Cost Explorer: Interactive visual analysis, historical trends (14 months), and RI/SP recommendations.",
    "AWS Budgets: Proactive financial thresholds, automated notifications (email/SNS), and automated actions.",
    "Cost Explorer answers 'Why did spending increase?' through multidimensional filtering.",
    "AWS Budgets answers 'Am I exceeding my budget?' through automated threshold monitoring.",
    "AWS Budgets can trigger automated actions (stop EC2/RDS, apply SCPs, trigger Lambda).",
    "Both tools share the same underlying AWS Billing and Cost Management data feed."
  ],
  "commonMistake": "Selecting Cost Explorer on exam questions asking to send automated email alerts when monthly spend exceeds $5,000. Cost Explorer does not send automated threshold alerts; AWS Budgets is the alerting tool.",
  "example": "# Comparison workflow: Set a budget threshold via AWS CLI, then investigate in Cost Explorer:\naws budgets create-budget \\\n  --account-id 123456789012 \\\n  --budget file://monthly-budget.json \\\n  --notifications-with-subscribers file://budget-notifications.json",
  "sources": [
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    },
    {
      "title": "Managing Your Costs with AWS Budgets",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
    }
  ]
});
