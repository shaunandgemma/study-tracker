import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-22',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Automated and Manual Snapshots',
  status: 'ready',
  plainEnglish: 'Amazon Redshift Snapshots are point-in-time cluster backups stored durably in Amazon S3. Automated Snapshots occur continuously every 8 hours or per 5 GB of data changes (retained from 1 to 35 days). Manual Snapshots are user-initiated backups that are retained indefinitely until explicitly deleted.',
  whyItMatters: 'Accidental database drops or data corruption require point-in-time recovery. Redshift incremental snapshots back up only modified disk blocks to S3, minimizing backup storage overhead and enabling fast cluster restoration.',
  workplaceExample: 'An engineer accidentally drops a core production schema. The database admin restores the 8:00 AM automated snapshot to a new Redshift cluster, recovering all schemas and data without affecting the running environment.',
  examFocus: 'SAA-C03 Snapshot & Restore Rules:\n- Automated Snapshots: Enabled by default (1 to 35 days retention period; default 1 day).\n- Incremental Backups: Snapshots store incremental changes; deleted data blocks are preserved in S3 until snapshot deletion.\n- Restore Behavior: Restoring a snapshot ALWAYS provisions a NEW Redshift cluster with a new endpoint; it does NOT overwrite an existing running cluster in-place.\n- Manual Snapshots: Kept until manually deleted, even if the source cluster is deleted.',
  keyPoints: [
    'Point-in-time cluster backups stored incrementally in Amazon S3.',
    'Automated snapshots occur every 8 hours or per 5 GB of data changes (1-35 days retention).',
    'Manual snapshots are user-created and retained indefinitely until manually deleted.',
    'Restoring a snapshot provisions a NEW Redshift cluster with a new endpoint.',
    'Incremental snapshot architecture minimizes backup storage footprint and cost.'
  ],
  commonMistake: 'Expecting a snapshot restore operation to overwrite an existing running Redshift cluster in-place. Restoring always provisions a separate new cluster.',
  example: 'Restoring a Redshift Cluster from a Snapshot via AWS CLI:\naws redshift restore-from-cluster-snapshot --cluster-identifier restored-analytics-cluster --snapshot-identifier my-manual-snapshot-2026',
  sources: [
    { title: 'Amazon Redshift snapshots and backups', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html' }
  ]
});
