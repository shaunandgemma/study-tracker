import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-2',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Core Checks (Basic Support) vs Full Checks (Business/Enterprise Support)',
  status: 'ready',
  plainEnglish: 'Trusted Advisor access depends on the account support plan. Basic Support provides all checks in the Service limits category plus a defined selection of Security and Fault tolerance checks. Full check access and the Trusted Advisor API are currently associated with AWS Business Support+, AWS Enterprise Support, or AWS Unified Operations. Older material may say Business or Enterprise On-Ramp; AWS has announced support-plan transitions, so engineers must check the current plan documentation rather than relying on an old list.',
  whyItMatters: 'A missing recommendation does not necessarily mean that an account has no issue. The relevant check might not be included in that account’s support plan, might not have refreshed, or might require another service to be enabled. Multi-account reports can therefore show different coverage for different accounts.',
  workplaceExample: 'A company’s management account has Enterprise Support, but several sandbox accounts have Basic Support. The central report contains richer results for the management account. The operations team records each account’s support plan and check coverage before comparing totals so the sandboxes are not incorrectly reported as healthier.',
  examFocus: 'SAA-C03 support-plan boundary:\n- Basic Support: all Service limits checks and selected Security and Fault tolerance checks.\n- Current full-check plans: Business Support+, Enterprise Support, and Unified Operations.\n- Full-plan accounts can use the Trusted Advisor API and have broader automated refresh behaviour.\n- Coverage is account-specific in an AWS organization.\n- Always verify current support-plan names because AWS has announced transitions from older plans.',
  keyPoints: [
    'Basic Support does not provide the complete Trusted Advisor check catalogue.',
    'Basic accounts can access all Service limits checks and selected Security and Fault tolerance checks documented by AWS.',
    'Business Support+, Enterprise Support, and Unified Operations currently provide access to all Trusted Advisor checks.',
    'The Trusted Advisor API requires an eligible full-support plan.',
    'An Organizations management account support plan does not automatically give every member account identical check coverage.',
    'Developer Support, the older Business Support plan, and Enterprise On-Ramp have announced transition or retirement timelines outside AWS GovCloud exceptions.'
  ],
  commonMistake: 'Comparing the number of green checks across accounts without checking their support plans. An account with fewer available checks can appear cleaner simply because less of the environment was evaluated.',
  example: 'Account A has Basic Support and shows service-quota checks plus selected security checks. Account B has Business Support+ and shows the full catalogue. The team reports coverage alongside findings and does not interpret Account A’s shorter list as better compliance.',
  sources: [
    { title: 'AWS Trusted Advisor check availability', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html' },
    { title: 'AWS Support plans', url: 'https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html' }
  ]
});
