import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-1",
  "title": "Stateful & Stateless Firewall Engine for VPC Perimeter Protection",
  "plainEnglish": "AWS Network Firewall is a fully managed, stateful network security service that protects your Amazon Virtual Private Cloud (VPC) perimeters. It operates a two-tiered inspection architecture combining a high-throughput Stateless Engine (which evaluates individual network packets without tracking connection context) and a deep Stateful Engine (which analyzes bidirectional network flows, application protocols, and intrusion signatures across full TCP/UDP connections).",
  "whyItMatters": "While Security Groups and Network Access Control Lists (NACLs) provide basic IP and port filtering, they lack advanced threat detection, domain name filtering, and deep packet inspection. AWS Network Firewall provides enterprise-grade perimeter defense that scales automatically up to 100 Gbps per Availability Zone with built-in high availability.",
  "workplaceExample": "An enterprise e-commerce platform deploys AWS Network Firewall at its VPC internet boundary. Inbound HTTP/HTTPS traffic hits the Stateless Engine first; high-priority stateless rules immediately drop known volumetric SYN flood attacks. Legitimate traffic is forwarded to the Stateful Engine, which verifies TLS Server Name Indication (SNI) certificates and inspects Suricata intrusion signatures to block SQL injection and remote code execution attempts.",
  "examFocus": "Understand the two-tier inspection pipeline in AWS Network Firewall: (1) Stateless Engine runs FIRST: Evaluates packets in order of numeric priority. Stateless actions include `Pass` (bypasses all further inspection), `Drop` (silently discards), or `Forward to stateful rules`. (2) Stateful Engine runs SECOND: Evaluates connection flows using 5-tuple rules, domain lists, and Suricata rules. Stateful actions include `Pass`, `Drop`, `Reject` (sends TCP reset / ICMP unreachable), and `Alert`.",
  "keyPoints": [
    "Two-tiered firewall engine combining ultra-fast Stateless inspection with deep Stateful inspection.",
    "Stateless engine evaluates individual packets based on 5-tuple criteria and rule priorities (lowest number evaluated first).",
    "Stateless default actions dictate whether unmatched packets are passed, dropped, or forwarded to the stateful engine.",
    "Stateful engine analyzes bidirectional connection state, application protocols, domain names, and Suricata signatures.",
    "Scales automatically with VPC traffic bandwidth up to 100 Gbps per Availability Zone.",
    "Requires VPC route tables to be configured explicitly to route ingress and egress traffic through firewall endpoints."
  ],
  "commonMistake": "Configuring a stateless rule with the `Pass` action intending to allow traffic to be inspected by stateful rules. The stateless `Pass` action completely bypasses the stateful engine; to allow stateful inspection, use the `Forward to stateful rules` action.",
  "example": "Configure a stateless rule group with a rule forwarding TCP port 443 traffic to the stateful engine: match protocol 6 (TCP), destination port 443, priority 100, action 'aws:forward_to_sfe'.",
  "sources": [
    {
      "title": "What is AWS Network Firewall?",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    },
    {
      "title": "Evaluation Order and Rule Actions in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-action.html"
    }
  ]
});
