import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-26",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Termination Policies",
  "status": "ready",
  "plainEnglish": "Termination Policies in Amazon EC2 Auto Scaling are prioritized rules that dictate which specific EC2 instance is terminated first when an Auto Scaling Group executes a scale-in event (reducing capacity) or needs to rebalance instances across Availability Zones. By default, Auto Scaling uses the `Default` termination policy, which first identifies the Availability Zone with the most instances, then selects the instance using the oldest Launch Template version, and finally picks the instance closest to its next billing hour.",
  "whyItMatters": "During scale-in or rolling software upgrades, you want the ASG to terminate older instances running legacy software or outdated AMIs first, rather than terminating newly launched, updated servers. Customizing termination policies ensures smooth rolling deployments, multi-AZ balance, and cost optimization.",
  "workplaceExample": "A DevOps team rolls out Launch Template v3 with a newly patched security AMI. They configure the ASG termination policy with `OldestLaunchTemplate` followed by `Default`. When scale-in occurs, the ASG preferentially terminates instances running older Launch Template v1 and v2 blueprints first, automatically cleaning up legacy instances.",
  "examFocus": "For SAA-C03, memorize the `Default` termination policy sequence: (1) Find the Availability Zone with the MOST instances (and at least one instance not protected from scale-in). (2) If multiple instances exist in that AZ, select instances using the OLDEST Launch Template / Configuration. (3) If multiple instances use the same template, select the instance closest to the next billing hour. (4) If all else is equal, pick a random instance.",
  "keyPoints": [
    "Determines which specific EC2 instance is terminated during scale-in or AZ rebalancing.",
    "Default policy balances across AZs first, then selects oldest Launch Template version.",
    "Available policies: `Default`, `OldestInstance`, `NewestInstance`, `OldestLaunchTemplate`, `AllocationStrategy`, `ClosestToNextInstanceHour`.",
    "Can combine multiple policies into a prioritized policy array.",
    "Scale-In Protection can be enabled on individual instances to prevent them from being terminated."
  ],
  "commonMistake": "Thinking `OldestInstance` and `OldestLaunchTemplate` are the same. `OldestInstance` terminates the server that has been running the longest; `OldestLaunchTemplate` terminates servers running an older blueprint/AMI version even if launched recently.",
  "example": "# Configure ASG with custom termination policies (OldestLaunchTemplate then Default):\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --termination-policies '[\"OldestLaunchTemplate\", \"Default\"]'",
  "sources": [
    {
      "title": "Work with Auto Scaling Termination Policies",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html"
    },
    {
      "title": "Instance Scale-In Protection in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-instance-protection.html"
    }
  ]
});
