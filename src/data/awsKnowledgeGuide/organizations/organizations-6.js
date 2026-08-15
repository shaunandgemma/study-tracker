import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-6',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Member Accounts',
  status: 'ready',
  plainEnglish: 'Member Accounts are individual AWS accounts contained within an organization (excluding the Management Account). Member accounts host actual application workloads, security tools, and data stores. They inherit governance policies (like SCPs) from their parent Organizational Units (OUs) and send usage charges to the Management Account for consolidated payment.',
  whyItMatters: 'Using separate member accounts for different business units, environments (dev, staging, prod), and security services establishes strong isolation boundaries, preventing a compromise in one account from affecting others.',
  workplaceExample: 'A fintech startup creates member accounts `prod-payments`, `dev-payments`, and `security-audit`. All member accounts inherit an SCP that blocks unencrypted S3 bucket creation.',
  examFocus: 'SAA-C03 Member Account Lifecycle & Access:\n- Creation vs Invitation: Member accounts can be created directly inside the organization or existing accounts invited to join.\n- `OrganizationAccountAccessRole`: Automatically created IAM role in new member accounts granting full admin access to the Management Account.\n- Policy Enforcement: Subject to all SCPs attached to parent OUs and the Organization Root.\n- Removal & Closure: Removing a member account requires providing payment method details and converting to a standalone account.',
  keyPoints: [
    'Individual AWS accounts in an organization that host application workloads.',
    'Inherit Service Control Policies (SCPs) from parent OUs and the Root container.',
    'Usage charges are automatically rolled into the Management Account bill.',
    'New member accounts include the default `OrganizationAccountAccessRole`.',
    'Can be created programmatically or joined via invitation.'
  ],
  commonMistake: 'Deleting the `OrganizationAccountAccessRole` in a member account without configuring cross-account IAM roles, locking administrative access out of the member account.',
  example: 'Creating a New Member Account via AWS CLI:\naws organizations create-account --email dev-team@example.com --account-name DevWorkloadAccount',
  sources: [
    { title: 'Managing AWS accounts in Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts.html' }
  ]
});
