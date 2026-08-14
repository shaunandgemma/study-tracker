import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-3', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail API Activity Auditing', status: 'ready',
  plainEnglish: 'A CloudTrail event is a JSON record of an activity in an AWS account. It can show the API name, event time, AWS Region, identity or service that made the request, source IP, user agent, request parameters, response elements, resources, and error details.',
  whyItMatters: 'Auditing converts an unexplained infrastructure change into a traceable action that can be attributed to a human session, automation role, or AWS service.',
  workplaceExample: 'An IAM policy gains broad permissions. An auditor locates the policy-version API call and follows the assumed-role session issuer to the deployment role and pipeline responsible for the change.',
  examFocus: 'CloudTrail is the primary service for API activity and governance auditing. Use Event history for recent Regional management events, a trail for ongoing S3 delivery, or CloudTrail Lake for SQL queries across retained event data.',
  keyPoints: ['eventName identifies the recorded operation.', 'userIdentity describes the principal or service behind the request.', 'requestParameters and responseElements add action context.', 'errorCode and errorMessage reveal failed calls.', 'CloudTrail log files are not guaranteed to be ordered like a stack trace.'],
  commonMistake: 'Looking only at the username field. Assumed roles and federated sessions require inspection of identity type, ARN, principal ID, and session issuer.',
  example: 'For a terminated instance, search TerminateInstances in the correct Region and time window, then compare the instance ID and identity session with change records.',
  sources: [{ title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'CloudTrail record contents', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html' }]
});
