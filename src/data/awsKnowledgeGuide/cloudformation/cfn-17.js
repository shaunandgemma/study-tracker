import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-17",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Stack Sets",
  "status": "ready",
  "plainEnglish": "An AWS CloudFormation StackSet extends the capability of standard CloudFormation stacks by allowing you to create, update, or delete stacks across multiple AWS accounts and multiple AWS Regions from a single centralized administration account. Using a single template, a StackSet automatically provisions identical stack instances into target accounts, enforcing consistent security baseline configurations, IAM roles, or logging infrastructure enterprise-wide.",
  "whyItMatters": "Large organizations operate hundreds of AWS accounts across global regions. Manually deploying security tools, AWS Config rules, or IAM roles into every account and Region individually is slow and prone to drift. StackSets automate multi-account management from a central hub.",
  "workplaceExample": "A central security team uses a StackSet to deploy an IAM security audit role and CloudTrail logging configuration into 50 AWS accounts across us-east-1, us-west-2, and eu-central-1 simultaneously with automatic auto-deployment enabled for new accounts.",
  "examFocus": "For SAA-C03, compare single CloudFormation Stacks with StackSets. A standard Stack operates within a single account and single Region. A StackSet deploys stack instances across multiple target AWS accounts and AWS Regions simultaneously. Know that StackSets integrate natively with AWS Organizations for automatic provisioning when new accounts join an OU.",
  "keyPoints": [
    "StackSets deploy CloudFormation stacks across multiple AWS accounts and Regions from a central admin account.",
    "Integrates with AWS Organizations to automatically deploy stacks into new target accounts added to an OU.",
    "Managed using Service-Managed permissions (AWS Organizations) or Self-Managed permissions (custom IAM roles).",
    "Concurrent deployment options (Max Concurrent Accounts, Failure Tolerance) control multi-region rollout speed and safety.",
    "Centralized updates automatically propagate template changes across all deployed stack instances worldwide."
  ],
  "commonMistake": "Trying to manually run aws cloudformation create-stack in 100 individual target accounts one by one instead of creating a single StackSet with AWS Organizations integration. Use StackSets for multi-account governance and baseline deployments.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Security baseline template suitable for multi-account StackSet deployment.\nResources:\n  SecurityAuditRole:\n    Type: AWS::IAM::Role\n    Properties:\n      RoleName: CentralSecurityAuditRole\n      AssumeRolePolicyDocument:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: !Sub 'arn:aws:iam::${AWS::AccountId}:root'\n            Action: sts:AssumeRole\n      ManagedPolicyArns:\n        - arn:aws:iam::aws:policy/SecurityAudit",
  "sources": [
    {
      "title": "Working with AWS CloudFormation StackSets",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html"
    },
    {
      "title": "StackSets Concepts",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html"
    }
  ]
});
