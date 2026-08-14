import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-24",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Instance Warmup",
  "status": "ready",
  "plainEnglish": "Instance Warmup (Estimated Instance Warmup) in Amazon EC2 Auto Scaling is the estimated time (in seconds) it takes for a newly launched EC2 instance to complete booting, configure software, warm its local caches, and begin contributing to the Auto Scaling Group's aggregated CloudWatch metrics. During the warmup period, the new instance is not included in the ASG's average metric calculations (such as Average CPU Utilization), preventing skewed metric spikes from triggering duplicate scaling actions.",
  "whyItMatters": "When a new EC2 instance boots, it often consumes 100% CPU for the first 60 seconds while executing User Data bootstrap scripts, compiling code, and warming up JVM or Python runtimes. Without an Instance Warmup timer, this temporary boot spike would skew the ASG's average CPU metric and trick scaling policies into launching unnecessary extra instances.",
  "workplaceExample": "A Java enterprise application takes 180 seconds to download dependencies, load Spring beans, and warm cache buffers. The engineering team configures an Estimated Instance Warmup of 240 seconds on their Target Tracking scaling policy. During scale-out, the booting instances are ignored by CloudWatch metric aggregations until the 4-minute warmup timer expires.",
  "examFocus": "For SAA-C03, know how Instance Warmup works with dynamic scaling: (1) Used by Step Scaling and Target Tracking policies instead of global cooldowns. (2) Prevents newly launched instances from contributing to CloudWatch metric aggregations while they are still initializing. (3) Also applies during Instance Refresh to control the pace of rolling instance replacements.",
  "keyPoints": [
    "Estimated time (in seconds) required for an instance to boot and begin serving traffic.",
    "Excludes warming instances from the ASG's aggregated CloudWatch metric calculations.",
    "Used by Step Scaling and Target Tracking policies (replaces rigid simple cooldowns).",
    "Prevents initial boot CPU spikes from triggering false-positive duplicate scale-outs.",
    "Used in Instance Refresh to pace rolling replacements of EC2 fleets."
  ],
  "commonMistake": "Leaving Estimated Instance Warmup at the default 0 or 60 seconds when your application takes 5 minutes to bootstrap. Heavy startup CPU spikes will distort target tracking metrics and cause over-scaling.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Target Tracking Policy with 180s Instance Warmup.\nResources:\n  TargetTrackingPolicy:\n    Type: AWS::AutoScaling::ScalingPolicy\n    Properties:\n      AutoScalingGroupName: !Ref ProductionASG\n      PolicyType: TargetTrackingScaling\n      EstimatedInstanceWarmup: 180\n      TargetTrackingConfiguration:\n        PredefinedMetricSpecification:\n          PredefinedMetricType: ASGAverageCPUUtilization\n        TargetValue: 60.0",
  "sources": [
    {
      "title": "Set the Instance Warmup Time for Target Tracking Policies",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html#target-tracking-warmup"
    },
    {
      "title": "Configuring Step Scaling and Instance Warmup",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"
    }
  ]
});
