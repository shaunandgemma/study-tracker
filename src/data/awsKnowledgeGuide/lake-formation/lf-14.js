import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-14',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Integration with Athena',
  status: 'ready',
  plainEnglish: 'Amazon Athena integrates natively with AWS Lake Formation to enforce fine-grained access controls during interactive SQL querying. When an Athena user executes a query against a Glue Data Catalog table, Athena requests permissions and data filtering rules from Lake Formation. Lake Formation vends short-lived S3 access credentials and applies column, row, or cell filters dynamically before Athena processes the query results.',
  whyItMatters: 'Athena is the primary serverless query engine for S3 data lakes. Lake Formation integration allows data teams to run serverless SQL queries across shared datasets while ensuring users see only the specific rows and columns they are authorized to access.',
  workplaceExample: 'An analyst opens the Athena Query Editor and executes `SELECT * FROM sales_records`. Athena calls Lake Formation. Lake Formation checks the analyst\'s role, applies a row filter (`region = \'EU\'`), strips the `credit_card` column, and vends temporary S3 credentials. Athena displays the sanitized result set seamlessly.',
  examFocus: 'SAA-C03 Athena & Lake Formation Requirements:\n- Workgroup Configuration: Athena workgroups can enforce Lake Formation permissions.\n- Query Processing: Athena does NOT access raw S3 data directly using the analyst\'s IAM credentials; it uses short-lived credentials vended by Lake Formation.\n- Prerequisites: Analyst requires IAM permission to use Athena (`athena:*`) AND Lake Formation permission (`SELECT`) on the target table.',
  keyPoints: [
    'Native serverless SQL integration for querying Lake Formation governed datasets.',
    'Athena queries automatically apply Column, Row, and Cell-level filters.',
    'Uses temporary S3 credentials vended by Lake Formation during query execution.',
    'Requires both IAM Athena permissions and Lake Formation table permissions.',
    'Eliminates the need to grant Athena users direct `s3:GetObject` permissions on raw S3 buckets.'
  ],
  commonMistake: 'Granting an analyst direct `s3:GetObject` permissions on raw S3 data lake buckets, bypassing Lake Formation governance when they query via Athena.',
  example: 'Executing an Athena Query against a Lake Formation governed table via AWS CLI:\naws athena start-query-execution --query-string "SELECT * FROM sales_db.orders LIMIT 10" --query-execution-context Database=sales_db --result-configuration OutputLocation=s3://athena-query-results-bucket/',
  sources: [
    { title: 'Using Amazon Athena with AWS Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/athena-integration.html' }
  ]
});
