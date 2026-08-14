import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-6', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Insights Events', status: 'ready',
  plainEnglish: 'CloudTrail Insights analyses normal patterns of write-management API calls and API error rates, then creates an Insights event when activity differs significantly from the baseline. The event shows the baseline, unusual activity, start time, and end time.',
  whyItMatters: 'An unusual surge can indicate a faulty deployment, runaway automation, operational incident, or compromised credentials even when individual API calls are permitted.',
  workplaceExample: 'A damaged deployment loop suddenly makes hundreds of EC2 modification calls. Insights reports the unusual call rate so operators can stop the pipeline before it changes more resources.',
  examFocus: 'Insights must be enabled and is not a replacement for standard management-event logging. It detects unusual API-call or error-rate activity; CloudWatch anomaly detection instead analyses metric behaviour.',
  keyPoints: ['Insights builds a baseline from management activity.', 'It can analyse unusual write-call rates and API error rates.', 'Insights events are a separate event type.', 'The underlying management events are needed for detailed investigation.', 'Additional CloudTrail charges can apply.'],
  commonMistake: 'Expecting Insights to detect unusual S3 object reads automatically. Its supported analysis is based on management activity and API error rates, not arbitrary data-event behaviour.',
  example: 'An Insights event identifies a spike in RunInstances. Investigators then examine the related management events to identify the role, parameters, and resources involved.',
  sources: [{ title: 'CloudTrail Insights events', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-insights-events-with-cloudtrail.html' }, { title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }]
});
