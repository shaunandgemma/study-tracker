import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-16',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Lake Formation vs IAM-Only S3 Permissions',
  status: 'ready',
  plainEnglish: 'AWS Lake Formation and IAM-Only S3 Permissions represent two fundamentally different approaches to data lake security:\n- IAM-Only S3 Permissions: Security is configured using IAM policies and S3 bucket policies. Access control is limited to coarse-grained S3 object prefixes and file paths (`s3://bucket/folder/*`). It lacks column, row, or cell filtering capabilities.\n- Lake Formation Permissions: Security is configured centrally on database objects, tables, columns, and rows. Integrated engines (Athena, Redshift Spectrum, EMR) use temporary credential vending to enforce fine-grained data access rules dynamically.',
  whyItMatters: 'Managing permissions for thousands of analytics users across hundreds of S3 prefixes using IAM policies results in complex, error-prone JSON documents. Lake Formation replaces prefix management with intuitive database table grants and data-cell filters.',
  workplaceExample: 'An organization migrates from IAM-only S3 policies to Lake Formation. Previously, they maintained 15 separate S3 bucket copies for different departments. With Lake Formation, they maintain 1 single S3 bucket and use fine-grained column/row grants to serve all 15 departments securely.',
  examFocus: 'SAA-C03 Decision Matrix (Lake Formation vs IAM-Only S3):\n- Granularity: IAM is coarse-grained (S3 bucket/prefix level); Lake Formation is fine-grained (database, table, column, row, cell level).\n- Credential Vending: Lake Formation vends short-lived S3 credentials automatically; IAM requires static or assumed role policies.\n- Policy Maintenance: Lake Formation uses GRANT/REVOKE or LF-Tags; IAM requires managing complex JSON policy documents.\n- Requirement: Coarse IAM permissions (`lakeformation:GetDataAccess`) are still required to invoke Lake Formation APIs.',
  keyPoints: [
    'IAM is coarse-grained (S3 bucket/prefix level); Lake Formation is fine-grained (table/column/row level).',
    'Lake Formation vends temporary S3 credentials to integrated engines dynamically.',
    'Eliminates duplicate S3 bucket copies and complex prefix-based IAM JSON policies.',
    'Supports LF-Tag Based Access Control for dynamic tag-driven governance.',
    'IAM permissions are still required to call AWS APIs and invoke Lake Formation.'
  ],
  commonMistake: 'Assuming Lake Formation completely eliminates IAM. Users still require IAM permissions to authenticate to AWS and call Lake Formation APIs.',
  example: 'Comparison Summary:\n- Requirement: "Restrict access to credit card numbers in a Parquet dataset" -> Solution: AWS Lake Formation (Column-level security).\n- Requirement: "Restrict S3 bucket creation to the DevOps team" -> Solution: IAM Policy (`s3:CreateBucket`).',
  sources: [
    { title: 'Lake Formation permissions and IAM permissions', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/lake-formation-permissions-matrix.html' }
  ]
});
