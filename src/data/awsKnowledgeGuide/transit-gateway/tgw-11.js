import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-11", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Route Propagation", "status": "ready",
  "plainEnglish": "Transit Gateway route propagation installs an attachment's advertised or known prefixes into selected Transit Gateway route tables. A VPC attachment propagates its VPC CIDRs; dynamic VPN and Direct Connect gateway attachments can propagate routes learned through Border Gateway Protocol (BGP). An attachment can propagate to multiple tables where the attachment type supports it.",
  "whyItMatters": "Propagation reduces manual route maintenance as networks or BGP advertisements change. It can also expose a network to more attachments than intended, because learned routes appear in every enabled table. Propagation design must follow segmentation intent and be reviewed before broad advertisements enter a central hub.",
  "workplaceExample": "A shared-services VPC propagates its CIDR to both production and development Transit Gateway tables. Production and development do not propagate to each other's lookup tables, but both propagate to the shared-services return table. This enables controlled shared access without automatically creating a direct route between the environments.",
  "examFocus": "Propagation and association are different: propagation supplies routes to a table, while association selects the one table used for incoming traffic. An attachment may propagate to multiple tables but associates with one. Ordinary Transit Gateway peering supports static routes rather than propagation across the peer.",
  "keyPoints": [
    "VPC propagation adds the attachment VPC's IPv4 and supported IPv6 CIDRs to the selected Transit Gateway table.",
    "Dynamic VPN, VPN Concentrator, and Direct Connect gateway attachments can propagate supported BGP-learned routes.",
    "Propagation can be enabled for multiple Transit Gateway route tables where supported, independently of the attachment's one association.",
    "Default propagation can automatically add new attachment routes to the default table and may be unsuitable for strict segmentation.",
    "Transit Gateway does not provide per-prefix filtering of an attachment's advertised routes at propagation, so control advertisements and table selection deliberately.",
    "A static route with the identical destination has higher priority and suppresses display of the overlapping propagated route until removed.",
    "Propagation changes only Transit Gateway tables; VPC subnet and on-premises return routes still need correct configuration."
  ],
  "commonMistake": "Do not enable every attachment's propagation into every table to make a missing route disappear. That can create unintended connectivity. Identify which source attachments need the destination, enable only the required propagation, and verify reverse propagation or static return routes.",
  "example": "Use separate production, development, and shared-services tables on paper. Show the shared-services CIDR propagating to both environment tables and both environment CIDRs propagating only to the shared-services return table. Trace both allowed replies and prove that no development-to-production destination appears.",
  "sources": [
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "Transit gateways in AWS Transit Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html"}
  ]
});
