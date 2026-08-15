import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-8',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Organization Root',
  status: 'ready',
  plainEnglish: 'The Organization Root (or Root container) is the parent container at the very top of the AWS Organizations hierarchy. When you create an organization, AWS automatically creates the Root. All Organizational Units (OUs) and member accounts sit beneath the Root container. Policies attached to the Root apply to all member accounts across the entire organization.',
  whyItMatters: 'Understanding the Root container is crucial for global governance. Attaching a Service Control Policy to the Root enforces global security baselines (e.g. denying unapproved AWS Regions) across every single member account simultaneously.',
  workplaceExample: 'A global cloud team attaches a Root SCP that blocks all AWS API calls in non-approved geographical Regions (e.g. denying all actions outside `us-east-1` and `eu-west-1`). This restriction cascades down through every OU and member account.',
  examFocus: 'SAA-C03 Root Container Concepts:\n- Organization Root vs Root User: The Organization Root is a structural container (`r-a1b2`), NOT an IAM user or account root user.\n- Default Policy Attachment: New organizations have the `FullAWSAccess` SCP attached to the Root by default.\n- Global Scope: Policies attached to the Root apply universally across all OUs and member accounts (except the Management Account).\n- Identifier Format: Organization Root IDs begin with `r-` followed by 4 to 32 alphanumeric characters.',
  keyPoints: [
    'Top-level structural container automatically created with every organization.',
    'Parent of all Organizational Units and member accounts in the hierarchy.',
    'Policies attached to the Root cascade down to all member accounts globally.',
    'Organization Root (`r-a1b2`) is distinct from an individual account root user.',
    'Pre-attached with the default `FullAWSAccess` policy when All-Features mode is enabled.'
  ],
  commonMistake: 'Confusing the structural Organization Root container (`r-a1b2`) with the root user login credentials of an AWS account.',
  example: 'Listing Organization Roots via AWS CLI:\naws organizations list-roots',
  sources: [
    { title: 'AWS Organizations terminology and concepts', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html#root' }
  ]
});
