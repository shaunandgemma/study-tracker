import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-11",
  "title": "Network Firewall Policies",
  "plainEnglish": "An AWS Network Firewall Policy is the central security specification that defines the complete inspection behavior of your firewall. A firewall policy combines one or more stateless rule groups and stateful rule groups, defines stateless default actions for unmatched packets and fragments, sets the stateful rule evaluation order (Strict Order vs Default Action Order), and configures optional TLS inspection configurations and stream exception policies.",
  "whyItMatters": "The firewall policy decouples rule definitions from firewall endpoint deployments. A single standardized corporate security policy can be attached to multiple AWS Network Firewalls across different VPCs and AWS accounts (using AWS Firewall Manager), ensuring consistent perimeter security governance across an entire organization.",
  "workplaceExample": "A global enterprise defines a corporate-wide Network Firewall Policy containing: (1) A Stateless Rule Group dropping known malicious CIDRs with default action `aws:forward_to_sfe`, (2) Strict Rule Order mode with Priority 10: AWS Managed Botnet C&C rule group, Priority 20: Outbound Domain Allowlist rule group, and (3) Default stateful action: Drop. The policy is attached to all VPC perimeters across 50 AWS accounts.",
  "examFocus": "Understand Firewall Policy configurations and settings: (1) Stateless Default Actions: Must define actions for full packets and fragmented packets (e.g., `aws:forward_to_sfe` and `aws:drop`). (2) Stateful Rule Order: `STRICT_ORDER` (evaluates rules by explicit numeric priority with configurable policy default actions) vs `DEFAULT_ACTION_ORDER` (Pass first, Drop second, Alert third). (3) Rule Group Capacity: Total capacity of all attached rule groups cannot exceed the policy capacity limit.",
  "keyPoints": [
    "Defines the overall traffic filtering behavior, rule group attachments, and default actions of a firewall.",
    "Combines stateless rule groups, stateful rule groups, and optional TLS inspection configurations.",
    "Configures Stateless Default Actions for unmatched full packets and fragmented packets.",
    "Sets Stateful Rule Order to either 'STRICT_ORDER' (priority-based) or 'DEFAULT_ACTION_ORDER'.",
    "Under Strict Order, allows setting default stateful actions (e.g., Drop or Alert for unmatched flows).",
    "Can be shared and centrally deployed across multiple AWS accounts using AWS Firewall Manager."
  ],
  "commonMistake": "Failing to set the stateless default action to `aws:forward_to_sfe`. If the stateless default action is left as `aws:pass`, all packets that do not explicitly match a stateless rule will bypass the stateful engine entirely.",
  "example": "Create a firewall policy with Strict stateful rule ordering and stateless forward-to-stateful default action using the AWS CLI: aws network-firewall create-firewall-policy --firewall-policy-name CorporatePolicy --firewall-policy '{\"StatelessDefaultActions\":[\"aws:forward_to_sfe\"],\"StatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\"],\"StatefulEngineOptions\":{\"RuleOrder\":\"STRICT_ORDER\"}}'.",
  "sources": [
    {
      "title": "Managing Firewall Policies in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-policies.html"
    },
    {
      "title": "Stateful Rule Evaluation Order in Firewall Policies",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/policy-rule-order.html"
    }
  ]
});
