import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-10', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Proactive Controls', status: 'ready',
  plainEnglish: 'A proactive control checks supported resources before AWS CloudFormation provisions them. It uses CloudFormation hooks to evaluate the proposed configuration and prevents a noncompliant resource from being created through that CloudFormation operation.',
  whyItMatters: 'It moves governance earlier into infrastructure deployment so teams receive feedback before a bad configuration exists.',
  workplaceExample: 'A pipeline attempts to deploy an unencrypted storage resource. The proactive control fails the CloudFormation operation, and the template is corrected before deployment.',
  examFocus: 'Proactive controls apply to supported resources provisioned by CloudFormation. They are different from preventive organization policies that deny API actions broadly and detective Config rules that evaluate existing resources.',
  keyPoints: ['Proactive controls evaluate before provisioning.', 'CloudFormation hooks implement the checks.', 'Possible evaluation results include PASS, FAIL, and SKIP.', 'A failed check blocks the affected CloudFormation provisioning.', 'Coverage depends on the resource type and deployment path.'],
  commonMistake: 'Assuming a proactive CloudFormation control evaluates every resource created manually through the console or every direct API call.',
  example: 'Enable the control on a test OU and validate both a compliant and noncompliant CloudFormation template before enabling it for production.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }]
});
