import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-6', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Control Tower Governed OUs', status: 'ready',
  plainEnglish: 'A governed OU is an AWS Organizations organizational unit registered with Control Tower and covered by its applicable baseline and controls. Accounts in the OU inherit the governance applied at that OU and parent levels.',
  whyItMatters: 'OUs let administrators apply a consistent policy set to groups of accounts based on purpose, risk, or environment.',
  workplaceExample: 'A Production OU receives stricter preventive controls than a Sandbox OU, while both inherit organization-wide logging protection.',
  examFocus: 'Controls are enabled at an OU and affect enrolled accounts beneath it. Register an existing OU before expecting Control Tower governance. Moving accounts or altering OUs outside supported workflows can cause drift or unexpected inherited controls.',
  keyPoints: ['OUs group accounts for governance.', 'A registered or baselined OU is brought under Control Tower governance.', 'Controls inherit through the Organizations hierarchy.', 'Account placement determines its applicable policies.', 'OU registration and updates require prerequisite checks.'],
  commonMistake: 'Moving an account into an OU based only on its name without reviewing inherited SCPs, controls, and regional governance.',
  example: 'Register Development and Production OUs separately, apply their required controls, and test account workloads before moving accounts between them.',
  sources: [{ title: 'Manage accounts through AWS Organizations', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/organizations.html' }, { title: 'Register an existing organizational unit', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/register-ou.html' }]
});
