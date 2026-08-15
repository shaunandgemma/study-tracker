import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-14',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Data Catalog with Lake Formation',
  status: 'ready',
  plainEnglish: 'AWS Lake Formation builds directly on top of the AWS Glue Data Catalog to provide fine-grained, centralized access control (database-, table-, column-, row-, and cell-level permissions) for data lake resources. Instead of managing complex S3 bucket policies and IAM permissions individually, Lake Formation grants granular permissions to IAM users or roles across Athena, Glue, Redshift Spectrum, and EMR.',
  whyItMatters: 'Standard IAM policies and S3 bucket policies only allow granting coarse-grained access to entire S3 folders. Lake Formation + Glue Data Catalog allows restricting access so a analyst team can query a table but cannot view sensitive columns (like Social Security Numbers or credit card fields).',
  workplaceExample: 'A healthcare organization enforces compliance rules on patient data in S3. Using AWS Lake Formation with the Glue Data Catalog, they grant researchers access to the `patients` table while hiding the `ssn` and `home_address` columns via column-level security filters.',
  examFocus: 'SAA-C03 Centralized Data Security:\n- AWS Lake Formation builds upon and secures the Glue Data Catalog.\n- Fine-Grained Access Control: Grant permissions at the Database, Table, Column, Row, and Cell levels.\n- Under the hood, Lake Formation manages access for Amazon Athena, Redshift Spectrum, EMR, and Glue ETL.\n- Uses Named Resource permissions or LF-TBAC (Tag-Based Access Control) for scalable governance.',
  keyPoints: [
    'Provides fine-grained access control (column-, row-, and cell-level) for Glue Data Catalog objects.',
    'Centralizes security governance across Athena, Redshift Spectrum, Glue, and EMR.',
    'Replaces complex IAM and S3 bucket policies with simple grant/revoke permissions.',
    'Supports Tag-Based Access Control (LF-TBAC) for managing permissions at scale.',
    'Audits all data lake access requests in AWS CloudTrail and Lake Formation logs.'
  ],
  commonMistake: 'Attempting to enforce row- and column-level data filtering by creating dozens of separate S3 buckets and IAM policies instead of using AWS Lake Formation over the Glue Data Catalog.',
  example: 'Granting Column-Level Permissions in Lake Formation:\n`aws lakeformation grant-permissions --principal DataLakePrincipalIdentifier="arn:aws:iam::123456789012:role/AnalystRole" --resource \'{"TableWithColumns":{"DatabaseName":"medical","Name":"patients","ColumnWildcard":{},"ColumnNames":["patient_id","diagnosis"]}}\' --permissions "SELECT"`',
  sources: [
    { title: 'What is AWS Lake Formation?', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html' }
  ]
});
