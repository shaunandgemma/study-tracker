import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-16",
  "title": "PrivateLink vs VPC Peering",
  "plainEnglish": "AWS PrivateLink and VPC Peering are two primary methods for establishing private network connectivity between VPCs in AWS, but they serve fundamentally different architectural patterns. VPC Peering is a Layer 3 (Network Layer) bidirectional routing connection that joins two VPC networks, allowing any instance in either VPC to communicate directly with any instance in the other (subject to security groups). AWS PrivateLink is a Layer 4/7 service-publishing technology that exposes a single specific application behind a load balancer without joining the underlying networks.",
  "whyItMatters": "VPC Peering requires completely non-overlapping CIDR blocks and establishes broad network-level connectivity, which creates security risks and IP management headaches in large multi-account or multi-tenant SaaS environments. AWS PrivateLink works seamlessly across overlapping IP address spaces and enforces strict zero-trust isolation by exposing only an individual API or service.",
  "workplaceExample": "An enterprise company acquires a startup whose VPC uses the identical `10.0.0.0/16` CIDR block. Because VPC Peering is impossible due to overlapping IP addresses, the enterprise uses AWS PrivateLink to expose its core billing API via an Endpoint Service, allowing the acquired startup's VPC to query the billing service privately without renumbering its entire network.",
  "examFocus": "Compare PrivateLink vs VPC Peering for AWS certification exams: (1) IP Address Space: VPC Peering REQUIRES non-overlapping CIDR blocks; PrivateLink WORKS with overlapping CIDR blocks. (2) Scope of Access: VPC Peering provides full bidirectional subnet-to-subnet routing; PrivateLink provides unidirectional consumer-to-service access only. (3) Backend Architecture: PrivateLink requires an internal Network Load Balancer (NLB); VPC Peering uses standard VPC route tables. (4) Cost: Peering has no hourly charge (standard cross-AZ data transfer fees only); PrivateLink charges hourly per endpoint plus data processing fees.",
  "keyPoints": [
    "VPC Peering provides bidirectional Layer 3 routing between two VPCs; PrivateLink exposes a specific Layer 4/7 service.",
    "PrivateLink supports overlapping and identical VPC CIDR blocks; VPC Peering strictly prohibits overlapping CIDRs.",
    "VPC Peering joins entire network subnets; PrivateLink limits access strictly to the target load-balanced service.",
    "PrivateLink connections are unidirectional (consumer-initiated); VPC Peering allows bidirectional communication.",
    "VPC Peering requires route table updates in both VPCs; PrivateLink uses local subnet ENIs and DNS.",
    "Choose VPC Peering for trusted internal VPC-to-VPC communication; choose PrivateLink for SaaS delivery or overlapping IP spaces."
  ],
  "commonMistake": "Attempting to use VPC Peering to connect two VPCs with overlapping CIDR blocks (e.g., both using `10.0.0.0/16`). AWS will reject the peering connection request; use AWS PrivateLink or AWS Transit Gateway with NAT to connect overlapping VPCs.",
  "example": "Use VPC Peering between internal development and staging VPCs (`10.1.0.0/16` and `10.2.0.0/16`) for full bi-directional developer access; use AWS PrivateLink to expose an internal payment processing service to 50 third-party client VPCs with arbitrary/overlapping IP ranges.",
  "sources": [
    {
      "title": "VPC-to-VPC Connectivity Options (AWS Whitepapers)",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/building-a-scalable-and-secure-multi-vpc-aws-network-infrastructure/vpc-to-vpc-connectivity.html"
    },
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    }
  ]
});
