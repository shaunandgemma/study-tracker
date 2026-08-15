import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-4',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'AWS Organizations Multi-Account Management',
  status: 'ready',
  plainEnglish: 'AWS Organizations is an account management service that allows you to consolidate multiple AWS accounts into an organization that you create and centrally manage. It provides centralized billing, automated account creation, grouping of accounts into Organizational Units (OUs), and organization-wide governance policies like Service Control Policies (SCPs).',
  whyItMatters: 'Using a single AWS account for all company workloads creates severe blast radius risks and complex IAM management. AWS Organizations enables a multi-account strategy that isolates environments (production, dev, security) while maintaining centralized control.',
  workplaceExample: 'A growing tech company creates an organization in AWS Organizations. They structure their environment into dedicated accounts (`Security`, `Log-Archive`, `Production`, `Development`) managed under a single payer account with unified billing.',
  examFocus: 'SAA-C03 Core Organizations Concepts:\n- Multi-Account Strategy: Recommended AWS best practice for workload isolation and blast radius reduction.\n- Feature Sets: Consolidated Billing Only mode vs All Features mode (enables SCPs and governance policies).\n- Account Hierarchy: Organization Root -> Organizational Units (OUs) -> Member Accounts.\n- Centralized Billing: Combines usage across all accounts for volume tiering discounts.',
  keyPoints: [
    'Centralized service for managing and governing multiple AWS accounts.',
    'Isolates workloads across dedicated accounts to minimize security blast radius.',
    'Provides Consolidated Billing to unify payments and leverage volume discounts.',
    'Supports two feature sets: Consolidated Billing Only and All Features.',
    'Enables organization-wide governance using Service Control Policies (SCPs).'
  ],
  commonMistake: 'Deploying all enterprise production, development, and testing workloads into a single AWS account instead of using AWS Organizations to create isolated accounts.',
  example: 'Creating an Organization via AWS CLI:\naws organizations create-organization --feature-set ALL',
  sources: [
    { title: 'What is AWS Organizations?', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html' }
  ]
});
