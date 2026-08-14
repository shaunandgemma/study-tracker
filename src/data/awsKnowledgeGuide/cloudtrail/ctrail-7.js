import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-7', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Event History', status: 'ready',
  plainEnglish: 'CloudTrail Event history is automatically available for an AWS account. It provides a searchable, downloadable, immutable view of the previous 90 days of management events in the selected AWS Region, without requiring a trail.',
  whyItMatters: 'It gives administrators an immediate starting point for recent investigations even when long-term audit logging was not configured beforehand.',
  workplaceExample: 'An instance disappeared yesterday. The operator selects its Region, opens Event history, filters by the instance or TerminateInstances, and identifies the responsible session.',
  examFocus: 'Event history contains management events only, is Regional, and is limited to 90 days. It is separate from trails and event data stores, so changing a trail does not change Event history. Use a trail or CloudTrail Lake for longer retention or additional event types.',
  keyPoints: ['Event history is enabled automatically.', 'It retains 90 days of management events.', 'Searches operate in the selected Region.', 'It can be queried with lookup-events.', 'It does not include data, Insights, or network activity events.'],
  commonMistake: 'Searching one Region for an event that occurred in another Region and concluding that it was never recorded.',
  example: 'Switch to eu-west-2, filter Event source to ec2.amazonaws.com, select the event, and inspect the identity and request parameters.',
  sources: [{ title: 'Working with CloudTrail event history', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html' }, { title: 'How CloudTrail works', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html' }]
});
