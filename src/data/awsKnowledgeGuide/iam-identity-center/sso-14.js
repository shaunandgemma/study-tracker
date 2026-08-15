import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-14",
  "title": "Assignment of Permission Sets to Accounts",
  "plainEnglish": "An Account Assignment in AWS IAM Identity Center is the binding mechanism that connects a Principal (a User or Group), a Permission Set (the policy template), and a Target (a specific AWS Account or an Organizational Unit). When an administrator creates an account assignment, IAM Identity Center automatically provisions the corresponding IAM role in the target account and establishes the trust relationship required for users to assume that role.",
  "whyItMatters": "Creating a permission set alone does not grant access to anyone. The Account Assignment is the critical step that authorizes workforce identities to use those permissions in specific AWS accounts. Assigning permission sets to Organizational Units (OUs) automates governance by ensuring that any new account added to the OU automatically receives the required roles without manual administrative overhead.",
  "workplaceExample": "A cloud platform engineer assigns the 'DevOpsEngineer' permission set to the 'DevOps-Group' on the 'Workloads-Staging' Organizational Unit containing 15 accounts. IAM Identity Center processes the assignment and provisions the 'AWSReservedSSO_DevOpsEngineer_xxxx' role in all 15 accounts. When a 16th account is added to the OU next month, IAM Identity Center automatically provisions the role in the new account.",
  "examFocus": "Understand the three components of an Account Assignment: (1) Principal (User or Group—prefer Group), (2) Permission Set (template defining policies and session duration), and (3) Target (AWS Account ID or Organizational Unit ID). Remember that removing an account assignment automatically deletes or disables the provisioned IAM role from the target account.",
  "keyPoints": [
    "An Account Assignment is the 3-way association: Principal (User/Group) + Permission Set + Target (Account/OU).",
    "Targeting an Organizational Unit (OU) automatically applies the assignment to all existing and future member accounts within that OU.",
    "IAM Identity Center automatically creates, manages, and cleans up the underlying IAM roles in target accounts.",
    "Removing an account assignment automatically removes access and deletes the corresponding IAM role if no other assignments require it.",
    "Assignments can be configured and automated using AWS CloudFormation, AWS CDK, Terraform, or the AWS CLI (sso-admin API).",
    "Allows different groups to have different permission sets in the same account (e.g., Developers get ReadOnlyAccess in Prod, but PowerUserAccess in Dev)."
  ],
  "commonMistake": "Creating a permission set and expecting users to see it in the AWS access portal without creating an Account Assignment. Users will only see accounts and roles in the portal once an explicit Account Assignment is created.",
  "example": "Create an account assignment using AWS CLI: aws sso-admin create-account-assignment --instance-arn arn:aws:sso:::instance/ssoins-123456789 --target-id 111122223333 --target-type AWS_ACCOUNT --permission-set-arn arn:aws:sso:::permissionSet/ssoins-1234/ps-56789 --principal-type GROUP --principal-id 9067000000-xxxx.",
  "sources": [
    {
      "title": "Assign User Access to AWS Accounts in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/user-mgmt.html"
    },
    {
      "title": "Permission Sets and Account Assignments",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"
    }
  ]
});
