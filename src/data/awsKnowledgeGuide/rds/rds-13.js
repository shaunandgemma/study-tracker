import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-13',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Manual Snapshots',
  status: 'ready',
  plainEnglish: 'RDS Manual DB Snapshots are user-initiated, point-in-time storage backups of an RDS instance. Unlike automated backups (which expire based on retention rules), manual snapshots are stored durably in Amazon S3 and retained indefinitely until explicitly deleted by a user, even if the parent RDS DB instance is deleted.',
  whyItMatters: 'Before performing major application deployments or database schema alterations, taking a manual snapshot provides an immutable safety backup that will not be automatically deleted by retention rules.',
  workplaceExample: 'Before executing a major v2.0 schema migration, a DevOps engineer creates a manual DB snapshot named `pre-v2-migration-snapshot`. If the schema upgrade fails, they restore a new instance from this manual snapshot.',
  examFocus: 'SAA-C03 Manual DB Snapshot Capabilities:\n- Lifetime: Retained indefinitely until manually deleted (persists even if the DB instance is deleted).\n- Sharing & Copying: Manual snapshots can be shared across AWS accounts and copied to secondary AWS Regions.\n- Unencrypted to Encrypted: Copying an unencrypted manual DB snapshot allows encrypting the copy with a KMS key.\n- Restoring Mechanics: Restoring a manual snapshot provisions a NEW DB Instance.',
  keyPoints: [
    'User-initiated storage snapshots stored durably in Amazon S3.',
    'Persist indefinitely until explicitly deleted by a user (survive instance deletion).',
    'Can be shared across AWS accounts and copied across AWS Regions.',
    'Copying an unencrypted snapshot enables encrypting the snapshot copy with KMS.',
    'Restoring a manual DB snapshot provisions a new DB instance with a new endpoint.'
  ],
  commonMistake: 'Deleting an RDS DB instance assuming automated backups will persist forever. Use manual snapshots (or final snapshot) for permanent backup retention.',
  example: 'Creating a Manual DB Snapshot via AWS CLI:\naws rds create-db-snapshot --db-instance-identifier prod-db --db-snapshot-identifier pre-v2-migration-snapshot-2026-08-15',
  sources: [
    { title: 'Creating a DB snapshot in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html' }
  ]
});
