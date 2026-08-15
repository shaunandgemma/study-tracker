import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-17",
  "title": "Fargate Private Subnet Internet Access using NAT Gateway",
  "plainEnglish": "For production security, Amazon ECS Fargate tasks are typically deployed into private VPC subnets with 'assignPublicIp: DISABLED'. Because these tasks do not have public IP addresses and cannot receive inbound connections from the internet, an AWS NAT (Network Address Translation) Gateway deployed in a public subnet is required to allow tasks to initiate outbound connections to the internet (e.g., pulling images from public registries, downloading package updates, or calling third-party SaaS APIs).",
  "whyItMatters": "Deploying container tasks in public subnets with public IP addresses exposes your application layer to inbound internet attacks and port scans. Placing Fargate tasks in private subnets with a NAT Gateway guarantees that container tasks remain completely shielded from inbound internet traffic while still retaining outbound connectivity.",
  "workplaceExample": "A banking application processes loan applications on Fargate. The security architecture requires all container tasks to run in private subnets across multiple AZs with assignPublicIp set to DISABLED. The private subnet route tables route 0.0.0.0/0 traffic to a multi-AZ NAT Gateway setup in public subnets, allowing tasks to pull container images and securely call external credit-check REST APIs.",
  "examFocus": "Understand VPC routing for Fargate: (1) If tasks run in a private subnet (assignPublicIp=DISABLED), the private subnet's route table MUST route 0.0.0.0/0 to a NAT Gateway (or use VPC Endpoints) for the task to pull images from ECR or write logs to CloudWatch. (2) If tasks run in a public subnet, assignPublicIp MUST be set to ENABLED; otherwise, tasks cannot reach ECR or the internet.",
  "keyPoints": [
    "Placing Fargate tasks in private subnets protects workloads from direct inbound internet exposure.",
    "When launched in private subnets, tasks must specify 'assignPublicIp: DISABLED' in their awsvpcConfiguration.",
    "A NAT Gateway residing in a public subnet translates private task IP addresses to an Elastic IP for outbound internet communication.",
    "The private subnet route table must contain a default route (0.0.0.0/0) pointing to the NAT Gateway ID (nat-xxxxxx).",
    "Essential for tasks that need to pull images from public Docker Hub/ECR public, send telemetry to SaaS monitoring tools, or invoke external REST APIs.",
    "For high availability, deploy at least one NAT Gateway per Availability Zone in corresponding public subnets."
  ],
  "commonMistake": "Launching Fargate tasks in a private subnet without a NAT Gateway or VPC Endpoints. The tasks will hang in PENDING and eventually fail with 'CannotPullContainerError' or 'ResourceInitializationError' because they cannot connect to ECR or CloudWatch.",
  "example": "Configure the private subnet route table: aws ec2 create-route --route-table-id rtb-private123 --destination-cidr-block 0.0.0.0/0 --gateway-id nat-0123456789abcdef0, then launch the Fargate service into that private subnet.",
  "sources": [
    {
      "title": "AWS Fargate Task Networking and Subnets",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html"
    },
    {
      "title": "NAT Gateways in Amazon VPC",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"
    }
  ]
});
