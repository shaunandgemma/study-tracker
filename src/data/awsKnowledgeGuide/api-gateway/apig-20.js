import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-20',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'API Gateway Caching',
  status: 'ready',
  plainEnglish: 'API Gateway caching stores selected REST API backend responses in a dedicated cache for a stage. For a matching cache key and unexpired time to live (TTL), API Gateway returns the cached response instead of invoking the backend. Cache keys can include suitable method or integration parameters so responses for different requests do not collide. Stage caching enables GET methods by default, with method-level overrides available.',
  whyItMatters: 'Caching can lower backend load and response latency for data that is safe to reuse. It is especially useful for read-heavy endpoints whose responses change less frequently than clients request them.',
  workplaceExample: 'A product catalog GET method caches responses by product ID for a short TTL. Repeated reads avoid database calls, while write operations remain uncached and invalidate or tolerate expiry according to the application’s consistency needs.',
  examFocus: 'API Gateway response caching is a REST API feature and has an additional hourly charge. Choose it for repeated, cacheable responses—not per-user or rapidly changing data unless the cache key and invalidation model are correct. TTL controls freshness; cache capacity affects performance; encryption should be enabled when cached data is sensitive. Monitor CacheHitCount and CacheMissCount and load-test capacity.',
  keyPoints: [
    'Caching reduces integration calls and can improve response latency.',
    'It is configured for a REST API stage with optional method overrides.',
    'TTL determines how long an entry can be reused.',
    'Cache keys must include every request value that changes the response.',
    'CacheHitCount and CacheMissCount show cache effectiveness.'
  ],
  commonMistake: 'Omitting an authorization-dependent or query parameter from the cache key can return one caller’s response to another. Cache only appropriate data, define complete keys, encrypt sensitive cached responses, and test requests that vary each relevant input.',
  example: 'Cache GET /products/{id} using the id path parameter as a key and a short TTL. Request the same product twice and expect the second response to be eligible for a hit; request another ID and expect a miss. Verify CloudWatch hit and miss metrics and confirm the backend invocation count changes accordingly.',
  sources: [
    { title: 'Cache settings for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html' },
    { title: 'Monitor REST API execution with CloudWatch metrics', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/monitoring-cloudwatch.html' }
  ]
});
