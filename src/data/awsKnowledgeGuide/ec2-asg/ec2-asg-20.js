import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-20",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Predictive Scaling",
  "status": "ready",
  "plainEnglish": "Predictive Scaling in Amazon EC2 Auto Scaling uses machine learning (ML) models to analyze your Auto Scaling Group's historical traffic and metric patterns over time (requiring at least 24 hours to 14 days of historical CloudWatch data) and forecasts future daily and weekly demand cycles. It automatically schedules future capacity additions before load surges occur, preventing the initialization latency associated with reactive dynamic scaling.",
  "whyItMatters": "Standard dynamic scaling is reactive: it only launches new servers after CPU or request counts spike, which leaves applications under-provisioned during the 3 to 10 minutes required for new EC2 instances to boot and initialize. Predictive scaling proactively launches instances in advance so they are fully warm and ready before the surge hits.",
  "workplaceExample": "An e-commerce website experiences cyclic daily traffic that climbs sharply every day starting at 11:30 AM lunch hour. Predictive scaling analyzes past two weeks of CloudWatch traffic, forecasts the exact traffic slope, and begins launching and warming instances at 11:00 AM so capacity perfectly matches the 11:30 AM rush.",
  "examFocus": "For SAA-C03, know when to use Predictive Scaling: (1) Use when workloads have recurring, predictable daily or weekly cyclical traffic patterns. (2) Uses machine learning to forecast demand and schedule proactive capacity. (3) Best practice: Combine Predictive Scaling (for planned proactive baseline) with Target Tracking Dynamic Scaling (for unexpected real-time spikes).",
  "keyPoints": [
    "Uses machine learning to analyze historical metric data and forecast future capacity needs.",
    "Proactively provisions and warms EC2 instances before forecasted traffic surges arrive.",
    "Eliminates latency delays caused by instance boot and application initialization times.",
    "Ideal for recurring cyclical patterns (daily morning spikes, weekly recurring cycles).",
    "Pair with Target Tracking Dynamic Scaling for comprehensive proactive + reactive scaling."
  ],
  "commonMistake": "Enabling predictive scaling on completely random, one-off bursty workloads with no recurring patterns. Machine learning forecasting requires recurring historical patterns to generate accurate capacity predictions.",
  "example": "# Create a predictive scaling policy using CloudFormation:\nType: AWS::AutoScaling::ScalingPolicy\nProperties:\n  AutoScalingGroupName: !Ref ProductionASG\n  PolicyType: PredictiveScaling\n  PredictiveScalingConfiguration:\n    MetricSpecifications:\n      - TargetValue: 50.0\n        PredefinedMetricPairSpecification:\n          PredefinedMetricType: ASGCPUUtilization\n    Mode: ForecastAndScale",
  "sources": [
    {
      "title": "Predictive Scaling for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html"
    },
    {
      "title": "Configuring Predictive Scaling Policies",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/predictive-scaling-customized-metric-specification.html"
    }
  ]
});
