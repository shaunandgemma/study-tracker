import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-15',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Backup Retention',
  status: 'ready',
  plainEnglish: 'RDS Backup Retention defines the number of days (from 1 to 35 days) that automated storage snapshots and continuous transaction logs are preserved in Amazon S3 for Point-in-Time Recovery. You can also configure Retained Automated Backups to keep automated backups after an RDS DB instance is deleted.',
  whyItMatters: 'Setting an appropriate backup retention period ensures compliance with corporate data retention mandates while balancing S3 backup storage costs. Disabling retention (`0` days) turns off automated backups and disables Read Replica creation.',
  workplaceExample: 'A compliance team sets a 35-day backup retention period for production financial databases, while setting 3 days for development databases to save backup storage costs.',
  examFocus: 'SAA-C03 Backup Retention Limits & Defaults:\n- Retention Range: 1 to 35 days (default is 1 day when created via CLI/API, 7 days via AWS Console).\n- Setting to 0: Setting `backupRetentionPeriod = 0` disables automated backups immediately and deletes all stored automated snapshots.\n- Deletion Protection: Retained Automated Backups allow keeping backups after instance deletion for disaster recovery.',
  keyPoints: [
    'Configures automated backup and transaction log storage lifetime (1 to 35 days).',
    'Setting retention to 0 disables automated backups and deletes existing automated snapshots.',
    'Required for Point-in-Time Recovery and Read Replica creation.',
    'Retained Automated Backups allow keeping automated backups after DB instance deletion.',
    'S3 backup storage is free up to 100% of allocated database storage capacity.'
  ],
  commonMistake: 'Setting backup retention to 0 on a primary database, which immediately deletes all existing automated snapshots and breaks Read Replica replication.',
  example: 'Updating Backup Retention Period via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --backup-retention-period 35 --apply-immediately',
  sources: [
    { title: 'Managing RDS automated backup retention', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupRetention' }
  ]
});
