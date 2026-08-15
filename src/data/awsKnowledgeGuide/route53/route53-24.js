import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-24",
  "title": "Route 53 Resolver Rules",
  "plainEnglish": "A Route 53 Resolver Rule is a conditional DNS routing policy that instructs the Route 53 Resolver in your Amazon VPC how to handle queries for specific domain names. By creating a Forwarding Rule, you specify a domain name (such as `corp.internal`) and one or more target IP addresses (such as on-premises DNS servers). When a query matches the rule, Route 53 Resolver forwards the request through a designated Outbound Endpoint to the target DNS server.",
  "whyItMatters": "Without Resolver Rules, workloads in an AWS VPC can only query public internet DNS and local Route 53 Private Hosted Zones. Resolver Rules provide precise, granular control over hybrid DNS resolution, allowing different corporate namespaces (e.g., `corp.local`, `partner.net`) to be forwarded to their respective authoritative on-premises DNS servers seamlessly.",
  "workplaceExample": "A network team manages an AWS multi-account environment. In the central networking account, they create a Forwarding Rule: `Domain: datacenter.corp -> Targets: 10.200.1.10, 10.200.2.10 via Outbound-Endpoint-1`. Using AWS Resource Access Manager (RAM), they share this rule with the entire AWS Organization. When application accounts associate their VPCs with the shared rule, all instances can immediately resolve on-premises hostnames.",
  "examFocus": "Understand Route 53 Resolver Rule types and associations: (1) Forwarding Rule: Forwards matching domain queries to specified target IP addresses using an Outbound Endpoint. (2) System Rule: Overrides a broader forwarding rule to resolve subdomains locally via Route 53 default resolver. (3) Recursive Rule: (Autodefined) Resolves public domains recursively. (4) VPC Association: A rule ONLY applies to VPCs that are explicitly associated with it. (5) RAM Sharing: Rules can be shared across accounts using AWS RAM.",
  "keyPoints": [
    "Conditional DNS routing rules that tell Route 53 Resolver how to handle specific domain queries.",
    "Forwarding Rules specify domain names, target on-premises DNS IPs, and associated Outbound Endpoints.",
    "System Rules allow overriding forwarding rules for specific subdomains to resolve locally.",
    "Must be explicitly associated with Amazon VPCs to take effect for workloads in those VPCs.",
    "Can be shared across multiple AWS accounts in an AWS Organization using AWS RAM.",
    "Supports multiple target IP addresses per rule for automated DNS server failover."
  ],
  "commonMistake": "Creating a Resolver Forwarding Rule in a central networking account and sharing it via RAM, but forgetting to associate the shared rule with consumer VPCs. A shared rule has zero effect until each consumer VPC associates with the rule via `associate-resolver-rule`.",
  "example": "Create a Resolver Forwarding Rule for `corp.internal` targeting on-premises DNS servers using the AWS CLI: aws route53resolver create-resolver-rule --creator-request-id $(date +%s) --name ForwardToOnPrem --rule-type FORWARD --domain-name corp.internal --target-ips Ip=192.168.1.10 Ip=192.168.2.10 --resolver-endpoint-id rslvr-out-0123456789abcdef0.",
  "sources": [
    {
      "title": "Managing Forwarding Rules in Route 53 Resolver",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-rules-managing.html"
    },
    {
      "title": "Route 53 Resolver Rules Overview",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-rules-overview.html"
    }
  ]
});
