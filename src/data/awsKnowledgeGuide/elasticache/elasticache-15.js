import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-15',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Encryption in Transit',
  status: 'ready',
  plainEnglish: 'ElastiCache Encryption in Transit secures network traffic between client applications and ElastiCache nodes (and between primary and replica cache nodes) using Transport Layer Security (TLS/SSL). When enabled, client applications connect over TLS, and Redis/Valkey AUTH tokens or IAM authentication can be enforced for user access.',
  whyItMatters: 'Unencrypted network traffic within a VPC can be intercepted by compromised internal network interfaces. Enabling TLS encryption in transit protects session tokens and sensitive cached payload data from network eavesdropping.',
  workplaceExample: 'A banking application enables Encryption in Transit on its ElastiCache Redis cluster. The application connects using TLS (`rediss://`) and passes a password token authenticated via Redis AUTH. All data sent across the network is encrypted with TLS 1.2+.',
  examFocus: 'SAA-C03 Transit Encryption & Authentication:\n- Enabled by setting `TransitEncryptionEnabled=true` at replication group creation.\n- Redis AUTH / Token Authentication: Requires clients to pass a secret password token to authenticate.\n- Role-Based Access Control (RBAC): Redis 6+ / Valkey supports fine-grained IAM and RBAC user permissions.\n- Must be enabled when creating the replication group (cannot be added later without cluster recreation).',
  keyPoints: [
    'Encrypts network communication between clients and cache nodes using TLS/SSL.',
    'Encrypts inter-node replication traffic between Primary and Read Replicas.',
    'Supports Redis AUTH token password authentication.',
    'Supports Role-Based Access Control (RBAC) for fine-grained user permissions.',
    'Must be enabled at replication group creation time.'
  ],
  commonMistake: 'Attempting to use a standard unencrypted connection string (`redis://`) when connecting to an ElastiCache cluster with Encryption in Transit enabled. TLS connection strings (`rediss://`) must be used.',
  example: 'Connecting via TLS with Redis CLI:\n`redis-cli -h my-cluster.xxxxxx.ng.0001.use1.cache.amazonaws.com -p 6379 --tls -a MyAuthToken123!`',
  sources: [
    { title: 'ElastiCache In-Transit Encryption (TLS)', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/in-transit-encryption.html' }
  ]
});
