import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-18", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Centralized Inspection", "status": "ready",
  "plainEnglish": "Centralized inspection deliberately routes traffic from multiple attachments through one shared security control. One design uses stateful appliances or Network Firewall endpoints in an inspection VPC with an appliance-mode VPC attachment. A newer AWS Network Firewall design can connect the firewall directly through a Transit Gateway network-function attachment, with AWS managing the underlying buffer VPC networking.",
  "whyItMatters": "Central inspection can apply consistent policy and logging, but a route that bypasses the firewall or an asymmetric return path can defeat the design. The routing policy, appliance state, Availability Zone behavior, ownership, monitoring, and failure response are all part of the security control.",
  "workplaceExample": "Production spokes associate with a Transit Gateway table whose application prefixes point to the inspection attachment. After inspection, a separate table forwards allowed traffic to the destination attachment. Reverse routes send replies back through inspection rather than directly to the source, and monitoring alerts if the firewall attachment is not ready.",
  "examFocus": "Transit Gateway forwards packets but does not inspect them. With stateful appliances in a VPC, use appliance mode and symmetric routing. With a Transit Gateway-attached AWS Network Firewall, AWS creates a network-function attachment with appliance mode enabled and supports static Transit Gateway routing. In either pattern, route both directions through the control and prevent bypass.",
  "keyPoints": [
    "A traditional inspection VPC needs attachment subnets, firewall endpoints or appliances, VPC route tables, and an appliance-mode VPC attachment.",
    "A Transit Gateway network-function attachment connects AWS Network Firewall directly and removes the need to manage a separate inspection VPC.",
    "AWS Network Firewall network-function attachments use static Transit Gateway routes; administrators explicitly steer selected prefixes to the firewall.",
    "Stateful inspection requires the request and reply to traverse a consistent path, so symmetry must be checked in both Transit Gateway and VPC tables.",
    "Separate Transit Gateway route tables can implement pre-inspection and post-inspection forwarding and reduce accidental direct paths.",
    "Security groups and network ACLs still apply where relevant; Transit Gateway itself is neither a firewall nor a NAT service.",
    "Design for multiple Availability Zones, monitor attachment and firewall health, and decide whether failure should block traffic or use a controlled fallback."
  ],
  "commonMistake": "Do not propagate every spoke route into every table and assume traffic will still visit the firewall. A more-specific or direct route can bypass inspection. Validate the selected route at every stage and trace the reply through the same stateful control before declaring the path secure.",
  "example": "Create a paper route matrix for source, inspection, and destination attachments. For one allowed flow, record the associated table and next attachment at each Transit Gateway entry, then the VPC or network-function inspection step and the full reverse path. Add a test that detects any direct source-to-destination route.",
  "sources": [
    {"title": "How AWS Transit Gateway works: appliance and network function attachments", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "AWS Transit Gateway network function attachments", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-nf-fw.html"},
    {"title": "Route traffic through a network function attachment", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/route-traffic-nf-attachment.html"},
    {"title": "Transit Gateway attachment configuration for AWS Network Firewall", "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/vpc-config-tgw-multi-az.html"}
  ]
});
