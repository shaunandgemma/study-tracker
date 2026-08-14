import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-23",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Cooldown Periods",
  "status": "ready",
  "plainEnglish": "A Cooldown Period in Amazon EC2 Auto Scaling is a configurable pause timer (default 300 seconds) that ensures your Auto Scaling Group does not launch or terminate additional EC2 instances before the effects of previous scaling activities are visible in CloudWatch metrics. During a cooldown period, Simple Scaling policies ignore incoming scaling requests, giving newly launched instances time to boot, warm up, and begin handling traffic.",
  "whyItMatters": "When an EC2 instance launches, it can take 2 to 5 minutes to boot the OS, install packages, and start serving requests. Without a cooldown period, a CloudWatch alarm would continue triggering every 60 seconds during the boot window, causing the ASG to launch far more instances than needed and wasting money.",
  "workplaceExample": "A batch processing group launches instances that take 4 minutes to load machine learning models into memory. The architect sets the default cooldown to 360 seconds. When a traffic spike hits, the ASG adds 4 instances and pauses scaling evaluations for 6 minutes, allowing the new instances to warm up and bring CPU load down naturally before evaluating whether more capacity is required.",
  "examFocus": "For SAA-C03, remember these cooldown rules: (1) Default cooldown is 300 seconds (5 minutes). (2) Cooldowns apply to Simple Scaling policies and manual scaling actions (not to Target Tracking or Step Scaling, which use Instance Warmup). (3) You can override the default group cooldown with a policy-specific cooldown.",
  "keyPoints": [
    "Configurable pause timer (default 300 seconds) between scaling activities.",
    "Prevents over-scaling while newly launched instances are booting and initializing.",
    "Applies primarily to Simple Scaling policies and manual capacity modifications.",
    "Does not apply to Step Scaling or Target Tracking (which use Instance Warmup).",
    "Can be set at the Auto Scaling Group level or overridden on individual scaling policies."
  ],
  "commonMistake": "Setting a cooldown period of 0 seconds on a Simple Scaling policy with an application that takes 5 minutes to initialize. Every 60 seconds, the high-CPU alarm will fire again, launching dozens of unnecessary instances.",
  "example": "# Update the default group cooldown to 180 seconds:\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --default-cooldown 180",
  "sources": [
    {
      "title": "Scaling Cooldowns for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html"
    },
    {
      "title": "Scaling Policy Types and Cooldown Behaviors",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"
    }
  ]
});
