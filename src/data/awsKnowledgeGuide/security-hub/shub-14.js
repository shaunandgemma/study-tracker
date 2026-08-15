import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-14',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Delegated Administrator',
  status: 'ready',
  plainEnglish: 'The Delegated Administrator in AWS Security Hub allows designating a specific member account (such as a dedicated `Security-Operations` account) within an AWS Organization to manage organization-wide Security Hub capabilities. This offloads daily security monitoring, policy creation, and finding triage away from the AWS Organizations Management Account.',
  whyItMatters: 'Using the AWS Organizations Management Account for daily operational security tasks violates least privilege security principles. Delegated Administration enables security teams to manage Security Hub fully from a dedicated security account.',
  workplaceExample: 'An enterprise designates account `111122223333` (`Security-Ops`) as the Security Hub Delegated Administrator. The SOC team uses `Security-Ops` to configure central policies, inspect member findings, and manage finding suppressions.',
  examFocus: 'SAA-C03 Delegated Administration Rules:\n- Designation Step: Designated by the AWS Organizations Management Account via `enable-organization-admin-account`.\n- Security Isolation: Protects the Management Account by granting administrative Security Hub rights to a dedicated member account.\n- Delegated Capabilities: Delegated Admin can enable/disable standards, manage member accounts, create configuration policies, and configure finding aggregators.',
  keyPoints: [
    'Designates a member account to manage Security Hub across the entire AWS Organization.',
    'Follows least privilege best practices by keeping operational tasks out of the Management Account.',
    'Delegated Admin can configure organization-wide standards, controls, and configuration policies.',
    'Centralizes finding aggregation and triage in a dedicated security operations account.',
    'Designated by the AWS Organizations Management Account.'
  ],
  commonMistake: 'Running daily Security Hub triage directly inside the Management Account instead of registering a dedicated Delegated Administrator member account.',
  example: 'Designating a Security Hub Delegated Administrator via AWS CLI:\naws securityhub enable-organization-admin-account --admin-account-id 111122223333',
  sources: [
    { title: 'Designating a Security Hub delegated administrator', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/accounts-orgs-delegated-administrator.html' }
  ]
});
