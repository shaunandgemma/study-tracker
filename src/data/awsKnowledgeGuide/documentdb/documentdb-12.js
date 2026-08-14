import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-12',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Point-in-Time Restore',
  status: 'ready',
  plainEnglish: 'DocumentDB Point-in-Time Restore (PITR) allows you to restore a DocumentDB cluster to any specific second within your automated backup retention period (up to 35 days). When performing a Point-in-Time Restore, AWS creates a brand-new DocumentDB cluster restored to the exact target timestamp using continuous transaction logs.',
  whyItMatters: 'If a developer accidentally drops a database collection at 02:15:30 PM, Point-in-Time Restore allows you to create a new cluster restored to 02:15:29 PM—recovering all lost data up to the exact second before the mistake occurred.',
  workplaceExample: 'An application bug corrupts document records in production at 10:45 AM. The DevOps team initiates a Point-in-Time Restore targeting 10:44:59 AM. DocumentDB provisions a new cluster with uncorrupted data, allowing engineers to export the affected collections.',
  examFocus: 'SAA-C03 Point-in-Time Restore rules:\n- Restores to any second within the retention period (5 minutes ago up to 35 days).\n- ALWAYS creates a NEW DocumentDB cluster (does NOT overwrite an existing cluster in place).\n- Restored cluster receives new endpoints, which must be updated in application connection strings.',
  keyPoints: [
    'Restores database to any second within backup retention period (up to 35 days).',
    'Uses continuous automated backups and transaction logs.',
    'Creates a brand-new DocumentDB cluster rather than overwriting existing cluster.',
    'Protects against accidental data deletion or application corruption bugs.',
    'Restored cluster requires setting up compute instances and security groups.'
  ],
  commonMistake: 'Expecting Point-in-Time Restore to overwrite the existing production cluster directly. PITR creates a new cluster, requiring updating application DNS or connection strings.',
  example: 'Restoring Cluster to Point-in-Time via AWS CLI:\n`aws docdb restore-db-cluster-to-point-in-time --source-db-cluster-identifier prod-cluster --target-db-cluster-identifier restored-cluster --restore-to-time 2026-08-14T10:44:59Z`',
  sources: [
    { title: 'Restoring to a Point in Time in Amazon DocumentDB', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/backup-restore.html' }
  ]
});
