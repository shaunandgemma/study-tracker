import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-27",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Instance Refresh",
  "status": "ready",
  "plainEnglish": "Amazon EC2 Auto Scaling Instance Refresh is an automated rolling update mechanism that replaces all running EC2 instances in an Auto Scaling Group in phased batches to roll out updated Launch Templates, new AMIs, or changed User Data scripts. During an Instance Refresh, the ASG launches a batch of new instances, waits for them to become healthy and pass warm-up checks, drains and terminates the old batch of instances, and repeats the process until 100% of the fleet is updated with zero application downtime.",
  "whyItMatters": "Before Instance Refresh, deploying a new AMI across a 100-instance ASG required writing complex custom scripts or manually terminating instances one by one. Instance Refresh provides a native, fully managed, safe rolling deployment with automatic rollback capabilities if new instances fail health checks.",
  "workplaceExample": "A security engineer creates a new Amazon Linux AMI with patched OpenSSL binaries. They update the ASG Launch Template to Version 2 and trigger an Instance Refresh with `MinHealthyPercentage: 90` and `InstanceWarmup: 180`. The ASG smoothly rolls out the new AMI across 50 production instances over 45 minutes with zero dropped user requests.",
  "examFocus": "For SAA-C03, know that Instance Refresh is the native AWS tool for performing rolling updates on Auto Scaling Groups. Parameters include: (1) `MinHealthyPercentage` (minimum percentage of capacity that must remain healthy during the refresh, e.g. 90%), (2) `InstanceWarmup` (warm-up delay before moving to the next batch), and (3) Automatic Rollbacks (triggers rollback if CloudWatch alarms alarm during refresh).",
  "keyPoints": [
    "Native rolling update tool to deploy new AMIs or Launch Templates across an ASG.",
    "Replaces instances in phased batches with zero application downtime.",
    "`MinHealthyPercentage` ensures sufficient healthy capacity remains active during rollout.",
    "`InstanceWarmup` gives new instances time to boot and warm caches before the next batch.",
    "Supports automatic rollback if CloudWatch alarms or health checks fail during deployment."
  ],
  "commonMistake": "Setting `MinHealthyPercentage` to 100% without allowing extra surge capacity. If capacity is at MaxSize, the ASG cannot launch extra instances and the refresh will stall; set `MinHealthyPercentage` to 80% or 90% or increase MaxSize temporarily.",
  "example": "# Start an ASG Instance Refresh to roll out a new Launch Template version:\naws autoscaling start-instance-refresh \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --preferences '{\"MinHealthyPercentage\": 90, \"InstanceWarmup\": 300, \"AutoRollback\": true}'",
  "sources": [
    {
      "title": "Use Instance Refresh to Update Instances in an Auto Scaling Group",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html"
    },
    {
      "title": "Configure Auto Rollback for Instance Refresh",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/instance-refresh-auto-rollback.html"
    }
  ]
});
