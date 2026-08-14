import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-21',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache vs DynamoDB Accelerator - DAX',
  status: 'ready',
  plainEnglish: 'Amazon ElastiCache and Amazon DynamoDB Accelerator (DAX) are both AWS in-memory caching solutions, but they target different database backends and application architectures:\n- Amazon ElastiCache: A versatile in-memory cache supporting Valkey, Redis OSS, and Memcached engines. Designed as a general-purpose cache sitting in front of ANY database (RDS, Aurora, DynamoDB, on-premises) or used as a session store. Requires application code changes to handle cache hits/misses.\n- Amazon DynamoDB Accelerator (DAX): A fully managed, inline write-through cache designed EXCLUSIVELY for Amazon DynamoDB. Requires ZERO application code changes (uses standard DynamoDB SDK calls) and reduces read latency to microseconds.',
  whyItMatters: 'Selecting the right caching service depends on your database engine and application code architecture. DAX is a seamless drop-in cache for DynamoDB, whereas ElastiCache provides flexible multi-purpose caching for relational databases and custom data structures.',
  workplaceExample: 'An enterprise uses DynamoDB for real-time user profiles. To achieve microsecond read latency without rewriting application code, they deploy DAX in front of DynamoDB. For their Aurora MySQL database, they deploy ElastiCache for Redis.',
  examFocus: 'SAA-C03 Decision Matrix:\n- DynamoDB + Microsecond Read Latency + Zero Code Changes -> Amazon DynamoDB Accelerator (DAX).\n- Relational DB (RDS/Aurora) + Session Store + Complex Redis Data Structures -> Amazon ElastiCache (Valkey/Redis/Memcached).',
  keyPoints: [
    'ElastiCache: General-purpose cache for RDS, Aurora, or custom data structures (Valkey/Redis/Memcached).',
    'DAX: Inline write-through cache designed EXCLUSIVELY for Amazon DynamoDB.',
    'DAX requires zero application code changes (drop-in SDK replacement for DynamoDB).',
    'ElastiCache requires application logic to manage cache hits/misses (Cache-Aside pattern).',
    'Both deliver microsecond in-memory read response times.'
  ],
  commonMistake: 'Selecting ElastiCache for a DynamoDB workload when DAX could provide microsecond caching without requiring any application code modification.',
  example: 'Decision Tree:\n- "Cache queries for Aurora PostgreSQL" -> ElastiCache.\n- "Microsecond read acceleration for DynamoDB with zero code change" -> DAX.',
  sources: [
    { title: 'What is Amazon ElastiCache?', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' },
    { title: 'DynamoDB Accelerator (DAX) Overview', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html' }
  ]
});
