import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-4', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Management Events', status: 'ready',
  plainEnglish: 'Management events record control-plane operations that configure AWS services and resources. Examples include creating a VPC, attaching an IAM policy, changing a trail, or listing infrastructure. They can be read operations, write operations, or both.',
  whyItMatters: 'Most security and operational investigations begin with control-plane changes because they explain who altered the account configuration.',
  workplaceExample: 'A route table suddenly sends traffic to the wrong gateway. CloudTrail management events reveal the ReplaceRoute call, the role session, and the supplied route parameters.',
  examFocus: 'Event history automatically provides the last 90 days of management events for the current Region. Trails log management events by default. Read-only events can be excluded to reduce delivery volume, but doing so reduces audit visibility.',
  keyPoints: ['Management events are also called control-plane events.', 'They include read and write operations.', 'Event history contains recent management events only.', 'Trails and event data stores enable longer-term recording.', 'Global service events require careful Region interpretation.'],
  commonMistake: 'Calling S3 GetObject a management event because it uses an API. Object-level access is a data event; bucket configuration calls are management events.',
  example: 'CreateBucket is a management event because it configures the service, while GetObject is a data event because it operates on an object.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'Logging management events', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html' }]
});
