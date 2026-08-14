import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-5', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Data Events', status: 'ready',
  plainEnglish: 'Data events record operations performed on or within a resource, such as S3 object access, Lambda function invocation, or DynamoDB item activity for supported resource types. Because these operations can happen very frequently, they are not logged by trails by default.',
  whyItMatters: 'Data events provide the detailed resource-access evidence needed to investigate data exposure, unexpected object deletion, or use of sensitive functions.',
  workplaceExample: 'A confidential S3 object is downloaded unexpectedly. A data-event selector for the bucket lets the security team identify the GetObject caller and request context.',
  examFocus: 'Enable data events explicitly and scope selectors to required resources and event types to control cost and noise. Event history does not display data events; use delivered trail logs or CloudTrail Lake as configured.',
  keyPoints: ['Data events are also called data-plane operations.', 'They are not enabled by default for trails.', 'Advanced event selectors provide granular filtering.', 'High-volume data events can generate charges and large log volumes.', 'Supported resource types vary by AWS service.'],
  commonMistake: 'Enabling a normal management trail and believing it proves who read every object in a bucket.',
  example: 'Configure S3 object-level write data events for a critical bucket prefix rather than logging every object operation in the entire account without a requirement.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'Logging data events', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html' }]
});
