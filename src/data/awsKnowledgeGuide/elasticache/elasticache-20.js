import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-20',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Database Query Caching',
  status: 'ready',
  plainEnglish: 'ElastiCache Database Query Caching is an optimization pattern where expensive, frequently executed database query results (from Amazon RDS, Aurora, or DynamoDB) are cached in ElastiCache in-memory memory nodes. When an application needs query results, it checks ElastiCache first before executing complex SQL JOIN queries or database aggregations.',
  whyItMatters: 'Relational databases consume heavy CPU, RAM, and disk I/O when processing complex SQL queries. Caching query results in ElastiCache drops database CPU utilization from 95% down to 10%, extending database lifespan and reducing licensing costs.',
  workplaceExample: 'An analytics dashboard runs a heavy SQL aggregation query (`SELECT department, COUNT(*), SUM(sales) FROM transactions GROUP BY department`) every 5 seconds. The app caches the JSON query result in ElastiCache with a 60-second TTL, reducing database queries by 98%.',
  examFocus: 'SAA-C03 Query Caching Pattern:\n- Application Tier checks ElastiCache before querying RDS/Aurora.\n- Drastically reduces database CPU utilization and read IOPS.\n- Requires setting appropriate Time-To-Live (TTL) on cached query results to balance freshness vs performance.',
  keyPoints: [
    'Stores pre-computed SQL/NoSQL query results in RAM.',
    'Dramatically reduces CPU and I/O load on backend databases (RDS, Aurora, DynamoDB).',
    'Improves application read response times from 30ms down to sub-1ms.',
    'Uses Time-To-Live (TTL) to invalidate stale query results automatically.',
    'Commonly uses Lazy Loading (Cache-Aside) design pattern.'
  ],
  commonMistake: 'Caching dynamic real-time transactional query results without setting a TTL or invalidation logic, causing applications to display outdated data to users.',
  example: 'Cached Query Key Pattern:\n`Key: "query:top_10_products_category_5"` -> `Value: [{"id": 10, "name": "Headphones"}, ...]` (TTL: 300 seconds).',
  sources: [
    { title: 'Caching Strategies for Amazon ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html' }
  ]
});
