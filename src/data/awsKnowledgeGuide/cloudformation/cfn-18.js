import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-18",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Cross-Account and Cross-Region StackSets",
  "status": "ready",
  "plainEnglish": "Cross-Account and Cross-Region StackSets represent the advanced multi-target deployment model of CloudFormation StackSets. By establishing trust between an administration account and target accounts (or using AWS Organizations service-managed permissions), CloudFormation securely assumes permissions in each target account to provision stacks in parallel across specified AWS Regions. You can define fine-grained rollout parameters, such as maximum concurrent account percentage and failure tolerance limits, to control deployment speed and safety.",
  "whyItMatters": "Enterprise cloud management requires deploying infrastructure globally while maintaining blast-radius control. Setting deployment parameters ensures that if a stack update fails in one Region or account, the StackSet halts further rollout immediately before affecting remaining global environments.",
  "workplaceExample": "An enterprise cloud engineering team deploys a centralized GuardDuty monitoring integration across 30 member accounts in 5 AWS Regions. They configure the StackSet to update 10% of accounts concurrently with a failure tolerance of 2 accounts, ensuring safe global deployment.",
  "examFocus": "For SAA-C03, understand the two permission models for StackSets: Service-Managed (AWS Organizations handles IAM cross-account roles automatically) and Self-Managed (requires manual creation of AWSCloudFormationStackSetAdministrationRole in admin account and AWSCloudFormationStackSetExecutionRole in target accounts). Know concurrency controls: Max Concurrent Accounts and Failure Tolerance.",
  "keyPoints": [
    "Deploys resources across multiple AWS accounts and Regions from a single master template.",
    "Service-Managed mode uses AWS Organizations to manage IAM trust and cross-account access automatically.",
    "Self-Managed mode relies on explicitly created IAM administration and execution roles across accounts.",
    "Concurrency settings (MaxConcurrentCount or MaxConcurrentPercentage) control parallel account updates.",
    "FailureTolerance specifies how many account stack instance failures are allowed before halting the operation."
  ],
  "commonMistake": "Forgetting to provision the target execution roles (AWSCloudFormationStackSetExecutionRole) when using Self-Managed StackSets, causing cross-account stack operations to fail with access denied errors. Use Service-Managed permissions with AWS Organizations for automated IAM management.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Centralized CloudWatch log group template for multi-region StackSet rollout.\nResources:\n  CentralLogGroup:\n    Type: AWS::Logs::LogGroup\n    Properties:\n      LogGroupName: /aws/organization/centralized-audit-logs\n      RetentionInDays: 365",
  "sources": [
    {
      "title": "Prerequisites for StackSets (Self-Managed)",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html"
    },
    {
      "title": "StackSet Deployment Options and Operations",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html#stacksets-concepts-operations"
    }
  ]
});
