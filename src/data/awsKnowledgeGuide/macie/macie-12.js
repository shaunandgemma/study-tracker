import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-12',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Macie Multi-Account Management',
  status: 'ready',
  plainEnglish: 'Macie integrates with AWS Organizations so a delegated Macie administrator can centrally manage associated member accounts and view organization-wide S3 inventory, policy findings, and supported discovery information. The administrator-member relationship has documented boundaries, and Macie remains Regional: enable and configure it in every Region where the organization needs coverage.',
  whyItMatters: 'Central administration reduces blind spots when teams create accounts and buckets independently. It also makes it possible to compare S3 posture and discovery usage across members while keeping account ownership and Regional configuration visible.',
  workplaceExample: 'The security account is designated as the Macie administrator for an AWS organization. It enables Macie for eligible member accounts, configures automated discovery for selected accounts, monitors per-account usage, and repeats the required setup in each approved Region that contains S3 workloads.',
  examFocus: 'The Organizations management account designates the delegated Macie administrator, which then performs supported central-management tasks. Do not assume one Region enables all Regions or that the administrator owns every member-created discovery job and result. Know that inventory, settings, results repositories, publication choices, and cost estimates can have Regional or account-specific behavior.',
  keyPoints: [
    'AWS Organizations can associate Macie member accounts with a delegated administrator.',
    'The administrator can view supported S3 inventory and policy findings for associated members.',
    'Capabilities differ for administrator-created jobs, member-created jobs, and automated discovery.',
    'Macie must be enabled and managed in each required AWS Region.',
    'Usage and cost estimates should be reviewed by account and Region rather than assumed to be globally aggregated.',
    'Repository and publication settings can remain specific to the configuring account and Region.'
  ],
  commonMistake: 'Enabling Macie only in the organization\'s home Region leaves S3 estates elsewhere outside that Macie configuration. Maintain an account-and-Region coverage list and verify member status, automated-discovery state, and result storage separately.',
  example: 'Designate the security account through AWS Organizations, associate a test member, and verify its bucket inventory from the administrator account. Repeat the validation in a second required Region, confirm who owns discovery jobs and results, and review estimated usage before expanding the rollout.',
  sources: [
    { title: 'Macie administrator and member account relationships', url: 'https://docs.aws.amazon.com/macie/latest/user/accounts-mgmt-relationships.html' },
    { title: 'Considerations for using Macie with AWS Organizations', url: 'https://docs.aws.amazon.com/macie/latest/user/accounts-mgmt-ao-notes.html' },
    { title: 'Amazon Macie and AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-macie.html' },
    { title: 'Understanding estimated usage costs for Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/account-mgmt-costs-calculations.html' }
  ]
});
