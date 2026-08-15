import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-18',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Moving Accounts between OUs',
  status: 'ready',
  plainEnglish: 'Moving Accounts between OUs is the process of reassigning a member account from one parent container to another within the AWS Organizations hierarchy. When an account is moved, it instantly loses all Service Control Policies (SCPs) inherited from its previous parent OU and immediately inherits all SCPs attached to its new parent OU.',
  whyItMatters: 'Account movement enables progressive staging environments (e.g. moving an account from a permissive `Sandbox OU` to a highly restricted `Production OU`). However, moving accounts live can immediately break application workloads if new SCP restrictions are unexpectedly applied.',
  workplaceExample: 'An engineering team completes testing on an account in `Non-Production OU`. The cloud administrator moves the account to `Production OU`. The account immediately inherits the strict `Production OU` SCP blocking unencrypted S3 buckets.',
  examFocus: 'SAA-C03 Account Movement Workflow & Policy Impact:\n- Immediate Policy Switch: SCPs from the old OU cease to apply immediately; SCPs from the destination OU apply instantly.\n- Impact Assessment: Always audit destination OU SCPs before executing a move to prevent unintended service disruptions.\n- Move API: Executed via `MoveAccount` API call specifying `AccountId`, `SourceParentId`, and `DestinationParentId`.',
  keyPoints: [
    'Reassigns an AWS member account to a new parent Organizational Unit (OU).',
    'Instantly revokes policies inherited from the source OU container.',
    'Immediately applies all policies attached to the destination OU container.',
    'Allows progressive promotion of accounts through development lifecycle OUs.',
    'Requires auditing destination SCPs prior to executing the move operation.'
  ],
  commonMistake: 'Moving an active production account into a new OU without testing destination SCPs, accidentally cutting off required AWS API access for running workloads.',
  example: 'Moving a Member Account via AWS CLI:\naws organizations move-account --account-id 123456789012 --source-parent-id ou-a1b2-11111111 --destination-parent-id ou-a1b2-22222222',
  sources: [
    { title: 'Moving an account between OUs', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_ous.html#move_account' }
  ]
});
