import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-8",
  "title": "Organization Sharing without Invitations",
  "plainEnglish": "Organization Sharing without Invitations is the default behavior in AWS RAM when sharing resources within your own AWS Organization after enabling Trusted Access. When a resource share specifies member accounts, Organizational Units (OUs), or the entire organization as principals, AWS RAM bypasses the formal invitation handshake completely, granting immediate access to the shared resources without requiring any manual approval or CLI command from consumer accounts.",
  "whyItMatters": "Manual invitation acceptance introduces administrative friction that breaks automated cloud provisioning workflows. By enabling organization sharing without invitations, platform teams can dynamically share VPC subnets, AWS Transit Gateways, and Route 53 Resolver rules with newly created accounts instantly during automated CI/CD and account vending processes.",
  "workplaceExample": "A DevOps platform uses an automated Terraform pipeline to provision 10 new developer sandbox accounts inside an AWS Organization. Because the central networking account shares development VPC subnets with the `Sandbox-OU` via RAM (and organization sharing is enabled), each new account immediately discovers the shared subnets in the Amazon VPC console upon creation, allowing developers to deploy test workloads with zero onboarding delays.",
  "examFocus": "Understand the conditions required for invitation-free sharing: (1) AWS Organizations Feature Set: Organizations MUST have 'All features' enabled (not Consolidated Billing only). (2) Trusted Access: The management account must execute `EnableSharingWithAwsOrganization`. (3) Principal Scope: The target principal must be a valid account ID, OU ARN, or Organization ARN belonging to the same organization.",
  "keyPoints": [
    "Eliminates the invitation and acceptance workflow when sharing within your AWS Organization.",
    "Requires 'All features' enabled in AWS Organizations and Trusted Access enabled for AWS RAM.",
    "Shared resources become visible and accessible to consumer accounts immediately upon share association.",
    "Supports seamless automated account provisioning pipelines (such as AWS Control Tower Account Factory).",
    "Does not generate email notifications or pending invitation records in member accounts.",
    "Member accounts cannot opt out or reject resources shared with them from within their organization."
  ],
  "commonMistake": "Thinking that organization sharing works when AWS Organizations is in 'Consolidated Billing Only' mode. Trusted Access for AWS RAM requires AWS Organizations to have 'All features' enabled.",
  "example": "Verify that organization sharing is active by checking the status of AWS RAM trusted access in your organization using the AWS CLI: aws organizations list-aws-service-access-for-organization --query 'EnabledServicePrincipals[?ServicePrincipal==`ram.amazonaws.com`]'.",
  "sources": [
    {
      "title": "Sharing Resources with AWS Organizations",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html#getting-started-sharing-orgs"
    },
    {
      "title": "Sharing AWS Resources with AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/share-resources.html"
    }
  ]
});
