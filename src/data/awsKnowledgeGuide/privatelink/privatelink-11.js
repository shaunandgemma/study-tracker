import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-11",
  "title": "Security Groups on Interface Endpoints",
  "plainEnglish": "Security Groups on Interface Endpoints act as stateful firewalls attached directly to the Endpoint Elastic Network Interfaces (ENIs) deployed in your VPC. Because an Interface Endpoint creates real ENIs inside your subnets, you can associate up to five VPC Security Groups with the endpoint to strictly control which source compute resources (EC2 instances, Lambda functions, ECS tasks) or IP CIDR blocks are permitted to send network traffic to the endpoint.",
  "whyItMatters": "Without security group enforcement, any compute resource inside your VPC could potentially communicate with the endpoint. Attaching tightly scoped security groups ensures network micro-segmentation and principle of least privilege, blocking unauthorized application tiers (e.g., public web servers) from reaching sensitive backend endpoints (e.g., database or payment endpoints).",
  "workplaceExample": "A network engineer provisions an Interface VPC Endpoint for AWS Secrets Manager. To ensure that only authorized backend payment microservices can retrieve secrets, the engineer attaches a security group (`sg-secrets-endpoint`) to the endpoint ENIs with an inbound rule: `Allow TCP Port 443 from source sg-payment-backend`. Frontend web servers with `sg-frontend-web` are blocked at the network layer from connecting to the Secrets Manager endpoint.",
  "examFocus": "Understand the bidirectional security group requirements for PrivateLink: (1) Interface Endpoint Security Group: Requires an INBOUND rule allowing traffic on the service port (typically TCP 443 for HTTPS AWS APIs) from the client application's security group or subnet CIDR. (2) Client Compute Security Group: Requires an OUTBOUND rule allowing traffic to the interface endpoint's security group or subnet CIDR on port 443.",
  "keyPoints": [
    "Security Groups attach directly to the Interface Endpoint ENIs to control inbound network access.",
    "Operates statefully; return traffic to clients is automatically allowed without explicit outbound rules on the endpoint.",
    "Inbound rules must allow the appropriate service protocol and port (typically TCP 443 for AWS APIs).",
    "Client compute resources require matching outbound security group rules permitting egress to the endpoint.",
    "Supports referencing source Security Group IDs (e.g., `sg-app-servers`) for seamless dynamic scaling.",
    "Gateway Endpoints (S3/DynamoDB) do NOT support Security Groups; they rely on VPC Route Tables and Endpoint Policies."
  ],
  "commonMistake": "Configuring security group rules that only allow outbound traffic from client EC2 instances, while forgetting to add an inbound allow rule on the Interface VPC Endpoint's security group. Both sides of the connection must permit the traffic.",
  "example": "Authorize inbound HTTPS traffic from an application security group to an interface endpoint security group using the AWS CLI: aws ec2 authorize-security-group-ingress --group-id sg-endpoint123 --protocol tcp --port 443 --source-group sg-app-instances.",
  "sources": [
    {
      "title": "Security Groups for Interface Endpoints",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html#security-groups-interface-endpoints"
    },
    {
      "title": "Working with Amazon VPC Security Groups",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html"
    }
  ]
});
