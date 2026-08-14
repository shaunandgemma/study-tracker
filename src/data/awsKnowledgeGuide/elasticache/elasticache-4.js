import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-4',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Managed In-Memory Caching',
  status: 'ready',
  plainEnglish: 'Amazon ElastiCache is a fully managed, in-memory data store and caching service provided by AWS. It allows applications to retrieve data from ultra-fast RAM (microsecond response times) instead of querying slower disk-based databases (like Amazon RDS or DynamoDB). ElastiCache supports popular open-source engines including Valkey, Redis OSS, and Memcached.',
  whyItMatters: 'Disk-based database reads take milliseconds, while ElastiCache reads take sub-milliseconds (microseconds). Placing ElastiCache in front of RDS or Aurora reduces database query load by up to 90% and drastically lowers infrastructure costs.',
  workplaceExample: 'A ride-sharing app places an ElastiCache cluster in front of its Aurora PostgreSQL database. Frequently requested driver location coordinates are cached in memory, dropping API latency from 45ms to 0.8ms.',
  examFocus: 'SAA-C03 Core Concept:\n- Fully managed in-memory cache layer in a VPC.\n- Offloads read pressure from relational (RDS) or key-value databases.\n- Supported Engines: Valkey, Redis OSS, and Memcached.\n- Serverless Mode: Automatically scales memory and compute throughput based on demand without managing cache nodes.',
  keyPoints: [
    'Fully managed in-memory caching service delivering microsecond response times.',
    'Sits between application tier and database tier to relieve database read bottlenecks.',
    'Supports Valkey, Redis OSS, and Memcached engines.',
    'Offers Serverless or Provisioned Node Cluster options.',
    'Improves application throughput and overall responsiveness.'
  ],
  commonMistake: 'Using ElastiCache as a primary persistent relational database storage engine. ElastiCache is an in-memory cache; primary data must reside in a persistent database like RDS, Aurora, or DynamoDB.',
  example: 'Architecture Pattern:\nApp Tier (EC2/Lambda) -> Check Cache (ElastiCache, 0.5ms) -> If Miss -> Query DB (RDS PostgreSQL, 25ms) -> Store in Cache.',
  sources: [
    { title: 'What is Amazon ElastiCache?', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
  ]
});
