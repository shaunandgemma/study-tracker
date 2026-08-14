import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-4', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Database Migration', status: 'ready',
  plainEnglish: 'AWS Database Migration Service moves data from a supported source to a supported target. A traditional DMS migration uses a replication instance, a source endpoint, a target endpoint, and a replication task. The task can copy existing data, replicate ongoing changes, or do both.',
  whyItMatters: 'DMS reduces the custom engineering needed to move database data and can keep a target synchronized while applications continue using the source.',
  workplaceExample: 'A company migrates an on-premises PostgreSQL database to Amazon RDS. DMS performs the full load, applies ongoing changes, and lets the team schedule a short cutover after replication lag reaches an acceptable level.',
  examFocus: 'DMS primarily moves data; schema and database-code conversion may require DMS Schema Conversion or native tools. Understand source and target endpoints, replication compute, tasks, table mappings, validation, and CDC prerequisites.',
  keyPoints: ['Endpoints describe source and target connectivity.', 'Replication compute runs migration tasks.', 'Tasks select migration mode and table mappings.', 'Full load copies existing rows.', 'CDC reads supported source transaction logs for ongoing changes.'],
  commonMistake: 'Assuming DMS automatically converts every schema object, procedure, trigger, and vendor-specific feature during a heterogeneous migration.',
  example: 'Assess compatibility, convert and create the target schema, test both endpoints, run full load plus CDC, validate data, then perform a controlled cutover.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'What is AWS Database Migration Service?', url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html' }]
});
