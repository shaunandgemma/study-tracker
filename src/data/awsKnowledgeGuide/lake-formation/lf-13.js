import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-13',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Registered Amazon S3 Locations',
  status: 'ready',
  plainEnglish: 'A Registered Amazon S3 Location in Lake Formation is an S3 bucket path (e.g., `s3://my-company-data-lake/sales/`) registered under Lake Formation governance along with an associated IAM Location Registration Role. Once an S3 path is registered, Lake Formation assumes control over data access for that path and vends temporary scoped S3 credentials to integrated query engines whenever authorized users submit queries.',
  whyItMatters: 'Registering S3 locations enables Lake Formation\'s credential vending engine. Integrated query services (Athena, EMR, Redshift Spectrum) no longer require broad S3 bucket policy permissions attached to end-user IAM roles.',
  workplaceExample: 'A Data Engineer registers `s3://enterprise-data-lake-prod/` in Lake Formation using the service-linked role `AWSServiceRoleForLakeFormationDataAccess`. Whenever Athena runs a query, Lake Formation checks catalog permissions and assumes this role to vend short-lived S3 access tokens to Athena.',
  examFocus: 'SAA-C03 Location Registration Mechanics:\n- S3 Registration Role: An IAM role configured with S3 read/write permissions on the registered path and trust relationship with `lakeformation.amazonaws.com`.\n- Data Location Permissions: Permissions granted to principals allowing them to create catalog databases or tables pointing to the registered S3 path.\n- Note: Registering an S3 path does NOT move or transform existing files on S3 disk.',
  keyPoints: [
    'Registers S3 bucket paths under Lake Formation security governance.',
    'Associated with an IAM role used for temporary S3 credential vending.',
    'Enables integrated services (Athena, EMR, Redshift Spectrum) to query data securely.',
    'Data Location Permissions grant authority to create tables pointing to registered S3 paths.',
    'Does not alter, move, or reformat existing raw files on Amazon S3 storage.'
  ],
  commonMistake: 'Registering an S3 location with an IAM role that lacks necessary S3 `s3:GetObject` or `s3:PutObject` permissions, causing credential vending to fail.',
  example: 'Registering an S3 Resource Path via AWS CLI:\naws lakeformation register-resource --resource-arn arn:aws:s3:::my-company-data-lake/sales/ --role-arn arn:aws:iam::<ACCOUNT_ID>:role/LakeFormationDataAccessRole',
  sources: [
    { title: 'Registering an Amazon S3 location', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/register-data-lake-location.html' }
  ]
});
