import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-12',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Data Lake Administrators',
  status: 'ready',
  plainEnglish: 'A Data Lake Administrator in AWS Lake Formation is an IAM user or role designated with full administrative privileges over all AWS Glue Data Catalog resources and registered S3 data locations governed by Lake Formation. Data Lake Admins can grant and revoke permissions on any catalog database or table, register new S3 storage locations, assign LF-Tags, and manage data lake settings.',
  whyItMatters: 'Even account root or IAM administrators (`AdministratorAccess`) cannot manage Lake Formation permissions unless they are explicitly designated as Data Lake Administrators. This strict separation of duties prevents cloud infra admins from tampering with sensitive data lake security rules.',
  workplaceExample: 'A company assigns the IAM role `DataGovernanceAdminRole` as a Data Lake Administrator. Only members assuming this role can grant table permissions, register new S3 data locations, or create Data-Cell Filters for analytics teams.',
  examFocus: 'SAA-C03 Data Lake Administrator Privileges:\n- Unrestricted Catalog Control: Can view, grant, or revoke permissions on ALL databases and tables in the catalog.\n- Register Locations: Can register S3 locations and assign location registration roles.\n- Initial Setup Requirement: At least one Data Lake Administrator MUST be designated when enabling Lake Formation in an AWS account.\n- IAM Separation: Standard IAM `AdministratorAccess` does NOT automatically grant Lake Formation data access.',
  keyPoints: [
    'Designated IAM user/role with full administrative authority over Lake Formation resources.',
    'Required for registering S3 locations, granting permissions, and managing LF-Tags.',
    'IAM `AdministratorAccess` does NOT automatically grant Data Lake Admin permissions.',
    'Establishes strict separation of duties between AWS infra admins and data security admins.',
    'Can view and manage all Data Catalog databases, tables, and data filters in the account.'
  ],
  commonMistake: 'Assuming an IAM user with `AdministratorAccess` can query Lake Formation governed tables without being added as a Data Lake Admin or granted explicit table permissions.',
  example: 'Setting Data Lake Administrators via AWS CLI:\naws lakeformation put-data-lake-settings --data-lake-settings \'{ "DataLakeAdmins": [{ "DataLakePrincipalIdentifier": "arn:aws:iam::<ACCOUNT_ID>:role/DataGovernanceAdminRole" }] }\'',
  sources: [
    { title: 'Data lake administrators', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/data-lake-admins.html' }
  ]
});
