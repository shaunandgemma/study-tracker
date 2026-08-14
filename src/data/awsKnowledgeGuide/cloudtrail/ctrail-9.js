import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-9', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Single-Region and Multi-Region Trails', status: 'ready',
  plainEnglish: 'A single-Region trail records events only in its home Region. A multi-Region trail records events from all enabled AWS Regions in the account and sends them to the configured destination. Trails created through the current console are multi-Region.',
  whyItMatters: 'Attackers, automation, and administrators can act in any enabled Region. Central multi-Region logging reduces blind spots and avoids maintaining separate Regional trails.',
  workplaceExample: 'A team normally operates in London, but compromised credentials create resources in another Region. Its multi-Region trail captures the activity in the central logging bucket.',
  examFocus: 'Choose multi-Region for comprehensive account auditing. Single-Region trails can be created through CLI or API for specialised needs. Opt-in Regions still need to be enabled before ordinary account activity can occur there.',
  keyPoints: ['Multi-Region trails cover all enabled Regions.', 'Single-Region trails record only the home Region.', 'The destination S3 bucket can be in a different Region.', 'Console-created trails are multi-Region.', 'Global service event handling should be reviewed to avoid misunderstanding duplicates or location.'],
  commonMistake: 'Using only a trail in the primary application Region and overlooking activity elsewhere in the account.',
  example: 'A multi-Region trail based in eu-west-2 can deliver activity from enabled Regions into one protected S3 bucket.',
  sources: [{ title: 'Working with CloudTrail trails', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-trails.html' }, { title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }]
});
