import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-2",
  "title": "Integration with AWS Organizations for automated multi-account sharing",
  "plainEnglish": "Integration with AWS Organizations allows AWS RAM to share resources seamlessly with individual member accounts, specific Organizational Units (OUs), or your entire AWS Organization without sending manual email invitations or requiring consumer accounts to accept invitations. Once Trusted Access is enabled in AWS Organizations, shared resources appear automatically in the AWS Management Consoles and APIs of authorized member accounts.",
  "whyItMatters": "Manually sharing resources and approving invitations across dozens or hundreds of AWS accounts is error-prone and unscalable. Integrating AWS RAM with AWS Organizations automates account provisioning: when a new AWS account is created or moved into an Organizational Unit (e.g., via AWS Control Tower Account Factory), it automatically inherits access to all shared VPC subnets, Transit Gateways, and Route 53 rules attached to that OU.",
  "workplaceExample": "An enterprise multi-account environment defines an Organizational Unit named `OU-Workloads`. The cloud infrastructure team shares a corporate Transit Gateway and central Route 53 Resolver rules with `arn:aws:organizations::111122223333:ou/o-abc123456/ou-12345678`. Whenever a new application account is vended into `OU-Workloads`, the account immediately discovers and uses the shared network resources with zero manual onboarding tickets.",
  "examFocus": "Understand AWS Organizations integration prerequisites and behavior: (1) Trusted Access: Must enable Trusted Access for AWS RAM from the Organizations management account (`ram:EnableSharingWithAwsOrganization`). (2) Principal Types: You can specify an entire Organization ARN (`arn:aws:organizations::...:organization/o-xxx`), an Organizational Unit ARN (`arn:aws:organizations::...:ou/...`), or a specific account ID. (3) No Invitations: Shares within the organization take effect immediately without invitation acceptance.",
  "keyPoints": [
    "Enables automatic resource sharing across AWS Organizations without requiring invitation acceptance.",
    "Requires enabling Trusted Access for AWS RAM in the AWS Organizations management account.",
    "Allows targeting principals at three granular scopes: entire Organization, specific OUs, or individual accounts.",
    "Newly vended accounts placed into an OU automatically inherit all resource shares associated with that OU.",
    "Disabling 'Allow external principals' ensures resources cannot be accidentally shared outside the organization.",
    "Managed centrally with delegated administration support, allowing member accounts to manage shares."
  ],
  "commonMistake": "Attempting to share resources with an Organizational Unit ARN before enabling Trusted Access for AWS RAM in AWS Organizations. Without trusted access enabled, RAM will fail to resolve the OU and return an error.",
  "example": "Enable organization-wide sharing in AWS RAM using the AWS CLI: aws ram enable-sharing-with-aws-organization.",
  "sources": [
    {
      "title": "Sharing Resources with AWS Organizations in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html#getting-started-sharing-orgs"
    },
    {
      "title": "AWS Services That You Can Use with AWS Organizations: AWS RAM",
      "url": "https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-ram.html"
    }
  ]
});
