import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-5",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "EC2 Auto Scaling Group Recommendations",
  "status": "ready",
  "plainEnglish": "EC2 Auto Scaling Group (ASG) Recommendations in AWS Compute Optimizer analyze the aggregate workload demand of all EC2 instances managed by an Auto Scaling group. The service evaluates whether the launch template or launch configuration is using optimal instance types and whether the minimum and maximum capacity parameters match actual scaling patterns over time.",
  "whyItMatters": "In an Auto Scaling group, an oversized instance type multiplies waste across every single running instance in the fleet. Optimizing the instance type in an ASG's launch template immediately reduces costs across all scaled instances and improves scaling responsiveness.",
  "workplaceExample": "A web service runs an Auto Scaling group with a minimum of 10 and a maximum of 50 c5.xlarge instances. Compute Optimizer identifies that memory and CPU utilization per instance rarely exceed 18%, and recommends changing the ASG launch template to c6g.large (Graviton), cutting the fleet's baseline cost by 45%.",
  "examFocus": "For SAA-C03, know that Compute Optimizer evaluates Auto Scaling groups at the fleet level. It analyzes metrics across all member instances in the ASG to recommend the best instance types for the launch template or launch template version. It can also recommend mixed instances policies.",
  "keyPoints": [
    "Analyzes the collective utilization metrics across all EC2 instances in an Auto Scaling group.",
    "Provides recommendations for the ASG's Launch Template or Launch Configuration.",
    "Recommends optimal instance types and sizes to rightsize the entire autoscaled fleet.",
    "Accounts for dynamic scaling swings, minimum instance counts, and peak traffic periods.",
    "Supports filtering by Auto Scaling group ARN or finding state (Optimized, Over-provisioned, Under-provisioned)."
  ],
  "commonMistake": "Updating the instance type directly on running ASG instances instead of updating the Auto Scaling Launch Template. To apply recommendations permanently, create a new Launch Template version with the recommended instance type and perform an instance refresh.",
  "example": "# Get recommendations for an Auto Scaling group:\naws compute-optimizer get-auto-scaling-group-recommendations \\\n  --auto-scaling-group-arns arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup:12345678-1234-1234-1234-123456789012:autoScalingGroupName/my-production-asg",
  "sources": [
    {
      "title": "Viewing Auto Scaling Group Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-asg-recommendations.html"
    },
    {
      "title": "Applying Auto Scaling Group Recommendations",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-asg-recommendations.html#apply-asg-recommendations"
    }
  ]
});
