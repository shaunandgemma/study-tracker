import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-2",
  "title": "Suricata-Compatible Intrusion Detection / Prevention System (IDS/IPS)",
  "plainEnglish": "AWS Network Firewall provides an Intrusion Detection and Prevention System (IDS/IPS) engine compatible with open-source Suricata rule specifications. This allows security engineers to import existing Suricata rules, community threat intelligence feeds, or custom deep-packet inspection signatures to detect and block malicious network traffic (such as malware command-and-control beacons, port scans, protocol anomalies, and exploit payloads) in real time.",
  "whyItMatters": "Standard port-and-IP firewalls cannot inspect the payload or behavioral patterns inside network packets. Suricata compatibility gives security teams access to thousands of industry-standard threat rules (such as Emerging Threats rulesets) and enables complex pattern matching across HTTP, TLS, DNS, and raw TCP/UDP streams without operating physical or virtual firewall appliances.",
  "workplaceExample": "A cybersecurity operations team configures an AWS Network Firewall stateful rule group using Suricata syntax: `drop tcp $HOME_NET any -> $EXTERNAL_NET any (msg:\"ET TROJAN Cobalt Strike Beacon Observed\"; content:\"/activity\"; http_uri; sid:2030001; rev:1;)`. When an infected EC2 workload attempts to communicate with an external Cobalt Strike server, the firewall immediately drops the connection and logs an alert.",
  "examFocus": "Understand Suricata rule mechanics in AWS Network Firewall: (1) Rule Format: Standard Suricata syntax containing action (`pass`, `drop`, `reject`, `alert`), header (protocol, source/destination IP, port), and options (`msg`, `content`, `pcre`, `sid`, `rev`). (2) Rule Order: Strict Order (evaluates rules in exact priority sequence) vs Default Action Order (Pass, Drop/Reject, Alert). (3) AWS Managed Rules: AWS provides pre-packaged Suricata threat intelligence rule groups (e.g., Botnet Command & Control, Threat Signatures).",
  "keyPoints": [
    "Native compatibility with open-source Suricata rule syntax for deep packet inspection and IDS/IPS defense.",
    "Supports standard rule actions: `pass` (allow flow), `drop` (block silently), `reject` (block and reset TCP), and `alert` (log finding).",
    "Inspects protocols including TCP, UDP, ICMP, HTTP, TLS, DNS, FTP, and custom application payloads.",
    "Integrates rule variables like `$HOME_NET` (your VPC CIDR) and `$EXTERNAL_NET` to define traffic directions.",
    "Supports AWS Managed Rule Groups containing vetted threat signatures maintained and updated automatically by AWS.",
    "Alert and drop events are published to Amazon CloudWatch Logs, Amazon S3, or Amazon Data Firehose."
  ],
  "commonMistake": "Using unsupported Suricata keywords or file-extraction options. AWS Network Firewall supports a comprehensive subset of Suricata keywords but does not support local file logging directives or disk-based payload carving.",
  "example": "Suricata rule to drop outbound HTTP traffic containing malicious User-Agent strings: drop http $HOME_NET any -> $EXTERNAL_NET any (msg:\"Malicious User-Agent Detected\"; content:\"sqlmap\"; http_user_agent; sid:1000002; rev:1;).",
  "sources": [
    {
      "title": "Stateful Rules in AWS Network Firewall with Suricata",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-suricata.html"
    },
    {
      "title": "Suricata Rule Examples and Syntax in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-examples.html"
    }
  ]
});
