import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-20', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Amazon S3 Sources and Targets', status: 'ready',
  plainEnglish: 'DMS can read supported files from S3 as a source or write database data to S3 as a target. An S3 source uses an external table definition to describe how files map to tables. An S3 target commonly writes full-load and CDC data as CSV by default and can support formats and options such as Parquet.',
  whyItMatters: 'S3 endpoints connect database migration with data-lake ingestion, archival, analytics, and file-based migration workflows.',
  workplaceExample: 'A relational database is replicated to an S3 data lake in Parquet format, partitioned by date, registered in Glue, and queried with Athena.',
  examFocus: 'S3 is object storage rather than a relational engine. Understand IAM service-role access, bucket and KMS policies, file formats, prefixes, external table definitions, CDC operation indicators, and endpoint-specific limitations.',
  keyPoints: ['S3 can act as a DMS source or target.', 'Source files require a table-mapping definition.', 'Target files can use CSV or supported Parquet options.', 'IAM and bucket permissions are required.', 'Schema changes do not rewrite previously emitted S3 records.'],
  commonMistake: 'Expecting an S3 target to preserve relational indexes, constraints, transactions, and schema evolution like a database target.',
  example: 'Write CDC records to a controlled prefix, include operation metadata required by consumers, encrypt the bucket, and validate downstream schema handling.',
  sources: [{ title: 'Using S3 as a DMS source', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.S3.html' }, { title: 'Using S3 as a DMS target', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html' }]
});
