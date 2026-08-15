import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-17',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Account Creation and Management',
  status: 'ready',
  plainEnglish: 'Account Creation and Management covers the automated workflows for adding, inviting, moving, and removing AWS member accounts within an organization. New accounts can be created programmatically via AWS CLI/SDK calls, automatically creating the default `OrganizationAccountAccessRole` for cross-account administration.',
  whyItMatters: 'Manual AWS account creation via web forms requires credit cards, phone verifications, and manual role setups. Automated account creation in AWS Organizations enables rapid Account Vending machines for automated environment provisioning.',
  workplaceExample: 'A DevOps team implements an automated Account Vending machine using AWS CloudFormation and AWS Organizations API. When a team requests a new project environment, a script calls `CreateAccount`, places the account in `Workloads OU`, and provisions security baselines.',
  examFocus: 'SAA-C03 Account Provisioning & Removal Mechanics:\n- Automated Creation: `CreateAccount` API creates a brand-new account automatically billed to the Management Account.\n- Default Role: `OrganizationAccountAccessRole` created automatically with full admin privileges for the Management Account.\n- Inviting Accounts: Existing standalone accounts can be invited via `InviteAccountToOrganization` (requires invitation acceptance).\n- Removing Accounts: Removing an account requires attaching a payment method and setting up standalone root user credentials.',
  keyPoints: [
    'Enables programmatic creation of new member accounts via API/SDK.',
    'Automatically provisions the `OrganizationAccountAccessRole` IAM role.',
    'Invites existing standalone accounts to join the organization via invitation handshake.',
    'Allows moving accounts between Organizational Units (OUs) dynamically.',
    'Removing a member account requires configuring standalone billing and root user access.'
  ],
  commonMistake: 'Attempting to remove a member account from an organization without first configuring a valid credit card/payment method on the standalone member account.',
  example: 'Checking Status of an Account Creation Request via AWS CLI:\naws organizations describe-create-account-status --create-account-request-id car-1234567890abcdef',
  sources: [
    { title: 'Creating an AWS account in your organization', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html' }
  ]
});
