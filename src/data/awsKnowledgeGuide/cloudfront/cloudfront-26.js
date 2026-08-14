import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-26',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'Lambda at Edge',
  status: 'ready',
  plainEnglish: 'Lambda@Edge is an extension of AWS Lambda that allows you to execute Node.js or Python code at AWS CloudFront edge locations globally. It lets you customize how CloudFront delivers content by modifying HTTP requests and responses at four specific execution points: Viewer Request, Origin Request, Origin Response, and Viewer Response. Unlike standard Lambda functions that run in a single AWS Region, Lambda@Edge functions automatically replicate across CloudFront Regional Edge Caches worldwide.',
  whyItMatters: 'Lambda@Edge enables heavy serverless logic at the edge close to users—such as complex authorization, dynamic URL rewrites, A/B testing header manipulations, custom response rendering, or image resizing on the fly—without sending traffic to backend origin servers.',
  workplaceExample: 'A global media company uses Lambda@Edge on Origin Request events to inspect the viewer\'s user-agent and device type. If the user is on a mobile device, Lambda@Edge rewrites the S3 fetch path from /images/hero.jpg to /images/hero-mobile.jpg, delivering optimized images without modifying the origin server.',
  examFocus: 'SAA-C03 comparison between Lambda@Edge and CloudFront Functions:\n- Lambda@Edge: Runs at Regional Edge Caches, supports Node.js & Python, longer execution timeout (up to 30s for origin events, 5s for viewer events), network & file system access, can inspect request bodies. Use for complex logic, API calls, or origin modifications.\n- CloudFront Functions: Runs at 600+ Edge Locations, light JavaScript only, sub-millisecond execution, no network access, no body access. Use for high-scale, simple header/URL manipulation.',
  keyPoints: [
    'Executes Node.js or Python code at Regional Edge Caches globally.',
    'Triggers at 4 points: Viewer Request, Origin Request, Origin Response, Viewer Response.',
    'Supports network access (calling external APIs/databases) and third-party libraries.',
    'Timeout up to 5 seconds (viewer side) or 30 seconds (origin side).',
    'Must be published from us-east-1 region.'
  ],
  commonMistake: 'Choosing Lambda@Edge for simple URL redirects or header additions when CloudFront Functions is faster (sub-millisecond) and costs 1/6th the price. Use CloudFront Functions for lightweight tasks and Lambda@Edge for heavy tasks needing network access.',
  example: 'Lambda@Edge Trigger Configuration:\nBehavior: `/images/*`\nEvent Type: `Origin Response`\nFunction ARN: `arn:aws:lambda:us-east-1:123456789012:function:ResizeImageOnFly:1`\nAction: If origin returns 404, generate and return resized image thumbnail immediately.',
  sources: [
    { title: 'Customizing at the edge with Lambda@Edge', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html' }
  ]
});
