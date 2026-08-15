import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-7",
  "title": "Route 53 Private Hosted Zones",
  "plainEnglish": "A Route 53 Private Hosted Zone is a private DNS container that answers domain name queries exclusively from inside one or more specified Amazon Virtual Private Clouds (VPCs). Resources outside the associated VPCs (such as clients on the public internet) cannot resolve records in a private hosted zone, making it ideal for internal service discovery, microservice routing, and private corporate domains (e.g., `corp.internal`).",
  "whyItMatters": "Hardcoding internal private IP addresses inside application configuration files makes infrastructure brittle and difficult to scale or migrate. Private hosted zones provide friendly, stable DNS hostnames (like `db.corp.internal` or `auth.service.local`) for internal databases and microservices without exposing internal network architecture or server hostnames to the public internet.",
  "workplaceExample": "A financial institution runs microservices across three VPCs (`VPC-Dev`, `VPC-Test`, `VPC-Prod`). The architecture team creates a Private Hosted Zone named `internal.fintech.aws` and associates all three VPCs with the hosted zone. Microservices in any of the three VPCs can resolve `payment-db.internal.fintech.aws` to the database's private IP (`10.0.4.55`), while queries originating from outside the VPCs receive zero response.",
  "examFocus": "Understand Private Hosted Zone prerequisites and cross-account associations: (1) VPC DNS Attributes: Both `enableDnsHostnames` and `enableDnsSupport` MUST be enabled on the associated VPC. (2) Cross-Account Association: To associate a VPC from Account B with a private hosted zone in Account A, Account A creates an authorization via `create-vpc-association-authorization`, and Account B accepts it via `associate-vpc-with-hosted-zone`. (3) Split-View (Split-Horizon) DNS: You can create a public and private hosted zone with the identical domain name.",
  "keyPoints": [
    "Responds to DNS queries originating strictly from associated Amazon VPCs.",
    "Completely hidden and inaccessible from the public internet.",
    "Requires both `enableDnsHostnames` and `enableDnsSupport` set to true on associated VPCs.",
    "Can be associated with multiple VPCs across different AWS accounts and different AWS Regions.",
    "Cross-account VPC association requires authorization from the hosted zone owner account.",
    "Supports Split-Horizon DNS where public and private hosted zones share the same domain name with different answers."
  ],
  "commonMistake": "Failing to enable `enableDnsHostnames` or `enableDnsSupport` on the associated VPC. Route 53 Private Hosted Zone DNS queries will fail inside the VPC until both DNS attributes are enabled.",
  "example": "Associate an additional VPC with an existing private hosted zone using the AWS CLI: aws route53 associate-vpc-with-hosted-zone --hosted-zone-id Z1234567890ABC --vpc VPCRegion=us-east-1,VPCId=vpc-01234567.",
  "sources": [
    {
      "title": "Working with Private Hosted Zones in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html"
    },
    {
      "title": "Associating Amazon VPCs with a Private Hosted Zone",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-associating-vpcs.html"
    }
  ]
});
