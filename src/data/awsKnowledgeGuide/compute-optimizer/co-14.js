import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-14",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Compute Optimizer vs Trusted Advisor",
  "status": "ready",
  "plainEnglish": "AWS Compute Optimizer and AWS Trusted Advisor are two distinct AWS optimization tools with different scopes and capabilities. AWS Compute Optimizer uses advanced machine learning models to provide in-depth, multi-dimensional rightsizing recommendations across specific compute and storage resources (EC2, ASG, EBS, Lambda, ECS Fargate). AWS Trusted Advisor is a broader account-wide advisory tool that evaluates your entire AWS environment against five best practice pillars: Cost Optimization, Security, Fault Tolerance, Performance, and Service Quotas.",
  "whyItMatters": "While Trusted Advisor provides basic threshold checks for idle resources (such as unattached Elastic IPs or low-utilization EC2 instances), it does not use ML models to evaluate multi-dimensional workload demand curves, predict memory headroom, or suggest cross-family Graviton migrations. Compute Optimizer provides the deep ML engineering needed for precision rightsizing.",
  "workplaceExample": "A cloud architect uses AWS Trusted Advisor to detect exposed S3 buckets and security group misconfigurations across their AWS Organization. They use AWS Compute Optimizer to generate exact instance-type migration roadmaps and calculate risk scores for their 300 production EC2 instances.",
  "examFocus": "For SAA-C03, compare the two services: AWS Trusted Advisor covers 5 broad pillars (Cost, Security, Fault Tolerance, Performance, Service Limits) with rule-based checks (e.g. idle DB instances, MFA on root). AWS Compute Optimizer focuses specifically on ML-driven rightsizing recommendations for EC2, ASG, EBS, Lambda, and ECS Fargate.",
  "keyPoints": [
    "Compute Optimizer: ML-driven rightsizing engine for compute, storage, and serverless resources.",
    "Trusted Advisor: Broad account-wide auditor across 5 pillars (Cost, Security, Reliability, Performance, Quotas).",
    "Trusted Advisor uses static threshold checks; Compute Optimizer uses predictive machine learning models.",
    "Compute Optimizer evaluates multi-dimensional metrics (CPU, RAM, network, EBS I/O, architecture).",
    "Both tools can be integrated with AWS Organizations for centralized multi-account governance."
  ],
  "commonMistake": "Thinking AWS Trusted Advisor can optimize Lambda function memory or suggest ECS Fargate container CPU/RAM allocations. For container and serverless rightsizing, use AWS Compute Optimizer.",
  "example": "# Check Trusted Advisor checks vs Compute Optimizer recommendations:\n# Trusted Advisor provides high-level checks:\naws support describe-trusted-advisor-checks --language en\n\n# Compute Optimizer provides deep ML recommendations:\naws compute-optimizer get-ec2-instance-recommendations",
  "sources": [
    {
      "title": "What is AWS Compute Optimizer?",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"
    },
    {
      "title": "AWS Trusted Advisor User Guide",
      "url": "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html"
    }
  ]
});
