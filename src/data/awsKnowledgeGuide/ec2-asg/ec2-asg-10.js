import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-10",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Elastic Load Balancing Integration",
  "status": "ready",
  "plainEnglish": "Elastic Load Balancing (ELB) Integration connects your Amazon EC2 Auto Scaling Group directly to an Application Load Balancer (ALB), Network Load Balancer (NLB), or Classic Load Balancer via Target Groups. When the ASG scales out and launches new EC2 instances, it automatically registers the new instances with the ELB Target Group. When the ASG scales in, it automatically initiates Connection Draining (deregistration delay) on the load balancer, allowing in-flight user requests to finish before safely terminating the instances.",
  "whyItMatters": "Without automated load balancer integration, engineers would have to manually add and remove EC2 IP addresses from load balancers every time the server fleet scaled. Automated registration and connection draining ensures zero dropped client requests and seamless traffic distribution across dynamic instance pools.",
  "workplaceExample": "An online retail store experiences sudden flash sales. The ASG launches 20 new EC2 instances. The ASG automatically registers them with the ALB Target Group. Once the instances pass ALB HTTP health checks, the ALB begins routing customer checkout traffic to them. When traffic subsides, the ALB drains existing connections before the ASG terminates the excess instances.",
  "examFocus": "For SAA-C03, know how ASG and ELB work together: (1) Attach the ASG to one or more ALB/NLB Target Group ARNs (`TargetGroupARNs`). (2) Understand Deregistration Delay / Connection Draining (gives active requests time to complete before instance termination). (3) You can configure the ASG to use ELB Health Checks so that instances failing load balancer health checks are replaced automatically.",
  "keyPoints": [
    "Automatically registers newly launched EC2 instances with ELB Target Groups.",
    "Automatically deregisters terminating instances and waits for connection draining.",
    "Connection Draining / Deregistration Delay prevents dropping in-flight HTTP requests.",
    "Enables single-DNS-entry client routing to dynamically scaled back-end fleets.",
    "Allows using ELB HTTP/HTTPS health checks to trigger ASG self-healing replacements."
  ],
  "commonMistake": "Manually registering individual EC2 instances launched by an ASG into a Target Group. Always attach the Target Group directly to the Auto Scaling Group so that registration and deregistration happen automatically.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: ASG with Application Load Balancer Target Group Attachment.\nResources:\n  AppASG:\n    Type: AWS::AutoScaling::AutoScalingGroup\n    Properties:\n      MinSize: '2'\n      MaxSize: '10'\n      DesiredCapacity: '4'\n      TargetGroupARNs:\n        - !Ref WebAppTargetGroup\n      LaunchTemplate:\n        LaunchTemplateId: !Ref WebLaunchTemplate\n        Version: !GetAtt WebLaunchTemplate.LatestVersionNumber",
  "sources": [
    {
      "title": "Attaching a Load Balancer to Your Auto Scaling Group",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html"
    },
    {
      "title": "ELB Target Groups and Auto Scaling Integration",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html"
    }
  ]
});
