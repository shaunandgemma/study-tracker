import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-12',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Inline Policies',
  status: 'ready',
  plainEnglish: 'An IAM Inline Policy is a JSON permissions policy embedded directly into a single specific IAM identity (an IAM User, IAM Group, or IAM Role). Unlike Managed Policies, an Inline Policy maintains a strict 1-to-1 relationship with its parent identity: it cannot be shared with or attached to any other identity, and if the parent identity is deleted, the inline policy is deleted along with it.',
  whyItMatters: 'Inline policies guarantee that a specific set of permissions can never be accidentally attached to any other user or role. They are used when permissions are strictly unique to a single specialized identity.',
  workplaceExample: 'A DevOps engineer embeds an Inline Policy inside a single specialized deployment role (`CodePipelineDeployerRole`). The policy contains strict, unique permissions for deploying a specific CloudFormation stack. No other role can ever share or inherit this inline policy.',
  examFocus: 'SAA-C03 Inline Policy Characteristics:\n- Strict 1-to-1 relationship with parent IAM User, Group, or Role.\n- Cannot be shared or re-attached to other identities.\n- Deleted automatically when the parent identity is deleted.\n- Best practice: Prefer Customer Managed Policies over Inline Policies for reusability, auditing, and version control.',
  keyPoints: [
    'Policy embedded directly into a single IAM User, Group, or Role.',
    'Strict 1-to-1 binding (cannot be re-used across multiple identities).',
    'Automatically deleted if the parent IAM identity is deleted.',
    'Useful for strict 1-to-1 permission isolation.',
    'Lacks independent version control compared to Managed Policies.'
  ],
  commonMistake: 'Overusing Inline Policies for common permissions across dozens of users, forcing administrators to update 50 separate inline policies manually whenever a permission changes.',
  example: 'Putting an Inline Policy on a Role via AWS CLI:\naws iam put-role-policy --role-name CodePipelineDeployerRole --policy-name UniqueDeployPermissions --policy-document file://inline-policy.json',
  sources: [
    { title: 'Managed policies and inline policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html' }
  ]
});
