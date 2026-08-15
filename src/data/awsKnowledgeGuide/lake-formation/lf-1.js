import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-1',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Centralized Data Lake Governance & Automated S3 Data Ingestion',
  status: 'ready',
  plainEnglish: 'AWS Lake Formation is a centralized data lake governance service that simplifies setting up, securing, and managing data lakes on Amazon S3. Instead of manually configuring complex S3 bucket policies, Glue Data Catalog permissions, and IAM policies across dozens of services, Lake Formation centralizes data lake security by defining grant/revoke permissions on Data Catalog databases, tables, columns, and rows.',
  whyItMatters: 'Managing permissions for thousands of data lake tables and S3 prefixes using raw IAM and S3 bucket policies quickly becomes unmanageable. Lake Formation provides a single control plane to register S3 storage locations, ingest data automatically via Blueprints, and enforce consistent access policies across query engines.',
  workplaceExample: 'A data platform team configures Lake Formation to govern an S3 data lake (`s3://company-data-lake`). They register the S3 bucket location in Lake Formation, define access permissions for `Sales` and `Marketing` teams, and use Blueprints to automatically ingest operational MySQL database logs into S3.',
  examFocus: 'SAA-C03 Core Concept for Lake Formation:\n- Governance Layer: Lake Formation acts as a security wrapper over Amazon S3 storage and the AWS Glue Data Catalog.\n- Credential Vending: When integrated query engines (Athena, Redshift Spectrum, EMR) query data, Lake Formation verifies permissions and vends short-lived S3 access credentials to the service.\n- Centralized Grants: Replaces complex individual S3 bucket policies with database/table grant statements.\n- Note: Data remains in Amazon S3; registering an S3 bucket in Lake Formation does NOT move or copy data.',
  keyPoints: [
    'Centralizes data lake setup, security, and governance on Amazon S3.',
    'Governs Data Catalog metadata and vends temporary credentials for S3 data access.',
    'Simplifies security by replacing complex IAM/S3 policy combinations with centralized grants.',
    'Supports automated data ingestion blueprints from relational databases and S3.',
    'Underlying raw data remains in Amazon S3 (registering S3 paths does not copy data).'
  ],
  commonMistake: 'Assuming that registering an S3 location in Lake Formation automatically copies or restructures raw files on S3 disk. Data stays in its original S3 location.',
  example: 'Registering an S3 Location via AWS CLI:\naws lakeformation register-resource --resource-arn arn:aws:s3:::<MY_DATA_LAKE_BUCKET> --use-service-linked-role',
  sources: [
    { title: 'What is AWS Lake Formation?', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html' }
  ]
});
