import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-3",
  "title": "Permission Sets & Automated Multi-Account Assignment",
  "plainEnglish": "A Permission Set in AWS IAM Identity Center is a centrally managed template defining AWS permissions and session configurations. When an administrator assigns a permission set to a user or group across designated AWS accounts or Organizational Units (OUs), IAM Identity Center automatically provisions corresponding IAM roles and policies inside every target account behind the scenes.",
  "whyItMatters": "In a large multi-account AWS environment, manually creating, attaching, and maintaining identical IAM roles and policies across hundreds of individual accounts is error-prone and leads to configuration drift. Permission sets allow administrators to define permissions once in IAM Identity Center, automatically deploying and updating the underlying IAM roles in all target accounts simultaneously.",
  "workplaceExample": "A cloud security architect creates a 'SecurityAuditor' permission set containing the AWS-managed policy SecurityAudit, an inline policy granting ReadOnly access to specific S3 compliance buckets, and an 8-hour session duration. They assign this permission set to the 'SecOps-Auditors' group across the entire 'Production-OUs' tree (40 accounts). IAM Identity Center automatically provisions the corresponding IAM role in all 40 accounts in minutes.",
  "examFocus": "Understand how permission sets work: A permission set is a template combining AWS-managed policies, customer-managed policies, inline policies, and optional permissions boundaries. It only becomes active in an account when combined with an Account Assignment (pairing a User or Group + Permission Set + AWS Account/OU). Updating a permission set automatically triggers role re-provisioning across all assigned accounts.",
  "keyPoints": [
    "A Permission Set is a centralized template of IAM policies, permissions boundaries, session duration, and relay state.",
    "Can combine AWS managed policies (e.g., ReadOnlyAccess), customer managed policy references, and custom inline policy JSON.",
    "When assigned to an account, IAM Identity Center automatically provisions an IAM role (prefixed with 'AWSReservedSSO_') in that target account.",
    "Account assignments can target individual AWS accounts or entire Organizational Units (OUs) within AWS Organizations.",
    "Modifying a permission set automatically re-provisions the underlying IAM roles across all assigned accounts to keep permissions in sync.",
    "Session duration can be configured between 15 minutes and 12 hours depending on security and operational requirements."
  ],
  "commonMistake": "Assuming that creating a permission set immediately grants permissions to users. A permission set by itself does nothing until you create an Account Assignment linking the permission set to specific users/groups and specific AWS accounts or OUs.",
  "example": "Create a permission set via AWS CLI: aws sso-admin create-permission-set --instance-arn arn:aws:sso:::instance/ssoins-123456789 --name 'DatabaseAdmin' --session-duration PT4H, attach policies to it, and assign it to the 'DBA-Team' group on production accounts.",
  "sources": [
    {
      "title": "Permission Sets in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"
    },
    {
      "title": "Assigning User Access to AWS Accounts",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/user-mgmt.html"
    }
  ]
});
