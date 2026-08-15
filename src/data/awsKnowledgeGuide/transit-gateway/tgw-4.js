import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-4", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Hub-and-Spoke Networking", "status": "ready",
  "plainEnglish": "AWS Transit Gateway is a Regional routing hub. Virtual private clouds (VPCs), Site-to-Site VPNs, Direct Connect gateways, peered Transit Gateways, and other supported networks connect through attachments. Traffic arriving from one attachment is looked up in the Transit Gateway route table associated with that attachment, and a matching route selects the next attachment.",
  "whyItMatters": "A hub-and-spoke design replaces a growing mesh of point-to-point connections with central routing and policy ownership. Centralization simplifies expansion, but one incorrect route-table change can affect many networks, so CIDR planning, segmentation, review, monitoring, and rollback are important.",
  "workplaceExample": "Three application VPCs attach to one Transit Gateway. Their subnet route tables send a shared-services CIDR to the Transit Gateway, their attachment-associated Transit Gateway tables point to the shared-services attachment, and the shared-services VPC has return routes to all three VPC CIDRs. Security groups allow only the required application ports.",
  "examFocus": "Transit Gateway provides transitive routing between supported attachments, unlike direct VPC peering. It is Regional; use Transit Gateway peering or another supported design across Regions. Attaching networks does not create working communication until VPC, Transit Gateway, destination, return, and security paths are all correct.",
  "keyPoints": [
    "VPC subnet route tables decide whether workload traffic is sent to the Transit Gateway attachment.",
    "The Transit Gateway route table associated with the source attachment selects the next attachment for an arriving packet.",
    "The destination network and every return-path table must route replies back through the appropriate Transit Gateway attachment.",
    "Association chooses an attachment's lookup table; propagation installs an attachment's learned routes into selected tables and is a different operation.",
    "Separate Transit Gateway route tables can segment spokes only when their associations and route contents actually prevent unwanted paths.",
    "Transit Gateway does not perform NAT or act as a firewall; security groups, network ACLs, firewalls, and workload controls remain necessary.",
    "Plan non-overlapping CIDRs, attachment-hour and data-processing costs, operational ownership, and route-change blast radius before centralizing."
  ],
  "commonMistake": "Do not stop after every VPC attachment reports available. Trace one packet and its reply through the source subnet route, source attachment association, Transit Gateway destination route, destination subnet route, and all security controls.",
  "example": "On paper, connect VPC A, VPC B, and a shared-services VPC using non-overlapping documentation ranges. For an A-to-shared request, record the source subnet route, associated Transit Gateway table and next attachment, destination route and security rule; then write the reverse path. Confirm no route unintentionally permits A-to-B traffic.",
  "sources": [
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "Transit gateways in AWS Transit Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html"}
  ]
});
