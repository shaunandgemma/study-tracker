import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-16', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Schema Conversion for Heterogeneous Migrations', status: 'ready',
  plainEnglish: 'Schema conversion translates the source engine definition and code into target-engine equivalents. It covers supported tables, keys, indexes, views, functions, procedures, and other objects, while flagging items that need manual redesign.',
  whyItMatters: 'Data can be copied successfully yet the application can still fail if database behaviour, types, SQL syntax, and procedural code were not converted correctly.',
  workplaceExample: 'Oracle NUMBER columns and sequences are mapped to PostgreSQL equivalents, while a proprietary package is redesigned by the development team.',
  examFocus: 'Generate and review assessment reports before migration. Conversion projects use source and target data providers, an instance profile, migration rules, and an S3 bucket for metadata. Applying converted code is a separate deliberate step.',
  keyPoints: ['Different engines require schema translation.', 'Assessment reports reveal conversion action items.', 'Dependencies between objects affect conversion order.', 'Manual code changes can remain.', 'Functional and performance testing are mandatory.'],
  commonMistake: 'Applying generated target code directly to production without reviewing destructive changes, data-type mappings, and manual action items.',
  example: 'Convert into a non-production target, review every action item, test schema deployment repeatedly, then promote the approved conversion through version control.',
  sources: [{ title: 'Converting database schemas', url: 'https://docs.aws.amazon.com/dms/latest/userguide/schema-conversion-convert.html' }, { title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }]
});
