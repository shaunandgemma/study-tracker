import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-14',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Automated Backups and Snapshots',
  status: 'ready',
  plainEnglish: 'Amazon Neptune provides continuous automated database backups and manual cluster snapshots. Automated backups continuously stream transaction logs to Amazon S3, enabling Point-in-Time Recovery (PITR) to any second within your configured retention period (1 to 35 days). Manual cluster snapshots are user-initiated backups that are retained indefinitely until explicitly deleted.',
  whyItMatters: 'Accidental database corruption or developer error requires the ability to rewind the database. Point-in-Time Recovery allows restoring a Neptune cluster to the exact second before a bad mutation occurred.',
  workplaceExample: 'A developer accidentally drops a major graph node label at 14:15:22. The database admin initiates a Point-in-Time Recovery to 14:15:00. Neptune provisions a new DB cluster containing all graph data exactly as it existed 22 seconds before the mistake.',
  examFocus: 'SAA-C03 Backup & Restore Mechanics:\n- Continuous Automated Backups: Enabled by default (1 to 35 days retention period; default 1 day).\n- Point-in-Time Recovery (PITR): Restores a cluster to any second within the retention window.\n- Manual Snapshots: User-created cluster snapshots retained until manual deletion.\n- Restore Process: Restoring a snapshot or PITR ALWAYS provisions a NEW DB cluster with a new endpoint; it does NOT overwrite an existing running cluster in-place.',
  keyPoints: [
    'Continuous automated backups enable Point-in-Time Recovery (1 to 35 days retention).',
    'Manual cluster snapshots are user-created and stored until manually deleted.',
    'Restoring a backup or snapshot provisions a NEW Neptune DB cluster.',
    'Backup data is stored durably in Amazon S3 with zero performance impact.',
    'Database Cloning allows creating instant, copy-on-write clone clusters.'
  ],
  commonMistake: 'Expecting a snapshot restore operation to overwrite the existing Neptune cluster in-place. Restoring creates a brand-new cluster with a new connection endpoint.',
  example: 'Restoring a Neptune Cluster to a Point in Time via AWS CLI:\naws neptune restore-db-cluster-to-point-in-time --target-db-cluster-identifier restored-neptune-cluster --source-db-cluster-identifier prod-neptune-cluster --restore-to-time 2026-08-15T14:15:00Z',
  sources: [
    { title: 'Backup and restore in Amazon Neptune', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/backup-restore.html' }
  ]
});
