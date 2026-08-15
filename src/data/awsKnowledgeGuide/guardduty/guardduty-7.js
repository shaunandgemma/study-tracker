import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-7",
  "title": "DNS Log Analysis",
  "plainEnglish": "Amazon GuardDuty continuously analyzes Domain Name System (DNS) query logs generated when resources inside your Amazon VPCs look up domain names using the default AWS Route 53 Resolver (AmazonProvidedDNS). GuardDuty evaluates these domain lookups against threat intelligence databases and machine learning models to detect malware communications, phishing domains, dynamic DNS lookups, domain generation algorithms (DGA), and data exfiltration attempts over DNS tunneling.",
  "whyItMatters": "Malware often uses DNS queries to locate command-and-control servers or bypass traditional firewalls by encoding stolen data into subdomains (DNS tunneling). By inspecting DNS queries at the AWS VPC resolver level, GuardDuty catches infected instances at the earliest stages of an attack before large volumes of data can be transferred.",
  "workplaceExample": "An infected workstation in a development VPC executes malware that attempts to exfiltrate database credentials via DNS tunneling by querying subdomains like 'dXNlcm5hbWU=.attacker-domain.com'. GuardDuty analyzes the Route 53 Resolver query stream and immediately flags the instance with a Backdoor:EC2/DNSDataExfiltration finding.",
  "examFocus": "Remember that GuardDuty monitors DNS queries made to the default AmazonProvidedDNS (.2 resolver IP in your VPC CIDR). If an EC2 instance uses an external DNS server (e.g., 8.8.8.8) or an on-premises DNS forwarder without routing through Route 53 Resolver, GuardDuty cannot inspect those DNS queries through this data source.",
  "keyPoints": [
    "Monitors DNS query logs made to the default VPC Route 53 Resolver (the AmazonProvidedDNS at the VPC CIDR base + 2).",
    "Does not require Route 53 DNS query logging to be enabled or configured by the customer for foundational GuardDuty analysis.",
    "Identifies queries directed to known malicious domains, botnet C2 nodes, and cryptocurrency mining hosts.",
    "Detects Domain Generation Algorithms (DGA), where malware rapidly queries pseudorandom domains to find an active C2 server.",
    "Detects DNS tunneling, a covert technique used by attackers to exfiltrate data or establish interactive shells through DNS queries.",
    "Operates entirely out-of-band with zero overhead or query latency added to DNS resolution times."
  ],
  "commonMistake": "Configuring custom DNS servers (such as on-premises DNS appliances) on EC2 instances and assuming GuardDuty will still inspect the queries. If instances bypass the Route 53 Resolver, GuardDuty cannot capture their DNS query logs.",
  "example": "Review a DNS-based finding in GuardDuty: inspect the 'service.action.dnsRequestAction' field in the finding JSON to view the exact queried domain (e.g., 'malicious-c2.example.com') and the protocol used.",
  "sources": [
    {
      "title": "Amazon GuardDuty and DNS Logs",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html#guardduty_dns"
    },
    {
      "title": "DNS Finding Types in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-ec2.html"
    }
  ]
});
