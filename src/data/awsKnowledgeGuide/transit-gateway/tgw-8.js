import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-8", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Peering Attachments", "status": "ready",
  "plainEnglish": "A Transit Gateway peering attachment connects two Transit Gateways so their attached networks can route to each other. One Transit Gateway owner is the requester and the peer owner is the accepter. After acceptance, each side must add static Transit Gateway routes for remote prefixes that target the peering attachment.",
  "whyItMatters": "Peering extends a hub architecture across Regions or accounts without creating direct peering between every VPC. It also creates a new routing boundary: routes learned from VPC, VPN, or Direct Connect attachments do not automatically propagate across the peer, so both teams must maintain an intentional prefix plan.",
  "workplaceExample": "Two Regional Transit Gateways peer to connect an application VPC to a disaster-recovery VPC. The requester creates the attachment and the remote owner accepts it. Each Transit Gateway table has a static route for the other VPC's non-overlapping CIDR, and both VPC subnet route tables provide forward and return paths.",
  "examFocus": "Transit Gateway peering can be intra-Region or inter-Region and can cross accounts. It is different from VPC peering. Peering requires acceptance and static routes on both sides; ordinary Transit Gateway route propagation does not automatically carry routes across the peering attachment.",
  "keyPoints": [
    "The requester specifies the peer Transit Gateway, account, and Region, and the accepter owner accepts or rejects the request.",
    "A peering attachment must reach an available state before it can carry routed traffic.",
    "Each side adds static routes for remote CIDRs to the peering attachment in the tables used by source attachments.",
    "Routes do not automatically propagate across Transit Gateway peering, so remote-prefix changes need coordinated route updates.",
    "VPC subnet tables on both sides still need routes to their local Transit Gateway, including the return direction.",
    "Overlapping CIDRs make destinations ambiguous and should be corrected through address planning rather than expecting peering to translate them.",
    "Inter-Region traffic has documented encryption and data-transfer considerations, and peering availability remains Region dependent."
  ],
  "commonMistake": "Do not accept the peering request and assume propagated spoke routes cross it. Add and review static remote-prefix routes on both Transit Gateways, then verify the two VPC route tables and security controls for forward and reply traffic.",
  "example": "Use `10.0.0.0/16` behind Transit Gateway A and `192.0.2.0/24` behind Transit Gateway B. List requester and accepter actions, add the matching static peer route on each side, add VPC routes to each local Transit Gateway, trace the reply, and test on paper how removing either static route breaks the flow.",
  "sources": [
    {"title": "Transit gateway peering attachments", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-peering.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
