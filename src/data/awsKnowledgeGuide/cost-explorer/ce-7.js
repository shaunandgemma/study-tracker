import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-7",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Filtering Costs",
  "status": "ready",
  "plainEnglish": "Filtering Costs in AWS Cost Explorer allows you to isolate a specific subset of your AWS billing data by applying one or more categorical filters. Supported filter dimensions include AWS Service (e.g. EC2, S3), Linked Account ID, Region (e.g. us-east-1, eu-west-1), Instance Type, Purchase Option (On-Demand, Spot, Reserved), Usage Type, and Cost Allocation Tag key-value pairs.",
  "whyItMatters": "Large enterprise AWS bills contain millions of line items across hundreds of services and accounts. Filtering eliminates background noise and focuses attention directly on the exact project, environment (e.g. `Environment: Production`), or microservice you need to evaluate.",
  "workplaceExample": "During a sprint cost review, an architect applies three simultaneous filters in Cost Explorer: `Linked Account: 123456789012 (Production)`, `Service: Amazon EC2-Instances`, and `Tag: Project = PaymentGateway`. The resulting view isolates the exact monthly compute cost for the checkout system.",
  "examFocus": "For SAA-C03, know how Cost Explorer filtering operates: (1) Filters can be combined using logical AND logic across dimensions (e.g. Account A AND Service EC2 AND Region us-west-2). (2) Tag filters require Cost Allocation Tags to be activated in the Billing console. (3) Filters apply before grouping and metric calculations.",
  "keyPoints": [
    "Restricts billing reports to specific subsets of services, accounts, tags, and Regions.",
    "Supported dimensions: Service, Linked Account, Region, Instance Type, Tag, Purchase Option.",
    "Multiple filters combine with logical AND operations to narrow analysis scope.",
    "Tag filtering requires user-defined cost allocation tags to be active.",
    "Filtered views can be saved as custom reports or bookmarked for recurring reviews."
  ],
  "commonMistake": "Filtering by a newly created resource tag immediately and seeing no data. Resource tags must first be activated as Cost Allocation Tags in the AWS Billing console, and it takes up to 24 hours for tag-based billing data to populate.",
  "example": "# Query cost filtered to Amazon S3 in us-east-1 for a specific linked account:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --filter '{\"And\": [{\"Dimensions\": {\"Key\": \"SERVICE\", \"Values\": [\"Amazon Simple Storage Service\"]}}, {\"Dimensions\": {\"Key\": \"REGION\", \"Values\": [\"us-east-1\"]}}]}'",
  "sources": [
    {
      "title": "Filtering the Data That You Want to View",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-filtering.html"
    },
    {
      "title": "Reading the Cost Explorer Data Table",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-table.html"
    }
  ]
});
