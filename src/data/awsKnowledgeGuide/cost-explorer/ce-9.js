import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-9",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Cost by Service",
  "status": "ready",
  "plainEnglish": "Cost by Service is one of the most fundamental and frequently used default views in AWS Cost Explorer. It organizes and displays your cloud expenses broken down by individual AWS services (such as Amazon Elastic Compute Cloud - Compute, Amazon Relational Database Service, Amazon Simple Storage Service, and AWS Lambda), allowing you to immediately pinpoint which cloud products account for the largest shares of your bill.",
  "whyItMatters": "In complex multi-tier cloud environments, thousands of AWS services can be spun up simultaneously. The Cost by Service breakdown allows FinOps professionals and architects to apply the Pareto principle (80/20 rule): 80% of costs typically stem from the top 3 or 4 services (e.g. EC2, RDS, S3), allowing optimization efforts to focus where ROI is highest.",
  "workplaceExample": "A company discovers their monthly AWS bill increased by $8,000. Viewing Cost by Service reveals that Amazon EC2 spend remained flat at $10,000, S3 spend was flat at $2,000, but Amazon DynamoDB jumped from $500 to $8,500 due to unintended provisioned write capacity on a logging table, pinpointing the issue immediately.",
  "examFocus": "For SAA-C03, know that Cost by Service is the default starting point for bill investigations. Note that certain AWS services appear as multiple sub-services in billing dimensions (e.g. `Amazon Elastic Compute Cloud - Compute`, `Amazon Elastic Block Store`, and `EC2 - Other` for NAT Gateways and Elastic IPs).",
  "keyPoints": [
    "Default breakdown showing spend distribution across all active AWS services.",
    "Quickly identifies top cost drivers across enterprise cloud environments.",
    "EC2 is typically split into Compute, EBS storage, and EC2-Other (NAT Gateways/EIPs).",
    "Enables drill-down by service into specific Usage Types and API operations.",
    "Accessible through pre-configured default Cost Explorer reports."
  ],
  "commonMistake": "Overlooking `EC2 - Other` in Cost by Service reports. Many architects assume EC2 charges only include instance vCPU/RAM; `EC2 - Other` contains NAT Gateway processing charges, unattached Elastic IPs, and EBS snapshots which can add up to thousands of dollars.",
  "example": "# Query top 5 AWS services by unblended cost for the past month:\naws ce get-cost-and-usage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --granularity MONTHLY \\\n  --metrics \"UnblendedCost\" \\\n  --group-by Type=DIMENSION,Key=SERVICE",
  "sources": [
    {
      "title": "Using the Default Cost Explorer Reports",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-default-reports.html"
    },
    {
      "title": "Analyzing Your Costs and Usage with AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
    }
  ]
});
