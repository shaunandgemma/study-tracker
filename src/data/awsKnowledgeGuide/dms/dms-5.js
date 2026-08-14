import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-5', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Homogeneous Database Migrations', status: 'ready',
  plainEnglish: 'A homogeneous migration keeps the same or compatible database engine family, such as PostgreSQL to Amazon RDS for PostgreSQL or Aurora PostgreSQL. Because source and target understand similar database objects, schema conversion is usually unnecessary.',
  whyItMatters: 'Like-for-like migrations reduce application changes and compatibility risk while allowing movement from self-managed databases to managed AWS services.',
  workplaceExample: 'An on-premises MySQL application moves to Amazon RDS for MySQL. Native schema and data types remain compatible, and DMS keeps the target current before cutover.',
  examFocus: 'Use native dump and restore for bulk loading when it is faster, then DMS CDC to minimize downtime. DMS homogeneous data migrations can use native database tools and serverless resources for supported engine combinations.',
  keyPoints: ['Source and target use the same engine family.', 'Schema conversion is generally not required.', 'Native database tools may provide efficient bulk transfer.', 'CDC can synchronize changes before cutover.', 'Engine versions and unsupported features still require assessment.'],
  commonMistake: 'Treating every same-name engine migration as automatically compatible without checking versions, extensions, collation, users, and database options.',
  example: 'Test PostgreSQL extensions and roles, load the target, start ongoing replication, validate row counts, then redirect the application after lag is cleared.',
  sources: [{ title: 'Migrating databases to their RDS equivalents', url: 'https://docs.aws.amazon.com/dms/latest/userguide/data-migrations.html' }, { title: 'Running homogeneous data migrations', url: 'https://docs.aws.amazon.com/dms/latest/userguide/dm-migrating-data.html' }]
});
