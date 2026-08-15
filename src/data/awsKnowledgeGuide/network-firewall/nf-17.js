import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-17",
  "title": "Network Firewall Layer 3 through Layer 7 Filtering",
  "plainEnglish": "AWS Network Firewall provides multi-layer inspection spanning Layer 3 (Network), Layer 4 (Transport), and Layer 7 (Application) of the Open Systems Interconnection (OSI) model. It allows security teams to enforce simple packet-level IP/port filters, perform stateful session tracking, and execute deep packet inspection (DPI) to validate application protocols (HTTP, TLS, DNS, FTP) and block threat signatures across entire VPC network boundaries.",
  "whyItMatters": "Traditional perimeter controls only inspect Layer 3 and Layer 4 headers (IP addresses and TCP/UDP ports). Attackers easily bypass port-based filters by tunneling malicious payloads over standard open ports like TCP 80 and 443. Layer 7 deep packet inspection analyzes the actual payload content, TLS metadata, and protocol behavior to detect and block threats regardless of the port used.",
  "workplaceExample": "A database tier in a VPC communicates over standard HTTPS port 443. AWS Network Firewall performs multi-layer inspection: Layer 3/4 rules verify that traffic originates from allowed internal subnets, while Layer 7 Suricata inspection analyzes the TLS SNI header to confirm the destination is an authorized payment gateway, dropping any attempts to use port 443 for unauthorized SSH tunneling or malware command-and-control.",
  "examFocus": "Understand the OSI layer capabilities of AWS Network Firewall: (1) Layer 3 / 4: Stateless and stateful 5-tuple matching on IPv4/IPv6 source/destination CIDRs, TCP/UDP ports, ICMP types, and TCP flags. (2) Layer 7: Stateful inspection of application-layer protocols (HTTP, TLS, DNS, FTP), domain name matching via TLS SNI / HTTP Host headers, and deep payload pattern matching using Suricata syntax.",
  "keyPoints": [
    "Comprehensive multi-layer inspection across Layer 3, Layer 4, and Layer 7 of the OSI model.",
    "Layer 3 & 4: Inspects IPv4/IPv6 addresses, CIDR blocks, TCP/UDP ports, ICMP types, and TCP connection flags.",
    "Layer 7: Inspects application protocols including HTTP, TLS, DNS, SSH, FTP, and custom application payloads.",
    "Domain Filtering: Validates TLS Server Name Indication (SNI) and HTTP Host headers without full decryption.",
    "Intrusion Prevention: Suricata IDS/IPS signatures perform regular expression and byte-level payload matching.",
    "Provides unified VPC perimeter defense that replaces disparate legacy network appliances."
  ],
  "commonMistake": "Confusing Layer 7 Network Firewall inspection with AWS WAF. AWS Network Firewall operates as an inline VPC router inspecting all network traffic and protocols at Layer 3–7; AWS WAF operates specifically on web endpoints (ALB, CloudFront, API Gateway) for HTTP/HTTPS web application logic.",
  "example": "Configure a Layer 7 Suricata rule to detect and drop non-DNS traffic attempting to use UDP port 53: drop udp $HOME_NET any -> $EXTERNAL_NET 53 (msg:\"Non-DNS Traffic on Port 53\"; app-layer-protocol:!dns; sid:1000005; rev:1;).",
  "sources": [
    {
      "title": "AWS Network Firewall Key Concepts and Features",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    },
    {
      "title": "Rule Actions and Layer 7 Filtering in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-action.html"
    }
  ]
});
