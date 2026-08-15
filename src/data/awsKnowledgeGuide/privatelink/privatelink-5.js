import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-5",
  "title": "Interface VPC Endpoints",
  "plainEnglish": "An Interface VPC Endpoint (powered by AWS PrivateLink) is a managed network component that establishes private connectivity from your Amazon VPC to supported AWS services, custom endpoint services, or partner SaaS applications. When you create an interface endpoint, AWS provisions one or more Elastic Network Interfaces (ENIs) with private IP addresses selected from your VPC subnets, serving as the local entry point for all traffic destined for that service.",
  "whyItMatters": "Workloads deployed inside private subnets without public internet access often need to make API calls to services like AWS Systems Manager (SSM), AWS Secrets Manager, Amazon SQS, or Amazon CloudWatch. Interface VPC Endpoints allow private EC2 instances, ECS containers, or Lambda functions to call these AWS APIs privately without traversing a NAT Gateway or Internet Gateway.",
  "workplaceExample": "A DevOps team manages a fleet of private EC2 instances in an isolated VPC with no internet route. To manage the servers using AWS Systems Manager (SSM) Session Manager, they create Interface VPC Endpoints for `com.amazonaws.us-east-1.ssm`, `ssmmessages`, and `ec2messages` across two private subnets. The SSM Agent connects directly to the private IP addresses of the interface endpoint ENIs, enabling secure browser-based terminal sessions.",
  "examFocus": "Understand Interface VPC Endpoint configuration: (1) Creates endpoint ENIs with private IP addresses in each specified subnet/AZ. (2) Security Groups: Attached directly to the interface endpoint ENIs to control which compute resources can send traffic to the endpoint (inbound HTTPS port 443). (3) Private DNS: Enabling Private DNS overrides standard regional DNS names (e.g., `secretsmanager.us-east-1.amazonaws.com`) to resolve to the endpoint's private IP addresses. (4) Endpoint Policies: IAM-style JSON policies attached to the endpoint to restrict allowed actions.",
  "keyPoints": [
    "Provisions dedicated Elastic Network Interfaces (ENIs) with private IP addresses inside your VPC subnets.",
    "Enables private communication to hundreds of AWS services, custom customer services, and SaaS partners.",
    "Controls inbound traffic using standard VPC Security Groups attached to the endpoint ENIs.",
    "Supports Private DNS to seamlessly redirect public AWS service DNS hostnames to private endpoint IPs.",
    "Can be restricted with VPC Endpoint Policies to enforce least-privilege API access.",
    "Accessible from on-premises networks over AWS Direct Connect or AWS Site-to-Site VPN."
  ],
  "commonMistake": "Failing to configure security group inbound rules on the Interface VPC Endpoint. If the endpoint's security group does not allow inbound TCP port 443 from your workload subnets, all API requests to the service will hang and time out.",
  "example": "Create an Interface VPC Endpoint for AWS Secrets Manager using the AWS CLI: aws ec2 create-vpc-endpoint --vpc-id vpc-01234567 --service-name com.amazonaws.us-east-1.secretsmanager --vpc-endpoint-type Interface --subnet-ids subnet-111 subnet-222 --security-group-ids sg-endpoint --private-dns-enabled.",
  "sources": [
    {
      "title": "Creating an Interface VPC Endpoint",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html"
    },
    {
      "title": "Interface VPC Endpoints (AWS PrivateLink)",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html"
    }
  ]
});
