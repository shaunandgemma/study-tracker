import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-14',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Multi-Account Inspector Management',
  status: 'ready',
  plainEnglish: 'Amazon Inspector can work with AWS Organizations so a delegated administrator manages scan activation, configuration, coverage, findings, and suppression across associated member accounts. Organization policies can centrally enforce scan-type enablement, while delegated administration supplies the operational view and remaining scan settings. Inspector activation and delegated-administrator setup must account for each Region in use.',
  whyItMatters: 'Central governance prevents newly created or overlooked accounts from becoming blind spots and gives security teams an organization-wide findings view. Regional planning is still essential because resources and Inspector configuration are regional.',
  workplaceExample: 'A company designates its security tooling account as the Inspector delegated administrator. An organization policy enables EC2 and ECR scanning for the production organizational unit, and the security team reviews coverage by account and repeats the required setup in every approved workload Region.',
  examFocus: 'The AWS Organizations management account designates the delegated administrator; the delegated administrator manages member scanning and aggregated findings. Organization policies can take precedence for scan-type enablement. Do not assume enabling one account or one Region automatically activates every account-Region pair.',
  keyPoints: [
    'AWS Organizations supports centralized Amazon Inspector management for member accounts.',
    'Only the Organizations management account can designate or remove the Inspector delegated administrator.',
    'The delegated administrator can view member coverage and aggregated finding details.',
    'Organization policies can automatically enable and enforce selected scan types, including for new accounts.',
    'Delegated administration and Inspector enablement have Regional considerations.',
    'Suppression rules created by the delegated administrator can apply across associated organization findings.'
  ],
  commonMistake: 'Designating an administrator in the primary Region and assuming global coverage can leave workloads elsewhere unmonitored. Maintain an account-by-Region activation matrix and verify the coverage page for every intended scan type.',
  example: 'From the management account, designate the security account as delegated administrator in each intended Region. Apply the approved organization policy or activate member scan types, then use the delegated administrator account to verify EC2, ECR, and Lambda coverage for a newly added member account.',
  sources: [
    { title: 'Managing multiple accounts in Amazon Inspector with AWS Organizations', url: 'https://docs.aws.amazon.com/inspector/latest/user/managing-multiple-accounts.html' },
    { title: 'Understanding delegated administrator and member accounts', url: 'https://docs.aws.amazon.com/inspector/latest/user/admin-member-relationship.html' },
    { title: 'Designating a delegated administrator account', url: 'https://docs.aws.amazon.com/inspector/latest/user/designating-admin.html' },
    { title: 'Activating Amazon Inspector scans for member accounts', url: 'https://docs.aws.amazon.com/inspector/latest/user/adding-member-accounts.html' }
  ]
});
