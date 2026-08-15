import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-19',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Delegated Administrator',
  status: 'ready',
  plainEnglish: 'Delegated Administrator allows the Management Account to designate specific member accounts to administer integrated AWS services (like Amazon GuardDuty, AWS Security Hub, AWS Config, and AWS IAM Identity Center) organization-wide, offloading day-to-day security operations without granting full Management Account permissions.',
  whyItMatters: 'Using the Management Account for routine security operations violates the principle of least privilege and increases risk. Delegated Administration enables security teams to manage organization-wide GuardDuty or Security Hub from a dedicated `Security-Tooling` member account.',
  workplaceExample: 'An enterprise registers account `111122223333` (`Security-Operations`) as the Delegated Administrator for Amazon GuardDuty. The SOC team uses this account to manage GuardDuty threat detectors across all member accounts without needing access to the Management Account.',
  examFocus: 'SAA-C03 Delegated Administration Principles:\n- Security Isolation: Enables managing organization-wide security tools from a dedicated member account.\n- Principle of Least Privilege: Reduces operational access needed for the Management Account.\n- Supported Services: GuardDuty, Security Hub, AWS Config, IAM Identity Center, Macie, Inspector, Firewall Manager.\n- Registration: Enabled via service-specific `EnableAWSServiceAccess` and delegated admin registration API calls.',
  keyPoints: [
    'Designates member accounts to manage specific organization-wide AWS services.',
    'Protects the Management Account by offloading routine operational management.',
    'Supported for GuardDuty, Security Hub, Config, Macie, Inspector, and IAM Identity Center.',
    'Delegated admin accounts gain administrative visibility over all organization member accounts for that service.',
    'Enforces security least privilege across administrative teams.'
  ],
  commonMistake: 'Performing day-to-day GuardDuty or Config security monitoring directly inside the Management Account instead of registering a Delegated Administrator member account.',
  example: 'Registering a Delegated Administrator for GuardDuty via AWS CLI:\naws guardduty enable-organization-admin-account --admin-account-id 111122223333',
  sources: [
    { title: 'Delegated administrator for AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_delegate_policies.html' }
  ]
});
