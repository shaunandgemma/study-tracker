import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-6",
  "title": "Permission Sets",
  "plainEnglish": "A Permission Set in AWS IAM Identity Center is a template of access policies and session settings that administrators create centrally. When assigned to an AWS account, IAM Identity Center automatically provisions a dedicated IAM role (prefixed with 'AWSReservedSSO_') inside that target account. Workforce users who assume this role inherit the permissions defined in the permission set.",
  "whyItMatters": "Permission sets eliminate the need to manually write and maintain identical IAM roles across hundreds of disparate AWS accounts. By configuring AWS managed policies, customer managed policies, inline policies, session durations, and permissions boundaries in a single central permission set, any updates are automatically pushed and synchronized to all assigned member accounts.",
  "workplaceExample": "A security operations team creates a 'NetworkEngineer' permission set. They attach the AWS-managed policy VPCFullAccess, reference a customer-managed policy 'DenyDirectInternetGatewayCreation' that exists in target accounts, and set a session duration of 2 hours. When assigned to the Networking group across 50 workload accounts, IAM Identity Center automatically provisions and maintains the corresponding IAM roles.",
  "examFocus": "Know the components of a permission set: (1) AWS Managed Policies (e.g., AdministratorAccess, ReadOnlyAccess), (2) Customer Managed Policy references (must exist with identical names in target accounts), (3) Inline Policies (custom JSON embedded in the permission set), (4) Permissions Boundaries (caps maximum permissions), and (5) Session Duration (15 minutes to 12 hours). Updating a permission set re-provisions roles in target accounts.",
  "keyPoints": [
    "Serves as a centralized template for IAM permissions and session properties managed in IAM Identity Center.",
    "Automatically provisions and manages IAM roles named 'AWSReservedSSO_<PermissionSetName>_<hash>' in target accounts.",
    "Supports combining AWS managed policies, customer managed policy references, and custom inline policy documents.",
    "Supports attaching an IAM Permissions Boundary to restrict the maximum permissions the resulting role can ever exercise.",
    "Configurable session durations range from a minimum of 15 minutes to a maximum of 12 hours.",
    "Supports Relay State, allowing users to land directly on a specific console URL (e.g., Amazon S3 or EC2 console) upon sign-in."
  ],
  "commonMistake": "Relying routinely on the AWS-managed AdministratorAccess policy in default permission sets. Best practice is to design distinct, least-privilege permission sets aligned with specific job functions (e.g., DevOpsEngineer, ReadOnlyAuditor, BillingManager).",
  "example": "Create a least-privilege permission set with an inline policy: aws sso-admin create-permission-set --instance-arn arn:aws:sso:::instance/ssoins-123456789 --name 'S3ReadOnly' --session-duration PT2H, then attach the AWS-managed AmazonS3ReadOnlyAccess policy.",
  "sources": [
    {
      "title": "Permission Sets in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"
    },
    {
      "title": "Managing Policies in Permission Sets",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html"
    }
  ]
});
