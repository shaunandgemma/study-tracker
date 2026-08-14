import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-18",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Simple Scaling Policies",
  "status": "ready",
  "plainEnglish": "A Simple Scaling Policy is the original, basic dynamic scaling policy in Amazon EC2 Auto Scaling. It scales instance capacity by a single fixed adjustment (such as 'add 2 instances' or 'increase capacity by 20%') whenever a single CloudWatch alarm threshold is breached (such as CPU > 70%). After performing a scaling activity, Simple Scaling mandates a strict Cooldown Period (default 300 seconds) during which all further scaling activities are completely locked out.",
  "whyItMatters": "While Target Tracking and Step Scaling are now modern best practices, understanding Simple Scaling is essential for managing legacy AWS architectures and understanding how scaling cooldowns function. The cooldown period prevents the ASG from launching too many instances before previous instances finish booting.",
  "workplaceExample": "A legacy batch worker fleet uses a Simple Scaling policy: when a CloudWatch alarm indicates that average CPU exceeds 75%, the ASG adds 2 worker instances. The ASG then waits 5 minutes (cooldown period) before evaluating the alarm again, giving the new workers time to pull jobs from the queue and reduce CPU load.",
  "examFocus": "For SAA-C03, know how Simple Scaling works: (1) Single adjustment value triggered by a single CloudWatch alarm threshold. (2) Enforces a mandatory Cooldown Period after each scaling activity before any other scaling activity can occur. (3) AWS recommends Target Tracking or Step Scaling over Simple Scaling for modern workloads because Simple Scaling cannot adjust proportionally to variable spike sizes.",
  "keyPoints": [
    "Original basic dynamic scaling policy in Amazon EC2 Auto Scaling.",
    "Performs a single adjustment (add/remove N instances or X percent) on alarm breach.",
    "Enforces a mandatory Cooldown Period (e.g. 300 seconds) after every scaling activity.",
    "Blocks all other scaling activities until the cooldown period expires.",
    "AWS recommends Target Tracking or Step Scaling for all modern architectures."
  ],
  "commonMistake": "Using Simple Scaling for rapidly fluctuating, spike-heavy traffic. Because Simple Scaling locks out all scaling activities during the cooldown period, a massive secondary traffic spike during the cooldown cannot trigger additional instances, potentially causing an outage.",
  "example": "# Create a simple scale-out policy with a 300-second cooldown:\naws autoscaling put-scaling-policy \\\n  --auto-scaling-group-name Legacy-Worker-ASG \\\n  --policy-name SimpleScaleOut \\\n  --policy-type SimpleScaling \\\n  --scaling-adjustment 2 \\\n  --adjustment-type ChangeInCapacity \\\n  --cooldown 300",
  "sources": [
    {
      "title": "Simple and Step Scaling Policies for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"
    },
    {
      "title": "Understanding Scaling Cooldowns in Simple Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/Cooldown.html"
    }
  ]
});
