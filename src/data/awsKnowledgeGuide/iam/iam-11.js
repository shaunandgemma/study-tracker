import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-11',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Managed Policies',
  status: 'ready',
  plainEnglish: 'An IAM Managed Policy is a standalone JSON permissions policy that exists independently in your AWS account and can be attached to multiple IAM Users, IAM Groups, and IAM Roles simultaneously. There are two types of managed policies:\n- AWS Managed Policies: Pre-created and maintained by AWS (e.g. `AdministratorAccess`, `AmazonS3ReadOnlyAccess`).\n- Customer Managed Policies: Created and maintained by you in your AWS account for custom permissions control.',
  whyItMatters: 'Managed policies promote reusability and central management. When you update a Customer Managed Policy, the changes immediately take effect across every user, group, and role to which the policy is attached.',
  workplaceExample: 'A security team creates a Customer Managed Policy named `FinancialDataAuditorPolicy`. They attach this single policy to 5 different IAM Roles across accounting microservices. Updating the policy automatically updates permissions for all 5 roles.',
  examFocus: 'SAA-C03 Managed Policy Types:\n- AWS Managed Policies: Created/updated by AWS. Cannot be modified by users. Useful for standard job function roles.\n- Customer Managed Policies: Created in your account. Fully customizable, versioned (up to 5 versions), and reusable across multiple identities.\n- Reusability: A single managed policy can be attached to up to 10 identities.',
  keyPoints: [
    'Standalone policy document that can be attached to multiple users, groups, and roles.',
    'AWS Managed Policies are created and updated automatically by AWS.',
    'Customer Managed Policies are created by users and offer full custom version control.',
    'Supports up to 5 policy versions with rollback capabilities.',
    'Updating a managed policy automatically updates permissions for all attached identities.'
  ],
  commonMistake: 'Relying exclusively on AWS Managed Policies like `AdministratorAccess` or `PowerUserAccess` in production instead of creating tightly scoped Customer Managed Policies following least privilege.',
  example: 'Creating a Customer Managed Policy via AWS CLI:\naws iam create-policy --policy-name FinancialDataAuditorPolicy --policy-document file://policy.json',
  sources: [
    { title: 'Managed policies and inline policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html' }
  ]
});
