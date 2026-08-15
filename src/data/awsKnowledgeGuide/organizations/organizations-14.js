import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-14',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Consolidated Billing',
  status: 'ready',
  plainEnglish: 'Consolidated Billing is a core feature of AWS Organizations that combines the billing and usage metrics of all member accounts into a single monthly invoice paid by the Management Account. It provides a centralized view of cloud expenditures across the organization, simplifies payment processing, and automatically unlocks volume pricing tiers.',
  whyItMatters: 'Managing separate credit cards and expense reports for dozens of AWS accounts creates massive financial overhead. Consolidated Billing unifies payments under one bill while providing detailed cost breakdown per member account in Cost Explorer.',
  workplaceExample: 'A company has 20 member accounts across 4 departments. Instead of receiving 20 separate monthly credit card invoices, the finance team receives one consolidated invoice paid by the Management Account via wire transfer.',
  examFocus: 'SAA-C03 Consolidated Billing Features & Mechanics:\n- Single Invoice: One combined bill paid by the Management Account.\n- Free Tier Sharing: Free Tier usage is combined across member accounts (e.g. 750 free EC2 hours shared across the org).\n- Cost Allocation Tags: Track expenditure per department/environment across all member accounts.\n- Consolidated Billing Only Mode: Basic feature set available without enabling governance policies (SCPs).',
  keyPoints: [
    'Combines charges across all member accounts into one single monthly invoice.',
    'Management Account is responsible for paying all accumulated organization charges.',
    'Combines usage across accounts to qualify for tiered volume discounts.',
    'Provides unified tracking via AWS Cost Explorer and Cost & Usage Reports (CUR).',
    'Can be used independently in Consolidated Billing Only mode.'
  ],
  commonMistake: 'Assuming Consolidated Billing automatically grants member account administrators access to view billing details of other member accounts. Billing access is restricted by IAM.',
  example: 'Viewing Organization Consolidated Costs via AWS Cost Explorer API:\naws ce get-cost-and-usage --time-period Start=2026-08-01,End=2026-08-15 --granularity MONTHLY --metrics "UnblendedCost" --group-by Type=DIMENSION,Key=LINKED_ACCOUNT',
  sources: [
    { title: 'Consolidated billing for AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_bootstrap-consolidated-billing.html' }
  ]
});
