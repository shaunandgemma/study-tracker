import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-13',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'SCP Inheritance',
  status: 'ready',
  plainEnglish: 'SCP Inheritance describes how Service Control Policies cascade down through the AWS Organizations tree hierarchy. Policies attached at the Organization Root automatically apply to all child Organizational Units (OUs) and member accounts. An account inherits all SCPs attached directly to it, plus all SCPs attached to its parent OUs and the Root container.',
  whyItMatters: 'Understanding inheritance prevents accidental lock-outs. To execute an action, the action must be allowed at EVERY level of the parent tree (Root -> Parent OU -> Child OU -> Account). An explicit Deny or lack of Allow at ANY level blocks the action.',
  workplaceExample: 'An account `prod-db` is located in `Workloads OU` -> `Production OU`. It inherits SCP-1 attached to Root, SCP-2 attached to `Workloads OU`, and SCP-3 attached to `Production OU`. An action is only permitted if allowed by all three parent SCPs.',
  examFocus: 'SAA-C03 SCP Inheritance & Intersection Rules:\n- Effective Permission Boundary: The intersection (AND operation) of all SCPs attached along the path from Root to the account.\n- Interruption of Access: Detaching `FullAWSAccess` at an intermediate OU blocks that service for ALL child accounts beneath that OU, even if attached at Root.\n- Moving Accounts: Moving an account from `OU-A` to `OU-B` immediately revokes policies from `OU-A` and applies policies from `OU-B`.',
  keyPoints: [
    'SCPs cascade down the hierarchy from Root to child OUs and member accounts.',
    'Effective guardrail is the intersection of all SCPs along the parent tree path.',
    'An explicit Deny at ANY parent level blocks the action for all downstream accounts.',
    'An action must be allowed at EVERY level from Root down to the specific account.',
    'Moving an account between OUs instantly updates its inherited policy boundaries.'
  ],
  commonMistake: 'Detaching the `FullAWSAccess` SCP from a parent OU without attaching a replacement Allow policy, accidentally blocking all AWS services for every account in child OUs.',
  example: 'SCP Inheritance Intersection:\n- Root SCP: Allows EC2, S3, RDS\n- Parent OU SCP: Allows EC2, S3\n- Member Account SCP: Allows EC2, DynamoDB\n- Effective Account Boundary: ONLY EC2 is permitted.',
  sources: [
    { title: 'SCP inheritance in AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_inheritance.html' }
  ]
});
