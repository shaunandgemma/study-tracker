import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-17', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Service Control Policy Integration', status: 'ready',
  plainEnglish: 'Control Tower can implement preventive controls with AWS Organizations service control policies. An SCP limits the actions that principals in affected member accounts may receive, even if an IAM policy otherwise allows those actions.',
  whyItMatters: 'Organization-level permission boundaries enforce critical rules consistently across many accounts and reduce dependence on each account administrator.',
  workplaceExample: 'A preventive control denies changes to protected logging resources throughout a governed OU, even to local administrators whose IAM policies are broad.',
  examFocus: 'SCPs do not grant permissions and do not limit the management account. Effective permission requires an identity or resource allow and must not be blocked by an SCP, permission boundary, session policy, or explicit deny.',
  keyPoints: ['SCPs set maximum permissions for member-account principals.', 'An SCP allow is not an IAM permission grant.', 'Explicit denies override allows.', 'SCPs inherit through roots and OUs.', 'Control Tower manages some SCPs as preventive controls.'],
  commonMistake: 'Editing or detaching a Control Tower-managed SCP directly in Organizations and creating governance drift.',
  example: 'Enable the Control Tower control at the intended OU, test a representative workload, and manage later changes through Control Tower rather than directly changing its SCP.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }, { title: 'Manage accounts through AWS Organizations', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/organizations.html' }]
});
