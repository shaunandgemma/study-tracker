import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-23',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Organizations Integration with AWS RAM',
  status: 'ready',
  plainEnglish: 'AWS Resource Access Manager (RAM) integrates with AWS Organizations to allow sharing supported AWS resources—such as VPC Subnets, Route 53 Resolver Rules, Transit Gateways, and License Manager licenses—seamlessly across accounts in an organization without exchanging cross-account IAM role credentials.',
  whyItMatters: 'Sharing private VPC subnets across member accounts via RAM enables centralized networking models (such as Shared VPCs). This reduces network infrastructure duplication while maintaining account-level IAM isolation.',
  workplaceExample: 'A cloud networking team provisions a central VPC in a `Shared-Infrastructure` account. Using AWS RAM, they share private subnets with the `Production OU`. Member accounts in `Production OU` launch EC2 instances directly into the shared private subnets.',
  examFocus: 'SAA-C03 AWS RAM & Organizations Sharing:\n- Organization-Wide Sharing: Share resources with the entire organization, specific OUs, or individual account IDs.\n- No External Invitations: When sharing within an organization, member accounts accept shares automatically without manual invitation handshakes.\n- Shared VPC Architecture: Host account owns the VPC, subnets, and routing; participant member accounts launch resources (EC2, RDS) inside shared subnets.\n- Global Condition Keys: Restrict resource sharing using `aws:PrincipalOrgID`.',
  keyPoints: [
    'Shares AWS infrastructure resources (Subnets, Transit Gateways, License Rules) across accounts.',
    'Eliminates manual invitation handshakes when sharing within an organization.',
    'Enables Shared VPC architectures to centralize network infrastructure management.',
    'Supports sharing with the entire Organization, specific OUs, or member accounts.',
    'Secured using IAM policies and `aws:PrincipalOrgID` condition keys.'
  ],
  commonMistake: 'Attempting to share unsupported AWS resources via RAM (e.g. S3 buckets or DynamoDB tables). Check RAM supported resource types before designing cross-account shares.',
  example: 'Creating a Resource Share for an OU via AWS CLI:\naws ram create-resource-share --name SharedProdSubnets --resource-arns arn:aws:ec2:us-east-1:<ACCOUNT_ID>:subnet/subnet-12345678 --principals arn:aws:organizations::<ACCOUNT_ID>:ou/o-a1b2c3d4/ou-a1b2-11111111',
  sources: [
    { title: 'Sharing AWS resources with AWS RAM and AWS Organizations', url: 'https://docs.aws.amazon.com/ram/latest/userguide/share-permissions.html' }
  ]
});
