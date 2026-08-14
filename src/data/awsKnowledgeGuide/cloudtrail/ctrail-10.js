import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-10', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Organization Trails', status: 'ready',
  plainEnglish: 'An organization trail records events for the management account and member accounts in an AWS Organizations organization using one centrally governed configuration. New member accounts receive the organization trail automatically.',
  whyItMatters: 'Central security teams gain consistent coverage without relying on each workload team to create and protect its own trail.',
  workplaceExample: 'A delegated security administrator manages a multi-Region organization trail that sends every account to a log-archive bucket. Developers can see the trail in member accounts but cannot change it.',
  examFocus: 'The management account or a registered delegated administrator creates and updates organization trails. Member accounts cannot modify or delete them. Central bucket access is separate and must be deliberately granted.',
  keyPoints: ['Organization trails span management and member accounts.', 'New accounts inherit the organization configuration.', 'A delegated administrator can manage the trail.', 'Member accounts cannot alter the organization trail.', 'Console-created organization trails are multi-Region.'],
  commonMistake: 'Assuming every member-account administrator can read the central S3 objects merely because the trail appears in their console.',
  example: 'Create the trail from a delegated security account, deliver to a log archive account, and grant auditors read access without giving workload accounts delete permissions.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'Creating a trail for an organization', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html' }, { title: 'Working with CloudTrail trails', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trails.html' }]
});
