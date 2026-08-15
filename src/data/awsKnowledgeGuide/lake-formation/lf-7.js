import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-7',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Database and Table Permissions',
  status: 'ready',
  plainEnglish: 'Database and Table Permissions in AWS Lake Formation control metadata visibility and data access at the container level within the AWS Glue Data Catalog. Database permissions control actions like creating tables (`CREATE_TABLE`) or altering database metadata, while Table permissions control data query actions (`SELECT`), schema modification (`ALTER`), data deletion (`DROP`), and data insertion (`INSERT`).',
  whyItMatters: 'Database and Table permissions establish standard catalog access boundaries. Granting `SELECT` on a table grants query access to all non-restricted columns and rows in that table, providing simple container-level security management.',
  workplaceExample: 'A Data Engineer is granted `CREATE_TABLE` and `ALTER` permissions on the `raw_telemetry_db` database to build new ingestion tables. Data Analysts are granted strictly `SELECT` permissions on specific production tables inside `reporting_db`.',
  examFocus: 'SAA-C03 Permission Types:\n- Database Permissions: `CREATE_TABLE`, `ALTER`, `DROP`, `DESCRIBE`.\n- Table Permissions: `SELECT`, `INSERT`, `DELETE`, `DROP`, `ALTER`, `DESCRIBE`.\n- Metadata vs Data: `DESCRIBE` allows viewing table schemas in the Data Catalog; `SELECT` allows querying the actual data files in S3.',
  keyPoints: [
    'Controls catalog permissions on Data Catalog databases and tables.',
    'Database permissions include `CREATE_TABLE`, `ALTER`, `DROP`, and `DESCRIBE`.',
    'Table permissions include `SELECT`, `INSERT`, `DELETE`, `DROP`, `ALTER`, and `DESCRIBE`.',
    '`DESCRIBE` permits catalog schema viewing; `SELECT` permits S3 data querying.',
    'Permissions can be granted directly via Named Resources or dynamically via LF-Tags.'
  ],
  commonMistake: 'Granting `DESCRIBE` permission on a table and expecting the user to be able to run SQL queries in Athena. SQL querying requires explicit `SELECT` permission.',
  example: 'Granting Table Select Permission via AWS CLI:\naws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=arn:aws:iam::<ACCOUNT_ID>:role/AnalystRole --resource \'{ "Table": { "DatabaseName": "analytics_db", "Name": "monthly_sales" } }\' --permissions SELECT',
  sources: [
    { title: 'Lake Formation permissions reference - Database and table permissions', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/LF-permissions-overview.html' }
  ]
});
