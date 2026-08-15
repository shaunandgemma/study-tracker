import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-8',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Roles',
  status: 'ready',
  plainEnglish: 'An IAM Role is an AWS identity with specific permissions policies attached that can be assumed by anyone or anything that needs it (such as AWS services like EC2/Lambda, federated workforce users, or external AWS accounts). Unlike an IAM User, an IAM Role does NOT have permanent long-term credentials (no password or static access keys); instead, assuming a role provides temporary, short-lived security credentials issued by AWS Security Token Service (STS).',
  whyItMatters: 'Hardcoding static credentials in server applications creates security vulnerabilities. IAM Roles allow EC2 instances, Lambda functions, and container tasks to acquire temporary credentials automatically, eliminating credential management overhead.',
  workplaceExample: 'An application running on an EC2 instance needs to read files from an S3 bucket. Instead of embedding AWS access keys in config files, the engineer attaches an IAM Role (`AppS3ReaderRole`) to the EC2 instance via an Instance Profile. The app retrieves temporary STS credentials automatically.',
  examFocus: 'SAA-C03 Core Concept for IAM Roles:\n- Temporary Credentials: Uses short-lived STS credentials (automatically rotated).\n- Role Composition: Composed of a Trust Policy (who can assume the role) and Permissions Policies (what the role can do).\n- EC2 Attachment: Attached to EC2 instances via an Instance Profile.\n- Cross-Account & Service Delegation: Primary mechanism for granting cross-account access and AWS service permissions.',
  keyPoints: [
    'AWS identity with permissions that is assumed dynamically by entities.',
    'Does NOT have permanent long-term credentials (uses short-lived STS credentials).',
    'Composed of a Trust Policy (who can assume) and Permissions Policies (what it can do).',
    'Attached to EC2 instances using an Instance Profile.',
    'Recommended security mechanism for application workloads running on AWS.'
  ],
  commonMistake: 'Generating long-term access keys for an IAM User and embedding them inside an EC2 instance or Lambda function instead of using an IAM Role.',
  example: 'Assuming an IAM Role via AWS CLI:\naws sts assume-role --role-arn "arn:aws:iam::<ACCOUNT_ID>:role/AppS3ReaderRole" --role-session-name "AppSession"',
  sources: [
    { title: 'IAM Roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' }
  ]
});
