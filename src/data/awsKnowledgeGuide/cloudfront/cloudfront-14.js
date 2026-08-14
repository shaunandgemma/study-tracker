import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-14',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront TTL Settings',
  status: 'ready',
  plainEnglish: 'Time to Live (TTL) is the amount of time CloudFront stores an object in an edge cache before checking the origin server for an updated version. CloudFront TTLs are controlled by three values configured in a Cache Policy: Minimum TTL, Maximum TTL, and Default TTL. Additionally, HTTP headers sent by the origin server (such as Cache-Control: max-age or Expires) influence how long CloudFront and client browsers cache the file.',
  whyItMatters: 'Setting appropriate TTL values ensures users receive fresh content while minimizing origin server loads. Static assets like images and bundled JavaScript can have long TTLs (e.g. 1 year), whereas rapidly changing data needs short TTLs (e.g. 0 to 60 seconds).',
  workplaceExample: 'A news portal sets Default TTL = 300 seconds (5 minutes) for news article pages. When breaking news is updated on the origin, CloudFront edge locations serve the cached article for at most 5 minutes before making an If-Modified-Since request to the origin to fetch the updated page.',
  examFocus: 'For SAA-C03, understand how origin Cache-Control headers interact with CloudFront TTL settings:\n- If origin sends Cache-Control: max-age=3600, CloudFront uses 3600s (if between Min TTL and Max TTL).\n- If origin sends no Cache-Control, CloudFront uses Default TTL.\n- To disable caching entirely for dynamic content, set Min TTL = 0, Default TTL = 0, Max TTL = 0 or send Cache-Control: no-cache, no-store from the origin.',
  keyPoints: [
    'Minimum TTL: Lowest duration CloudFront will cache an object.',
    'Default TTL: Used when origin does not provide Cache-Control headers (default is 24 hours / 86400 seconds).',
    'Maximum TTL: Highest duration CloudFront will cache an object regardless of origin headers.',
    'Origin HTTP headers (Cache-Control: max-age, Expires) override Default TTL within the Min/Max bounds.',
    'Setting TTLs to 0 forces CloudFront to forward all requests to the origin.'
  ],
  commonMistake: 'Configuring an origin Cache-Control: max-age=86400 but wondering why CloudFront updates every hour because Maximum TTL in the cache policy was set to 3600 seconds. Max TTL caps the origin setting.',
  example: 'CloudFront Cache Policy Settings:\nMinimum TTL: 0 seconds\nDefault TTL: 86400 seconds (24 hours)\nMaximum TTL: 31536000 seconds (365 days)\nOrigin Response Header: `Cache-Control: public, max-age=7200`\nEffective CloudFront Cache Duration: 7200 seconds (2 hours).',
  sources: [
    { title: 'Managing how long content stays in the cache (expiration)', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/expiration.html' }
  ]
});
