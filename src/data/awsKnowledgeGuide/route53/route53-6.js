import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-6",
  "title": "Route 53 Public Hosted Zones",
  "plainEnglish": "A Route 53 Public Hosted Zone is an authoritative container in Amazon Route 53 that stores DNS records (such as A, AAAA, CNAME, and MX records) that answer public domain name queries from any recursive resolver across the global internet. When you create a public hosted zone, AWS automatically assigns four unique authoritative Name Servers (NS) distributed across the globe to respond to internet traffic for that domain.",
  "whyItMatters": "Public hosted zones represent the front door of your internet-facing web applications, APIs, and cloud services. Operating on AWS's globally distributed, anycast DNS infrastructure, Route 53 public hosted zones provide 100% SLA availability, ultra-low latency DNS lookups, and native integration with AWS load balancers, CloudFront distributions, and S3 website endpoints.",
  "workplaceExample": "An enterprise registers `examplecompany.com` and creates a Route 53 Public Hosted Zone. AWS assigns 4 authoritative name servers (e.g., `ns-123.awsdns-15.com`). The DevOps engineer updates the domain registrar's NS records to point to these 4 name servers. Within the hosted zone, they create alias records routing `examplecompany.com` to an Amazon CloudFront distribution and `api.examplecompany.com` to an Application Load Balancer.",
  "examFocus": "Understand public hosted zone architecture and delegation: (1) Authoritative Name Servers: Route 53 automatically creates an NS (Name Server) record with 4 distinct anycast servers and an SOA (Start of Authority) record. (2) Delegation: To activate the hosted zone, you must update the parent domain registrar with the exact 4 Route 53 name servers. (3) Zone Apex: Supports Route 53 Alias records at the naked domain / root apex (`examplecompany.com`).",
  "keyPoints": [
    "Authoritative container for public DNS records visible to any client on the internet.",
    "Automatically provisioned with 4 globally distributed authoritative Route 53 name servers.",
    "Backed by an anycast DNS network providing 100% service level agreement (SLA) availability.",
    "Requires updating your domain registrar with the 4 assigned Route 53 name servers to delegate authority.",
    "Supports all standard DNS record types plus AWS-specific Alias records at the zone apex.",
    "Charged at a low monthly rate per hosted zone plus per-million DNS queries processed."
  ],
  "commonMistake": "Creating a public hosted zone in Route 53 but forgetting to update the domain registrar's Name Server (NS) records. Route 53 cannot respond to public internet queries until the registrar points to the 4 assigned Route 53 name servers.",
  "example": "Create a public hosted zone for a domain using the AWS CLI: aws route53 create-hosted-zone --name example.com --caller-reference $(date +%s) --hosted-zone-config Comment='Production Web Zone',PrivateZone=false.",
  "sources": [
    {
      "title": "Working with Public Hosted Zones in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/AboutHZWorkingWith.html"
    },
    {
      "title": "Managing Hosted Zones in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html"
    }
  ]
});
