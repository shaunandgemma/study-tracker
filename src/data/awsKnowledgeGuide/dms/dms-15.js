import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-15', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'AWS Schema Conversion Tool and DMS Schema Conversion', status: 'ready',
  plainEnglish: 'DMS Schema Conversion is the AWS DMS capability for assessing and converting schemas and database code between supported engines. AWS Schema Conversion Tool is the earlier downloadable tool that also supports assessment and conversion workflows. Both separate schema conversion from DMS data movement.',
  whyItMatters: 'Heterogeneous migrations must translate tables, types, views, procedures, functions, and other vendor-specific objects before migrated data can be used correctly.',
  workplaceExample: 'A migration project assesses SQL Server to Aurora PostgreSQL, converts supported objects automatically, and lists stored procedures that engineers must rewrite.',
  examFocus: 'Use schema conversion for different database engines. Assessment reports show conversion coverage and action items. Converted code must be reviewed, applied to the target, and tested; conversion does not automatically migrate application data.',
  keyPoints: ['Assessment estimates conversion complexity.', 'Automated conversion handles supported objects.', 'Action items identify manual work.', 'Converted code must be applied to the target.', 'DMS tasks then move the selected data.'],
  commonMistake: 'Assuming a successful automatic conversion percentage proves application compatibility.',
  example: 'Create a migration project, assess the schemas, convert supported objects, repair action items, apply to a test target, and run application regression tests.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Converting database schemas', url: 'https://docs.aws.amazon.com/dms/latest/userguide/schema-conversion-convert.html' }]
});
