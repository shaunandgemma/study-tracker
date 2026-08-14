import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-15",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Rightsizing Recommendations",
  "status": "ready",
  "plainEnglish": "Rightsizing Recommendations in AWS Cost Explorer is an automated cost-optimization feature that analyzes Amazon EC2 instance CloudWatch performance metrics (specifically CPU, memory, and network utilization over a 14-day lookback period) to identify underutilized or idle virtual servers. It recommends downsizing to a smaller, cheaper instance type within the same or different instance family, or terminating completely idle instances.",
  "whyItMatters": "Developers often over-provision EC2 instances (e.g. choosing a 16-vCPU `c5.4xlarge` when average CPU utilization never exceeds 5%). Rightsizing Recommendations eliminates guesswork by calculating the exact projected monthly savings of downsizing or terminating over-provisioned compute capacity.",
  "workplaceExample": "A DevOps team runs 40 EC2 instances for background batch processing. Cost Explorer Rightsizing Recommendations identifies 15 instances averaging under 4% CPU utilization and recommends downsizing them from `m5.2xlarge` to `m5.large`. Implementing the downsizing cuts compute spending by $2,100 per month with zero performance degradation.",
  "examFocus": "For SAA-C03, know how Rightsizing Recommendations function: (1) Analyzes historical EC2 CloudWatch metrics over the past 14 days. (2) Identifies instances as Underutilized or Idle. (3) Recommendations include: Downsizing within the same family (e.g. `c5.2xlarge` to `c5.xlarge`), Cross-family downsizing (e.g. `c5` to `m6g` Graviton), or Terminating idle instances. (4) Can be customized with user-defined CPU thresholds (e.g. trigger recommendation if CPU < 20%).",
  "keyPoints": [
    "Analyzes EC2 CloudWatch utilization metrics over a 14-day evaluation window.",
    "Flags EC2 instances that are idle or consistently underutilized.",
    "Recommends specific target instance types and calculates estimated monthly dollar savings.",
    "Supports intra-family downsizing, cross-family modernization, and termination of idle servers.",
    "Allows customizing CPU and memory target thresholds for conservative or aggressive savings.",
    "Integrates closely with AWS Compute Optimizer for advanced machine-learning recommendations."
  ],
  "commonMistake": "Downsizing an instance based solely on low CPU utilization without checking memory utilization. Basic CloudWatch does not collect memory metrics unless the CloudWatch Agent is installed; downsizing a low-CPU but high-RAM instance could cause Out-Of-Memory (OOM) crashes.",
  "example": "# Query Rightsizing recommendations via AWS CLI:\naws ce get-rightsizing-recommendation \\\n  --service \"AmazonEC2\" \\\n  --configuration '{\"RecommendationTarget\":\"SAME_INSTANCE_FAMILY\",\"BenefitsConsidered\":true}'",
  "sources": [
    {
      "title": "Optimizing Your Cost with Rightsizing Recommendations",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html"
    },
    {
      "title": "Understanding Rightsizing Recommendation Calculations",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/understanding-rr-calc.html"
    }
  ]
});
