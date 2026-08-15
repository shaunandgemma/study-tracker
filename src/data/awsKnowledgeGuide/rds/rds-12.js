import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-12',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Automated Backups',
  status: 'ready',
  plainEnglish: 'RDS Automated Backups continuously record database storage backups and uploaded transaction logs (write-ahead logs or binlogs) to Amazon S3 during a user-configurable daily backup window. Automated backups enable Point-in-Time Recovery (PITR), allowing you to restore a database to any precise second within the retention period (1 to 35 days).',
  whyItMatters: 'If a buggy database migration script corrupts tables at 10:14:22 AM, automated transaction log backups allow restoring the database to 10:14:21 AM, completely recovering from data corruption.',
  workplaceExample: 'An enterprise database has automated backups configured with a 30-day retention window. When an analyst accidentally deletes a customer table, the DBA uses PITR to restore a new database instance to 5 seconds before the table deletion.',
  examFocus: 'SAA-C03 Automated Backup Mechanics:\n- Retention Window: Configurable from 1 to 35 days (0 disables automated backups).\n- Storage & S3: Backups include daily full storage snapshots PLUS continuous transaction logs stored in S3.\n- Deletion Behavior: Deleting an RDS instance deletes automated backups by default (unless retained automated backups are configured).\n- Restoration Rule: Restoring an automated backup ALWAYS creates a NEW DB Instance with a new endpoint; it NEVER overwrites an existing instance in-place.',
  keyPoints: [
    'Combines daily full storage snapshots with continuous transaction log archiving in S3.',
    'Enables Point-in-Time Recovery (PITR) to any second within the retention window.',
    'Retention period is configurable from 1 to 35 days (enabled by default for 1 day).',
    'Disabling automated backups (`retention = 0`) deletes all existing automated backups.',
    'Restoring an automated backup creates a brand-new DB Instance with a new endpoint.'
  ],
  commonMistake: 'Expecting automated backup restoration to rewind an existing primary database instance in-place. Restoration always provisions a new DB instance.',
  example: 'Configuring Automated Backup Window via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --backup-retention-period 14 --preferred-backup-window "03:00-04:00" --apply-immediately',
  sources: [
    { title: 'Working with automated backups in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html' }
  ]
});
