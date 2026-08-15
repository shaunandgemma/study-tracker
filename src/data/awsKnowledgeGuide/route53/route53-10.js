import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-10",
  "title": "Alias Records vs CNAME Records",
  "plainEnglish": "Alias Records and CNAME (Canonical Name) Records in Amazon Route 53 both point domain names to target destinations, but they operate through fundamentally different mechanisms. A standard CNAME record maps one domain name to another domain name and requires the client resolver to make an additional DNS query to resolve the target to an IP address. An Alias record is an AWS Route 53 native feature that recognizes specific AWS resources (like ALBs, CloudFront distributions, or S3 buckets) and responds directly with the IP address of that resource in a single step.",
  "whyItMatters": "The differences between Alias and CNAME records directly impact web architecture, RFC compliance, and operating expenses. According to DNS standards (RFC 1034), a CNAME record cannot coexist with other records at the zone apex (`example.com`). Using Route 53 Alias records solves the apex limitation, speeds up client DNS resolution, and eliminates query fees for AWS targets.",
  "workplaceExample": "A website architecture requires both the apex domain (`examplecompany.com`) and a subdomain (`blog.examplecompany.com`) to route to an Application Load Balancer. The engineer creates an Alias A record for `examplecompany.com` pointing to the ALB (satisfying the zone apex rule). For `blog.examplecompany.com`, they can create either an Alias record or a standard CNAME record, but choose an Alias record to eliminate DNS query fees and benefit from target health checks.",
  "examFocus": "Compare Alias vs CNAME for AWS certification exams: (1) Zone Apex: Alias records WORK at the zone apex; CNAME records are FORBIDDEN at the zone apex. (2) Cost: Queries to Alias records pointing to AWS resources are FREE; queries to CNAME records incur standard Route 53 query charges. (3) Target Support: Alias records point only to AWS resources or another record in the same hosted zone; CNAME records can point to ANY domain on the internet. (4) Lookups: Alias returns IP address immediately; CNAME returns a hostname requiring a second lookup.",
  "keyPoints": [
    "Alias records are permitted at the zone apex (naked domain); CNAME records are strictly forbidden at the zone apex.",
    "Route 53 does not charge for queries to Alias records pointing to AWS resources.",
    "CNAME records incur standard Route 53 per-million query charges.",
    "Alias records resolve to target IP addresses in a single DNS query; CNAME requires a secondary resolution roundtrip.",
    "Alias records automatically update when underlying AWS resource IP addresses change.",
    "CNAME can point to any external third-party hostname; Alias targets must be AWS resources or hosted zone records."
  ],
  "commonMistake": "Attempting to create a CNAME record for the root domain `example.com` to point to a CloudFront distribution or ALB. Standard DNS RFCs prohibit CNAMEs at the apex; you must create an Alias A record in Route 53.",
  "example": "Use an Alias A record to point the root domain `mycompany.com` to an Application Load Balancer; use a standard CNAME record to point `docs.mycompany.com` to an external documentation provider hosted at `readthedocs.io`.",
  "sources": [
    {
      "title": "Choosing Between Alias and Non-Alias Records in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html"
    },
    {
      "title": "CNAME Resource Record Format in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CNAMEFormat"
    }
  ]
});
