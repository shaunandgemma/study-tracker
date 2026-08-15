import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-8',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Column-Level Permissions',
  status: 'ready',
  plainEnglish: 'Column-Level Permissions in AWS Lake Formation allow administrators to grant or restrict access to specific columns within a Data Catalog table. Administrators can specify either an Inclusion list (granting access to ONLY named columns) or an Exclusion list (granting access to all columns EXCEPT named sensitive columns like PII or financial tokens).',
  whyItMatters: 'Tables often contain a mix of public operational fields and sensitive personal data. Column-level permissions allow data analysts to query non-sensitive columns without needing separate ETL pipelines to strip or redact sensitive fields.',
  workplaceExample: 'An HR database contains employee records with `employee_id`, `department`, `salary`, and `home_address`. Using Lake Formation Column-Level Permissions, the security team grants the `AnalyticsRole` access to `employee_id` and `department`, while excluding `salary` and `home_address`.',
  examFocus: 'SAA-C03 Column Permission Mechanics:\n- TableWithColumns Resource: Used in `grant-permissions` to define column inclusion or exclusion arrays.\n- Inclusion vs Exclusion: Include specified columns OR exclude specified columns.\n- Query Engine Handling: If a query selects an unauthorized column, the query fails with an `Access Denied` error or returns masked results if data-cell filtering is configured.',
  keyPoints: [
    'Restricts access to specific columns within a Glue Data Catalog table.',
    'Supports Column Inclusion (allow list) and Column Exclusion (block list).',
    'Prevents unauthorized exposure of sensitive PII, credit cards, or salary data.',
    'Evaluated dynamically by Athena, Redshift Spectrum, EMR, and Glue.',
    'Eliminates maintenance of duplicate redacted datasets in Amazon S3.'
  ],
  commonMistake: 'Expecting Column-Level Permissions to work when an IAM user accesses S3 files directly via S3 `GetObject` API bypassing Lake Formation integrated query engines.',
  example: 'Granting Column Inclusion Permissions via AWS CLI:\naws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=arn:aws:iam::<ACCOUNT_ID>:role/HRAnalyticsRole --resource \'{ "TableWithColumns": { "DatabaseName": "hr_db", "Name": "employees", "ColumnNames": ["employee_id", "department"] } }\' --permissions SELECT',
  sources: [
    { title: 'Column-level security in Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/granting-permissions-column-level.html' }
  ]
});
