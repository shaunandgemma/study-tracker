import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-7',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Distributions',
  status: 'ready',
  plainEnglish: 'A CloudFront Distribution is the top-level resource you create in AWS to configure how CloudFront delivers your content. It acts as the entryway or blueprint that tells CloudFront where your original content lives (the origin), how to cache it (cache behaviors), what domain name to use (such as app.example.com), and what security rules to enforce. CloudFront provides two main types of distributions: Web Distributions (for HTTP/HTTPS traffic, websites, APIs) and RTMP Distributions (legacy media streaming, now deprecated in favor of HTTP web distributions).',
  whyItMatters: 'Distributions are the central management point for your CDN configuration. Through a single distribution, you can route traffic to multiple origins (S3 buckets, load balancers), set up custom domain names with SSL certificates, configure WAF firewalls, and control caching behavior across hundreds of edge locations globally.',
  workplaceExample: 'A SaaS company creates a CloudFront Web Distribution for app.myservice.com. They point /static/* path requests to an S3 bucket and /api/* path requests to an Application Load Balancer. Users everywhere access a single domain while CloudFront correctly routes and caches content according to the distribution settings.',
  examFocus: 'For SAA-C03, understand that a CloudFront distribution gets a default domain name (like d111111abcdef8.cloudfront.net). To use a custom domain name (e.g. www.example.com), you must configure Alternate Domain Names (CNAMEs) in the distribution and attach an AWS Certificate Manager (ACM) SSL/TLS certificate created in the us-east-1 (N. Virginia) region.',
  keyPoints: [
    'A distribution connects edge locations to your origin server(s).',
    'Assigned a unique CloudFront domain name (d123.cloudfront.net).',
    'Custom domain names (CNAMEs) require an SSL/TLS certificate in ACM us-east-1.',
    'Can contain multiple origins and path-based cache behaviors.',
    'Changes to distributions propagate across global edge locations within minutes.'
  ],
  commonMistake: 'Attempting to associate an ACM SSL certificate requested in us-west-2 or eu-west-1 with a CloudFront distribution. CloudFront requires ACM certificates to be requested in us-east-1 (N. Virginia) regardless of where your origin or users are located.',
  example: 'CloudFront Distribution Configuration:\n{\n  "CallerReference": "dist-2026-08-14",\n  "Aliases": { "Items": ["cdn.example.com"] },\n  "DefaultRootObject": "index.html",\n  "Origins": { "Items": [{ "Id": "S3-my-bucket", "DomainName": "my-bucket.s3.us-east-1.amazonaws.com" }] },\n  "DefaultCacheBehavior": { "TargetOriginId": "S3-my-bucket", "ViewerProtocolPolicy": "redirect-to-https" }\n}',
  sources: [
    { title: 'Working with distributions', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html' }
  ]
});
