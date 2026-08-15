import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-20',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Data Sharing',
  status: 'ready',
  plainEnglish: 'Redshift Data Sharing allows securely sharing live, read-only data across different Amazon Redshift provisioned clusters or Redshift Serverless workgroups—across AWS accounts and AWS Regions—without copying or moving the physical data. Consumer clusters query producer data directly in-place from Redshift Managed Storage.',
  whyItMatters: 'Traditional cross-account data sharing requires running complex ETL export pipelines (`UNLOAD` -> S3 -> `COPY`), creating data duplication, sync lag, and extra storage costs. Data Sharing provides instantaneous live access with zero data duplication.',
  workplaceExample: 'A central data team maintains a `Producer` Redshift cluster (`sales-db`). They share the `sales_fact` table live with `Marketing` and `Finance` consumer clusters. Marketing analysts query live sales data instantly without any ETL data copying.',
  examFocus: 'SAA-C03 Data Sharing Architecture:\n- Requirement: Producer and consumer clusters must use RA3 nodes or Redshift Serverless.\n- Datashare Object: Producer creates a `DATASHARE` object, adds specific schemas/tables/views, and authorizes consumer namespaces/accounts.\n- Zero ETL Duplication: Consumers query producer managed storage directly; no data duplication occurs.\n- Granular Security: Grant or revoke access down to individual tables, views, or user-defined functions (UDFs).',
  keyPoints: [
    'Securely shares live read-only data across Redshift clusters and AWS accounts without copying data.',
    'Requires RA3 instance types or Redshift Serverless in producer and consumer clusters.',
    'Eliminates data duplication, complex ETL export pipelines, and data sync latency.',
    'Supports cross-account and cross-Region live data sharing.',
    'Governed by granular SQL authorizations on `DATASHARE` objects.'
  ],
  commonMistake: 'Attempting to use Redshift Data Sharing on legacy DC2 node clusters. Data Sharing requires RA3 nodes or Redshift Serverless.',
  example: 'Creating and Authorizing a Datashare in SQL:\n-- On Producer Cluster:\nCREATE DATASHARE sales_share;\nALTER DATASHARE sales_share ADD SCHEMA public;\nALTER DATASHARE sales_share ADD TABLE public.sales_fact;\nGRANT USAGE ON DATASHARE sales_share TO ACCOUNT "123456789012";\n\n-- On Consumer Cluster:\nCREATE DATABASE sales_consumer FROM DATASHARE sales_share OF ACCOUNT "987654321098";',
  sources: [
    { title: 'Overview of Amazon Redshift data sharing', url: 'https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html' }
  ]
});
