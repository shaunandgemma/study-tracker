import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-17", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Centralized Internet Egress", "status": "ready",
  "plainEnglish": "Centralized internet egress sends outbound traffic from private spoke VPCs through a Transit Gateway to an egress VPC. The egress VPC contains a public NAT gateway and an internet gateway. Transit Gateway routes between networks; the NAT gateway translates private IPv4 source addresses, and the internet gateway provides the path to the internet.",
  "whyItMatters": "A shared egress VPC can centralize public source addresses, inspection, logging, and operating controls. It also concentrates dependency and cost, so Availability Zone placement, capacity, route isolation, failure behavior, and the complete reply path must be designed deliberately.",
  "workplaceExample": "Private application subnets use a default route to Transit Gateway. The spoke-associated Transit Gateway table sends the default route to the egress VPC attachment. In the egress VPC, the attachment subnet routes internet traffic to a same-zone public NAT gateway, whose public subnet routes to the internet gateway. Return routes lead back to each spoke.",
  "examFocus": "Transit Gateway is not a NAT gateway and does not itself provide internet access. For the documented IPv4 pattern, private spokes need routes to Transit Gateway, the gateway needs a default route to the egress attachment, and the egress VPC needs a public NAT gateway, internet gateway, and routes back to spoke CIDRs. Do not confuse this with inbound internet publishing.",
  "keyPoints": [
    "A spoke subnet can use 0.0.0.0/0 to send IPv4 internet-bound traffic to its Transit Gateway attachment.",
    "The Transit Gateway lookup table associated with the spoke attachment needs a default route to the egress VPC attachment.",
    "The egress attachment should use private subnets whose route tables send internet destinations to the NAT gateway rather than directly to the internet gateway.",
    "A public NAT gateway sits in a public subnet with a route to an internet gateway and uses an Elastic IP address for internet traffic.",
    "The egress-side Transit Gateway table and VPC tables need routes back to every allowed spoke CIDR so translated replies reach the originating workload.",
    "Segmentation routes or blackholes can stop spoke-to-spoke traffic while still allowing the shared outbound path.",
    "Plan a NAT gateway per required Availability Zone and review Transit Gateway processing, NAT processing, and cross-zone data-transfer implications."
  ],
  "commonMistake": "Do not point the egress attachment subnet directly at the internet gateway for private spoke traffic. The internet gateway drops traffic whose instances do not have public addresses. Route through the public NAT gateway, and verify the exact reverse route from the egress VPC to the originating spoke.",
  "example": "For a private workload using a documentation address, trace its packet through the spoke subnet default route, spoke-associated Transit Gateway table, egress attachment subnet, NAT gateway, and internet gateway. Reverse the trace for the reply and note where source translation is created and removed.",
  "sources": [
    {"title": "How AWS Transit Gateway works: centralized outbound routing", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "NAT gateways", "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"},
    {"title": "Internet gateways", "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"}
  ]
});
