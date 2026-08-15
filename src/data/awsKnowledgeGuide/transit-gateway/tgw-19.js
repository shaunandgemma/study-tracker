import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-19", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway vs VPC Peering", "status": "ready",
  "plainEnglish": "VPC peering is a direct, one-to-one private connection between two virtual private clouds (VPCs). It is not transitive: a VPC cannot act as a router between its peers. Transit Gateway is a Regional hub that can route transitively among supported attachments when its route tables and every attached network's routes allow the traffic.",
  "whyItMatters": "The choice affects topology, route count, operational ownership, segmentation, path length, and cost. A few simple VPC pairs may suit peering, while many VPCs or connections to VPN and Direct Connect commonly benefit from a managed hub. Neither option removes the need for security and return-path design.",
  "workplaceExample": "Two tightly coupled VPCs use one peering connection and reciprocal subnet routes. Later, dozens of application VPCs need shared on-premises, egress, and inspection paths. The team evaluates Transit Gateway so each VPC connects to a hub and central route tables enforce the approved paths instead of building a full peering mesh.",
  "examFocus": "Choose VPC peering for direct VPC-to-VPC connectivity when non-transitive routing is acceptable. Choose Transit Gateway for scalable hub-and-spoke and transitive routing among supported attachments. VPC peering does not provide edge-to-edge access through a peer's VPN, Direct Connect, NAT gateway, internet gateway, or gateway endpoint.",
  "keyPoints": [
    "VPC peering is one-to-one and non-transitive; Transit Gateway is a hub capable of transitive routing among configured attachments.",
    "Both support same-Region and inter-Region patterns, but Transit Gateway remains a Regional resource and uses peering attachments between gateways.",
    "VPC peering uses VPC route tables on both sides; Transit Gateway adds attachment association and Transit Gateway route-table lookup to the path.",
    "Neither service is a firewall or NAT device, so security groups, network ACLs, inspection, address translation, and return routes remain separate concerns.",
    "Overlapping VPC CIDRs prevent VPC peering and also create routing ambiguity in a Transit Gateway design, so plan unique address ranges.",
    "Compare the direct peering path with Transit Gateway attachment-hour, processing, and transfer charges using current pricing for the actual Regions.",
    "AWS Cloud WAN addresses broader centrally managed global networks, while AWS PrivateLink exposes specific services privately rather than providing general transitive IP routing."
  ],
  "commonMistake": "Do not expect VPC B to reach VPC C through its peering connection with VPC A, or expect an attached Transit Gateway to allow all traffic automatically. Peering needs reciprocal VPC routes; Transit Gateway needs correct associations, routes or propagations, VPC routes, return paths, and security controls.",
  "example": "Compare two designs for four VPCs using documentation-only CIDRs. Count the direct peering relationships and reciprocal route changes for full connectivity, then draw one Transit Gateway attachment per VPC and identify each associated lookup table. Note which design better expresses required segmentation and which introduces hub processing cost.",
  "sources": [
    {"title": "What is VPC peering?", "url": "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"},
    {"title": "How VPC peering connections work", "url": "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
