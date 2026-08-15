import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-13",
  "title": "Route 53 Resolver Rule Sharing",
  "plainEnglish": "Route 53 Resolver Rule Sharing via AWS RAM allows a central network or shared services account to share Amazon Route 53 Resolver Forwarding Rules across all accounts in an AWS Organization. Once shared, consumer accounts can associate the shared rules directly with their local VPCs, enabling private DNS resolution of on-premises domain names (such as `corp.internal` or `datacenter.local`) without deploying dedicated DNS forwarder instances or outbound endpoints in every account.",
  "whyItMatters": "Deploying redundant Route 53 Resolver Outbound Endpoints ($0.125/hour per endpoint ENI) and managing independent DNS forwarding rules across dozens of VPCs and accounts creates unnecessary cloud costs and administrative drift. Centralizing outbound resolver endpoints and sharing rules via AWS RAM establishes a unified, cost-effective hybrid DNS resolution architecture across the entire enterprise.",
  "workplaceExample": "A central Network Services account creates an Outbound Route 53 Resolver Endpoint connected to the corporate on-premises data center DNS servers (`192.168.1.10` and `192.168.1.11`). The team creates a forwarding rule for `corp.example.com` and shares it via AWS RAM with the entire organization. When a developer in an analytics account associates their VPC with the shared rule, EC2 instances in that VPC can immediately resolve internal on-premises database hostnames seamlessly.",
  "examFocus": "Understand the architecture of shared Route 53 Resolver rules: (1) Outbound Endpoints: Provisioned ONLY in the central network account (attached to hybrid Direct Connect/VPN). (2) Forwarding Rules: Define domain names (e.g., `corp.local`) and target on-premises IP addresses; owned by the central account. (3) Sharing & Association: Rules are shared via RAM with consumer accounts; consumer accounts execute a local VPC association (`associate-resolver-rule`) to bind their VPCs to the shared rule.",
  "keyPoints": [
    "Shares Amazon Route 53 Resolver Forwarding Rules across AWS accounts using AWS RAM.",
    "Centralizes hybrid on-premises DNS forwarding, eliminating duplicate resolver endpoints across accounts.",
    "Consumer accounts associate their local VPCs with the shared resolver rule to inherit DNS routing.",
    "Owner account manages the underlying Outbound Resolver Endpoints and target on-premises DNS server IPs.",
    "Updating a shared resolver rule instantly updates DNS resolution across all associated consumer VPCs.",
    "Substantially lowers networking expenses by avoiding per-account Outbound Resolver Endpoint ENI fees."
  ],
  "commonMistake": "Thinking that sharing a Route 53 Resolver rule automatically enables DNS resolution in consumer VPCs. After the rule is shared via RAM, the consumer account must explicitly associate their local VPC with the shared Resolver Rule.",
  "example": "Associate a shared Route 53 Resolver rule with a local consumer VPC using the AWS CLI: aws route53resolver associate-resolver-rule --resolver-rule-id rslvr-rr-0123456789abcdef0 --vpc-id vpc-01234567.",
  "sources": [
    {
      "title": "Managing and Sharing Resolver Rules in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-rules-managing.html#resolver-rules-managing-sharing"
    },
    {
      "title": "Shareable AWS Resources in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/shareable.html"
    }
  ]
});
