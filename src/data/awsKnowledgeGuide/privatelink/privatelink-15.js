import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-15",
  "title": "PrivateLink Non-Transitive Connectivity",
  "plainEnglish": "PrivateLink Non-Transitive Connectivity refers to the fundamental architectural characteristic that AWS PrivateLink establishes an isolated, point-to-point service connection rather than general network routing. When a consumer VPC connects to a service provider via an Interface VPC Endpoint, network traffic cannot 'hop' or transit through the endpoint to access other subnets, other VPCs, the internet, or on-premises networks behind the provider.",
  "whyItMatters": "In multi-tenant SaaS architectures and B2B partner integrations, exposing an entire VPC network introduces massive security liabilities. Because PrivateLink is strictly non-transitive and service-specific, providers can expose a single microservice to untrusted external customers without risking unauthorized lateral network movement into internal databases or private subnets.",
  "workplaceExample": "A banking SaaS provider allows 50 independent enterprise clients to connect to its credit-scoring API via AWS PrivateLink. Because PrivateLink is non-transitive, client companies can only send TCP requests directly to the credit-scoring Network Load Balancer. Clients cannot route traffic through the endpoint to access other client VPCs, internal banking databases, or corporate on-premises networks.",
  "examFocus": "Understand non-transitive routing boundaries for AWS networking exams: (1) Service-Specific: PrivateLink connects a consumer to ONE specific service behind an NLB/GWLB, not the provider's entire VPC. (2) Non-Transitive: Traffic cannot transit through a VPC endpoint to reach other VPCs or the internet. (3) Consumer-Initiated: The connection flow is unidirectional from consumer to provider (the provider cannot initiate connections back to the consumer).",
  "keyPoints": [
    "PrivateLink establishes a point-to-point service channel, not a general Layer 3 network routing path.",
    "Non-transitive: Traffic cannot hop through an endpoint to reach other VPCs, subnets, or the internet.",
    "Connections are strictly consumer-initiated; providers cannot initiate outbound connections to consumers.",
    "Exposes only the specific ports and listeners configured on the provider's Network Load Balancer.",
    "Guarantees network isolation in multi-tenant SaaS environments, preventing lateral movement.",
    "Operates independently of VPC CIDRs, allowing private connectivity across completely overlapping IP spaces."
  ],
  "commonMistake": "Assuming that creating an Interface VPC Endpoint in VPC-A to a service in VPC-B will allow instances in VPC-B to initiate SSH or database connections back to instances in VPC-A. PrivateLink is strictly unidirectional (consumer to provider only).",
  "example": "Architecture: Consumer VPC (10.0.0.0/16) -> Interface Endpoint ENI (10.0.1.20) -> PrivateLink -> Provider NLB (10.0.0.0/16) -> Target App. No other resources in the provider's VPC can be reached.",
  "sources": [
    {
      "title": "AWS PrivateLink Concepts and Architecture",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html"
    },
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    }
  ]
});
