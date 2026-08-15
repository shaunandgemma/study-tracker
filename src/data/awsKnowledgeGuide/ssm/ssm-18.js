import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-18",
  "title": "VPC Interface Endpoints for Systems Manager",
  "plainEnglish": "VPC Interface Endpoints for Systems Manager are private, secure network interfaces (powered by AWS PrivateLink) placed inside your Amazon VPC subnets that allow private EC2 instances with no internet access (no Internet Gateway, no NAT Gateway, and no public IP addresses) to communicate directly with AWS Systems Manager service endpoints over the private AWS network backbone.",
  "whyItMatters": "Strict enterprise security compliance mandates (such as PCI DSS, HIPAA, and financial regulations) forbid database and payment backend instances from having public IP addresses or outbound internet routes through NAT Gateways. Configuring VPC Interface Endpoints allows private instances to be fully managed by Systems Manager (enabling Session Manager, Patch Manager, and Run Command) without any data traversing the public internet.",
  "workplaceExample": "A bank deploys a PCI-compliant card-processing cluster in completely isolated private VPC subnets with zero NAT gateways. To enable Session Manager shell access and automated security patching, the network engineer provisions three AWS PrivateLink VPC Interface Endpoints in the VPC: (1) `com.amazonaws.us-east-1.ssm`, (2) `com.amazonaws.us-east-1.ssmmessages`, and (3) `com.amazonaws.us-east-1.ec2messages`. All private instances immediately connect to Systems Manager over private IP addresses.",
  "examFocus": "Know the mandatory VPC Interface Endpoints required for Systems Manager: (1) Core SSM: `com.amazonaws.[region].ssm` (for standard SSM API calls). (2) Session Manager: `com.amazonaws.[region].ssmmessages` (MANDATORY for Session Manager interactive WebSocket channel). (3) Message Routing: `com.amazonaws.[region].ec2messages` (for Run Command and message processing). (4) S3 Gateway Endpoint: Required if Session Manager logs or Patch Manager downloads packages from S3. (5) KMS Endpoint: `com.amazonaws.[region].kms` (if using SecureString parameters or KMS session encryption).",
  "keyPoints": [
    "Enables completely private EC2 instances without internet access to communicate with Systems Manager.",
    "Powered by AWS PrivateLink with private Elastic Network Interfaces (ENIs) deployed in VPC subnets.",
    "Three primary endpoints required: `ssm`, `ssmmessages` (for Session Manager), and `ec2messages`.",
    "Keeps all management traffic within the private AWS network backbone, satisfying strict compliance rules.",
    "Requires Private DNS enabled on the VPC to resolve standard service DNS names to endpoint private IPs.",
    "Security groups attached to the interface endpoints must allow inbound HTTPS (port 443) from instance subnets."
  ],
  "commonMistake": "Creating only the `ssm` interface endpoint and wondering why Session Manager connections fail. Session Manager strictly requires the `ssmmessages` interface endpoint to establish the interactive WebSocket communication channel.",
  "example": "Create a VPC Interface Endpoint for Session Manager messaging in a VPC using the AWS CLI: aws ec2 create-vpc-endpoint --vpc-id vpc-01234567 --vpc-endpoint-type Interface --service-name com.amazonaws.us-east-1.ssmmessages --subnet-ids subnet-11111111 subnet-22222222 --security-group-ids sg-ssm-endpoints --private-dns-enabled.",
  "sources": [
    {
      "title": "Creating VPC Endpoints for AWS Systems Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"
    },
    {
      "title": "Prerequisites for Session Manager and VPC Endpoints",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html"
    }
  ]
});
