import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-17",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Step Scaling Policies",
  "status": "ready",
  "plainEnglish": "A Step Scaling Policy is an advanced dynamic scaling policy in Amazon EC2 Auto Scaling that scales your instance capacity in tiered stages (steps) based on the magnitude of a CloudWatch alarm breach. For example, if CPU utilization exceeds 60%, add 1 instance; if CPU reaches between 70% and 85%, add 3 instances; if CPU spikes over 85%, add 6 instances. Step scaling does not wait for a cooldown period during scale-out, allowing rapid sequential scaling during aggressive traffic surges.",
  "whyItMatters": "Traffic spikes are rarely linear. A small traffic bump requires only a modest capacity increase, whereas a massive 10x traffic spike needs an immediate, aggressive capacity surge. Step scaling allows fine-grained scaling responses tailored directly to the severity of the load increase.",
  "workplaceExample": "A streaming news service configures Step Scaling based on CloudWatch CPU metrics: CPU 50–70% adds 2 instances, CPU 70–90% adds 6 instances, and CPU >90% (breaking news surge) adds 15 instances immediately. Because Step Scaling evaluates continuous alarms without cooldown lockouts, it responds instantly to unfolding traffic spikes.",
  "examFocus": "For SAA-C03, know the key differentiators of Step Scaling: (1) Adjusts capacity based on stepped metric ranges (e.g. +10% capacity at 60% CPU, +30% at 75% CPU). (2) Unlike Simple Scaling, Step Scaling supports warm-up periods instead of strict cooldowns, allowing it to respond to subsequent alarm breaches while previous instances are still launching. (3) Ideal when scaling needs differ based on the size of the metric violation.",
  "keyPoints": [
    "Scales capacity in tiered steps based on the magnitude of a CloudWatch alarm breach.",
    "Supports multiple adjustment ranges (e.g. +1 instance for mild spike, +5 for severe spike).",
    "Does not enforce cooldown periods during scale-out; can scale out continuously as load rises.",
    "Uses Instance Warmup instead of global cooldown to evaluate metric impact.",
    "Superior to legacy Simple Scaling for bursty or unpredictable workloads."
  ],
  "commonMistake": "Confusing Step Scaling with Simple Scaling. Simple Scaling uses a single threshold with a rigid cooldown period that blocks all further scaling until elapsed; Step Scaling allows multiple step tiers and responds immediately to escalating alarm breaches.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Step Scaling Policy with Tiered Adjustments.\nResources:\n  StepScaleOutPolicy:\n    Type: AWS::AutoScaling::ScalingPolicy\n    Properties:\n      AutoScalingGroupName: !Ref AppASG\n      PolicyType: StepScaling\n      AdjustmentType: ChangeInCapacity\n      StepAdjustments:\n        - MetricIntervalLowerBound: 0\n          MetricIntervalUpperBound: 20\n          ScalingAdjustment: 1\n        - MetricIntervalLowerBound: 20\n          ScalingAdjustment: 3",
  "sources": [
    {
      "title": "Step and Simple Scaling Policies for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"
    },
    {
      "title": "Configuring Step Adjustments in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#step-scaling-adjustments"
    }
  ]
});
