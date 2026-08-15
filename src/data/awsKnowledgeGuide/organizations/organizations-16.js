import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-16',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'All Features Mode',
  status: 'ready',
  plainEnglish: 'All Features Mode is the advanced feature set of AWS Organizations that enables organization-wide governance, management policies (Service Control Policies, Tag Policies, Backup Policies, AI Opt-Out Policies), and trusted AWS service integrations (IAM Identity Center, AWS Control Tower, GuardDuty, Security Hub).',
  whyItMatters: 'While Consolidated Billing Only mode handles invoicing, All Features Mode is required for full security and compliance governance across a multi-account environment. Organizations created today enable All Features Mode by default.',
  workplaceExample: 'A company starts an organization in `Consolidated Billing Only` mode. To enforce security guardrails, they upgrade to `All Features Mode`. Each invited member account must accept the feature-set upgrade request before SCPs can be attached.',
  examFocus: 'SAA-C03 Feature Sets Comparison:\n- Consolidated Billing Only: Basic mode for shared payment, volume tiering, and billing reports.\n- All Features Mode: Includes Consolidated Billing PLUS Service Control Policies (SCPs), Tag Policies, Backup Policies, and Trusted AWS Service Integrations.\n- Upgrade Workflow: Upgrading from Billing Only to All Features requires sending an approval request that ALL invited member accounts must accept.',
  keyPoints: [
    'Enables full governance, policy enforcement, and trusted service integrations.',
    'Required for Service Control Policies (SCPs), Tag Policies, and Backup Policies.',
    'Allows integrations with IAM Identity Center, Control Tower, GuardDuty, and Security Hub.',
    'Default mode for newly created organizations in AWS Organizations.',
    'Upgrading from Billing-Only requires acceptance from all invited member accounts.'
  ],
  commonMistake: 'Attempting to attach Service Control Policies (SCPs) to an organization running in `Consolidated Billing Only` mode without enabling `All Features Mode` first.',
  example: 'Enabling All Features Mode via AWS CLI:\naws organizations enable-all-features',
  sources: [
    { title: 'Enabling all features in AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_org_support-all-features.html' }
  ]
});
