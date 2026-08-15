import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-7",
  "title": "Fargate Security Groups",
  "plainEnglish": "Security Groups in AWS Fargate act as stateful virtual firewalls attached directly to the Elastic Network Interface (ENI) of each individual running task. Because Fargate tasks use awsvpc networking, you control incoming (inbound) and outgoing (outbound) network traffic at the task level rather than at a shared host instance level.",
  "whyItMatters": "On traditional container clusters with shared host instances, all containers on the same EC2 instance share the host's security group rules. With Fargate, each microservice task can have its own dedicated security group, enforcing true micro-segmentation and least-privilege network isolation between front-end, back-end, and database tiers.",
  "workplaceExample": "A retail application runs a public-facing Application Load Balancer and a private Fargate order-service. The team creates a dedicated security group for the Fargate tasks that only allows inbound TCP traffic on port 8080 from the security group of the ALB, and allows outbound traffic only to the Amazon Aurora database security group on port 5432.",
  "examFocus": "Understand how security groups work with Fargate: You specify security group IDs in the 'awsvpcConfiguration' when creating an ECS service or running a task. For security best practice, reference security groups by ID in rule definitions (e.g., allow ingress on container port from the ALB security group) rather than CIDR blocks.",
  "keyPoints": [
    "Security groups attach directly to the Elastic Network Interface (ENI) provisioned for each Fargate task.",
    "Enables granular task-level micro-segmentation, ensuring different microservices in the same subnet have distinct firewall rules.",
    "Security group rules are stateful; return traffic for allowed inbound requests is automatically permitted regardless of outbound rules.",
    "Best practice is to configure security group chaining (referencing other security group IDs) rather than opening broad IP CIDR ranges.",
    "Inbound rules must allow traffic on the specific container port from the client or Application Load Balancer.",
    "Outbound rules must allow tasks to connect to downstream dependencies (e.g., RDS databases, VPC endpoints, or NAT gateways for internet access)."
  ],
  "commonMistake": "Blocking all outbound traffic on a Fargate task's security group. Fargate tasks in private subnets need outbound HTTPS (port 443) access to reach AWS APIs (like ECR, CloudWatch, and Secrets Manager) via NAT Gateway or VPC Endpoints; restricting all outbound traffic prevents tasks from starting.",
  "example": "Create a task security group that permits ingress only from the ALB security group: aws ec2 authorize-security-group-ingress --group-id sg-task12345 --protocol tcp --port 8080 --source-group sg-alb67890.",
  "sources": [
    {
      "title": "Amazon ECS Security Group Rules",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-group-rules.html"
    },
    {
      "title": "AWS Fargate Task Networking",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html"
    }
  ]
});
