import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-14',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Automated Snapshots',
  status: 'ready',
  plainEnglish: 'Automated Snapshots are hourly cluster backups taken automatically by Amazon OpenSearch Service and stored durably in a service-managed Amazon S3 bucket. Automated snapshots record the cluster state and index data, enabling point-in-time domain restoration in the event of accidental index deletion or cluster corruption.',
  whyItMatters: 'Replica shards protect against data node failure but cannot protect against accidental document deletions or index drops. Automated snapshots provide a disaster-recovery safety net stored outside the cluster.',
  workplaceExample: 'An engineer accidentally executes `DELETE /products` on a production domain. The database admin restores the most recent hourly automated snapshot into a new OpenSearch domain, recovering all catalog data within 30 minutes.',
  examFocus: 'SAA-C03 Backup & Restore Mechanics:\n- Automated Snapshots: Taken hourly and retained for 14 days at no additional charge.\n- Storage Bucket: Stored in an AWS-managed S3 bucket (invisible in user\'s S3 console).\n- Manual Snapshots: User-created snapshots registered to a customer-owned S3 bucket for long-term retention or cross-account/cross-region migration.\n- Restore Process: Restoring a snapshot restores index data; existing indices with matching names must be closed or deleted before restoring.',
  keyPoints: [
    'Hourly cluster backups taken automatically and retained for 14 days at no extra cost.',
    'Stored durably in an AWS-managed S3 bucket.',
    'Manual snapshots can be exported to customer-owned S3 buckets for long-term archiving.',
    'Enables cluster restoration following data corruption or accidental index deletion.',
    'Used for migrating indices across OpenSearch domains or AWS accounts.'
  ],
  commonMistake: 'Assuming replica shards substitute for backups. Replicas instantly mirror index deletions; snapshots allow rewinding to a clean prior state.',
  example: 'Restoring an Index from Snapshot via REST API:\nPOST /_snapshot/cs-automated/2026-08-15-14-00-00-utc/_restore\n{\n  "indices": "products",\n  "rename_pattern": "products",\n  "rename_replacement": "products_restored"\n}',
  sources: [
    { title: 'Working with Amazon OpenSearch Service index snapshots', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-snapshots.html' }
  ]
});
