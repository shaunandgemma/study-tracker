import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-25",
  "title": "Hybrid DNS Resolution",
  "plainEnglish": "Hybrid DNS Resolution is the unified, bidirectional Domain Name System architecture that enables workloads running inside AWS Amazon VPCs and servers running inside on-premises corporate data centers to seamlessly resolve each other's private domain names over AWS Direct Connect or Site-to-Site VPN connections. This is achieved by pairing Route 53 Resolver Inbound Endpoints (for on-prem to AWS lookups) with Outbound Endpoints and Forwarding Rules (for AWS to on-prem lookups).",
  "whyItMatters": "Hybrid cloud migrations require applications spread across data centers and cloud VPCs to communicate continuously. Without bidirectional hybrid DNS, developers are forced to maintain brittle IP address mappings, duplicate hosts files, or run unmanaged DNS proxy servers, leading to DNS resolution failures, split-brain routing, and migration delays.",
  "workplaceExample": "An enterprise establishes a bidirectional Hybrid DNS architecture: (1) AWS to On-Prem: An Outbound Resolver Endpoint with a Forwarding Rule sends queries for `*.corp.internal` to on-premises DNS servers (`192.168.1.5`). (2) On-Prem to AWS: An Inbound Resolver Endpoint receives queries on IP `10.0.1.53`; on-premises DNS servers forward queries for `*.aws.corp` to `10.0.1.53`. Workloads in both environments resolve private services in the other environment transparently.",
  "examFocus": "Understand the two halves of bidirectional Hybrid DNS: (1) Inbound Flow: On-Premises Client -> On-Premises DNS Server -> Direct Connect/VPN -> Route 53 Resolver INBOUND Endpoint -> Route 53 Private Hosted Zone. (2) Outbound Flow: EC2 Instance -> Route 53 Resolver (.2) -> Resolver Forwarding Rule -> Route 53 Resolver OUTBOUND Endpoint -> Direct Connect/VPN -> On-Premises DNS Server.",
  "keyPoints": [
    "Delivers seamless bidirectional private DNS resolution between AWS VPCs and on-premises networks.",
    "Combines Route 53 Resolver Inbound Endpoints, Outbound Endpoints, and Forwarding Rules.",
    "Operates securely over dedicated AWS Direct Connect or AWS Site-to-Site VPN private connections.",
    "Inbound Endpoints provide IP listening targets for on-premises DNS conditional forwarders.",
    "Outbound Endpoints provide VPC exit interfaces for Forwarding Rules pointing to on-premises DNS IPs.",
    "Eliminates the operational overhead and single-point-of-failure risks of self-managed EC2 BIND forwarders."
  ],
  "commonMistake": "Creating circular DNS forwarding loops where an on-premises DNS server forwards `example.com` to Route 53, while a Route 53 Resolver rule forwards `example.com` back to on-premises. Ensure each environment is authoritative for distinct non-overlapping subdomains.",
  "example": "Architecture: Configure on-premises Microsoft DNS conditional forwarder for `aws.corp` pointing to Inbound Endpoint IPs `10.0.1.10` and `10.0.2.10`; configure Route 53 Resolver Forwarding Rule for `onprem.corp` pointing to on-premises DNS IPs `192.168.10.20` and `192.168.10.21` via Outbound Endpoint.",
  "sources": [
    {
      "title": "Hybrid DNS Resolution Using Amazon Route 53 Resolver",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-hybrid-dns.html"
    },
    {
      "title": "Hybrid DNS Resolution Architecture (AWS Whitepapers)",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/hybrid-dns-resolution.html"
    }
  ]
});
