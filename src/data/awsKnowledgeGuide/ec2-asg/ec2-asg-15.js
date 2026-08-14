import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-15",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Dynamic Scaling",
  "status": "ready",
  "plainEnglish": "Dynamic Scaling in Amazon EC2 Auto Scaling is the ability of an Auto Scaling Group to automatically adjust its instance capacity in real time in response to changing live workload demand. Dynamic scaling policies monitor Amazon CloudWatch performance metrics (such as CPU utilization, network I/O, or custom application metrics) and automatically increase Desired Capacity (scale out) during traffic surges or decrease Desired Capacity (scale in) during quiet periods.",
  "whyItMatters": "Traffic patterns in modern web applications fluctuate constantly throughout the day and week. Static server capacity forces organizations to over-provision for theoretical peak loads (wasting money 90% of the time) or suffer sluggish response times during sudden traffic spikes. Dynamic scaling aligns compute capacity directly with actual user demand in real time.",
  "workplaceExample": "A streaming media application experiences a surge in active viewers during prime-time evening hours. A dynamic scaling policy monitoring average CPU utilization automatically scales out the ASG from 10 instances to 45 instances as CPU climbs past 60%, and gradually scales back in to 10 instances by 2:00 AM.",
  "examFocus": "For SAA-C03, understand the three types of dynamic scaling policies: (1) Target Tracking Scaling (recommended default—maintains a specific metric value like 50% CPU, similar to a thermostat), (2) Step Scaling (adjusts capacity in tiered increments based on the size of the metric breach), and (3) Simple Scaling (adjusts capacity based on a single threshold and enforces cooldown periods).",
  "keyPoints": [
    "Automatically scales ASG capacity up and down in response to live load changes.",
    "Driven by Amazon CloudWatch metrics (CPU utilization, network throughput, request count).",
    "Three dynamic policy types: Target Tracking, Step Scaling, and Simple Scaling.",
    "Eliminates manual capacity adjustments and matches costs directly to active demand.",
    "Operates strictly within the configured `MinSize` and `MaxSize` capacity boundaries."
  ],
  "commonMistake": "Configuring only scale-out policies and forgetting to configure scale-in policies. Without scale-in policies, the ASG will scale up during peak traffic and remain at peak size forever, resulting in unexpected high AWS bills.",
  "example": "# Create a dynamic target tracking policy targeting 50% average CPU utilization:\naws autoscaling put-scaling-policy \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --policy-name TargetTracking-50PercentCPU \\\n  --policy-type TargetTrackingScaling \\\n  --target-tracking-configuration file://target-tracking-cpu.json",
  "sources": [
    {
      "title": "Dynamic Scaling for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html"
    },
    {
      "title": "Scaling Policy Types in Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"
    }
  ]
});
