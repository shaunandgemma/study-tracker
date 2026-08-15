import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-6", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway VPN Attachments", "status": "ready",
  "plainEnglish": "An AWS Site-to-Site VPN attachment connects a customer network to a Transit Gateway through encrypted IPsec tunnels. The customer gateway device and AWS VPN configuration exchange routes either dynamically with Border Gateway Protocol (BGP) or through configured static prefixes, according to the VPN routing option.",
  "whyItMatters": "A VPN attachment lets multiple VPCs share hybrid connectivity without a separate VPN for every VPC. The tunnels are only one part of the path: on-premises routing, BGP or static prefixes, Transit Gateway association and propagation, VPC subnet routes, security controls, and return advertisements must agree.",
  "workplaceExample": "A branch advertises `192.0.2.0/24` over BGP to a Transit Gateway VPN attachment. The branch route propagates into the application attachment's lookup table, application subnet routes send branch traffic to Transit Gateway, and VPC prefixes are advertised back to the customer gateway. Both VPN tunnels are configured and monitored.",
  "examFocus": "Site-to-Site VPN provides encrypted tunnels to a customer gateway. BGP-capable devices use dynamic routing; supported static designs configure prefixes explicitly. Propagation can install learned VPN routes in Transit Gateway tables, but VPC subnet and customer-network return routes remain required.",
  "keyPoints": [
    "The VPN attachment terminates Site-to-Site VPN connectivity at the Transit Gateway and is distinct from a VPC attachment.",
    "Dynamic routing uses BGP advertisements; static routing uses explicitly configured customer-network prefixes where supported.",
    "The customer gateway's ASN, tunnel addresses, IPsec parameters, and routing mode must match the AWS-generated configuration.",
    "Associate the VPN attachment with the Transit Gateway table that should route traffic arriving from on premises.",
    "Enable propagation into only the Transit Gateway tables whose attached networks should learn the VPN routes, or use deliberate static routes.",
    "VPC subnet route tables must point on-premises prefixes to Transit Gateway, and the customer gateway must know the return VPC prefixes.",
    "Use both tunnels and design broader device, connection, and site resilience; a single VPN configuration is not a complete resilience strategy."
  ],
  "commonMistake": "Do not troubleshoot only the IPsec tunnel state. A tunnel can be up while traffic fails because BGP routes are absent, a VPN attachment is associated with the wrong table, propagation is disabled, a VPC route is missing, or the branch lacks the return prefix.",
  "example": "For a fictional branch range `192.0.2.0/24` and VPC range `10.0.0.0/16`, list the two tunnel states, expected BGP advertisements, VPN attachment association, propagation target, VPC subnet route, branch return route, and security rules. Then model one tunnel failure and confirm the design has a tested alternate path.",
  "sources": [
    {"title": "Get started with AWS Site-to-Site VPN", "url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html"},
    {"title": "Static and dynamic routing in AWS Site-to-Site VPN", "url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-static-dynamic.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
