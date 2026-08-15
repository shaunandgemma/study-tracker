import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-28",
  "title": "Route 53 Integration with ELB, CloudFront and S3",
  "plainEnglish": "Amazon Route 53 integrates natively with core AWS infrastructure services—including Elastic Load Balancing (ALB/NLB), Amazon CloudFront edge distributions, and Amazon S3 static website hosting buckets—via Route 53 Alias Records. This integration allows domain names (including the root zone apex like `example.com`) to point directly to AWS services with zero DNS query fees, automatic tracking of underlying AWS IP address changes, and built-in target health evaluation.",
  "whyItMatters": "External DNS providers require complex CNAME forwarding or flattening workarounds to point root apex domains to AWS load balancers or CloudFront distributions, adding DNS resolution latency and ongoing query costs. Route 53 Alias integration provides seamless, instantaneous DNS resolution to AWS resources with zero extra query charges and native health integration.",
  "workplaceExample": "A company deploys a static single-page web application: (1) The HTML/JS assets are hosted in an S3 bucket configured for static website hosting named `www.mycompany.com`, (2) An Amazon CloudFront distribution is deployed in front of the S3 bucket with an AWS Certificate Manager (ACM) SSL certificate, and (3) Route 53 Alias A and AAAA records for `mycompany.com` and `www.mycompany.com` route directly to the CloudFront distribution with zero DNS query fees.",
  "examFocus": "Understand integration specifics for each target service: (1) Amazon S3 Website: S3 bucket name MUST match the domain/record name exactly (e.g., bucket `example.com` for record `example.com`). (2) Elastic Load Balancer (ELB): Point Alias record to the dualstack/standard ELB DNS name; enable `EvaluateTargetHealth=true` to inherit target group health. (3) Amazon CloudFront: Point Alias record to CloudFront domain (`d123.cloudfront.net`); the CloudFront distribution MUST have the domain listed as an Alternate Domain Name (CNAME) with a matching SSL certificate.",
  "keyPoints": [
    "Native Route 53 Alias integration with ELB, Amazon CloudFront, and Amazon S3 static websites.",
    "Zero DNS query charges for queries resolving to supported AWS resources via Alias records.",
    "Supports zone apex (naked root domain) routing for all three services.",
    "S3 static website integration requires the S3 bucket name to match the domain name exactly.",
    "CloudFront integration requires configured Alternate Domain Names (CNAMEs) and valid ACM certificates.",
    "ELB integration supports 'EvaluateTargetHealth=true' to inherit load balancer health checks automatically."
  ],
  "commonMistake": "Creating an S3 bucket with a name different from the Route 53 record name when using S3 website endpoints (e.g., naming the bucket `my-site-bucket` while creating an Alias record for `example.com`). S3 will return a 404 or 403 error; the bucket name MUST match the domain name exactly.",
  "example": "Configure an Alias A record pointing to a CloudFront distribution in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"example.com\", \"Type\": \"A\", \"AliasTarget\": {\"HostedZoneId\": \"Z2FDTNDATAQYW2\", \"DNSName\": \"d123456789abcdef.cloudfront.net\", \"EvaluateTargetHealth\": false}}}]}.",
  "sources": [
    {
      "title": "Routing Traffic to an Amazon CloudFront Distribution",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html"
    },
    {
      "title": "Routing Traffic to an Elastic Load Balancer",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html"
    }
  ]
});
