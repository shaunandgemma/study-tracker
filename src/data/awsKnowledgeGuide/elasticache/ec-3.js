import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec-3',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'Caching Patterns: Lazy Loading (Cache-Aside), Write-Through, & Session Store Offloading',
  status: 'ready',
  plainEnglish: 'Caching strategies dictate how applications read from and write to Amazon ElastiCache:\n- Lazy Loading (Cache-Aside): The app checks the cache first. If data is present (Cache Hit), it returns it immediately. If missing (Cache Miss), the app queries the database, writes the result to the cache, and returns it.\n- Write-Through: The app writes data to the cache and the database simultaneously, ensuring cache data is always fresh.\n- Session Store Offloading: User web session data is offloaded to ElastiCache so web servers remain completely stateless.',
  whyItMatters: 'Using the right caching pattern prevents database overload, minimizes read latency to sub-milliseconds, and ensures web servers can scale horizontally without losing user session state.',
  workplaceExample: 'An e-commerce app uses Lazy Loading with a 1-hour TTL for product pages. When 100,000 users view the same product, only 1 request hits the backend RDS database; 99,999 requests are served directly from ElastiCache in 0.5 milliseconds.',
  examFocus: 'SAA-C03 Caching Patterns to memorize:\n- Lazy Loading: Only caches requested data. Disadvantage: Cache miss penalty on initial read; risk of stale data (mitigate with TTL).\n- Write-Through: Data in cache is never stale. Disadvantage: Write penalty (2 writes per update); cache bloat with unread data.\n- Session Store: Offloads HTTP user session state from web servers to ElastiCache (Redis/Valkey).',
  keyPoints: [
    'Lazy Loading (Cache-Aside) loads data into cache only when requested on a cache miss.',
    'Write-Through updates cache and database simultaneously on every write.',
    'Time-to-Live (TTL) prevents stale data in Lazy Loading strategies.',
    'Session Store Offloading enables stateless web tier auto-scaling.',
    'Sub-millisecond read latency speeds up application performance dramatically.'
  ],
  commonMistake: 'Implementing Lazy Loading without setting a TTL (Time-To-Live), causing outdated database records to linger in the cache indefinitely after database updates.',
  example: 'Lazy Loading Logic Pseudocode:\n`let data = cache.get("user:100");`\n`if (!data) { data = db.query("SELECT * FROM users WHERE id=100"); cache.set("user:100", data, TTL_SECONDS); }`\n`return data;`',
  sources: [
    { title: 'Caching Strategies for Amazon ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html' }
  ]
});
