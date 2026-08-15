import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-5",
  "title": "Multi-Account AWS Access",
  "plainEnglish": "Multi-Account AWS Access in IAM Identity Center enables administrators to manage access to all AWS accounts within an organization from a single, centralized control plane. Through group-based assignments, administrators define which teams have access to which AWS accounts and with what level of permissions, without needing to configure individual IAM trust policies or switch-role configurations in each separate member account.",
  "whyItMatters": "In a multi-account organization, establishing direct cross-account IAM role trust relationships between every user and every target account requires complex IAM trust policies, manual cross-account role switching, and high maintenance overhead. IAM Identity Center abstracts this complexity into centralized account assignments that scale seamlessly across hundreds of AWS accounts.",
  "workplaceExample": "A company organizes its AWS accounts into three Organizational Units (OUs): 'CoreServices', 'Workloads-Dev', and 'Workloads-Prod'. An administrator assigns the 'Developers' group to the 'Workloads-Dev' OU with the 'DeveloperAccess' permission set, and the 'DevOps-Admins' group to both Dev and Prod OUs. As new workload accounts are added to either OU, access is automatically granted.",
  "examFocus": "Know that multi-account access in IAM Identity Center relies on AWS Organizations. Best practice is to assign permission sets to GROUPS rather than individual users, and to target Organizational Units (OUs) so that newly created member accounts inherit the appropriate assignments automatically. Understand that Service Control Policies (SCPs) act as a maximum permissions guardrail over all multi-account access.",
  "keyPoints": [
    "Centrally manages workforce permissions across all AWS accounts belonging to an AWS Organization.",
    "Best practice is to assign permission sets to User Groups rather than individual users to streamline onboarding and offboarding.",
    "Account assignments can target Organizational Units (OUs), ensuring new member accounts automatically inherit role assignments.",
    "Eliminates the need to configure manual cross-account IAM trust policies (sts:AssumeRole) in individual member accounts.",
    "Users can view all assigned accounts and roles in the AWS access portal and switch between accounts without re-entering credentials.",
    "All account access is constrained by Organizational Service Control Policies (SCPs) and permissions boundaries."
  ],
  "commonMistake": "Creating individual account assignments for hundreds of individual users across dozens of accounts. This creates administrative overhead and makes audits difficult; always organize users into groups and assign permission sets to groups.",
  "example": "Assign a permission set to a group across an entire OU via AWS CLI: aws sso-admin create-account-assignment --instance-arn arn:aws:sso:::instance/ssoins-123456789 --target-id ou-1234-567890ab --target-type ORGANIZATIONAL_UNIT --permission-set-arn arn:aws:sso:::permissionSet/ssoins-1234/ps-123456789 --principal-type GROUP --principal-id 9067000000-xxxx.",
  "sources": [
    {
      "title": "Managing Access to AWS Accounts in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-accounts.html"
    },
    {
      "title": "Organizing Accounts in AWS Organizations for IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/aws-org-concepts.html"
    }
  ]
});
