import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-13', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Full Load plus CDC', status: 'ready',
  plainEnglish: 'Full load plus CDC starts capturing source changes while DMS copies the existing tables. After each table is loaded, cached changes are applied, and ongoing replication continues so the target approaches the live source state.',
  whyItMatters: 'This is the common DMS pattern for moving an active database with minimal application downtime.',
  workplaceExample: 'A retail system remains online during the initial copy. DMS captures new orders, applies them after table loading, and continues until a short final cutover window.',
  examFocus: 'The replication instance needs enough memory and storage for cached changes during full load. A slow target increases CDCLatencyTarget and may spill changes to disk. Full load plus CDC does not remove the need for target schema preparation and data validation.',
  keyPoints: ['DMS captures changes while copying existing data.', 'Cached changes are applied after table loading.', 'Ongoing CDC continues after full load.', 'Replication lag must be monitored before cutover.', 'Source logs must be retained throughout the migration.'],
  commonMistake: 'Beginning a high-change migration with insufficient replication storage and source log retention.',
  example: 'Pilot the full load, monitor cached-change storage and latency, tune the target, then freeze writes briefly when the target has caught up.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Sizing a replication instance', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.SizingReplicationInstance.html' }]
});
