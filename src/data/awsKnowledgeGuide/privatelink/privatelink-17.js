import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-17",
  "title": "PrivateLink vs NAT Gateway",
  "plainEnglish": "AWS PrivateLink and AWS NAT Gateway are both managed AWS networking components that facilitate outbound connectivity from private subnets, but they operate through completely different mechanisms. An AWS NAT Gateway translates private IPv4 addresses into an Elastic IP address to grant private compute instances general outbound egress access to the public internet and public AWS endpoints. AWS PrivateLink creates private IP endpoint interfaces within your subnets to connect directly to specific AWS services, partner SaaS apps, or custom internal APIs without traversing the public internet.",
  "whyItMatters": "Choosing between PrivateLink and NAT Gateway affects security boundaries, network architecture, and cloud data transfer costs. Routing high-volume traffic (such as gigabytes of CloudWatch logs or KMS calls) through a NAT Gateway incurs both NAT hourly and data transfer fees. Replacing NAT routes with PrivateLink interface endpoints keeps sensitive traffic on the AWS private backbone and prevents accidental data exfiltration to unauthorized public internet endpoints.",
  "workplaceExample": "A high-security fintech backend runs in private subnets. The team replaces their NAT Gateway with AWS PrivateLink Interface Endpoints for AWS Secrets Manager, Amazon SQS, and Amazon CloudWatch. By removing the NAT Gateway and Internet Gateway entirely, they eliminate internet egress attack surfaces, save $1,200 monthly on NAT Gateway data transfer charges, and achieve 100% private compliance.",
  "examFocus": "Compare PrivateLink vs NAT Gateway for AWS certification exams: (1) Destination Scope: NAT Gateway provides general outbound egress to the ENTIRE public internet; PrivateLink provides private access to ONE specific AWS service, SaaS app, or custom endpoint service. (2) Public IP & Internet: NAT Gateway requires an Elastic IP and an Internet Gateway in a public subnet; PrivateLink requires NO public IPs, NO Internet Gateways, and NO public routes. (3) Security: PrivateLink supports Endpoint Policies and Security Groups; NAT Gateway relies on route tables and NACLs. (4) Hybrid Connectivity: On-premises servers can access PrivateLink Interface Endpoints over Direct Connect/VPN; on-premises servers CANNOT route through a VPC NAT Gateway to reach the internet.",
  "keyPoints": [
    "NAT Gateway provides general outbound IPv4 internet access for private subnets via Elastic IP translation.",
    "PrivateLink provides private IP access to specific AWS services, custom APIs, and SaaS platforms.",
    "PrivateLink traffic stays entirely on the private AWS network backbone; NAT Gateway routes traffic to the public internet.",
    "NAT Gateway requires an attached Internet Gateway in a public subnet; PrivateLink requires zero internet infrastructure.",
    "PrivateLink Interface Endpoints are directly accessible from on-premises networks via Direct Connect or VPN.",
    "PrivateLink endpoints can be governed by granular IAM VPC Endpoint Policies and attached Security Groups."
  ],
  "commonMistake": "Deploying a NAT Gateway to allow on-premises systems connected via Direct Connect to reach AWS services. On-premises traffic cannot route through a VPC NAT Gateway; you must deploy PrivateLink Interface Endpoints with private DNS to provide on-premises access to AWS services.",
  "example": "Use an AWS NAT Gateway for private EC2 instances that need to download open-source software patches from general internet repositories; use AWS PrivateLink Interface Endpoints for private EC2 instances that need to call AWS KMS and AWS Secrets Manager securely without internet access.",
  "sources": [
    {
      "title": "NAT Gateways in Amazon VPC",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"
    },
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    }
  ]
});
