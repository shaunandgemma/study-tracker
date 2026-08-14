import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-1', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management',
  title: 'Audit Logging of API Calls across Management Events, Data Events, & Insights Events', status: 'ready',
  plainEnglish: 'AWS CloudTrail records activity performed through the AWS console, CLI, SDKs, APIs, and supported AWS services. Management events describe control-plane changes such as creating a subnet. Data events describe high-volume resource operations such as reading an S3 object or invoking a Lambda function. Insights events identify unusual rates of write-management activity or API error activity when Insights is enabled.',
  whyItMatters: 'CloudTrail answers who performed an action, what API operation occurred, when and where it happened, which resource was involved, and whether the request succeeded. This evidence supports investigations, compliance, and change accountability.',
  workplaceExample: 'A production bucket policy changes unexpectedly. The security team searches CloudTrail for PutBucketPolicy, identifies the assumed role and source address, checks the request parameters, and correlates the change with the deployment pipeline.',
  examFocus: 'Management events are logged by default in Event history and by trails; data events and Insights are not enabled by default and can add cost. Use data selectors for resource-level activity and Insights for anomalous API behaviour rather than ordinary metric thresholds.',
  keyPoints: ['Management events describe control-plane operations.', 'Data events describe resource-level operations and are often high volume.', 'Insights events report unusual activity patterns after the feature is enabled.', 'CloudTrail records both API and supported non-API account activity.', 'All CloudTrail event types use a JSON event format.'],
  commonMistake: 'Creating a trail and assuming every S3 object read or Lambda invocation is recorded. Data events require explicit event-selector configuration.',
  example: 'Investigate a deleted security group by filtering management events for DeleteSecurityGroup, then inspect userIdentity, eventTime, sourceIPAddress, requestParameters, and errorCode.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'How CloudTrail works', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html' }]
});
