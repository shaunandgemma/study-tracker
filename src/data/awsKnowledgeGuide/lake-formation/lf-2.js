import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-2',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Fine-Grained Access Control (Column-level, Row-level, and Cell-level security)',
  status: 'ready',
  plainEnglish: 'Lake Formation Fine-Grained Access Control provides precise security filtering on data lake tables at the Column-level, Row-level, and Cell-level (combining specific rows and columns). Using Data-Cell Filters, administrators can grant a user access to a table while masking sensitive columns (such as Social Security Numbers or Credit Cards) or filtering rows (such as restricting a regional manager to records where `country = \'US\'`).',
  whyItMatters: 'Without fine-grained access control, organizations are forced to maintain multiple duplicate S3 buckets and ETL pipelines to sanitize datasets for different user roles, wasting storage and increasing maintenance overhead.',
  workplaceExample: 'A healthcare company shares a `patients` table with research analysts via Amazon Athena. A Lake Formation Data-Cell Filter excludes the `ssn` and `phone_number` columns and restricts rows to `consent_given = true`. Analysts run standard SQL queries on the table, seeing only authorized cells seamlessly.',
  examFocus: 'SAA-C03 Fine-Grained Filtering Capabilities:\n- Column-Level Security: Include or exclude specific columns (e.g. grant access to all columns EXCEPT `credit_card`).\n- Row-Level Security: Filter rows using SQL-like expressions (e.g. `region = \'US-East\'`).\n- Cell-Level Security: Combines column inclusion/exclusion WITH row-level filtering in a single Data-Cell Filter.\n- Query Engine Enforcement: Enforced automatically when querying via Athena, Redshift Spectrum, EMR, or AWS Glue.',
  keyPoints: [
    'Enforces Column-level, Row-level, and Cell-level security on Data Catalog tables.',
    'Data-Cell Filters combine row predicates with column inclusions/exclusions.',
    'Eliminates the need to create duplicate S3 buckets or ETL jobs for sanitized data views.',
    'Works transparently across integrated engines (Athena, Redshift Spectrum, Glue, EMR).',
    'Restricts sensitive columns (SSNs, PII) while preserving full table querying for authorized users.'
  ],
  commonMistake: 'Attempting to configure row-level filtering using S3 bucket policies. S3 bucket policies operate at the file/prefix level, not the database row level.',
  example: 'Creating a Data-Cell Filter via AWS CLI:\naws lakeformation create-data-cells-filter --table-data \'{ "TableCatalogId": "<ACCOUNT_ID>", "DatabaseName": "healthcare_db", "TableName": "patients", "Name": "ResearchFilter", "ColumnNames": ["patient_id", "diagnosis"], "RowFilter": { "FilterExpression": "consent_given = true" } }\'',
  sources: [
    { title: 'Data-cell filters in Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html' }
  ]
});
