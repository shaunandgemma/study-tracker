import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-12",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost Allocation Tags",
  "status": "ready",
  "plainEnglish": "Cost Allocation Tags are key-value metadata labels assigned to AWS resources (such as `Environment: Production`, `CostCenter: 1042`, or `Project: Atlas`) that are explicitly activated in the AWS Billing and Cost Management console. Once activated, AWS organizes your billing data using these tag keys, enabling you to filter and group costs in Cost Explorer, AWS Budgets, and Cost and Usage Reports (CUR).",
  "whyItMatters": "Multiple applications, development squads, and microservices often share the same AWS account or VPC. Without Cost Allocation Tags, all charges are blended into a single unassigned bill, making it impossible to attribute costs to specific applications, cost centers, or product owners.",
  "workplaceExample": "A company activates the `CostCenter` and `Environment` tags. All CloudFormation and Terraform modules are updated to require these tags. When the monthly AWS bill is generated, Cost Explorer groups spend by `CostCenter`, allowing the accounting team to automatically invoice the correct engineering department with zero manual spreadsheet reconciliation.",
  "examFocus": "For SAA-C03, remember these crucial tag rules: (1) Applying a tag to an EC2 or S3 resource does NOT automatically make it a cost allocation tag; you MUST explicitly activate it in the Billing and Cost Management console. (2) Two types: AWS-Generated tags (e.g. `aws:createdBy`, prefixed with `aws:`) and User-Defined tags (prefixed with `user:`). (3) Cost allocation tags only apply to costs incurred AFTER activation—they do NOT apply retroactively to past bills.",
  "keyPoints": [
    "Key-value metadata labels used to organize and track AWS costs on a detailed level.",
    "Must be explicitly activated in the AWS Billing and Cost Management console.",
    "Two types: AWS-Generated tags (`aws:createdBy`) and User-Defined tags.",
    "Tags only apply to costs incurred AFTER activation; they are NOT retroactive.",
    "Enables filtering and grouping in Cost Explorer, AWS Budgets, and Cost and Usage Reports.",
    "Enforce tagging compliance using AWS Organizations Tag Policies and SCPs."
  ],
  "commonMistake": "Expecting newly activated Cost Allocation Tags to categorize previous months of spending. Cost allocation tags are forward-looking only; they start tracking costs from the moment they are activated in the Billing console forward.",
  "example": "# Query costs grouped by a User-Defined Cost Allocation Tag ('user:Project'):\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=TAG,Key=\"user:Project\"",
  "sources": [
    {
      "title": "Using Cost Allocation Tags in AWS Billing",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/cost-alloc-tags.html"
    },
    {
      "title": "Activating User-Defined Cost Allocation Tags",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/activate-tags.html"
    }
  ]
});
