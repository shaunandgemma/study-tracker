import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-14",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Replacing Unhealthy Instances",
  "status": "ready",
  "plainEnglish": "Replacing Unhealthy Instances is the automatic self-healing process in Amazon EC2 Auto Scaling where any instance that fails health checks (EC2 status checks, ELB health checks, or custom health checks) is automatically terminated and replaced with a newly launched, healthy EC2 instance to maintain the group's Desired Capacity.",
  "whyItMatters": "Manual server recovery requires on-call engineers to wake up at 3:00 AM, diagnose broken servers, terminate them, and launch new ones. Auto Scaling's automatic replacement mechanism fixes server failures within minutes with zero human intervention, delivering high application resilience.",
  "workplaceExample": "An EC2 instance hosting a microservice runs out of file descriptors and begins timing out. The ALB marks it unhealthy, and the ASG immediately initiates replacement: it starts terminating the broken instance, provisions a fresh EC2 instance from the Launch Template in the same Availability Zone, runs User Data scripts, and registers it with the ALB.",
  "examFocus": "For SAA-C03, know the exact replacement lifecycle: (1) An instance is marked `Unhealthy`. (2) The ASG initiates termination and launches a replacement instance simultaneously. (3) If you need to troubleshoot an unhealthy instance before it is deleted, use ASG Lifecycle Hooks to pause termination, or use `aws autoscaling set-instance-health` or `standby` state.",
  "keyPoints": [
    "Automatic self-healing mechanism that maintains Desired Capacity.",
    "Triggers when an instance fails EC2 status checks, ELB health checks, or custom checks.",
    "Terminates the impaired instance and provisions a new instance from the Launch Template.",
    "Launches the replacement instance in the same Availability Zone to maintain multi-AZ balance.",
    "Can be paused for forensic inspection using Terminating Lifecycle Hooks."
  ],
  "commonMistake": "Attempting to manually reboot an unhealthy instance managed by an ASG while ELB health checks are failing. The ASG will terminate and replace the instance before your manual troubleshooting is complete; put the instance in `Standby` mode first if you need to debug it.",
  "example": "# Put an instance in Standby mode for troubleshooting to prevent ASG termination:\naws autoscaling enter-standby \\\n  --instance-ids i-0123456789abcdef0 \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --should-decrement-desired-capacity",
  "sources": [
    {
      "title": "Replacing Unhealthy Instances in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-maintain-instance-levels.html#as-replace-unhealthy-instances"
    },
    {
      "title": "Temporarily Removing Instances from Your Auto Scaling Group",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-enter-exit-standby.html"
    }
  ]
});
