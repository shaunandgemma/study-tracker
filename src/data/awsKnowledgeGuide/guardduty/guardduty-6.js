import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-6",
  "title": "VPC Flow Log Analysis",
  "plainEnglish": "Amazon VPC Flow Logs capture information about the IP traffic going to and from network interfaces in your virtual private clouds (VPCs). Amazon GuardDuty continuously analyzes this network flow telemetry to detect unauthorized network communications, inbound port scanning, brute-force login attempts (such as SSH on port 22 or RDP on port 3389), connections to known command-and-control (C2) servers, and cryptocurrency mining activity.",
  "whyItMatters": "Compromised workloads in a cloud environment frequently attempt outbound connections to malicious infrastructure to download payloads or receive instructions from attackers. By analyzing VPC Flow Logs at scale, GuardDuty identifies compromised instances and container hosts purely from network connection metadata without installing network inspection appliances.",
  "workplaceExample": "A web server in a public subnet is compromised through an unpatched vulnerability in a web application. The attacker uses the server to initiate port scans across internal subnets and opens an outbound connection to a Bitcoin mining pool. GuardDuty analyzes the VPC network flows and alerts the security operations center with Recon:EC2/Portscan and CryptoCurrency:EC2/BitcoinTool.B findings.",
  "examFocus": "Understand that GuardDuty consumes VPC Flow Logs directly from an internal, independent AWS network feed. Customers do NOT need to enable VPC Flow Logs in their VPCs or pay for CloudWatch log storage for GuardDuty to perform network analysis. GuardDuty inspects flow metadata (IPs, ports, protocols, timestamps), not application packet contents.",
  "keyPoints": [
    "Analyzes network flow metadata (source/destination IP, port, protocol, packet count, byte count, and accept/reject status).",
    "Does not require customers to enable or configure VPC Flow Logs in their VPCs for foundational GuardDuty protection.",
    "Operates completely out-of-band with zero impact on network bandwidth, throughput, or instance CPU utilization.",
    "Identifies inbound brute-force attempts targeting open SSH (TCP 22) and RDP (TCP 3389) ports.",
    "Detects outbound traffic to known malicious IP addresses, botnet command-and-control servers, and cryptocurrency pools.",
    "Identifies internal network reconnaissance, such as an EC2 instance scanning other instances across private subnets."
  ],
  "commonMistake": "Believing that GuardDuty captures and stores full network packet payloads for deep packet inspection. GuardDuty only analyzes Layer 3/4 flow metadata; for full packet inspection, you would use AWS Network Firewall or third-party IDS/IPS appliances.",
  "example": "Review a VPC Flow Log finding in the GuardDuty console: inspect the 'service.action.networkConnectionAction' object to see the remote IP, remote port, connection direction (INBOUND/OUTBOUND), and protocol (TCP/UDP).",
  "sources": [
    {
      "title": "Amazon GuardDuty and Amazon VPC Flow Logs",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html#guardduty_vpc"
    },
    {
      "title": "EC2 Finding Types in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-ec2.html"
    }
  ]
});
