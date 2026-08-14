import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-8",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Grouping Costs",
  "status": "ready",
  "plainEnglish": "Grouping Costs in AWS Cost Explorer splits your aggregated spending data into categorized color-coded chart segments and rows based on a chosen dimension or tag. Common grouping dimensions include Service, Linked Account, Region, Instance Type, Usage Type, Charge Type, Purchase Option, and Cost Allocation Tag keys (such as `CostCenter` or `Owner`).",
  "whyItMatters": "Looking at total AWS spend as a single bar chart doesn't reveal which team or service is driving expenses. Grouping costs breaks that total down into visual, proportional slices, instantly showing whether compute, database, or network transfer represents the bulk of your invoice.",
  "workplaceExample": "An IT director reviews a company-wide AWS monthly spend of $50,000. By grouping the chart by `Linked Account`, they immediately see that Account A (Data Engineering) accounts for $32,000, Account B (Web App) accounts for $12,000, and Account C (Dev Sandbox) accounts for $6,000, making internal chargebacks straightforward.",
  "examFocus": "For SAA-C03, know how Grouping works in Cost Explorer: (1) You can group by up to two dimensions in the UI (e.g. Group by Service, then by Region). (2) In the Cost Explorer API (`GetCostAndUsage`), you can group by up to two `GroupDefinitions` (DIMENSION or TAG). (3) Grouping by Cost Allocation Tag separates spend by business departments or project owners.",
  "keyPoints": [
    "Splits aggregated billing data into categorized segments and tabular rows.",
    "Available grouping dimensions: Service, Linked Account, Region, Instance Type, Tag, Usage Type.",
    "Supports grouping by up to two dimensions simultaneously in Cost Explorer.",
    "Enables chargeback and showback reporting across business units and cost centers.",
    "Works seamlessly in conjunction with filters to provide targeted cost breakdowns."
  ],
  "commonMistake": "Grouping by a tag when many resources lack that tag. Un-tagged resources will be lumped together into a large `No tag key` category, making it difficult to allocate costs accurately.",
  "example": "# Query monthly spend grouped by both Service and Linked Account:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=DIMENSION,Key=SERVICE Type=DIMENSION,Key=LINKED_ACCOUNT",
  "sources": [
    {
      "title": "Reading the Cost Explorer Data Table and Groupings",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-table.html"
    },
    {
      "title": "Filtering and Grouping Data in AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-filtering.html"
    }
  ]
});
