import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-keyspaces",
  "topicTitle": "Amazon Keyspaces",
  "objectiveCode": "Databases",
  "status": "ready",
  "id": "keyspaces-15",
  "title": "Keyspaces VPC Interface Endpoints",
  "plainEnglish": "Amazon Keyspaces VPC Interface Endpoints (powered by AWS PrivateLink) allow you to securely connect your private Amazon Virtual Private Cloud (VPC) resources directly to Amazon Keyspaces without sending traffic over the public internet. It places dedicated Elastic Network Interfaces (ENIs) with private IP addresses inside your VPC subnets, routing all database queries through private AWS network infrastructure.",
  "whyItMatters": "Enterprise security policies often prohibit backend database workloads from communicating over public internet gateways or having outbound public IP addresses. VPC Interface Endpoints allow applications running in isolated private subnets (such as EC2 instances, Lambda functions, or ECS containers) to access Amazon Keyspaces securely without requiring an Internet Gateway, NAT Gateway, or VPN connection.",
  "workplaceExample": "A banking institution deploys their core ledger microservices inside private subnets with no internet gateway attached. They provision an AWS PrivateLink Interface VPC Endpoint for Amazon Keyspaces (com.amazonaws.us-east-1.cassandra) with private DNS enabled. The ledger microservices connect directly to the standard regional Cassandra endpoint (cassandra.us-east-1.amazonaws.com), resolving to private ENI IP addresses within their VPC.",
  "examFocus": "Understand VPC Interface Endpoints for Keyspaces: (1) Uses AWS PrivateLink (service name: com.amazonaws.<region>.cassandra). (2) Communication occurs over port 9142 with TLS encryption. (3) Enabling Private DNS allows client drivers to use standard Keyspaces DNS names without code changes. (4) VPC Endpoint Policies can restrict which keyspaces or IAM principals can access Keyspaces through that specific endpoint.",
  "keyPoints": [
    "Provides private network connectivity from Amazon VPC to Amazon Keyspaces via AWS PrivateLink.",
    "Provisions Elastic Network Interfaces (ENIs) with private IP addresses directly in your VPC subnets.",
    "Eliminates the need for Internet Gateways, NAT Gateways, or public IP routing for database queries.",
    "Enables Private DNS to automatically resolve standard regional endpoints (cassandra.<region>.amazonaws.com) to private VPC endpoint IPs.",
    "Database traffic is encrypted with TLS 1.2+ and travels strictly over the private AWS global network backbone.",
    "Supports VPC Endpoint Policies to enforce granular access control rules restricting allowed keyspaces or IAM principals."
  ],
  "commonMistake": "Forgetting to open inbound TCP port 9142 on the Security Group attached to the VPC Interface Endpoint. If port 9142 is blocked, Cassandra client drivers will fail to connect and time out during SSL/TLS handshakes.",
  "example": "Create a VPC Interface Endpoint for Amazon Keyspaces using the AWS CLI: aws ec2 create-vpc-endpoint --vpc-id vpc-01234567 --service-name com.amazonaws.us-east-1.cassandra --vpc-endpoint-type Interface --subnet-ids subnet-11111 subnet-22222 --security-group-ids sg-12345 --private-dns-enabled.",
  "sources": [
    {
      "title": "Using Amazon Keyspaces with Interface VPC Endpoints (AWS PrivateLink)",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/vpc-endpoints.html"
    },
    {
      "title": "Connecting to Amazon Keyspaces Using an Interface VPC Endpoint",
      "url": "https://docs.aws.amazon.com/keyspaces/latest/devguide/vpc-endpoints-connecting.html"
    }
  ]
});
