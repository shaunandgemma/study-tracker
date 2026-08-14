import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-14',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Security Groups',
  status: 'ready',
  plainEnglish: 'ElastiCache Security Groups govern inbound and outbound network traffic to your cache nodes at the network interface level. By attaching VPC Security Groups to an ElastiCache cluster, you control which application servers (such as EC2 web servers or Lambda functions) can connect to the cache ports (default TCP 6379 for Redis/Valkey, TCP 11211 for Memcached).',
  whyItMatters: 'Restricting access to cache ports prevents unauthorized compute instances or external networks from reading sensitive session tokens, cached database records, or memory contents stored in ElastiCache.',
  workplaceExample: 'An enterprise configures a security group `elasticache-sg` for its Redis cluster. They add an inbound rule allowing TCP port 6379 ONLY from the security group of the web application servers (`web-app-sg`). All other network traffic is blocked.',
  examFocus: 'SAA-C03 Security Group Rules:\n- Default Ports: TCP 6379 (Redis/Valkey) and TCP 11211 (Memcached).\n- Use Security Group Chaining: Inbound rule on `elasticache-sg` allows port 6379 with Source set to `web-app-sg` ID.\n- ElastiCache clusters are private to the VPC (no direct public internet access).',
  keyPoints: [
    'Virtual firewalls controlling inbound/outbound traffic to cache nodes.',
    'Default Ports: 6379 (Redis/Valkey), 11211 (Memcached).',
    'Best practice: Restrict inbound access using Security Group Chaining.',
    'Prevents unauthorized network access to sensitive in-memory data.',
    'Stateful: Inbound response traffic is automatically allowed outbound.'
  ],
  commonMistake: 'Setting the security group inbound source to `0.0.0.0/0` (open to the world), exposing in-memory cache data to public internet port scans.',
  example: 'Security Group Inbound Rule:\nType: Custom TCP | Port: 6379 | Source: `sg-0123456789abcdef0` (App Server Security Group ID).',
  sources: [
    { title: 'Security Groups in ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
  ]
});
