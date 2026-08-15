import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-13',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Multi-Account Security Hub',
  status: 'ready',
  plainEnglish: 'Multi-Account Security Hub enables centralizing security posture management and finding visibility across hundreds of member AWS accounts within an AWS Organization. Using Central Configuration policies, security administrators can automatically enable Security Hub standards and controls across all existing and newly created member accounts in the organization.',
  whyItMatters: 'Manually configuring Security Hub standards on an account-by-account basis across an enterprise with 200 member accounts is error-prone. Multi-Account integration ensures uniform security governance and automatic onboarding of new accounts.',
  workplaceExample: 'An enterprise cloud security team uses Multi-Account Security Hub. When a developer creates a new `sandbox-account` via AWS Control Tower, Security Hub is enabled automatically with FSBP standards enforced via organization policies.',
  examFocus: 'SAA-C03 Multi-Account Management Architecture:\n- AWS Organizations Integration: Natively integrates with AWS Organizations for centralized account management.\n- Auto-Enablement: Automatically enables Security Hub and specific standards for new accounts joining the organization.\n- Central Configuration Policies: Enforces organization-wide security control policies across OUs and member accounts.\n- Account Association Modes: Central Configuration (recommended) vs Local Configuration.',
  keyPoints: [
    'Centralizes security finding visibility and compliance scores across an entire AWS Organization.',
    'Automatically enables Security Hub on newly provisioned AWS member accounts.',
    'Uses Central Configuration policies to enforce standards consistently across Organizational Units (OUs).',
    'Offloads security posture tracking from individual member account owners to a central security team.',
    'Eliminates visibility blind spots across multi-account AWS environments.'
  ],
  commonMistake: 'Relying on manual invitations to link AWS accounts instead of using AWS Organizations auto-enablement for multi-account management.',
  example: 'Enabling Auto-Enablement for Organization Accounts via AWS CLI:\naws securityhub update-organization-configuration --auto-enable',
  sources: [
    { title: 'Managing multi-account security posture in Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-accounts.html' }
  ]
});
