import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-8",
  "title": "VPC Endpoint Services",
  "plainEnglish": "A VPC Endpoint Service is a configuration created by a service provider (a SaaS vendor or central infrastructure team) to publish an application or API hosted in their VPC, making it privately accessible to consumer VPCs via AWS PrivateLink. The service provider fronts their backend application targets with a Network Load Balancer (NLB) or Gateway Load Balancer (GWLB) and configures access permissions to control which AWS accounts can discover and connect to the service.",
  "whyItMatters": "Before endpoint services, sharing an internal microservice across different AWS accounts required maintaining complex VPC peering meshes, transit gateways, or exposing endpoints over the public internet. VPC Endpoint Services allow providers to offer multi-tenant, SaaS-ready private APIs with granular account allowlisting, independent IP address spaces, and consumer connection approval workflows.",
  "workplaceExample": "A fintech data provider hosts an equity pricing API behind a Network Load Balancer in Account 111122223333. They create a VPC Endpoint Service and add Account 444455556666 to the Allowed Principals list with acceptance required. When the consumer account creates an interface endpoint targeting the service name (`com.amazonaws.vpce.us-east-1.vpce-svc-01234`), the provider reviews and approves the connection, establishing secure, private API access.",
  "examFocus": "Understand VPC Endpoint Service lifecycle and configuration: (1) Target Load Balancer: Must be backed by a Network Load Balancer (NLB) or Gateway Load Balancer (GWLB). (2) Service Name: Unique identifier formatted as `com.amazonaws.vpce.<region>.vpce-svc-<id>`. (3) Allowed Principals: Explicitly add AWS account IDs, IAM users, roles, or AWS Organizations ARNs (`arn:aws:organizations::...`). (4) Acceptance: Manual connection acceptance or automatic acceptance (`AcceptanceRequired=false`). (5) Private DNS: Requires domain ownership TXT record verification in public DNS.",
  "keyPoints": [
    "Allows service providers to publish internal applications privately to consumer VPCs via AWS PrivateLink.",
    "Backed by a Network Load Balancer (NLB) for TCP/UDP services or a Gateway Load Balancer (GWLB) for security appliances.",
    "Generates a unique Service Name that consumers use to create Interface VPC Endpoints.",
    "Access is governed by an Allowed Principals list (IAM roles, users, accounts, or AWS Organizations).",
    "Supports manual connection approval workflows or automated acceptance.",
    "Custom Private DNS names can be assigned to the endpoint service after domain ownership verification."
  ],
  "commonMistake": "Attempting to create a VPC Endpoint Service directly fronting an Application Load Balancer (ALB). Classic VPC Endpoint Services require a Network Load Balancer (NLB) or Gateway Load Balancer (GWLB); you can place an ALB as an IP target behind the NLB if Layer 7 routing is needed.",
  "example": "Create a VPC Endpoint Service associated with an NLB ARN using the AWS CLI: aws ec2 create-vpc-endpoint-service-configuration --network-load-balancer-arns arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/api-nlb/abcd --acceptance-required.",
  "sources": [
    {
      "title": "AWS PrivateLink Endpoint Services",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-service.html"
    },
    {
      "title": "Configuring a VPC Endpoint Service",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html"
    }
  ]
});
