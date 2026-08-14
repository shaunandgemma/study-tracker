import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'elasticache-17',
  topicId: 'topic-elasticache',
  topicTitle: 'Amazon ElastiCache',
  objectiveCode: 'Databases',
  title: 'ElastiCache Backups and Snapshots',
  status: 'ready',
  plainEnglish: 'ElastiCache for Redis and Valkey allows you to create point-in-time backup snapshots of your cache cluster. A snapshot is a complete copy of a cluster\'s data and metadata saved into Amazon S3 as an RDB file. You can configure automated daily backup windows (retaining backups from 1 to 35 days) or create manual snapshots on demand.',
  whyItMatters: 'Snapshots provide disaster recovery backups, allow warm-starting new cache clusters, and enable migrating cache clusters across AWS accounts or regions.',
  workplaceExample: 'A database administrator configures automated daily backups for a Redis cluster with a 14-day retention window. Before performing a cluster engine upgrade from Redis 6 to Redis 7, they create a manual snapshot (`pre-upgrade-snapshot`) to ensure an immediate rollback path.',
  examFocus: 'SAA-C03 Backup rules for ElastiCache:\n- Supported for Redis and Valkey engines ONLY (Memcached does NOT support backups or snapshots).\n- Automated Backups: Configured retention window (1 to 35 days).\n- Manual Snapshots: Persist until manually deleted.\n- Exporting: Snapshots can be exported to an Amazon S3 bucket for cross-region disaster recovery.',
  keyPoints: [
    'Creates point-in-time RDB snapshots stored durably in Amazon S3.',
    'Supported for Valkey and Redis engines (NOT supported for Memcached).',
    'Automated daily backup window with 1 to 35 day retention.',
    'Manual snapshots persist indefinitely until explicitly deleted.',
    'Snapshots can be exported to S3 or used to seed new cache clusters.'
  ],
  commonMistake: 'Attempting to configure automated backups for an ElastiCache Memcached cluster. Memcached is a pure in-memory engine with no backup or snapshot capability.',
  example: 'Creating a Manual Snapshot via AWS CLI:\n`aws elasticache create-snapshot --replication-group-id my-redis-group --snapshot-name manual-backup-2026-08-14`',
  sources: [
    { title: 'Backup and Restore for ElastiCache for Redis', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/backups.html' }
  ]
});
