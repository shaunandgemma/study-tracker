import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-8', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Target Endpoints', status: 'ready',
  plainEnglish: 'A target endpoint describes the destination that DMS writes to. It contains target engine, network, TLS, credentials, and engine-specific settings, and its database identity needs permission to create or modify the selected target objects as required by the task.',
  whyItMatters: 'Target performance and permissions directly affect full-load speed and CDC latency; a slow target can cause cached changes to accumulate on replication compute.',
  workplaceExample: 'An Aurora target is scaled and indexed for the migration, but some secondary indexes are created after the bulk load to improve loading performance.',
  examFocus: 'Target table preparation mode controls whether DMS drops, truncates, or leaves existing tables. Protect production data by understanding that choice. DMS does not necessarily create every secondary object required by the application.',
  keyPoints: ['Endpoint type must be target.', 'The target user needs required write and object privileges.', 'Target table preparation changes full-load behaviour.', 'Target tuning affects throughput and CDC latency.', 'Schema, indexes, constraints, and permissions require a migration plan.'],
  commonMistake: 'Selecting drop-tables mode against a target that already contains data that must be retained.',
  example: 'Create the target schema, test connectivity, migrate a representative subset, validate application queries, and record safe table-preparation settings.',
  sources: [{ title: 'Creating source and target endpoints', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Endpoints.Creating.html' }, { title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }]
});
