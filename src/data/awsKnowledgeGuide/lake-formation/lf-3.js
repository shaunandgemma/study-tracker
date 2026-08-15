import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-3',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Lake Formation Data Lake Management',
  status: 'ready',
  plainEnglish: 'Lake Formation Data Lake Management encompasses the administration, storage registration, and governance lifecycle of an enterprise data lake. Key management tasks include registering S3 storage locations, assigning Data Lake Administrators, managing underlying S3 service-linked roles, organizing Glue Data Catalog databases, and auditing access through CloudTrail.',
  whyItMatters: 'Effective data lake management prevents "data swamps"—unorganized, insecure S3 buckets with unknown data ownership and risky permissions.',
  workplaceExample: 'A Data Governance Manager sets up a centralized data lake. They register `s3://prod-analytics-lake` in Lake Formation, assign a dedicated Data Lake Admin role, revoke legacy `IAMAllowedPrincipals` defaults, and establish tag-based access rules for data domain owners.',
  examFocus: 'SAA-C03 Core Management Steps:\n1. Register S3 Locations: Register S3 paths with Lake Formation using an IAM role for credential vending.\n2. Revoke `IAMAllowedPrincipals`: Remove legacy default permissions that bypass Lake Formation governance.\n3. Designate Administrators: Assign specific IAM users/roles as Data Lake Administrators.\n4. Audit: Audit query activity and permission changes via CloudTrail.',
  keyPoints: [
    'Comprehensive administration of S3 storage registration, catalog databases, and access control.',
    'Registers S3 bucket paths and assigns IAM roles for secure credential vending.',
    'Requires revoking `IAMAllowedPrincipals` to enforce strict Lake Formation control.',
    'Designates Data Lake Administrators with full authority over catalog permissions.',
    'Logs all governance changes and data access attempts to AWS CloudTrail.'
  ],
  commonMistake: 'Leaving default `IAMAllowedPrincipals` enabled on Glue Data Catalog databases, allowing any IAM user with basic S3/Glue permissions to bypass Lake Formation security rules.',
  example: 'Revoking IAMAllowedPrincipals via AWS CLI:\naws lakeformation revoke-permissions --principal DataLakePrincipalIdentifier=IAM_ALLOWED_PRINCIPALS --resource \'{ "Database": { "Name": "sales_db" } }\' --permissions ALL',
  sources: [
    { title: 'Lake Formation permissions reference', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/LF-permissions-overview.html' }
  ]
});
