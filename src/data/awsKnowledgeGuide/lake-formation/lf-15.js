import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-15',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Integration with Redshift Spectrum',
  status: 'ready',
  plainEnglish: 'Amazon Redshift Spectrum integrates with AWS Lake Formation to allow data warehouse queries to directly query external tables stored in an S3 data lake under Lake Formation security governance. When a Redshift Spectrum query executes, Redshift validates table permissions, column masks, and row filters with Lake Formation before reading the external S3 dataset.',
  whyItMatters: 'Redshift Spectrum enables combining internal Redshift data warehouse tables with exabytes of raw S3 data lake files. Lake Formation integration ensures that enterprise data security policies remain consistent across both data warehouse and data lake layers.',
  workplaceExample: 'A data warehouse engineer creates an external schema in Redshift pointing to the Glue Data Catalog. When a financial report joins Redshift local tables with an external S3 `transactions` table, Redshift Spectrum enforces Lake Formation row-level filters automatically.',
  examFocus: 'SAA-C03 Redshift Spectrum & Lake Formation Setup:\n- External Schema: Created in Redshift with `FROM DATA CATALOG` and `LOOKUP KEY OFF`.\n- Redshift Role: The IAM role attached to the Redshift cluster must be registered as a Lake Formation principal with `SELECT` permissions on the external table.\n- Temporary Credentials: Lake Formation vends short-lived S3 access tokens to Redshift Spectrum nodes during execution.',
  keyPoints: [
    'Enables Redshift data warehouse clusters to query Lake Formation governed S3 tables.',
    'Applies Column-level and Row-level security filters during external table queries.',
    'Combines internal Redshift data warehouse storage with external S3 data lakes.',
    'Uses temporary S3 credentials vended by Lake Formation for Redshift Spectrum nodes.',
    'Requires Redshift IAM cluster role to have Lake Formation `SELECT` permissions.'
  ],
  commonMistake: 'Failing to authorize the Redshift cluster\'s IAM role in Lake Formation, causing Redshift Spectrum external queries to fail with `Permission Denied`.',
  example: 'Creating a Redshift External Schema using Lake Formation Catalog via SQL:\nCREATE EXTERNAL SCHEMA lakeformation_schema FROM DATA CATALOG DATABASE \'analytics_db\' IAM_ROLE \'arn:aws:iam::<ACCOUNT_ID>:role/RedshiftLakeRole\' CREATE EXTERNAL DATABASE IF NOT EXISTS;',
  sources: [
    { title: 'Using Redshift Spectrum with AWS Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/redshift-spectrum-integration.html' }
  ]
});
