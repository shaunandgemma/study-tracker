import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-7',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Organizational Units - OUs',
  status: 'ready',
  plainEnglish: 'An Organizational Unit (OU) is a logical container for grouping AWS accounts within an organization. OUs can be nested in a tree structure up to 5 levels deep. Applying a policy (such as a Service Control Policy) to an OU automatically applies that policy to all member accounts and nested child OUs contained within it.',
  whyItMatters: 'Managing policies on an account-by-account basis becomes unmanageable as organisations grow to dozens or hundreds of AWS accounts. OUs allow applying uniform governance policies based on environment or business function.',
  workplaceExample: 'An enterprise builds a multi-account tree structure: `Production OU` (contains `prod-app-1` and `prod-app-2` accounts) and `Workloads OU` -> `Non-Production OU` (contains `dev` and `test` accounts). The `Production OU` inherits a strict SCP prohibiting Region disabling.',
  examFocus: 'SAA-C03 Organizational Unit Architecture:\n- Nesting Limit: OUs can be nested up to 5 levels deep below the Organization Root.\n- Recommended Structure: Security OU, Infrastructure OU, Workloads OU (Prod / Non-Prod), Sandbox OU.\n- Policy Inheritance: Policies attached to an OU automatically flow down to all child OUs and nested accounts.\n- Moving Accounts: Moving an account from one OU to another immediately changes its inherited policy set.',
  keyPoints: [
    'Logical containers used to group AWS member accounts into a manageable hierarchy.',
    'Supports nested OU structures up to 5 levels deep below the Root.',
    'Service Control Policies attached to an OU are inherited by all child accounts and OUs.',
    'Enables environment-based governance (e.g. `Production` vs `Sandbox` OUs).',
    'Moving an account between OUs instantly updates its inherited policy guardrails.'
  ],
  commonMistake: 'Structuring OUs based strictly on corporate HR org charts rather than operational security guardrails and policy requirements.',
  example: 'Creating an Organizational Unit via AWS CLI:\naws organizations create-organizational-unit --parent-id r-a1b2 --name WorkloadsOU',
  sources: [
    { title: 'Managing Organizational Units (OUs)', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_ous.html' }
  ]
});
