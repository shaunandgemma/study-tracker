import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-13',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Cache Keys',
  status: 'ready',
  plainEnglish: 'A Cache Key is the unique identifier that CloudFront uses to determine whether an incoming request matches an existing cached object. By default, the cache key consists of the domain name and the URL path of the request (e.g. https://d123.cloudfront.net/logo.png). However, you can configure CloudFront Cache Policies to include headers, query strings, or cookies in the cache key. When request attributes are in the cache key, CloudFront caches different versions of the file based on variations in those attributes.',
  whyItMatters: 'Including necessary parameters in the cache key ensures users get tailored content (e.g. different languages based on Accept-Language headers or search results based on ?category=books). However, including unnecessary parameters lowers your Cache Hit Ratio because CloudFront treats slight parameter variations as separate cached items.',
  workplaceExample: 'An international e-commerce app includes the Accept-Language header in its CloudFront Cache Policy. When a user in Spain requests /homepage, CloudFront caches the Spanish version. When a user in Germany requests /homepage, CloudFront sees a different cache key, fetches the German version from the origin, and caches it separately.',
  examFocus: 'To maximize the Cache Hit Ratio, minimize the number of headers, query strings, and cookies included in the cache key. Use CloudFront Cache Policies and Origin Request Policies: include only parameters needed for caching in the Cache Policy, and pass other required origin parameters using Origin Request Policies without affecting the cache key.',
  keyPoints: [
    'Cache key uniquely identifies objects stored at edge locations.',
    'Default cache key = HTTP request method + domain name + request URI path.',
    'Can optionally include specific query strings, headers, and cookies.',
    'Fewer parameters in the cache key = higher cache hit ratio and better performance.',
    'Use Origin Request Policies to forward headers to origin without adding them to the cache key.'
  ],
  commonMistake: 'Forwarding All Headers or User-Agent in the cache key. User-Agent contains hundreds of variations across browsers, causing CloudFront to cache hundreds of duplicate files and dropping the cache hit ratio to nearly 0%.',
  example: 'Cache Policy Definition:\nName: `LanguageAndQueryCachePolicy`\nCache Key Contents:\n- Headers: `Accept-Language`\n- Query Strings: `page`, `sort`\n- Cookies: None\nResult: `GET /products?page=2` with header `Accept-Language: es` generates a unique cache key.',
  sources: [
    { title: 'Understanding the cache key', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html' }
  ]
});
