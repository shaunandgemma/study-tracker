import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "budgets-12",
  "topicId": "topic-budgets",
  "topicTitle": "AWS Budgets",
  "objectiveCode": "Management",
  "title": "Budget Actions",
  "status": "ready",
  "plainEnglish": "Budget Actions allow AWS Budgets to automatically take corrective action on your AWS infrastructure whenever a budget threshold is exceeded, rather than just sending passive email notifications. A Budget Action can automatically apply an IAM policy (such as attaching a policy to an IAM user, group, or role that denies further resource provisioning), apply a Service Control Policy (SCP) at the AWS Organizations level, or automatically stop running Amazon EC2 instances or Amazon RDS database instances within a target region.",
  "whyItMatters": "Passive email alerts can easily be missed or ignored over weekends, allowing a runaway workload or security breach to generate thousands of dollars in unwanted charges. Budget Actions provide automated cost enforcement that immediately curbs spending when critical thresholds are breached.",
  "workplaceExample": "A university computer science lab gives students AWS sandbox accounts with a $100 monthly budget. They configure a Budget Action on the 100% threshold: when a student account hits $100, the action automatically attaches an IAM policy denying `ec2:RunInstances` and `rds:CreateDBInstance`, preventing unexpected charges while keeping existing work accessible.",
  "examFocus": "For SAA-C03, know the three types of automated Budget Actions: (1) Apply IAM Policy (restricts permissions for users/groups/roles), (2) Apply Service Control Policy (SCP in AWS Organizations), and (3) Stop EC2 or RDS instances (targets specific instances or all instances in a region). Actions can be executed automatically or require manual administrator approval.",
  "keyPoints": [
    "Executes automated actions when budget thresholds are breached to curb spending.",
    "Supports three action types: IAM Policy attachment, SCP attachment, and Target Instance stopping (EC2/RDS).",
    "Actions can run automatically or require manual one-click approval by an administrator.",
    "Requires an IAM service role granting AWS Budgets permissions to modify IAM, Organizations, or EC2/RDS.",
    "Provides active programmatic cost containment beyond passive notifications."
  ],
  "commonMistake": "Configuring a Budget Action that stops production EC2/RDS database instances on a 100% threshold. Stopping production databases causes immediate application outages for end users. Use Budget Actions with automated shutdowns on sandbox/development accounts, and use notifications or manual approval for production.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: AWS Budget Action stopping EC2 instances upon 100% budget breach.\nResources:\n  AutoStopAction:\n    Type: AWS::Budgets::BudgetsAction\n    Properties:\n      BudgetName: SandboxCostBudget\n      NotificationType: ACTUAL\n      ActionType: APPLY_IAM_POLICY\n      ActionThreshold:\n        Value: 100\n        Type: PERCENTAGE\n      ExecutionRoleArn: !GetAtt BudgetActionExecutionRole.Arn\n      ApprovalModel: AUTOMATIC\n      Definition:\n        IamActionDefinition:\n          PolicyArn: 'arn:aws:iam::aws:policy/AWSElementalMediaPackageReadOnly'\n          Roles:\n            - SandboxDeveloperRole",
  "sources": [
    {
      "title": "Configuring AWS Budget Actions",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html"
    },
    {
      "title": "AWS::Budgets::BudgetsAction CloudFormation Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budgetsaction.html"
    }
  ]
});
