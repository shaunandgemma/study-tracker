import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-10',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Trusted Advisor Recommendations and Status',
  status: 'ready',
  plainEnglish: 'The Trusted Advisor console groups check results by status. Action recommended is shown in red, Investigation recommended in yellow, No problems detected in green, and excluded items in gray. A status describes the latest available evaluation of that check or resource. It can be stale until the check refreshes, and excluded does not mean fixed.',
  whyItMatters: 'Teams need to understand both urgency and freshness. Acting on an old result can waste time, while assuming that a gray or green item is safe can hide accepted risk or uncovered problems. The check description, alert criteria, affected resource, last update, and refresh behaviour give the status its meaning.',
  workplaceExample: 'An engineer sees a red recommendation after a resource was already corrected. Before reopening the incident, they check the last update time and whether that check permits manual refresh. After reevaluation, the result becomes green and the change record captures both the remediation and refreshed evidence.',
  examFocus: 'SAA-C03 status interpretation:\n- Red: action recommended.\n- Yellow: investigation recommended.\n- Green: no problem detected by that check.\n- Gray: excluded item or other non-current state, depending on the console context.\n- Refresh supported checks before relying on the result; some integrated checks refresh automatically and cannot be manually refreshed.',
  keyPoints: [
    'A status is the result of a specific check evaluation, not a universal health grade.',
    'Red findings normally deserve priority, but impact and exposure still require validation.',
    'Yellow findings require investigation rather than automatic dismissal.',
    'Green means the check found no issue; it does not prove that no issue exists outside the check.',
    'Excluded resources remain intentionally hidden from included results and should have documented justification.',
    'Refresh timing differs by check, support plan, and integration, so the last updated time matters.'
  ],
  commonMistake: 'Excluding a persistent recommendation simply to make the dashboard green. Exclusion changes reporting; it does not change the resource or remove the risk.',
  example: 'A yellow quota recommendation is refreshed and remains yellow. Capacity forecasts show an upcoming release will exceed the current quota, so the team requests an increase and keeps the item included until the approved quota and refreshed result are verified.',
  sources: [
    { title: 'Get started with Trusted Advisor Recommendations', url: 'https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html' },
    { title: 'Manage Trusted Advisor access and actions', url: 'https://docs.aws.amazon.com/awssupport/latest/user/security-trusted-advisor.html' }
  ]
});
