import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-6",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Auto Scaling Groups - ASGs",
  "status": "ready",
  "plainEnglish": "An Amazon EC2 Auto Scaling Group (ASG) is a managed collection of Amazon EC2 instances treated as a single logical unit for automated capacity management, high availability, and dynamic scaling. An ASG automatically provisions new EC2 instances when application demand increases (scaling out), terminates excess instances when demand subsides to save costs (scaling in), and continuously monitors instance health to automatically replace crashed or degraded servers.",
  "whyItMatters": "Running a fixed number of static virtual servers either wastes money on idle compute during off-peak hours or crashes your application during traffic spikes. ASGs provide self-healing reliability and elasticity, ensuring your application always has the exact number of healthy servers needed to handle user load.",
  "workplaceExample": "A ticketing website uses an ASG behind an Application Load Balancer. On normal days, the ASG runs 4 EC2 instances. When concert tickets go on sale and traffic surges by 800%, the ASG automatically scales out to 32 instances across multiple Availability Zones, keeping the website responsive, and scales back down to 4 instances after the sale.",
  "examFocus": "For SAA-C03, understand the core functions of an ASG: (1) Self-healing (automatically replaces unhealthy instances to maintain Desired capacity), (2) Elastic scaling (scales out/in based on demand metrics or schedules), (3) Multi-AZ distribution (maintains balanced instance count across multiple AZs for high availability), and (4) Uses Launch Templates to define the instance configuration.",
  "keyPoints": [
    "Collection of EC2 instances managed as a single logical pool for scaling and availability.",
    "Maintains application availability by automatically replacing unhealthy or terminated instances.",
    "Dynamically adjusts capacity (scale out/in) based on load, schedules, or predictive AI.",
    "Distributes instances evenly across multiple Availability Zones in a Region.",
    "Uses EC2 Launch Templates to define AMI, instance type, security groups, and user data."
  ],
  "commonMistake": "Thinking that an ASG incurs an additional management fee. Amazon EC2 Auto Scaling is completely free to use; you only pay for the underlying EC2 compute instances and EBS volumes provisioned by the ASG.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Auto Scaling Group with Multi-AZ Subnets.\nResources:\n  WebASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      AutoScalingGroupName: Production-Web-ASG\n      MinSize: '2'\n      MaxSize: '10'\n      DesiredCapacity: '4'\n      VPCZoneIdentifier:\n        - subnet-0123456789abcdef0\n        - subnet-0fedcba9876543210\n      LaunchTemplate:\n        LaunchTemplateId: !Ref WebLaunchTemplate\n        Version: !GetAtt WebLaunchTemplate.LatestVersionNumber",
  "sources": [
    {
      "title": "What is Amazon EC2 Auto Scaling?",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html"
    },
    {
      "title": "Benefits of Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html"
    }
  ]
});
