import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-18', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Account Enrollment', status: 'ready',
  plainEnglish: 'Enrollment brings an existing AWS Organizations member account under Control Tower governance in a registered OU. Control Tower checks prerequisites, establishes required roles and baseline resources, and applies the controls inherited by the account.',
  whyItMatters: 'Organizations often adopt Control Tower after accounts already exist. Enrollment extends consistent governance without replacing those accounts.',
  workplaceExample: 'A legacy development account is assessed for conflicts, given the required AWSControlTowerExecution role, moved into a registered OU, and enrolled after existing Config settings are resolved.',
  examFocus: 'The account must meet prerequisites, including required access and compatible AWS Config configuration. Landing-zone drift can block enrollment. Verify the existing account email carefully to avoid accidentally creating a new account.',
  keyPoints: ['Enrollment governs an existing member account.', 'The target OU must be registered or baselined.', 'AWSControlTowerExecution access is required.', 'Existing Config resources can cause enrollment failure.', 'Auto-enrollment can govern accounts moved into eligible OUs when configured.'],
  commonMistake: 'Selecting account creation when the intention was to enroll an existing account, potentially producing a second AWS account.',
  example: 'Review prerequisites and backups, verify account ID and email, prepare the execution role, enroll into a test OU, and confirm controls and logging.',
  sources: [{ title: 'Enroll an existing account from the console', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html' }, { title: 'Provision accounts within AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/methods-of-provisioning.html' }]
});
