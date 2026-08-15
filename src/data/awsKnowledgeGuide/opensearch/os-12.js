import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-12',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'UltraWarm Storage',
  status: 'ready',
  plainEnglish: 'UltraWarm Storage is a cost-effective storage tier in Amazon OpenSearch Service for infrequently accessed read-only log data. UltraWarm uses Amazon S3 for data storage backed by dedicated UltraWarm nodes that cache index data in local memory/SSD, reducing storage costs by up to 90% compared to Hot EBS storage while maintaining query capability.',
  whyItMatters: 'Retaining 90 days of log data on Hot EBS storage is prohibitively expensive. UltraWarm allows keeping terabytes of historical logs accessible for queries and compliance at object-storage prices.',
  workplaceExample: 'A financial institution retains log data for 1 year. They store the first 7 days of logs on Hot EBS storage for rapid indexing, then automatically transition indices older than 7 days to UltraWarm storage via Index State Management (ISM).',
  examFocus: 'SAA-C03 Tiered Storage Options:\n- Hot Tier (EBS): High-speed write indexing and active search queries.\n- UltraWarm Tier (S3-backed): Read-only data storage backed by S3 with local caching on UltraWarm nodes; costs up to 90% less than EBS.\n- Cold Storage Tier: Detached read-only indices stored directly on S3 without dedicated compute nodes; must be restored to UltraWarm to query.\n- Capacity: UltraWarm domains support up to 3 PB of log storage per domain.',
  keyPoints: [
    'Cost-effective storage tier backed by Amazon S3 for read-only historical data.',
    'Reduces log storage costs by up to 90% compared to Hot EBS Data Node storage.',
    'UltraWarm nodes cache active query data on local SSDs for fast search access.',
    'Supports up to 3 PB of storage per OpenSearch domain.',
    'Automated seamlessly via OpenSearch Index State Management (ISM) policies.'
  ],
  commonMistake: 'Attempting to perform high-frequency write or indexing operations directly against indices stored in UltraWarm. UltraWarm is strictly for read-only historical data.',
  example: 'Migrating an Index to UltraWarm via REST API:\nPOST /_ultrawarm/migration/logs-2026.07.01/_warm',
  sources: [
    { title: 'UltraWarm storage for Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html' }
  ]
});
