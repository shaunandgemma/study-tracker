import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-41",
  "title": "Lambda@Edge",
  "plainEnglish": "Lambda@Edge is an extension of AWS Lambda that allows you to run serverless code globally at Amazon CloudFront edge locations closest to your end users. Instead of routing every request back to a central origin server or regional AWS Region, Lambda@Edge intercepts web requests and responses at the CDN edge, enabling ultra-low-latency customization, dynamic content generation, security header injection, and localized routing.",
  "whyItMatters": "Serving global audiences with sub-10-millisecond latency requires executing logic as close to the user as possible. Lambda@Edge eliminates origin round-trips for tasks like user authentication verification, URL redirects, A/B testing variations, device-specific image resizing, and injecting HTTP security headers (like HSTS and Content-Security-Policy).",
  "workplaceExample": "An international media website serves content through Amazon CloudFront. They configure a Lambda@Edge function triggered on 'Viewer Request' events. When a user requests a URL, the edge function inspects the user's `CloudFront-Viewer-Country` header and GeoIP cookies, instantly redirecting European users to `/eu/` and North American users to `/us/` without touching the origin web server.",
  "examFocus": "Know the four CloudFront event trigger points for Lambda@Edge: (1) Viewer Request: Executed when CloudFront receives a request from an end user (before checking cache). (2) Origin Request: Executed only on cache misses before CloudFront forwards the request to the origin server. (3) Origin Response: Executed when CloudFront receives a response from the origin (before caching). (4) Viewer Response: Executed before delivering the cached response back to the end user. Functions MUST be authored and published in the `us-east-1` (N. Virginia) Region.",
  "keyPoints": [
    "Executes serverless Node.js and Python functions across global Amazon CloudFront edge locations.",
    "Functions must be created and published in the US East (N. Virginia) `us-east-1` Region.",
    "Supports 4 event triggers: Viewer Request, Origin Request, Origin Response, and Viewer Response.",
    "Can modify HTTP request and response headers, cookies, query strings, and body payloads at the edge.",
    "Origin Request and Origin Response triggers support larger timeouts (up to 30s) and network access to VPC/AWS services.",
    "Viewer Request and Viewer Response triggers require lightweight execution (timeout limit: 5 seconds, memory up to 128 MB)."
  ],
  "commonMistake": "Attempting to create or deploy Lambda@Edge functions in AWS Regions other than `us-east-1`. Lambda@Edge functions and their version publications must always be created in `us-east-1` so CloudFront can replicate them globally.",
  "example": "Associate a published Lambda version with a CloudFront behavior for Viewer Request: In the CloudFront distribution cache behavior, add a Lambda Function Association with EventType 'viewer-request' and ARN 'arn:aws:lambda:us-east-1:123456789012:function:edge-auth:1'.",
  "sources": [
    {
      "title": "Customizing at the Edge with Lambda@Edge",
      "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html"
    },
    {
      "title": "Choosing Between CloudFront Functions and Lambda@Edge",
      "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html"
    }
  ]
});
