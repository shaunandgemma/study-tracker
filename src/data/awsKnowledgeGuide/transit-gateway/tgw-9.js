import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-9", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Route Tables", "status": "ready",
  "plainEnglish": "A Transit Gateway route table contains destination prefixes and next-hop attachments. When a packet arrives through an attachment, Transit Gateway uses the route table associated with that source attachment, finds the most specific matching destination, and forwards to the selected VPC, VPN, Direct Connect gateway, peering, or other supported attachment—or drops it for a blackhole route.",
  "whyItMatters": "Transit Gateway route tables are the central control point for reachability and segmentation across many networks. They are separate from VPC subnet route tables: the VPC table sends a packet into Transit Gateway, while the Transit Gateway table decides where that packet goes next.",
  "workplaceExample": "Production and development attachments use different Transit Gateway tables. Both tables contain a route to a shared-services attachment, but neither contains a route to the other environment. The shared-services attachment's associated table has return routes to each environment, allowing controlled service access without production-to-development routing.",
  "examFocus": "Know the two route-table layers and the source-attachment lookup model. Longest-prefix matching selects the most specific route. For an identical destination, documented attachment-type priorities apply; a static route has priority over a propagated route with the same CIDR. Transit Gateway is routing, not firewalling.",
  "keyPoints": [
    "Every packet lookup uses the Transit Gateway route table associated with the attachment on which that packet arrived.",
    "A route destination can select a next attachment, reference a supported prefix list, or deliberately blackhole matching traffic.",
    "A more-specific route normally wins over a less-specific route, such as a `/24` over a `/16`.",
    "When a static and propagated route have the same destination CIDR, the static route has higher documented priority.",
    "Default association and propagation can populate a default table, while custom tables support deliberate segmentation.",
    "VPC subnet routes and destination return routes are still required; entries in only the Transit Gateway table are insufficient.",
    "Exported route-table data is a point-in-time file for analysis and is not a live mechanism for controlling forwarding."
  ],
  "commonMistake": "Do not inspect the destination VPC route table and assume it shows how Transit Gateway forwards arriving traffic. Identify the source attachment, open its associated Transit Gateway table, apply longest-prefix matching, and then verify the complete reverse lookup.",
  "example": "Create a paper table with `10.0.0.0/8` pointing to shared services, `10.1.0.0/16` pointing to production, and `10.1.2.0/24` as a blackhole. Trace three destination addresses using longest-prefix match, then document VPC subnet routes and the return route needed for each permitted flow.",
  "sources": [
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "Create a static route in AWS Transit Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-create-static-route.html"}
  ]
});
