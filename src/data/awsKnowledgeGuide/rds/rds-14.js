import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-14',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Point-in-Time Recovery',
  status: 'ready',
  plainEnglish: 'Point-in-Time Recovery (PITR) is an automated recovery feature of Amazon RDS that restores a database instance to any specific second within your configured automated backup retention window (up to 35 days ago). RDS restores the nearest daily storage snapshot and plays back transaction logs up to the specified target timestamp.',
  whyItMatters: 'Human error or ransomware scripts can corrupt data at a precise time. PITR allows stepping back to seconds before the corrupting query executed, minimizing data loss Recovery Point Objectives (RPO).',
  workplaceExample: 'An automated script executes a bad `DROP TABLE` SQL query at 14:22:05 PM. The DBA uses PITR to restore a new RDS instance to 14:22:00 PM, recovering all table data without losing earlier transactions.',
  examFocus: 'SAA-C03 PITR Restoration Rules:\n- Granularity: Restores data to any second within the automated backup retention period.\n- Restored Resource: Always provisions a NEW DB Instance (e.g. `restored-db-instance`); existing primary instance is NOT modified.\n- Transaction Log Requirement: Requires continuous transaction logs (enabled when `backupRetentionPeriod > 0`).\n- Latest Restorable Time: Usually within 5 minutes of current time.',
  keyPoints: [
    'Restores a database to any specific second within the automated backup window.',
    'Combines the most recent daily storage snapshot with continuous transaction log replay.',
    'Always provisions a brand-new DB Instance with a new endpoint URI.',
    'Latest restorable time is typically within 5 minutes of current operational time.',
    'Crucial for recovering from accidental table drops or application data corruption.'
  ],
  commonMistake: 'Expecting PITR to overwrite the existing corrupted database in-place, instead of creating a separate restored DB instance.',
  example: 'Restoring an RDS DB Instance to a Point in Time via AWS CLI:\naws rds restore-db-instance-to-point-in-time --source-db-instance-identifier prod-db --target-db-instance-identifier restored-db-1422 --restore-time "2026-08-15T14:22:00Z"',
  sources: [
    { title: 'Restoring a DB instance to a specified time in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PITR.html' }
  ]
});
