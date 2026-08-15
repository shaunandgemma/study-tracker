import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-6",
  "title": "Fargate awsvpc Networking",
  "plainEnglish": "The 'awsvpc' network mode is the native networking model used by AWS Fargate. In this mode, every running Fargate task is allocated its own dedicated Elastic Network Interface (ENI) and a private IPv4 address directly from the specified Amazon VPC subnet. Containers within the same task communicate with each other over the localhost interface (127.0.0.1).",
  "whyItMatters": "In legacy container networking (bridge mode), multiple containers share the host EC2 instance's network interface and require complex port mapping (dynamic host port allocation). The awsvpc mode gives each task first-class citizen status on your VPC network, making container traffic directly inspectable by VPC Flow Logs, routing tables, and network security tools.",
  "workplaceExample": "A security-conscious financial institution deploys payment processing tasks on Fargate. Because each task uses awsvpc networking and gets a private IP from their secure subnet, they attach dedicated security groups to each task, write exact VPC Flow Log rules to audit ingress/egress per task IP, and route outbound traffic through an AWS Network Firewall.",
  "examFocus": "Remember that AWS Fargate strictly requires the 'awsvpc' network mode. Know that when attaching an Application Load Balancer or Network Load Balancer to a Fargate service, the target group target type MUST be set to 'ip' (not 'instance'), because the load balancer routes directly to the task's private IP address.",
  "keyPoints": [
    "AWS Fargate requires the 'awsvpc' network mode; other modes (bridge, host, none) are not supported.",
    "Every Fargate task receives a dedicated Elastic Network Interface (ENI) and private IPv4 address from the VPC subnet.",
    "Containers inside the same Fargate task communicate with one another over localhost (127.0.0.1) and share the same port space.",
    "Load balancers (ALB/NLB) routing traffic to Fargate services must use Target Groups configured with the 'ip' target type.",
    "VPC Flow Logs can capture all network traffic to and from individual Fargate tasks via their ENI IP addresses.",
    "Tasks consume private IP addresses from your VPC subnets; ensure your subnets are sufficiently sized to avoid IP exhaustion during scaling."
  ],
  "commonMistake": "Creating a load balancer Target Group with target type 'instance' when deploying on Fargate. Fargate tasks do not run on customer-managed EC2 instances; the target group target type must be set to 'ip'.",
  "example": "Configure the network configuration parameter for an ECS Fargate service: --network-configuration 'awsvpcConfiguration={subnets=[\"subnet-01234567\"],securityGroups=[\"sg-01234567\"],assignPublicIp=\"DISABLED\"}'.",
  "sources": [
    {
      "title": "Amazon ECS Task Networking with awsvpc",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html"
    },
    {
      "title": "AWS Fargate Task Networking Guidelines",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html"
    }
  ]
});
