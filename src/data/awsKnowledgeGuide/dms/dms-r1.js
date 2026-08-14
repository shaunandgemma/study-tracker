import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-r1', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Homogeneous vs Heterogeneous Database Migration - Schema Conversion Tool Requirement', status: 'ready',
  plainEnglish: 'A homogeneous migration keeps the database engine compatible, so the source schema normally works on the target. A heterogeneous migration changes engines and therefore needs schema and database-code assessment and conversion before DMS transfers data into the target structures.',
  whyItMatters: 'Recognizing this distinction prevents teams from confusing data movement with the much broader work of changing database dialect and application behaviour.',
  workplaceExample: 'MySQL to RDS MySQL can use native schema compatibility, while SQL Server to Aurora PostgreSQL requires conversion of tables, types, procedures, and application SQL.',
  examFocus: 'Same engine generally means no schema conversion tool; different engines normally require DMS Schema Conversion or AWS SCT and manual remediation. Always assess versions and extensions even in homogeneous migrations.',
  keyPoints: ['Homogeneous means compatible engine families.', 'Heterogeneous means different database engines.', 'DMS moves data between supported endpoints.', 'Schema conversion handles structural and code differences.', 'Not every database object converts automatically.'],
  commonMistake: 'Answering that DMS alone performs every part of an Oracle-to-PostgreSQL conversion.',
  example: 'For Oracle to PostgreSQL, generate an assessment, convert and apply supported target objects, manually fix action items, and then migrate data with DMS.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Migrating databases to their RDS equivalents', url: 'https://docs.aws.amazon.com/dms/latest/userguide/data-migrations.html' }, { title: 'Convert database schemas', url: 'https://docs.aws.amazon.com/dms/latest/userguide/schema-conversion-convert.html' }]
});
