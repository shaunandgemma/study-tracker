import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-9",
  "title": "Route 53 Alias Records",
  "plainEnglish": "A Route 53 Alias Record is an AWS-specific extension to standard DNS that allows you to route domain traffic directly to selected AWS resources (such as Amazon CloudFront distributions, Application/Network Load Balancers, Amazon S3 website endpoints, and API Gateways) without incurring extra DNS query charges. Unlike standard CNAME records, Alias records can be created at the zone apex (e.g., `example.com`), automatically track AWS resource IP changes, and support integrated health evaluation.",
  "whyItMatters": "Standard DNS CNAME records cannot be used at the zone apex (naked root domain) and require external resolvers to make multiple recursive DNS lookups, adding latency and cost. Route 53 Alias records resolve directly to AWS resource IP addresses in a single query, update automatically when load balancer IPs scale, and are completely free of Route 53 query charges when pointing to AWS resources.",
  "workplaceExample": "An engineering team deploys a marketing site on Amazon CloudFront (`d12345.cloudfront.net`) and an Application Load Balancer (`my-alb-1234.us-east-1.elb.amazonaws.com`). The team creates two Alias records in Route 53: (1) An Alias A record for the zone apex `example.com` pointing to the CloudFront distribution, and (2) An Alias A record for `api.example.com` pointing to the ALB with `EvaluateTargetHealth=true`.",
  "examFocus": "Understand Route 53 Alias record superpowers: (1) Zone Apex Support: Allowed at the root domain (`example.com`), whereas CNAME is forbidden. (2) Cost: Route 53 charges ZERO query fees for queries to Alias records pointing to AWS resources. (3) Single Lookup: Returns the target IP address directly to the resolver without an extra CNAME lookup roundtrip. (4) `EvaluateTargetHealth`: Inherits the health status of the target ALB, NLB, or CloudFront distribution automatically.",
  "keyPoints": [
    "AWS-specific DNS extension routing directly to supported AWS infrastructure endpoints.",
    "Fully supported at the zone apex / root domain (e.g., `example.com`), unlike CNAME records.",
    "Zero DNS query charges for queries routed to supported AWS resource targets.",
    "Automatically tracks dynamic IP address changes of AWS load balancers and CloudFront distributions.",
    "Supports 'EvaluateTargetHealth' to automatically incorporate target AWS resource health into DNS routing.",
    "Supported targets include CloudFront, ELB (ALB/NLB/CLB), S3 website endpoints, API Gateway, and VPC endpoints."
  ],
  "commonMistake": "Attempting to create an Alias record pointing to an external third-party hostname (e.g., `external-service.com`). Route 53 Alias records can only point to supported AWS resources or another record within the same Route 53 hosted zone; use a standard CNAME for external non-AWS domains.",
  "example": "Create an Alias A record routing the zone apex to an Application Load Balancer in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"example.com\", \"Type\": \"A\", \"AliasTarget\": {\"HostedZoneId\": \"Z35SXDOTRQ7X7K\", \"DNSName\": \"dualstack.my-alb-1234.us-east-1.elb.amazonaws.com\", \"EvaluateTargetHealth\": true}}}]}.",
  "sources": [
    {
      "title": "Choosing Between Alias and Non-Alias Records in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html"
    },
    {
      "title": "Routing Traffic to AWS Resources with Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-aws-resources.html"
    }
  ]
});
