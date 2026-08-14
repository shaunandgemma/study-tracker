import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-8",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Launch Templates",
  "status": "ready",
  "plainEnglish": "An Amazon EC2 Launch Template is a configuration blueprint that specifies all instance parameters required to launch an EC2 instance, including the Amazon Machine Image (AMI) ID, instance type, key pair, security groups, EBS block device mappings, IAM instance profile, and User Data bootstrap scripts. Launch Templates support versioning, allowing you to create incremental versions (e.g. updating an AMI or adding environment variables) and configure your Auto Scaling Group to automatically use the `$Latest` or `$Default` version.",
  "whyItMatters": "Launch Templates have replaced legacy Launch Configurations across AWS. Unlike immutable Launch Configurations that had to be recreated from scratch every time an AMI changed, Launch Templates support versioning, parameter overrides, mixed instance policies, Spot instances, T2/T3 unlimited bursting, and modern EC2 features.",
  "workplaceExample": "A DevOps engineer updates a web application to release v2.0. They build a new golden AMI and add Version 2 to their EC2 Launch Template referencing the new AMI. Because the production ASG is configured to use `Version: $Latest`, triggering an ASG Instance Refresh rolls out the new software version across all instances with zero downtime.",
  "examFocus": "For SAA-C03, know that Launch Templates are the recommended and required AWS modern standard for ASGs (Launch Configurations are deprecated). Launch Templates support: (1) Versioning (v1, v2, `$Latest`, `$Default`), (2) Mixed Instances Policies (combining On-Demand and Spot instances, and multiple instance types), and (3) Advanced features like Capacity Reservations, IAM roles, and T3 unlimited burst.",
  "keyPoints": [
    "Configuration blueprint specifying AMI, instance type, key pair, security groups, and user data.",
    "Supports versioning: create incremental versions without rebuilding the template.",
    "ASGs can dynamically track `$Latest` or `$Default` template versions.",
    "Enables advanced features: Mixed Instances Policies (Spot/On-Demand), multiple instance types.",
    "Replaces legacy Launch Configurations (which were unversioned and lacked modern features)."
  ],
  "commonMistake": "Using deprecated Launch Configurations in new architectures. AWS strongly recommends Launch Templates for all new ASGs due to versioning and support for Spot/On-Demand mixed instance policies.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: EC2 Launch Template with User Data.\nResources:\n  WebLaunchTemplate:\n    Type: AWS::EC2::LaunchTemplate\n    Properties:\n      LaunchTemplateName: WebServerTemplate\n      LaunchTemplateData:\n        ImageId: ami-0c55b159cbfafe1f0\n        InstanceType: t3.micro\n        SecurityGroupIds:\n          - sg-0123456789abcdef0\n        UserData:\n          Fn::Base64: |\n            #!/bin/bash\n            dnf install -y httpd\n            systemctl start httpd",
  "sources": [
    {
      "title": "Amazon EC2 Launch Templates",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html"
    },
    {
      "title": "Creating a Launch Template for an Auto Scaling Group",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-launch-template.html"
    }
  ]
});
