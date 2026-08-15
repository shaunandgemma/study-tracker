import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-10",
  "title": "Private DNS for Interface Endpoints",
  "plainEnglish": "Private DNS for Interface Endpoints is a feature in AWS PrivateLink that allows applications inside your VPC to connect to AWS services or custom endpoint services using their standard public DNS domain names (such as `secretsmanager.us-east-1.amazonaws.com` or `api.mycompany.com`), while automatically resolving those hostnames to the private IP addresses of the local endpoint ENIs instead of public internet IP addresses.",
  "whyItMatters": "Without Private DNS enabled, client applications and standard AWS SDKs would have to be manually reconfigured to point to long, complex endpoint-specific DNS names (e.g., `vpce-01234-abcd.secretsmanager.us-east-1.vpce.amazonaws.com`). Enabling Private DNS ensures that existing software, scripts, and AWS SDK code work seamlessly with zero code modifications while keeping all network traffic entirely private.",
  "workplaceExample": "A company migrates an on-premises Java application to private EC2 subnets in AWS. The application uses the standard AWS SDK to invoke AWS KMS (`kms.us-east-1.amazonaws.com`). The cloud engineer creates an Interface VPC Endpoint for KMS and enables Private DNS. The local Amazon Route 53 Resolver automatically intercepts DNS lookups for `kms.us-east-1.amazonaws.com` and returns the private IPs `10.0.1.45` and `10.0.2.89`, routing all KMS calls through PrivateLink without altering a single line of Java code.",
  "examFocus": "Understand Private DNS prerequisites and behavior: (1) VPC DNS Attributes: Both `enableDnsHostnames` and `enableDnsSupport` MUST be set to `true` on the consumer VPC. (2) Route 53 Private Hosted Zone: AWS automatically manages a private hosted zone in your account when Private DNS is enabled for AWS services. (3) Custom Endpoint Services: Using custom private DNS names (e.g., `api.example.com`) requires creating a domain verification TXT record in your public DNS to prove domain ownership.",
  "keyPoints": [
    "Resolves standard public service hostnames to the private IP addresses of your Interface Endpoint ENIs.",
    "Eliminates the need to modify application code, SDK configurations, or API connection endpoints.",
    "Requires both 'Enable DNS hostnames' and 'Enable DNS resolution' set to true on the consumer VPC.",
    "AWS automatically provisions and manages the Route 53 private hosted zone for supported AWS services.",
    "Custom endpoint services require domain ownership verification (TXT record in public DNS) before enabling private DNS.",
    "Provides regional DNS names (load-balanced across AZs) and zonal DNS names (targeting specific AZ endpoints)."
  ],
  "commonMistake": "Attempting to enable Private DNS on an Interface VPC Endpoint when `enableDnsHostnames` is set to `false` on the VPC. Private DNS resolution will fail until both `enableDnsHostnames` and `enableDnsSupport` are enabled on the VPC.",
  "example": "Verify and enable VPC DNS attributes required for Private DNS using the AWS CLI: aws ec2 modify-vpc-attribute --vpc-id vpc-01234567 --enable-dns-hostnames '{\"Value\":true}', and aws ec2 modify-vpc-attribute --vpc-id vpc-01234567 --enable-dns-support '{\"Value\":true}'.",
  "sources": [
    {
      "title": "Private DNS for Interface Endpoints",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/private-dns.html"
    },
    {
      "title": "Managing Private DNS Names for VPC Endpoint Services",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/manage-dns-names.html"
    }
  ]
});
