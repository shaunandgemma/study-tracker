import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-32",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Auto Scaling with Multi-AZ Architecture",
  "status": "ready",
  "plainEnglish": "Auto Scaling with Multi-AZ Architecture is the design pattern of configuring an Amazon EC2 Auto Scaling Group behind a Multi-AZ Elastic Load Balancer across at least two or three Availability Zones. The ASG continuously balances the distribution of EC2 instances equally across all specified AZs. If one AZ experiences hardware failure, network disconnection, or physical disaster, the ASG automatically detects impaired instances and provisions replacement capacity in the surviving AZs, ensuring zero application downtime.",
  "whyItMatters": "Single-AZ deployments introduce a single point of failure (SPOF). Designing an ASG with Multi-AZ architecture is a cornerstone requirement of the AWS Well-Architected Framework Reliability Pillar, protecting systems against isolated physical failures.",
  "workplaceExample": "A healthcare portal deploys an Auto Scaling Group across 3 Availability Zones with `MinSize: 3` and `DesiredCapacity: 6` (2 instances per AZ). When a localized substation failure interrupts power to Availability Zone C, the Application Load Balancer shifts all incoming web traffic to AZ A and AZ B, and the ASG launches 2 replacement instances in AZ A and AZ B to restore full 6-instance capacity.",
  "examFocus": "For SAA-C03, calculate capacity for high availability during AZ outages: To ensure an application can survive a single AZ failure at 100% capacity: (1) If using 2 AZs, each AZ must run 50% extra capacity (e.g. 2 instances in AZ1, 2 instances in AZ2 for a 2-instance requirement). (2) If using 3 AZs, each AZ must run 50% of the total needed capacity (e.g. 2 in AZ1, 2 in AZ2, 2 in AZ3 for a 4-instance requirement).",
  "keyPoints": [
    "Fundamental AWS Well-Architected pattern for maximum reliability and fault tolerance.",
    "Maintains equal instance distribution across 2, 3, or more Availability Zones.",
    "Automatically replaces lost capacity in surviving AZs if an entire AZ suffers an outage.",
    "Pairs with Application Load Balancer cross-zone load balancing for uniform traffic flow.",
    "Capacity calculation: architect enough instances across AZs to absorb a single AZ failure."
  ],
  "commonMistake": "Deploying an ASG with 4 instances across 2 AZs (2 per AZ) when the application strictly requires 4 instances to run under peak load. If 1 AZ fails, only 2 instances survive (50% capacity loss). Deploy 4 instances in each AZ, or spread 2 instances across 3 AZs (6 total) so 4 instances survive an AZ loss.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Highly Available Multi-AZ ASG.\nResources:\n  ProductionASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '3'\n      MaxSize: '12'\n      DesiredCapacity: '6'\n      VPCZoneIdentifier:\n        - subnet-us-east-1a-id\n        - subnet-us-east-1b-id\n        - subnet-us-east-1c-id\n      TargetGroupARNs:\n        - !Ref ProductionALBTargetGroup\n      LaunchTemplate:\n        LaunchTemplateId: !Ref WebLaunchTemplate\n        Version: !GetAtt WebLaunchTemplate.LatestVersionNumber",
  "sources": [
    {
      "title": "Amazon EC2 Auto Scaling Multi-AZ Architecture Best Practices",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html"
    },
    {
      "title": "Adding and Balancing Across Availability Zones in Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-add-availability-zone.html"
    }
  ]
});
