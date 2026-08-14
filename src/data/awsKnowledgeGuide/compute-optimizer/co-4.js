import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-4",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "EC2 Instance Recommendations",
  "status": "ready",
  "plainEnglish": "EC2 Instance Recommendations in AWS Compute Optimizer provide tailored instance type suggestions for standalone Amazon EC2 virtual machines. The service analyzes CloudWatch metrics for CPU utilization, memory utilization (when CloudWatch Agent is active), network in/out throughput, and local instance storage/EBS throughput over a 14-day lookback period (or up to 3 months with Enhanced Infrastructure Metrics), recommending optimal instance sizes and processor architectures.",
  "whyItMatters": "Running mismatched EC2 instance types leads to unnecessary spending or degraded application responsiveness. For example, running a memory-heavy database on a compute-optimized (C-family) instance results in idle CPU and memory swapping. Compute Optimizer identifies the optimal instance family (M, C, R, T, I) and size.",
  "workplaceExample": "A company runs 20 r5.2xlarge instances for a caching proxy. Compute Optimizer reviews 14 days of telemetry, discovers that memory utilization peaked at only 22% and CPU peaked at 15%, and recommends switching to t4g.xlarge instances, saving $1,400 per month without impacting latency.",
  "examFocus": "For SAA-C03, remember that EC2 instance recommendations consider CPU, network, disk, and memory (if CloudWatch agent is installed). It can recommend downsizing, upsizing, changing instance families (e.g. R5 to M5), or switching processor architectures (x86 to AWS Graviton). It supports both On-Demand and Reserved/Savings Plans pricing perspectives.",
  "keyPoints": [
    "Analyzes standalone Amazon EC2 instances across hundreds of instance types.",
    "Evaluates CPU, disk I/O, network throughput, and memory (via CloudWatch Agent).",
    "Suggests same-family changes, cross-family migrations, and processor switches (Graviton/AMD/Intel).",
    "Provides up to 3 recommendation options per instance with pricing and performance risk ratings.",
    "Supports Enhanced Infrastructure Metrics for a 3-month lookback period on cyclical workloads."
  ],
  "commonMistake": "Ignoring the instance generation when rightsizing. For example, moving from an older m4.large to an m6i.large or m7g.large not only reduces costs but also delivers significant generational performance gains and EBS bandwidth improvements.",
  "example": "# Get EC2 recommendations for a specific instance:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --instance-arns arn:aws:ec2:us-east-1:123456789012:instance/i-0a1b2c3d4e5f6g7h8 \\\n  --query 'instanceRecommendations[0].recommendationOptions[*].[instanceType,projectedUtilizationMetrics]'",
  "sources": [
    {
      "title": "Viewing EC2 Instance Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html"
    },
    {
      "title": "Enhanced Infrastructure Metrics for EC2 Instances",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/enhanced-infrastructure-metrics.html"
    }
  ]
});
