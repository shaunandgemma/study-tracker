import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-21",
  "title": "Route 53 Resolver",
  "plainEnglish": "Route 53 Resolver (also known as the Amazon-provided DNS or '.2 resolver') is the built-in recursive DNS server integrated directly into every Amazon Virtual Private Cloud (VPC). Accessible at the reserved IPv4 address `169.254.169.253` (or the VPC network base CIDR plus 2, such as `10.0.0.2`), Route 53 Resolver automatically resolves public internet domain names, Route 53 Private Hosted Zones, and internal EC2 instance hostnames for all workloads in your VPC.",
  "whyItMatters": "Every cloud application requires fast, highly available DNS resolution to communicate with internal microservices and external APIs. Route 53 Resolver is built natively into the VPC hypervisor layer, providing infinite horizontal scaling with zero server provisioning. Through Inbound and Outbound Endpoints, Resolver extends seamlessly to resolve hybrid on-premises corporate domains.",
  "workplaceExample": "An EC2 instance in subnet `10.0.1.0/24` boots up and queries `10.0.0.2` (the Route 53 Resolver) for three destinations: (1) `s3.us-east-1.amazonaws.com` (resolves via public DNS), (2) `db.internal.corp` (resolves via an associated Route 53 Private Hosted Zone), and (3) `ldap.onprem.company` (forwarded to on-premises Active Directory via an Outbound Resolver Endpoint).",
  "examFocus": "Understand Route 53 Resolver architecture: (1) Default Resolver IP: Reserved address at `169.254.169.253` and VPC CIDR base + 2 (e.g., `10.0.0.2` in a `10.0.0.0/16` VPC). (2) VPC DNS Attributes: Requires `enableDnsSupport=true` to function. (3) Hybrid DNS Extension: Inbound Endpoints (on-prem -> VPC) and Outbound Endpoints (VPC -> on-prem). (4) DNS Firewall: Filter and block outbound DNS queries to malicious domains.",
  "keyPoints": [
    "Built-in recursive DNS resolver present in every Amazon VPC.",
    "Accessible at `169.254.169.253` and the primary VPC CIDR base plus 2 (e.g., `10.0.0.2`).",
    "Resolves public internet DNS names, Private Hosted Zones, and internal instance hostnames.",
    "Requires `enableDnsSupport` enabled on the VPC to respond to instance DNS queries.",
    "Extensible to hybrid networks via Inbound and Outbound Resolver Endpoints.",
    "Integrated with Route 53 Resolver DNS Firewall to inspect and block outbound malicious domain queries."
  ],
  "commonMistake": "Attempting to send DNS queries directly from on-premises data centers to `169.254.169.253` or `10.0.0.2`. The default .2 resolver is link-local to the VPC and cannot be reached from outside the VPC; on-premises networks must query a Route 53 Resolver Inbound Endpoint.",
  "example": "Verify Route 53 Resolver DNS resolution inside an EC2 instance: dig @169.254.169.253 example.com +short, or dig @10.0.0.2 db.internal.local.",
  "sources": [
    {
      "title": "What is Route 53 Resolver?",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html"
    },
    {
      "title": "Route 53 Resolver Overview and Architecture",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-overview.html"
    }
  ]
});
