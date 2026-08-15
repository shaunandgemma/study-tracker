import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-7",
  "title": "Stateless Rule Groups",
  "plainEnglish": "A Stateless Rule Group in AWS Network Firewall contains high-speed filtering rules that inspect each network packet in isolation without maintaining memory of previous packets or connection state. Stateless rules evaluate 5-tuple attributes (source IP/CIDR, source port, destination IP/CIDR, destination port, and protocol) and TCP flags in strict numeric priority order to either immediately allow, drop, or forward the packet to the stateful engine.",
  "whyItMatters": "Stateless inspection processes packets at line-rate speeds with ultra-low latency, making it ideal for mitigating volumetric DDoS attacks, dropping traffic from unauthorized IP subnets, or quickly allowing high-bandwidth trusted network flows without consuming stateful inspection capacity.",
  "workplaceExample": "A streaming video platform deploys a stateless rule group with Priority 10: `Drop UDP source port 19 (NTP) and port 53 (DNS) with payload > 1000 bytes` to immediately mitigate amplification DDoS attacks. Priority 20: `Forward TCP port 443 to stateful rules`. Unmatched traffic is dropped by the stateless default action, shielding backend workloads from high-volume volumetric scans.",
  "examFocus": "Understand stateless rule configuration and actions: (1) Rule Priority: Every stateless rule has a unique integer priority (1 to 10,000); lower numbers are evaluated first. (2) Rule Actions: `aws:pass` (allows packet and completely BYPASSES stateful engine), `aws:drop` (silently drops packet), `aws:forward_to_sfe` (sends packet to stateful engine). (3) Stateless Default Actions: Configured in the policy for unmatched packets and packet fragments.",
  "keyPoints": [
    "Evaluates individual network packets independently without maintaining connection session state.",
    "Rules are evaluated in strict numeric priority order (lowest priority number evaluated first).",
    "Matches 5-tuple attributes: source/destination IP, source/destination port, protocol, and TCP flags.",
    "Supported actions: `aws:pass`, `aws:drop`, and `aws:forward_to_sfe` (forward to stateful engine).",
    "Stateless 'Pass' completely bypasses all stateful inspection rules in the firewall policy.",
    "Firewall Capacity Units (FCU): Each rule group requires allocated capacity based on rule count and complexity."
  ],
  "commonMistake": "Setting a stateless rule action to `aws:pass` for traffic that requires Suricata IDS/IPS or domain name inspection. The `Pass` action exempts packets from the stateful engine; always use `aws:forward_to_sfe` if stateful inspection is required.",
  "example": "Define a stateless rule in JSON to drop inbound Telnet (port 23) traffic: {\"Priority\": 10, \"RuleDefinition\": {\"MatchAttributes\": {\"Protocols\": [6], \"Sources\": [{\"AddressDefinition\": \"0.0.0.0/0\"}], \"Destinations\": [{\"AddressDefinition\": \"10.0.0.0/16\"}], \"DestinationPorts\": [{\"FromPort\": 23, \"ToPort\": 23}]}, \"Actions\": [\"aws:drop\"]}}.",
  "sources": [
    {
      "title": "Stateless Rule Groups in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateless-rule-groups.html"
    },
    {
      "title": "Stateless Default Actions in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateless-default-actions.html"
    }
  ]
});
