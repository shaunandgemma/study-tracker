import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-15", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Inter-Region Peering", "status": "ready",
  "plainEnglish": "A Transit Gateway is a Regional router. An inter-Region peering attachment privately connects two Transit Gateways in different AWS Regions so networks attached to one gateway can reach networks attached to the other. The peer owner must accept the request, and administrators must add static routes that target the peering attachment.",
  "whyItMatters": "Inter-Region peering can join regional network hubs without sending traffic over the public internet. It does not merge the gateways or their route tables, so each Region keeps separate routing, ownership, failure boundaries, and costs.",
  "workplaceExample": "A company has application VPCs in two Regions. Each VPC subnet table routes the remote application CIDR to its local Transit Gateway. Each gateway has a static route to the remote CIDR through the peering attachment, and the remote VPC has the reverse routes required for replies.",
  "examFocus": "Remember that Transit Gateways are Regional and peering can connect them across Regions. Routes are not automatically propagated across a Transit Gateway peering attachment: configure static routes on both gateway sides and the required VPC forward and return routes. Overlapping CIDRs cannot be routed reliably.",
  "keyPoints": [
    "The requester creates the peering attachment, and the owner of the accepter Transit Gateway accepts it before it becomes usable.",
    "A Transit Gateway route table needs a static route for each remote prefix that should use the peering attachment.",
    "Configure the reverse direction on the peer Transit Gateway; creating only one static route produces a broken reply path.",
    "VPC subnet route tables still send remote traffic to the local Transit Gateway and must be correct on both sides.",
    "Association chooses which Transit Gateway table handles traffic arriving from an attachment; peering does not copy associations or propagations between gateways.",
    "Inter-Region peering traffic stays on the AWS global network and AWS documents virtual-layer AES-256 encryption between Regions.",
    "Use non-overlapping CIDRs and consider inter-Region data-transfer and Transit Gateway processing charges when comparing designs."
  ],
  "commonMistake": "Do not assume accepting the peering attachment advertises every attached VPC route to the other gateway. Add intentional static routes on both Transit Gateways, verify the associated lookup tables, and trace the complete request and return path through both Regions.",
  "example": "Using documentation-only CIDRs, draw Region A with VPC 192.0.2.0/24 and Region B with VPC 198.51.100.0/24. Record both VPC subnet routes and the static remote-prefix route in each Transit Gateway table, then trace a packet and reply across the peering attachment.",
  "sources": [
    {"title": "Transit gateway peering attachments", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-peering.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
