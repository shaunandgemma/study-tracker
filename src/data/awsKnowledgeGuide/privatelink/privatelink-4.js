import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-4",
  "title": "AWS PrivateLink Private Service Connectivity",
  "plainEnglish": "AWS PrivateLink is a high-performance, highly secure private networking technology that provides private connectivity between Virtual Private Clouds (VPCs), AWS services, on-premises networks, and third-party SaaS applications. PrivateLink establishes secure, unidirectional network paths using private IP addresses on the AWS global network backbone, entirely bypassing the public internet, Internet Gateways, NAT devices, and public IP addressing.",
  "whyItMatters": "Exposing internal microservices or connecting to third-party SaaS platforms over the public internet exposes traffic to interception, DDoS attacks, and complex firewall configurations. AWS PrivateLink allows organizations to consume and publish services privately without exposing underlying network topologies or requiring complex bidirectional VPC peering meshes.",
  "workplaceExample": "A cybersecurity SaaS provider hosts a multi-tenant threat intelligence platform in AWS Account A. Enterprise customers in Account B, C, and D need to query the threat database privately. Instead of managing complex VPC peering with overlapping IP address ranges, the SaaS provider creates an AWS PrivateLink Endpoint Service behind a Network Load Balancer, allowing customers to connect securely via private endpoint IP addresses in their own VPCs.",
  "examFocus": "Understand core PrivateLink concepts: (1) Service Provider: Exposes a service hosted behind a Network Load Balancer (NLB) or Gateway Load Balancer (GWLB) via an Endpoint Service. (2) Service Consumer: Connects to the service by creating an Interface VPC Endpoint (`vpce-xxxx`). (3) Traffic is consumer-initiated and strictly unidirectional to the exposed service; it is NOT transitive full network routing. (4) Overlapping CIDRs: PrivateLink works seamlessly between VPCs with identical or overlapping IP address spaces.",
  "keyPoints": [
    "Provides private, unidirectional connectivity to AWS services, SaaS applications, and custom APIs.",
    "Keeps all network traffic securely on the AWS global backbone, bypassing the public internet completely.",
    "Eliminates the need for Internet Gateways, NAT Gateways, public IP addresses, or route table modifications.",
    "Works seamlessly between VPCs with overlapping CIDR blocks because connections target a specific service rather than full IP subnets.",
    "Service providers front their backend workloads with a Network Load Balancer (NLB) or Gateway Load Balancer (GWLB).",
    "Consumers access the service via private IP Elastic Network Interfaces (ENIs) deployed in their local VPC subnets."
  ],
  "commonMistake": "Thinking AWS PrivateLink provides bidirectional full network connectivity like VPC Peering. PrivateLink is strictly a consumer-initiated service connection; the service provider cannot initiate connections back to the consumer's VPC.",
  "example": "Architecture: Consumer EC2 in private subnet -> Interface VPC Endpoint (private IP 10.0.1.50) -> AWS PrivateLink Backbone -> Provider Network Load Balancer -> Provider ECS backend microservices.",
  "sources": [
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    },
    {
      "title": "AWS PrivateLink Concepts and Architecture",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html"
    }
  ]
});
