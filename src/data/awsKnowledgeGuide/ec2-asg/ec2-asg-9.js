import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-9",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Multiple Availability Zone Deployment",
  "status": "ready",
  "plainEnglish": "Multiple Availability Zone Deployment in Amazon EC2 Auto Scaling is an architectural configuration where your Auto Scaling Group is attached to subnets spanning multiple distinct Availability Zones (AZs) within an AWS Region. The ASG automatically balances instance distribution across all specified AZs. If one Availability Zone experiences a physical power, cooling, or network failure, the ASG automatically detects the unavailable instances and rebalances capacity by launching replacement instances in the surviving healthy AZs.",
  "whyItMatters": "Deploying an ASG in only a single AZ leaves your entire application vulnerable to physical data center outages. Multi-AZ deployment provides fault tolerance and high availability out of the box, ensuring that losing an entire data center causes zero application downtime.",
  "workplaceExample": "A banking payment portal configures an ASG across 3 Availability Zones (`us-east-1a`, `us-east-1b`, `us-east-1c`) with 6 running instances (2 per AZ). When a fiber-optic cut takes `us-east-1a` offline, the ASG immediately launches 2 replacement instances across `us-east-1b` and `us-east-1c`, maintaining full 6-instance capacity.",
  "examFocus": "For SAA-C03, remember how ASG balances across AZs: (1) ASG always attempts to keep an EQUAL number of instances in each specified AZ. (2) During scale-out, it launches instances in the AZ with the fewest instances. (3) During scale-in (termination), by default it selects the AZ with the MOST instances first to maintain perfect multi-AZ balance.",
  "keyPoints": [
    "Distributes EC2 instances evenly across multiple Availability Zones in a Region.",
    "Provides fault tolerance: survives complete data center / AZ outages automatically.",
    "During scale-out, launches instances in the AZ with the fewest running instances.",
    "During scale-in, terminates instances in the AZ with the most instances to rebalance.",
    "Configured using the `VPCZoneIdentifier` property specifying subnets in multiple AZs."
  ],
  "commonMistake": "Configuring an Auto Scaling Group with subnets located in only a single Availability Zone. Always specify subnets across at least 2 or 3 AZs for high-availability production workloads.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Multi-AZ Auto Scaling Group.\nResources:\n  MultiAzASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '3'\n      MaxSize: '9'\n      DesiredCapacity: '6'\n      VPCZoneIdentifier:\n        - subnet-az1-id\n        - subnet-az2-id\n        - subnet-az3-id\n      LaunchTemplate:\n        LaunchTemplateId: !Ref AppLaunchTemplate\n        Version: !GetAtt AppLaunchTemplate.LatestVersionNumber",
  "sources": [
    {
      "title": "Adding and Balancing Across Availability Zones in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-add-availability-zone.html"
    },
    {
      "title": "Amazon EC2 Auto Scaling Multi-AZ Architecture Best Practices",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html"
    }
  ]
});
