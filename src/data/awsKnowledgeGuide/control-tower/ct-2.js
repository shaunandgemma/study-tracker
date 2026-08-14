import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-2', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Guardrails: Preventive Guardrails (SCPs) vs Detective Guardrails (Config rules)', status: 'ready',
  plainEnglish: 'Control Tower controls, formerly called guardrails, express governance rules. Preventive controls block disallowed actions before they succeed and commonly use AWS Organizations policies. Detective controls use AWS Config rules to discover resources that are already noncompliant and report violations.',
  whyItMatters: 'Some risks must be impossible to create, while others need visibility and remediation without blocking every deployment.',
  workplaceExample: 'A preventive control denies changes to protected logging resources. A detective control reports unencrypted EBS volumes so the operations team can correct them.',
  examFocus: 'Preventive means deny before the change; detective means evaluate and report after resource creation or modification. A preventive deny is not an IAM permission grant, and a detective finding does not automatically block deployment.',
  keyPoints: ['Preventive controls stop prohibited actions.', 'Detective controls identify noncompliant resources.', 'Preventive controls commonly use SCPs, RCPs, or declarative policies.', 'Detective controls use AWS Config rules.', 'Controls apply to governed OUs and their enrolled accounts.'],
  commonMistake: 'Assuming an SCP grants permissions. It establishes the maximum available permissions; identities still require an IAM allow.',
  example: 'Use a preventive control to protect the log archive bucket and a detective control to flag public S3 buckets that require investigation.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }]
});
