import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-12',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Multi-Account Recommendations with AWS Organizations',
  status: 'ready',
  plainEnglish: 'Trusted Advisor Organizational View aggregates check results from accounts in AWS Organizations into reports. An authorised administrator enables trusted access, selects accounts or organizational units, Regions, checks, categories, and resource statuses, then creates a JSON or CSV report. The report is a snapshot: creating it does not automatically refresh every member account and does not give every account the same check coverage.',
  whyItMatters: 'Large organisations need one place to identify repeated risks and prioritise remediation across accounts. Organizational View provides that visibility while retaining account-level support-plan and ownership boundaries. Accurate reporting requires refreshed checks, understood coverage, secure report storage, and accountable owners in each member account.',
  workplaceExample: 'A cloud centre of excellence creates a monthly report for production organizational units, stores it in a restricted analysis location, and ranks red security and fault-tolerance findings. Each resource is assigned to its owning account team, while the central team tracks repeated patterns and organisation-wide improvements.',
  examFocus: 'SAA-C03 multi-account boundary:\n- Enable trusted access between Trusted Advisor and AWS Organizations.\n- Use Organizational View to create aggregated reports.\n- Reports can be filtered and downloaded as JSON or CSV.\n- Refresh account checks before reporting; report creation is not a refresh operation.\n- Member-account support plans still determine the checks available in each account.',
  keyPoints: [
    'Organizational View is enabled from the organization management account with the required permissions and trusted access.',
    'Reports can aggregate selected organizational units, accounts, Regions, categories, checks, and resource statuses.',
    'The report contains summaries, schema information, and resource-level result data.',
    'Generating a report does not automatically refresh member-account checks.',
    'A management account with a full support plan does not grant identical Trusted Advisor coverage to Basic member accounts.',
    'Organizational reports can contain sensitive account and resource metadata and should be stored with appropriate access control.'
  ],
  commonMistake: 'Treating a newly generated organizational report as fully current without refreshing eligible account checks or reviewing last-update information first.',
  example: 'Before the quarterly report, owners refresh eligible checks in each account. The delegated process creates a report for production OUs, analysts separate findings by account and category, and remediation tickets retain the originating account and resource identifiers.',
  sources: [
    { title: 'Organizational view for AWS Trusted Advisor', url: 'https://docs.aws.amazon.com/awssupport/latest/user/organizational-view.html' },
    { title: 'Using other AWS services with Trusted Advisor reports', url: 'https://docs.aws.amazon.com/awssupport/latest/user/use-other-aws-services-with-trusted-advisor-reports.html' }
  ]
});
