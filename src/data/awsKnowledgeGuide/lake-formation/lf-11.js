import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'lf-11',
  topicId: 'topic-lake-formation',
  topicTitle: 'AWS Lake Formation',
  objectiveCode: 'Analytics',
  title: 'Cross-Account Data Sharing',
  status: 'ready',
  plainEnglish: 'Lake Formation Cross-Account Data Sharing enables an organization to share Data Catalog databases and tables securely across different AWS accounts or entire AWS Organizations without copying or moving the underlying S3 data files. Sharing utilizes AWS Resource Access Manager (RAM) or direct Lake Formation permissions. Recipient accounts create a Resource Link pointing to the shared database or table in the producer account.',
  whyItMatters: 'Enterprise data mesh architectures maintain decentralized data lakes across multiple business-unit AWS accounts. Cross-account sharing allows a Central Data Lake Account to share datasets with Analytics Consumer Accounts instantly while maintaining central security governance.',
  workplaceExample: 'Producer Account A (`111111111111`) shares the `sales_data` table with Consumer Account B (`222222222222`). Consumer Account B accepts the share via AWS RAM, creates a Resource Link named `shared_sales_link` in their local catalog, and queries the data in Athena without transferring any S3 data files.',
  examFocus: 'SAA-C03 Cross-Account Sharing Workflow:\n1. Producer Account: Grants Lake Formation permissions on database/table to Consumer Account ID or Organization ID.\n2. AWS RAM: Shares the resource via AWS Resource Access Manager.\n3. Consumer Account: Accepts RAM invitation and creates a Resource Link in their local Data Catalog.\n4. S3 Data Access: Lake Formation vends temporary S3 credentials to the consumer\'s query engine upon query execution.',
  keyPoints: [
    'Shares Data Catalog databases and tables across AWS accounts without data movement.',
    'Integrates with AWS Resource Access Manager (RAM) and AWS Organizations.',
    'Consumer accounts create a Resource Link pointing to the shared producer resource.',
    'Preserves fine-grained (column/row) permissions across account boundaries.',
    'Underlying S3 data remains in the producer account; consumer engines use temporary credentials.'
  ],
  commonMistake: 'Forgetting to configure KMS Key Policy permissions for cross-account access when the producer S3 data is encrypted with a Customer Managed KMS Key.',
  example: 'Granting Cross-Account Permission via AWS CLI:\naws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=222222222222 --resource \'{ "Table": { "DatabaseName": "central_db", "Name": "sales" } }\' --permissions SELECT --permissions-with-grant-option SELECT',
  sources: [
    { title: 'Cross-account data sharing in Lake Formation', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/cross-account-permissions.html' }
  ]
});
