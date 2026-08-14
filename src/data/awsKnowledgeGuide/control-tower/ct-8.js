import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-8', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Preventive Controls', status: 'ready',
  plainEnglish: 'A preventive control blocks actions that would violate a governance rule. Control Tower implements these controls with AWS Organizations mechanisms such as service control policies, resource control policies, or declarative policies depending on the control.',
  whyItMatters: 'Prevention is appropriate when allowing a prohibited change even briefly would create unacceptable risk, such as disabling protected audit capabilities.',
  workplaceExample: 'A preventive control protects the log archive by denying policy changes that ordinary workload administrators should never make.',
  examFocus: 'A preventive control reports enforced or not enabled rather than compliant or noncompliant resource counts. It limits possible actions but does not grant IAM permissions.',
  keyPoints: ['Preventive controls stop actions before success.', 'They apply through the organization hierarchy.', 'An explicit deny overrides identity-based allows.', 'SCPs define permission boundaries rather than grants.', 'Denied attempts can still appear in CloudTrail.'],
  commonMistake: 'Attaching an SCP and expecting users to gain the actions listed in it. Users still require IAM permissions, and an SCP can only limit them.',
  example: 'Enable a preventive control on Production to disallow changes to central logging, then test with a non-production principal before wider rollout.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }]
});
