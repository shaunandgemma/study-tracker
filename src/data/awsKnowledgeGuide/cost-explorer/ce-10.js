import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-10",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost by Account",
  "status": "ready",
  "plainEnglish": "Cost by Account in AWS Cost Explorer aggregates and compares spending across individual member (linked) AWS accounts within an AWS Organization using Consolidated Billing. When accessed from the management (payer) account, Cost Explorer provides a single pane of glass showing the exact dollar amounts billed to each development, staging, production, and shared services account.",
  "whyItMatters": "Multi-account AWS architectures are the industry best practice for security and environment isolation. Cost by Account enables financial transparency and chargeback mechanisms, allowing finance teams to invoice individual business units or departments based on their specific account usage.",
  "workplaceExample": "An enterprise with 50 AWS accounts groups Cost Explorer by `Linked Account`. They see that the Marketing Analytics account spent $22,000 this month, while the Core Banking account spent $15,000. Finance uses these exact figures to debit the corresponding department cost centers during monthly accounting close.",
  "examFocus": "For SAA-C03, know how multi-account billing works in Cost Explorer: (1) The Management (Payer) account sees cost data across ALL member accounts in the organization. (2) Member (Linked) accounts see only their own costs and usage data by default. (3) Volume discounts and Savings Plans / RI sharing can be managed at the organization level or disabled per linked account.",
  "keyPoints": [
    "Breaks down spending across linked member accounts in AWS Organizations.",
    "Management account has full visibility into all member accounts in the organization.",
    "Member accounts see only their own local account cost and usage by default.",
    "Enables accurate showback and chargeback accounting across departments.",
    "Supports filtering by individual account ID to isolate department workloads."
  ],
  "commonMistake": "Attempting to view company-wide multi-account spending from a member account. Only IAM principals inside the AWS Organizations Management (payer) account have organization-wide Cost Explorer access.",
  "example": "# Query monthly spend grouped by Linked Account ID:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=DIMENSION,Key=LINKED_ACCOUNT",
  "sources": [
    {
      "title": "Consolidated Billing for AWS Organizations",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/consolidated-billing.html"
    },
    {
      "title": "Filtering and Grouping by Linked Account in Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-filtering.html"
    }
  ]
});
