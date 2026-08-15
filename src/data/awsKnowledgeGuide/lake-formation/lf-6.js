import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-6',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Fine-Grained Data Access',
  status: 'ready',
  plainEnglish: 'Fine-Grained Data Access in AWS Lake Formation refers to the capability to restrict data lake access down to specific columns, rows, or data cells for individual users or roles querying through integrated AWS analytics services. When a query is submitted in Athena or Redshift Spectrum, Lake Formation filters the underlying S3 data on the fly before returning the query results.',
  whyItMatters: 'Fine-grained data access allows organizations to adhere to least-privilege principles and global privacy laws (GDPR, CCPA) without duplicating dataset files in S3 or maintaining custom database views.',
  workplaceExample: 'An e-commerce store maintains a single `customer_orders` S3 dataset. Using Lake Formation Fine-Grained Data Access, Support Agents can view `order_id` and `delivery_status` for all rows, while Marketing Analysts can view all columns but only for rows where `marketing_opt_in = true`.',
  examFocus: 'SAA-C03 Fine-Grained Data Access Implementation:\n- Enforcement Mechanism: Query engines request credentials and query filtering instructions from Lake Formation.\n- Dynamic Credential Vending: Lake Formation vends temporary S3 credentials scoped specifically to the filtered data subsets.\n- No Data Duplication: Filters operate dynamically on query execution without modifying raw S3 storage files.',
  keyPoints: [
    'Restricts data lake querying down to specific columns, rows, or data cells.',
    'Evaluated dynamically at query runtime by integrated analytics engines.',
    'Uses temporary scoped S3 credential vending to enforce filtered data access.',
    'Eliminates dataset duplication and custom data-sanitization ETL pipelines.',
    'Ensures compliance with GDPR, CCPA, and HIPAA privacy rules.'
  ],
  commonMistake: 'Attempting to configure fine-grained row access using IAM condition keys. IAM policies cannot parse or filter row contents inside Parquet or ORC data files on S3.',
  example: 'Granting Column-Level Permissions via AWS CLI:\naws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=arn:aws:iam::<ACCOUNT_ID>:role/SupportRole --resource \'{ "TableWithColumns": { "DatabaseName": "orders_db", "Name": "customer_orders", "ColumnNames": ["order_id", "delivery_status"] } }\' --permissions SELECT',
  sources: [
    { title: 'Data filtering and cell-level security in Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/data-filters-about.html' }
  ]
});
