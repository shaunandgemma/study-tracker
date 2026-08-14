import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-21",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "CloudWatch Alarm Integration",
  "status": "ready",
  "plainEnglish": "CloudWatch Alarm Integration connects Amazon CloudWatch metric alarms directly to Amazon EC2 Auto Scaling policies. When a monitored metric (such as CPU utilization, SQS queue depth, or custom application error rates) breaches a predefined alarm threshold for a specified number of evaluation periods, CloudWatch invokes the ASG scaling policy's Amazon Resource Name (ARN), triggering an automated scale-out or scale-in action.",
  "whyItMatters": "CloudWatch alarms enable event-driven scaling based on virtually any business or technical metric. For asynchronous message processing systems, scaling based on SQS queue length prevents message backlog and guarantees compliance with SLA processing times without human monitoring.",
  "workplaceExample": "A video transcoding backend processes jobs from an Amazon SQS queue. The team creates a CloudWatch metric alarm that triggers when `ApproximateNumberOfMessagesVisible` exceeds 500. When the alarm transitions to `ALARM`, it triggers the ASG Step Scaling Policy to add 10 GPU worker instances immediately.",
  "examFocus": "For SAA-C03, know how CloudWatch Alarms integrate with ASG: (1) Step and Simple scaling policies require manual CloudWatch Alarm creation and linking via Alarm Actions. (2) Target Tracking automatically creates and manages its own CloudWatch Alarms. (3) For SQS queue worker fleets, the recommended metric is custom: `Backlog Per Instance` (Queue Depth / Number of Running Instances) to prevent over-scaling.",
  "keyPoints": [
    "Connects CloudWatch metric alarms directly to ASG Step and Simple scaling policies.",
    "Triggers scaling actions when metric thresholds are breached across evaluation periods.",
    "Supports AWS standard metrics, detailed monitoring metrics, and custom CloudWatch metrics.",
    "Target Tracking creates and configures its own CloudWatch alarms automatically.",
    "For SQS worker fleets, scale based on `Backlog per Instance` for optimal scaling efficiency."
  ],
  "commonMistake": "Scaling SQS worker fleets purely on raw queue depth without considering existing worker count. If 1,000 messages arrive and you have 50 workers processing 20 msgs/sec, the queue clears in 1 second; scaling out 10 extra workers would waste money.",
  "example": "# Create a CloudWatch Alarm that triggers an ASG scale-out policy ARN:\naws cloudwatch put-metric-alarm \\\n  --alarm-name HighCPUUtilizationAlarm \\\n  --metric-name CPUUtilization \\\n  --namespace AWS/EC2 \\\n  --statistic Average \\\n  --period 60 \\\n  --threshold 70 \\\n  --comparison-operator GreaterThanOrEqualToThreshold \\\n  --evaluation-periods 2 \\\n  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:01234567-89ab-cdef-0123-456789abcdef:autoScalingGroupName/AppASG:policyName/ScaleOutPolicy",
  "sources": [
    {
      "title": "Using CloudWatch Alarms with Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html#adding-step-scaling-policies"
    },
    {
      "title": "Scaling Based on Amazon SQS with Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"
    }
  ]
});
