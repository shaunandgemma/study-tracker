import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-12',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Cache Behaviors',
  status: 'ready',
  plainEnglish: 'A Cache Behavior defines how CloudFront processes and responds to incoming HTTP requests based on URL path patterns (such as /images/*, /api/*, or *.pdf). Every CloudFront distribution has a Default Cache Behavior (*) that processes requests not matched by any path pattern. Within each behavior, you configure which origin to send traffic to, allowed HTTP methods, TTL settings, smooth streaming, Viewer Protocol Policies (HTTP/HTTPS redirection), and which headers, cookies, or query strings to include in the cache key.',
  whyItMatters: 'Cache Behaviors give architects fine-grained control over how different parts of a website or app are handled. For instance, images can be aggressively cached for 30 days, while API endpoints pass through with no caching (TTL 0), and admin paths require HTTPS with restricted access.',
  workplaceExample: 'A media streaming site defines three cache behaviors in one CloudFront distribution:\n1. `/static/*` -> Routes to S3, caches for 1 year, forces HTTPS.\n2. `/video/*` -> Routes to MediaStore, enables smooth streaming.\n3. `/api/*` -> Routes to ALB, forwards all headers and query parameters, TTL set to 0 (no cache).',
  examFocus: 'Cache behaviors are evaluated in precedence order (top down). The path patterns are evaluated from top to bottom, and the Default Cache Behavior (*) is always evaluated LAST. On the exam, if a request matches multiple patterns, CloudFront uses the first matching behavior in the ordered list.',
  keyPoints: [
    'Path patterns determine which cache behavior handles a request.',
    'Behaviors specify target origin, Viewer Protocol Policy, allowed HTTP methods, and TTLs.',
    'Evaluated in strict precedence order from top to bottom; Default (*) is always last.',
    'Allows mixing static caching (S3) and dynamic pass-through (ALB) on a single domain.',
    'AWS WAF web ACLs and edge functions (Lambda@Edge / CloudFront Functions) are attached at the behavior level.'
  ],
  commonMistake: 'Placing the Default Cache Behavior (*) above a specific path pattern like /images/* or putting a broader pattern before a specific one. Always order specific path patterns first.',
  example: 'Behavior Precedence Example:\nPrecedence 1: Path Pattern = `/api/v1/*` -> Origin = ALB-Origin, Caching Disabled\nPrecedence 2: Path Pattern = `/images/*.jpg` -> Origin = S3-Origin, Max TTL = 31536000\nDefault (*): Path Pattern = `*` -> Origin = S3-Origin, Default TTL = 86400',
  sources: [
    { title: 'Working with distributions', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html' }
  ]
});
