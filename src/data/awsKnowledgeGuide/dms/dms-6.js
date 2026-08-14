import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-6', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Heterogeneous Database Migrations', status: 'ready',
  plainEnglish: 'A heterogeneous migration changes database engines, such as Oracle to PostgreSQL. DMS moves and transforms supported data, while DMS Schema Conversion assesses and converts schema objects and database code where possible.',
  whyItMatters: 'Changing engines can reduce licensing cost or modernize a platform, but SQL dialects, data types, procedures, and engine-specific behaviour introduce conversion work.',
  workplaceExample: 'A team moves Oracle to Aurora PostgreSQL. Schema Conversion converts compatible tables and views, reports manual action items for PL/SQL code, and DMS transfers the data.',
  examFocus: 'For different engines, separate schema conversion from data migration. Automated conversion does not eliminate testing or manual remediation. Use assessment reports to estimate complexity before committing to the cutover plan.',
  keyPoints: ['The source and target engines differ.', 'Schema and code conversion is normally required.', 'Assessment reports identify automatic and manual conversion work.', 'DMS migrates supported data after target structures exist.', 'Application SQL and drivers may also need changes.'],
  commonMistake: 'Starting the data task before creating and verifying the converted target schema and required constraints.',
  example: 'Assess Oracle objects, convert supported schema to PostgreSQL, repair action items, apply the target schema, then configure the DMS data task.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Converting database schemas with DMS Schema Conversion', url: 'https://docs.aws.amazon.com/dms/latest/userguide/schema-conversion-convert.html' }]
});
