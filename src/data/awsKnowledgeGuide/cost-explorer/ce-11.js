import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-11",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost by Region",
  "status": "ready",
  "plainEnglish": "Cost by Region in AWS Cost Explorer groups and filters your cloud expenses by the AWS geographic Region where the infrastructure was provisioned (such as `us-east-1`, `eu-west-1`, or `ap-southeast-1`), or as `Global` for region-less services like Amazon Route 53, AWS IAM, AWS WAF, and Amazon CloudFront.",
  "whyItMatters": "Resource provisioning across unauthorized or unexpected AWS Regions is a common source of security vulnerabilities and surprise billing. Cost by Region immediately exposes rogue workloads deployed in unapproved overseas regions and helps evaluate cross-region disaster recovery costs.",
  "workplaceExample": "A UK-based company with strict GDPR compliance policies groups Cost Explorer by Region. They spot a $4,500 monthly charge in `ap-northeast-1` (Tokyo). Investigation reveals a developer accidentally deployed test GPU EC2 instances in Tokyo instead of `eu-west-2` (London) and forgot to tear them down.",
  "examFocus": "For SAA-C03, know how regional pricing and analysis work in Cost Explorer: (1) AWS service pricing varies significantly between Regions (e.g. `us-east-1` is often cheaper than `sa-east-1` or `ap-northeast-1`). (2) Global services (Route 53, CloudFront, IAM) appear under the `Global` region dimension. (3) Grouping by Region highlights multi-region deployment spend.",
  "keyPoints": [
    "Breaks down spending by AWS geographic Region (e.g. us-east-1, eu-central-1).",
    "Categorizes global services (Route 53, CloudFront, IAM, WAF) under `Global`.",
    "Exposes rogue or accidental workloads spun up in unapproved AWS regions.",
    "Helps calculate the infrastructure cost of Multi-Region Disaster Recovery architectures.",
    "Highlights regional pricing differentials across global enterprise deployments."
  ],
  "commonMistake": "Searching for CloudFront or Route 53 costs under a specific physical Region like `us-east-1`. Global services do not belong to a specific AWS Region and are categorized under `Global` in Cost Explorer.",
  "example": "# Query monthly spend grouped by AWS Region:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=DIMENSION,Key=REGION",
  "sources": [
    {
      "title": "Filtering Data by Region in AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-filtering.html"
    },
    {
      "title": "Reading the Cost Explorer Data Table",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-table.html"
    }
  ]
});
