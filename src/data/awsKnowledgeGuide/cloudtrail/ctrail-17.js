import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-17', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'Identifying User Identity and Source IP', status: 'ready',
  plainEnglish: 'The userIdentity element describes the principal behind a request, which may be an IAM user, assumed role, federated identity, root user, AWS service, or another identity type. sourceIPAddress records where the request originated when available; for an AWS service it can contain the service DNS name.',
  whyItMatters: 'Temporary credentials and role chaining mean the visible role name is not always the original person or workload. Investigators must follow the session information to attribute an action correctly.',
  workplaceExample: 'An assumed deployment role deletes a resource. The team inspects the session ARN, session issuer, principal ID, source identity, user agent, and source IP to link the action back to a pipeline run.',
  examFocus: 'Do not assume sourceIPAddress always contains a public client IP or that userIdentity always contains an IAM username. For assumed roles, examine sessionContext and issuer fields; sourceIdentity can preserve the original identity when STS is configured to carry it.',
  keyPoints: ['Identity type explains how credentials were obtained.', 'ARN and principalId identify the acting principal and session.', 'sessionIssuer identifies the role that issued temporary credentials.', 'sourceIdentity can preserve an original federated identity.', 'sourceIPAddress may be an IP address or an AWS service name.'],
  commonMistake: 'Attributing an action to the role owner solely from the role name without examining the session and source identity.',
  example: 'For an AssumedRole event, record the session ARN, role ARN, sourceIdentity if present, MFA context, source address, user agent, and correlated AssumeRole event.',
  sources: [{ title: 'CloudTrail userIdentity element', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-user-identity.html' }, { title: 'CloudTrail event record contents', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html' }]
});
