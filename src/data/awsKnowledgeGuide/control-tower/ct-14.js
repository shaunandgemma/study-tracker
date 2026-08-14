import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-14', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Audit Account', status: 'ready',
  plainEnglish: 'The Audit account is a shared security account intended for cross-account security and compliance access. It provides a controlled place for auditors and security teams to review governed accounts without operating daily workloads from the management account.',
  whyItMatters: 'A dedicated account supports separation of duties and lets security teams investigate member accounts through controlled roles and notifications.',
  workplaceExample: 'The security operations team signs in through IAM Identity Center, assumes read-only audit roles in workload accounts, reviews Config findings, and follows incidents without receiving application administrator access.',
  examFocus: 'Audit and Log Archive are different: Audit supports security access and notifications; Log Archive owns retained log data. Both normally sit in the Security OU and should use tightly managed identities.',
  keyPoints: ['Audit is a dedicated shared security account.', 'It supports cross-account investigation and compliance access.', 'It is separate from the management and Log Archive accounts.', 'Access should use controlled roles and temporary credentials.', 'Ordinary workloads should not run there.'],
  commonMistake: 'Using the Audit account as the central log-storage account or as a general administrator account for everyday work.',
  example: 'Grant the security team read and investigation roles from Audit while keeping log object ownership in Log Archive.',
  sources: [{ title: 'How AWS Control Tower works', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html' }, { title: 'Roles and accounts in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html' }]
});
