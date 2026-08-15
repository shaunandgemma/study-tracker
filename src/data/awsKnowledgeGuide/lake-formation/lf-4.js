import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-4',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Centralized Data Lake Permissions',
  status: 'ready',
  plainEnglish: 'Centralized Data Lake Permissions in AWS Lake Formation provide a unified permission model for granting and revoking access to Data Catalog databases, tables, and underlying Amazon S3 data. Permissions can be granted using two primary methods:\n1. Named Resource Access: Granting permissions directly on specific named databases or tables.\n2. LF-Tag Based Access Control (LF-TBAC): Granting permissions based on policy tags assigned to catalog resources.',
  whyItMatters: 'Managing permissions on hundreds of individual tables causes policy bloat. Centralized permissions allow security officers to manage permissions using simple SQL-like GRANT/REVOKE commands or dynamic LF-Tags across thousands of datasets.',
  workplaceExample: 'A security officer executes a single Lake Formation grant command to give the `FinancialAnalysts` IAM role `SELECT` permission on the `earnings_2026` table. Lake Formation handles metadata visibility in Glue and vends temporary S3 credentials when analysts query Athena.',
  examFocus: 'SAA-C03 Permission Methods:\n- Named Resource Permissions: Grants on specific Database, Table, or Column names (e.g. `GRANT SELECT ON TABLE sales_db.orders TO ROLE DataAnalyst`).\n- LF-Tag Based Access Control (LF-TBAC): Assign tags (e.g. `Confidentiality=High`) to resources and grant permissions to principals matching those tags.\n- Grant Options: `WITH GRANT OPTION` allows recipient principals to grant permissions to other users.',
  keyPoints: [
    'Unified permission model for Data Catalog databases, tables, and underlying S3 data.',
    'Supports Named Resource Access and LF-Tag Based Access Control (LF-TBAC).',
    'Replaces static IAM/S3 policies with dynamic Lake Formation GRANT/REVOKE rules.',
    '`WITH GRANT OPTION` enables delegation of permission management to team leads.',
    'Integrated with IAM Identity Center and IAM Users/Roles for principal identification.'
  ],
  commonMistake: 'Granting Lake Formation table permissions to an IAM role, but failing to ensure the IAM role has basic `lakeformation:GetDataAccess` permissions in its IAM identity policy.',
  example: 'Granting Named Resource Permission via AWS CLI:\naws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=arn:aws:iam::<ACCOUNT_ID>:role/DataAnalystRole --resource \'{ "Table": { "DatabaseName": "finance_db", "Name": "earnings" } }\' --permissions SELECT',
  sources: [
    { title: 'Granting Lake Formation permissions', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/granting-permissions.html' }
  ]
});
