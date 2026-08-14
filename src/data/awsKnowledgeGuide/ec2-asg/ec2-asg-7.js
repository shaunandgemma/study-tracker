import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-7",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Minimum, Desired and Maximum Capacity",
  "status": "ready",
  "plainEnglish": "Minimum, Desired, and Maximum Capacity are the three core numerical boundary limits that define the sizing boundaries of an Amazon EC2 Auto Scaling Group. (1) Minimum Capacity (`MinSize`) is the absolute floor—the ASG will never terminate instances below this number, guaranteeing a baseline level of availability. (2) Maximum Capacity (`MaxSize`) is the hard ceiling—the ASG will never scale above this number, protecting your budget from runaway billing. (3) Desired Capacity (`DesiredCapacity`) is the target number of running instances the ASG actively maintains; scaling policies adjust this desired number up or down between the Min and Max boundaries.",
  "whyItMatters": "Setting proper capacity bounds prevents two catastrophic production failure modes: setting MinSize too low (or to 0) risks taking the application completely offline during scale-in, while omitting MaxSize safeguards could allow a DDoS attack to spawn thousands of instances and generate tens of thousands of dollars in unintended cloud bills.",
  "workplaceExample": "A retail application configures an ASG with `MinSize: 4`, `DesiredCapacity: 6`, and `MaxSize: 20`. Under steady state, 6 instances run across 3 AZs. If 2 instances fail health checks, the ASG immediately launches 2 replacements to restore DesiredCapacity to 6. During a traffic surge, scaling policies increase DesiredCapacity up to a maximum cap of 20.",
  "examFocus": "For SAA-C03, remember the boundary rule: `MinSize <= DesiredCapacity <= MaxSize`. If an unhealthy instance is terminated, the ASG automatically launches a replacement to keep running capacity equal to Desired Capacity. If you manually change Desired Capacity to a value lower than MinSize or higher than MaxSize, the ASG automatically adjusts MinSize or MaxSize to accommodate the new desired value.",
  "keyPoints": [
    "MinSize: The minimum number of running instances the ASG will ever maintain.",
    "MaxSize: The maximum number of instances the ASG can scale up to.",
    "DesiredCapacity: The active target number of healthy instances maintained by the ASG.",
    "Mathematical rule: `MinSize <= DesiredCapacity <= MaxSize` at all times.",
    "Self-healing: If an instance fails, ASG launches a replacement to maintain Desired Capacity."
  ],
  "commonMistake": "Setting DesiredCapacity higher than MaxSize in configuration templates. CloudFormation or the AWS CLI will reject the request with a validation error; MaxSize must always be greater than or equal to DesiredCapacity.",
  "example": "# Update ASG capacity parameters via AWS CLI:\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --min-size 2 \\\n  --desired-capacity 4 \\\n  --max-size 12",
  "sources": [
    {
      "title": "Amazon EC2 Auto Scaling Capacity Limits",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html"
    },
    {
      "title": "Maintaining a Fixed Number of Instances in an ASG",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-maintain-instance-levels.html"
    }
  ]
});
