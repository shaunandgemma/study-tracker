import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-13',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Policy Evaluation Logic',
  status: 'ready',
  plainEnglish: 'AWS IAM Policy Evaluation Logic is the decision engine used by AWS to evaluate request authorization. By default, all requests are implicitly denied (Default Deny). When a request is made, AWS evaluates all applicable policies (Identity Policies, Resource Policies, Permissions Boundaries, Service Control Policies, and Session Policies). The decision rule is simple: if an Explicit Deny exists anywhere, the request is DENIED. Otherwise, if an applicable Explicit Allow exists, the request is ALLOWED. If no allow exists, it remains DENIED (Implicit Deny).',
  whyItMatters: 'Understanding evaluation logic prevents security misconfigurations and helps troubleshoot why a legitimate user request fails or why an unwanted action was allowed.',
  workplaceExample: 'An engineer has an identity policy allowing `s3:*`. However, an AWS Organizations Service Control Policy (SCP) attached to their account contains an explicit deny for `s3:DeleteBucket`. When the engineer attempts to delete a bucket, IAM evaluation logic triggers the Explicit Deny rule and blocks the operation.',
  examFocus: 'SAA-C03 Policy Evaluation Order:\n1. Default State: Implicit Deny.\n2. Evaluate all applicable policies (Identity, Resource, Boundaries, SCPs, Session Policies).\n3. Is there an EXPLICIT DENY? -> YES: Result is DENIED.\n4. Is there an EXPLICIT ALLOW? -> YES: Result is ALLOWED.\n5. Otherwise -> Result is DENIED (Implicit Deny).',
  keyPoints: [
    'Default state for all requests is Implicit Deny.',
    'An Explicit Deny in ANY applicable policy instantly overrides all ALLOWs.',
    'An Explicit Allow grants permission ONLY if no Explicit Deny exists.',
    'Evaluates Identity Policies, Resource Policies, Boundaries, SCPs, and Session Policies.',
    'Access is allowed only when an explicit Allow is present and no explicit Deny applies.'
  ],
  commonMistake: 'Expecting an Identity-Based ALLOW to grant access when an Organizations Service Control Policy (SCP) or Permissions Boundary explicitly denies the action.',
  example: 'Evaluation Flow Decision:\nImplicit Deny (Default) -> Check SCPs -> Check Permissions Boundaries -> Check Identity/Resource Policies -> Explicit Deny Found? (DENY) -> Explicit Allow Found? (ALLOW) -> No Allow (DENY).',
  sources: [
    { title: 'Policy evaluation logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }
  ]
});
