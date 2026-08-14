import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-11',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Automated Backups and Snapshots',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB automatically backs up your database cluster storage continuously and retains continuous backups for a configurable retention period (1 to 35 days). In addition to automated daily backups, you can create manual cluster snapshots at any time. Manual snapshots persist until you explicitly delete them, even if you delete the DocumentDB cluster.',
  whyItMatters: 'Automated backups and manual snapshots ensure disaster recovery protection against accidental data deletion, ransomware, or software corruption without impacting cluster performance.',
  workplaceExample: 'A database administrator configures continuous automated backups with a 30-day retention window. Before deploying a major database schema migration, they trigger a manual cluster snapshot (`pre-migration-snap-v2`), ensuring a restore point exists if the migration fails.',
  examFocus: 'SAA-C03 Backup rules:\n- Automated Backups: Retention 1 to 35 days (default 1 day). Continuous backup stored in S3 at no extra impact to database performance.\n- Manual Snapshots: Created by user; retained until manually deleted (persists after cluster deletion).\n- Backup Storage: Free backup storage up to 100% of your total DocumentDB cluster storage size.',
  keyPoints: [
    'Continuous automated backups retained for 1 to 35 days.',
    'Automated backups do not impact database performance.',
    'Manual Cluster Snapshots persist until explicitly deleted.',
    'Manual snapshots remain intact even if the DocumentDB cluster is deleted.',
    'Snapshots can be encrypted with AWS KMS and shared across AWS accounts.'
  ],
  commonMistake: 'Deleting a DocumentDB cluster assuming automated backups will persist. Deleting a cluster deletes all automated backups; only manual cluster snapshots survive cluster deletion.',
  example: 'Creating a Manual Cluster Snapshot:\n`aws docdb create-db-cluster-snapshot --db-cluster-identifier prod-cluster --db-cluster-snapshot-identifier manual-backup-2026-08-14`',
  sources: [
    { title: 'Backup and Restore in Amazon DocumentDB', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/backup-restore.html' }
  ]
});
