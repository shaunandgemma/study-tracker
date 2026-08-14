import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-9',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Multi-AZ with Automatic Failover',
  status: 'ready',
  plainEnglish: 'ElastiCache Multi-AZ with Automatic Failover is a high-availability feature for Redis and Valkey replication groups. When enabled, ElastiCache continuously monitors the health of the primary cache node. If the primary node fails or an Availability Zone goes dark, ElastiCache automatically promotes the healthiest read replica in another AZ to become the new primary, and updates DNS records to route traffic seamlessly.',
  whyItMatters: 'Without Automatic Failover, a primary node crash requires manual administrator intervention to promote a replica, leading to extended application downtime. Multi-AZ automatic failover restores write capabilities in under 1 minute.',
  workplaceExample: 'A retail mobile application enables Multi-AZ with Automatic Failover on its Redis cache cluster. When the primary node in `us-east-1a` suffers a network outage, ElastiCache promotes the replica in `us-east-1b` to Primary automatically. The app reconnects without downtime.',
  examFocus: 'SAA-C03 Multi-AZ Failover rules:\n- Requires at least 1 Read Replica in a different Availability Zone from the Primary.\n- Enabled by setting `AutomaticFailoverEnabled=true` on the replication group.\n- DNS endpoints update automatically during failover.\n- Maintains 99.9% SLA availability.',
  keyPoints: [
    'Monitors primary node health and automatically promotes a read replica during failure.',
    'Requires at least one read replica located in a different Availability Zone.',
    'Automatic DNS endpoint updates redirect application traffic to the new primary.',
    'Failover completes automatically, typically within 30 to 60 seconds.',
    'Supported for Valkey and Redis engines (not available on Memcached).'
  ],
  commonMistake: 'Enabling Multi-AZ Automatic Failover on a single-node Redis cluster without any read replicas. Automatic failover strictly requires at least one read replica.',
  example: 'Enabling Automatic Failover via AWS CLI:\n`aws elasticache modify-replication-group --replication-group-id my-redis-group --automatic-failover-enabled --apply-immediately`',
  sources: [
    { title: 'Minimizing Downtime with Multi-AZ', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/AutoFailover.html' }
  ]
});
