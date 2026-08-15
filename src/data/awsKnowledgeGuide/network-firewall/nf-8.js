import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-8",
  "title": "Stateful Rule Groups",
  "plainEnglish": "A Stateful Rule Group in AWS Network Firewall analyzes complete bidirectional network communication flows (sessions) rather than isolated packets. It tracks connection states (such as TCP 3-way handshakes and UDP request/response pairs), enabling advanced deep packet inspection, application protocol validation, domain name filtering, and Suricata intrusion detection and prevention (IDS/IPS).",
  "whyItMatters": "Modern cyber threats hide malicious payloads inside established TCP connections and legitimate application protocols. Stateful rule groups inspect full packet streams to identify signature-based exploits, command-and-control beacons, and unauthorized data exfiltration that simple packet filters miss.",
  "workplaceExample": "A healthcare provider configures stateful rule groups in AWS Network Firewall to protect patient database subnets. The stateful engine inspects inbound traffic: legitimate established database connections are permitted, while an attacker attempting an unauthenticated buffer overflow exploit against the database protocol is detected by a Suricata IPS signature and immediately dropped.",
  "examFocus": "Understand stateful rule group formats and evaluation orders: (1) Rule Formats: 5-tuple rules, Domain list rules, and Suricata-compatible IPS rules. (2) Rule Order Modes: Strict Order (rules evaluated in exact priority order from 1 to 65,535, with policy default actions) vs Default Action Order (evaluates all Pass rules first, then Drop/Reject rules, then Alert rules). (3) Supported actions: `pass`, `drop`, `reject` (drops and returns TCP RST/ICMP unreachable), and `alert`.",
  "keyPoints": [
    "Tracks bidirectional connection state across full TCP, UDP, and ICMP network sessions.",
    "Supports three rule formats: Suricata IPS rules, Domain Lists (SNI/Host header), and 5-tuple rules.",
    "Stateful rule actions: `Pass` (allow flow), `Drop` (block silently), `Reject` (block with TCP reset), `Alert` (log event).",
    "Strict Rule Order mode evaluates rules in exact numeric priority order (priority 1 evaluated first).",
    "Default Action Order mode evaluates rules by action type: Pass first, Drop second, Alert third.",
    "Rule groups require allocated Firewall Capacity Units (FCU) based on rule quantity and complexity."
  ],
  "commonMistake": "Mixing assumptions between Strict Rule Order and Default Action Order. In Default Action Order, a single matching `Pass` rule overrides all subsequent `Drop` rules regardless of where it appears in the rule group; use Strict Rule Order if you need exact priority-based evaluation.",
  "example": "Define a stateful 5-tuple rule group in JSON: {\"RuleGroupName\": \"BlockInboundSSH\", \"RuleGroup\": {\"RulesSource\": {\"StatefulRules\": [{\"Action\": \"DROP\", \"Header\": {\"Protocol\": \"TCP\", \"Source\": \"0.0.0.0/0\", \"SourcePort\": \"ANY\", \"Direction\": \"FORWARD\", \"Destination\": \"10.0.0.0/16\", \"DestinationPort\": \"22\"}, \"RuleOptions\": [{\"Keyword\": \"sid\", \"Settings\": [\"100001\"]}]}]}}}",
  "sources": [
    {
      "title": "Stateful Rule Groups in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups.html"
    },
    {
      "title": "Evaluation Order for Stateful Rules in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/suricata-rule-evaluation-order.html"
    }
  ]
});
