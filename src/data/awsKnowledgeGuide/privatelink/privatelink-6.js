import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-6",
  "title": "Endpoint Elastic Network Interfaces",
  "plainEnglish": "An Endpoint Elastic Network Interface (Endpoint ENI) is the physical virtual network card that AWS automatically creates inside your VPC subnet when you provision an Interface VPC Endpoint. Each Endpoint ENI is assigned a private IPv4 address (and optionally IPv6) from the subnet's CIDR block and serves as the local network gateway through which in-VPC resources route packets to the remote service.",
  "whyItMatters": "Because Endpoint ENIs are real network interfaces residing within your VPC subnets, they follow standard AWS networking security rules. You can attach VPC Security Groups, inspect traffic with VPC Flow Logs, apply Network ACLs, and query them via local Route 53 Resolver DNS just like any other private ENI in your VPC.",
  "workplaceExample": "A network security team provisions an Interface VPC Endpoint across three subnets (`10.0.1.0/24`, `10.0.2.0/24`, `10.0.3.0/24`). AWS assigns private IP `10.0.1.25` in AZ-a, `10.0.2.78` in AZ-b, and `10.0.3.112` in AZ-c. The security team attaches a strict Security Group to these ENIs permitting inbound HTTPS port 443 only from authorized application EC2 security groups and enables VPC Flow Logs on the ENIs for compliance auditing.",
  "examFocus": "Understand Endpoint ENI characteristics and limits: (1) One ENI is created per specified subnet/Availability Zone. (2) High Availability: To ensure multi-AZ resilience, always create endpoint ENIs across at least two Availability Zones. (3) Security Groups: Attached directly to the Endpoint ENIs (acting as a firewall on the service entrance). (4) IP Consumption: Each endpoint ENI consumes 1 private IP address from the subnet CIDR.",
  "keyPoints": [
    "AWS automatically provisions and manages an ENI inside each selected subnet for the interface endpoint.",
    "Assigned a dedicated private IP address drawn from the local subnet CIDR block.",
    "Controlled via attached VPC Security Groups to restrict inbound network access to authorized sources.",
    "Must be deployed across multiple subnets in different Availability Zones to ensure high availability.",
    "Can be monitored using standard Amazon VPC Flow Logs for network traffic auditing and security forensics.",
    "Consumed private IPs count against subnet capacity and cannot be shared across multiple distinct endpoints."
  ],
  "commonMistake": "Deploying an Interface VPC Endpoint in only a single subnet/AZ for production workloads. If that Availability Zone experiences an outage, workloads in other AZs lose connectivity to the endpoint; always specify subnets across multiple AZs for high availability.",
  "example": "List the private IP addresses and ENI IDs of an interface endpoint using the AWS CLI: aws ec2 describe-vpc-endpoints --vpc-endpoint-ids vpce-0123456789abcdef0 --query 'VpcEndpoints[0].NetworkInterfaceIds'.",
  "sources": [
    {
      "title": "Interface VPC Endpoints Architecture and ENIs",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html"
    },
    {
      "title": "Elastic Network Interfaces (ENIs) in Amazon VPC",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-interfaces.html"
    }
  ]
});
