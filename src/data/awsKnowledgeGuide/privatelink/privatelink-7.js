import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-7",
  "title": "Private IP Connectivity",
  "plainEnglish": "Private IP Connectivity in AWS PrivateLink is the ability for client applications inside an Amazon VPC or connected on-premises corporate network to access external AWS services, custom APIs, and SaaS applications using strictly private IPv4 or IPv6 addresses. Network packets travel entirely across the isolated AWS global network backbone, never touching public internet routers or requiring public DNS resolution.",
  "whyItMatters": "Many regulated organizations (such as healthcare, banking, and government agencies) have strict security policies that forbid compute workloads from possessing public IP addresses, routing through Internet Gateways, or sending data across the public internet. Private IP connectivity satisfies these compliance requirements while protecting sensitive payloads from external eavesdropping and DDoS attacks.",
  "workplaceExample": "A private banking database tier runs on EC2 instances with private IPs (`10.50.4.0/24`) and zero internet route. To push audit logs to Amazon CloudWatch and fetch encryption keys from AWS KMS, the team provisions PrivateLink Interface Endpoints. The database instances connect to the endpoints' private IPs (`10.50.4.15` and `10.50.4.82`), transmitting all cryptographic operations securely over private AWS network links.",
  "examFocus": "Understand the scope of Private IP connectivity with PrivateLink: (1) In-VPC: Workloads connect directly to the private IP of the endpoint ENI. (2) Hybrid Access: On-premises servers connected via AWS Direct Connect or AWS Site-to-Site VPN can reach the interface endpoint's private IP address directly without a public proxy. (3) No Public IPs: Neither the client workload nor the endpoint requires public IP addresses or Internet Gateways.",
  "keyPoints": [
    "Enables end-to-end communication using private IP addresses on the AWS private network.",
    "Bypasses the public internet entirely, eliminating exposure to internet-based security threats.",
    "Accessible from on-premises data centers via AWS Direct Connect or Site-to-Site VPN.",
    "Works with both IPv4 and dual-stack IPv6 interface endpoint configurations.",
    "Does not require route table modifications; traffic reaches the endpoint via standard local subnet routing.",
    "Eliminates public NAT Gateway data processing charges for traffic routed to supported private endpoints."
  ],
  "commonMistake": "Assuming that on-premises servers can access Gateway Endpoints via private IPs. Gateway Endpoints (for S3/DynamoDB) use route table routes and cannot be accessed from on-premises; on-premises private IP access requires an Interface VPC Endpoint.",
  "example": "Verify private IP connectivity to an interface endpoint using curl or test-netconnection inside a private EC2 instance: curl -vk https://10.0.1.25:443 --header 'Host: secretsmanager.us-east-1.amazonaws.com'.",
  "sources": [
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    },
    {
      "title": "AWS PrivateLink Endpoint Services Overview",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-service.html"
    }
  ]
});
