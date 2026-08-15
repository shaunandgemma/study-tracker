import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-7",
  "title": "Users and Groups",
  "plainEnglish": "Users and Groups in AWS IAM Identity Center represent the workforce identities and organizational units authorized to access AWS resources. Depending on the configured identity source, users and groups are either created directly within the built-in IAM Identity Center directory or synchronized automatically from external enterprise identity providers (like Okta or Microsoft Entra ID) using SCIM.",
  "whyItMatters": "Managing individual user permissions across dozens of AWS accounts leads to high administrative overhead, privilege creep, and onboarding/offboarding delays. Group-based access control allows administrators to assign permissions to groups (e.g., 'DataPlatform-Developers'); adding or removing a user from that group immediately updates their permissions across all target AWS accounts.",
  "workplaceExample": "A company establishes standard groups in IAM Identity Center: 'CloudArchitects', 'DataEngineers', and 'SecurityAuditors'. When a new data engineer joins the organization, an administrator adds them to the 'DataEngineers' group. The engineer instantly gains access to all development and staging analytics accounts with the pre-configured 'DataPipelineAdmin' permission set.",
  "examFocus": "Know that best practice is always group-based assignment (assigning permission sets to Groups rather than Users). Understand that user and group attributes (e.g., Department, CostCenter) can be mapped from external IdPs and used in Attribute-Based Access Control (ABAC) policies using principal tags (${aws:PrincipalTag/Department}).",
  "keyPoints": [
    "Workforce identities can be managed in the built-in directory or synchronized from external IdPs/Active Directory.",
    "Group-based assignment is the architectural best practice for scalable multi-account access control.",
    "Adding or removing a user from a group automatically grants or revokes their access to all accounts assigned to that group.",
    "Supports user attributes (e.g., email, department, cost center) mapped from SCIM or SAML assertions.",
    "Enables Attribute-Based Access Control (ABAC) where IAM policies evaluate session tags passed from user attributes.",
    "Users authenticate once to access all AWS accounts and cloud applications assigned to their user identity or groups."
  ],
  "commonMistake": "Assigning permission sets directly to individual user accounts rather than groups. Individual assignments become unmanageable as organizations scale and create severe risks of orphaned access when employees change roles.",
  "example": "Create a group in IAM Identity Center and add a user via AWS CLI: aws identitystore create-group --identity-store-id d-1234567890 --display-name 'SecOps-Team', then call create-group-membership to add the user to the group.",
  "sources": [
    {
      "title": "Managing Users in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/user-mgmt.html"
    },
    {
      "title": "Managing Groups in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/group-mgmt.html"
    }
  ]
});
