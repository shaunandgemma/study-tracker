import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-1",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "ML Right-Sizing Recommendations for EC2 Instances, EBS Volumes, ECS Fargate, & Lambda",
  "status": "ready",
  "plainEnglish": "AWS Compute Optimizer is a machine learning (ML)-powered service that analyzes your historical resource utilization metrics from Amazon CloudWatch and provides actionable rightsizing recommendations. It examines memory, CPU, disk I/O, and network usage across Amazon EC2 instances, Amazon EC2 Auto Scaling groups, Amazon EBS volumes, AWS Lambda functions, Amazon ECS services on AWS Fargate, and commercial database licenses, recommending optimal configurations to eliminate waste and prevent performance bottlenecks.",
  "whyItMatters": "Manual rightsizing across thousands of cloud resources is nearly impossible and prone to human guesswork. Over-provisioning wastes budget on unused capacity, while under-provisioning causes application crashes and sluggish user experiences. Compute Optimizer applies predictive ML models to recommend the exact right instance types, storage IOPS, and memory allocations.",
  "workplaceExample": "An enterprise with 500 EC2 instances turns on AWS Compute Optimizer. Within 24 hours, the service identifies 120 over-provisioned m5.4xlarge instances running at less than 10% CPU and recommends downsizing them to m6g.xlarge (AWS Graviton), cutting monthly compute spend by $18,000 while maintaining identical application response times.",
  "examFocus": "For SAA-C03, remember that AWS Compute Optimizer uses machine learning to deliver rightsizing recommendations across 5 core compute and storage resource types: (1) EC2 instances, (2) Auto Scaling groups, (3) EBS volumes, (4) Lambda functions, and (5) ECS on Fargate. It requires at least 30 hours of CloudWatch metrics history (and defaults to analyzing the past 14 days of data).",
  "keyPoints": [
    "Uses machine learning models trained on millions of workloads to deliver rightsizing guidance.",
    "Supports EC2 instances, Auto Scaling groups, EBS volumes, Lambda functions, and ECS on Fargate.",
    "Analyzes CloudWatch metrics including CPU, memory (via CloudWatch Agent), disk I/O, and network throughput.",
    "Requires a minimum of 30 hours of historical metric data before generating recommendations.",
    "Available at no additional charge for standard 14-day lookback metrics."
  ],
  "commonMistake": "Expecting Compute Optimizer to generate recommendations immediately upon launching an EC2 instance. Compute Optimizer requires at least 30 hours of historical CloudWatch metric data to understand baseline workload patterns before generating recommendations.",
  "example": "# Get EC2 instance recommendations via the AWS CLI:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --region us-east-1 \\\n  --query 'instanceRecommendations[*].[instanceArn,currentInstanceType,finding,recommendationOptions[0].instanceType]' \\\n  --output table",
  "sources": [
    {
      "title": "What is AWS Compute Optimizer?",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"
    },
    {
      "title": "Supported Resources in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/supported-resources.html"
    }
  ]
});
