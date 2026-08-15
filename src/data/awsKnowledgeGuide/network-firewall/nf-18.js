import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-18",
  "title": "Network Firewall vs Security Groups and NACLs",
  "plainEnglish": "AWS Network Firewall, Security Groups, and Network Access Control Lists (NACLs) provide complementary, multi-layered defense-in-depth within an Amazon VPC. Security Groups act as stateful virtual firewalls attached at the instance/ENI level. NACLs act as stateless packet filters at the subnet boundary. AWS Network Firewall operates as an inline, VPC-wide perimeter defense system offering advanced Layer 3 through Layer 7 deep packet inspection, IDS/IPS intrusion prevention, and domain filtering.",
  "whyItMatters": "Relying solely on Security Groups or NACLs leaves systems vulnerable to malware command-and-control communication, SQL injection payloads hidden inside open ports, and outbound data exfiltration to unapproved domains. Understanding the strengths of each service allows architects to layer controls effectively without redundancy.",
  "workplaceExample": "A secure banking architecture implements defense-in-depth: (1) AWS Network Firewall sits at the VPC perimeter inspecting all ingress/egress traffic with Suricata IPS signatures and domain allowlists, (2) Network ACLs provide subnet-level coarse IP blocking of blacklisted CIDR ranges, and (3) Security Groups enforce micro-segmentation, allowing only specific web server security groups to connect to the database on port 5432.",
  "examFocus": "Compare the three VPC security controls for AWS certification exams: (1) Security Groups: Stateful (return traffic allowed automatically), ENI/instance level, allow rules only, evaluates all rules before deciding. (2) Network ACLs: Stateless (requires explicit inbound/outbound rules), subnet level, supports allow AND deny rules, evaluated in numeric rule order. (3) AWS Network Firewall: Stateful + Stateless, VPC-wide inline routing, Layer 3–7 DPI, Suricata IDS/IPS, FQDN domain filtering.",
  "keyPoints": [
    "Security Groups: Stateful, attached to individual ENIs/instances, supports allow rules only.",
    "Network ACLs: Stateless, attached at the subnet boundary, supports allow and deny rules in numeric order.",
    "AWS Network Firewall: Inline VPC routing, provides Layer 3–7 deep packet inspection, IDS/IPS, and domain filtering.",
    "Network Firewall does NOT replace Security Groups or NACLs; all three work together as defense-in-depth.",
    "Neither Security Groups nor NACLs can perform domain name (FQDN) filtering or deep payload inspection.",
    "Network Firewall scales automatically up to 100 Gbps per AZ and integrates centrally with AWS Firewall Manager."
  ],
  "commonMistake": "Attempting to implement domain allowlists (e.g., allow `*.github.com`) using Security Groups or NACLs. Neither Security Groups nor NACLs support domain names or Layer 7 inspection; FQDN filtering requires AWS Network Firewall.",
  "example": "Use Security Groups to allow inbound HTTPS (port 443) only from an Application Load Balancer to EC2 instances; use AWS Network Firewall at the VPC internet gateway to inspect that HTTPS traffic for known malware signatures and exploit payloads.",
  "sources": [
    {
      "title": "VPC Security Groups and Network ACLs Overview",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html"
    },
    {
      "title": "AWS Network Firewall Overview and Comparison",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    }
  ]
});
