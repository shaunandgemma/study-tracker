import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-16",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Target Tracking Scaling Policies",
  "status": "ready",
  "plainEnglish": "A Target Tracking Scaling Policy is the most intuitive and recommended dynamic scaling policy in Amazon EC2 Auto Scaling. It functions like a thermostat in a house: you choose a target metric value (e.g. 'keep average ASG CPU utilization at 50%' or 'keep ALB RequestCountPerTarget at 1,000'), and AWS Auto Scaling automatically creates CloudWatch alarms and continuously calculates how many instances to add or remove to keep the metric hovering around that exact target value.",
  "whyItMatters": "Manual threshold math (e.g. guessing how many servers to add when CPU hits 70%) is complicated and prone to over- or under-scaling. Target tracking automatically adjusts proportional capacity: if traffic doubles, it doubles capacity; if traffic drops by 50%, it cuts capacity in half, with zero manual alarm math required.",
  "workplaceExample": "A SaaS startup configures a Target Tracking policy based on `ALBRequestCountPerTarget: 2000`. When a marketing campaign sends a flood of API traffic, the metric jumps to 6,000 requests per target. Target Tracking calculates that capacity must triple and immediately scales the ASG from 5 instances to 15 instances.",
  "examFocus": "For SAA-C03, remember that Target Tracking is the AWS-recommended default scaling policy. Predefined metrics supported: (1) `ASGAverageCPUUtilization`, (2) `ASGAverageNetworkIn`, (3) `ASGAverageNetworkOut`, and (4) `ALBRequestCountPerTarget`. Target Tracking automatically creates and manages both scale-out and scale-in CloudWatch alarms.",
  "keyPoints": [
    "AWS-recommended default scaling policy for dynamic workloads.",
    "Functions like a thermostat: maintains a specific target value (e.g. 50% CPU).",
    "Automatically provisions and manages underlying CloudWatch scale-out and scale-in alarms.",
    "Predefined metrics: CPU Utilization, Network In/Out, and ALB Request Count per Target.",
    "Supports customized CloudWatch metrics if predefined metrics do not match workload.",
    "Scale-in can be disabled if you only want target tracking to scale out."
  ],
  "commonMistake": "Targeting a metric that does not scale proportionally with instance count (such as a database query queue or SQS queue depth without dividing by instance count). For SQS queues, use a custom metric measuring Backlog Per Instance.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Target Tracking Policy targeting 50% CPU.\nResources:\n  CpuScalingPolicy:\n    Type: AWS::AutoScaling::ScalingPolicy\n    Properties:\n      AutoScalingGroupName: !Ref ProductionASG\n      PolicyType: TargetTrackingScaling\n      TargetTrackingConfiguration:\n        PredefinedMetricSpecification:\n          PredefinedMetricType: ASGAverageCPUUtilization\n        TargetValue: 50.0",
  "sources": [
    {
      "title": "Target Tracking Scaling Policies for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"
    },
    {
      "title": "Predefined Metrics for Target Tracking Scaling Policies",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html#available-metrics"
    }
  ]
});
