import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-9",
  "title": "RAM Principals",
  "plainEnglish": "A RAM Principal is the target entity authorized by a resource owner to access and consume shared AWS resources within an AWS RAM resource share. AWS RAM supports four distinct principal types depending on the scope of access required: (1) Individual AWS Account IDs (12-digit numbers), (2) Organizational Units (OUs), (3) Entire AWS Organizations, and (4) specific IAM Roles or IAM Users (for supported resource types).",
  "whyItMatters": "Selecting the appropriate principal type determines the administrative boundary and blast radius of your resource sharing strategy. Using broad principal scopes (like an Organization ARN) enables universal infrastructure sharing, while granular scopes (like individual account IDs or IAM roles) enforce strict principle of least privilege for sensitive workloads.",
  "workplaceExample": "A cloud architect applies tiered principal targeting across different resource shares: (1) Core corporate Route 53 Resolver rules are shared with the Entire Organization principal (`arn:aws:organizations::111122223333:organization/o-abc123456`), (2) Production VPC subnets are shared strictly with the Production OU (`arn:aws:organizations::...:ou/.../ou-prod`), and (3) A third-party security audit prefix list is shared strictly with an external vendor's specific 12-digit AWS Account ID.",
  "examFocus": "Know the supported RAM principal formats: (1) 12-digit Account ID: `123456789012` (internal or external account). (2) Organizational Unit (OU): `arn:aws:organizations::<mgmt-account>:ou/o-<org-id>/ou-<ou-id>`. (3) Entire Organization: `arn:aws:organizations::<mgmt-account>:organization/o-<org-id>`. (4) IAM Role / User: `arn:aws:iam::<account-id>:role/<role-name>` (supported only on specific resource types).",
  "keyPoints": [
    "Defines the consumer entity authorized to discover and interact with a resource share.",
    "Supports four principal categories: Account IDs, Organizational Units (OUs), Organizations, and IAM Roles/Users.",
    "Targeting an OU automatically includes all member accounts and nested child OUs under that branch.",
    "Targeting an entire Organization shares the resource globally across all accounts in the company.",
    "IAM Roles and Users can be specified directly as principals for certain resource types to enforce role-level scoping.",
    "Principals can be associated or disassociated from resource shares at any time via the console or CLI."
  ],
  "commonMistake": "Attempting to specify an IAM role as a principal for resource types that do not support role-level sharing (e.g., VPC subnets). VPC subnets must be shared with Account IDs, OUs, or Organizations, not individual IAM roles.",
  "example": "Associate multiple principal types (an individual account and an OU) with a resource share using the AWS CLI: aws ram associate-resource-share --resource-share-arn arn:aws:ram:us-east-1:111122223333:resource-share/abcd-1234 --principals 222233334444 arn:aws:organizations::111122223333:ou/o-abc123456/ou-stage.",
  "sources": [
    {
      "title": "Working with Principals in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-principals.html"
    },
    {
      "title": "Shareable AWS Resources and Supported Principals",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/shareable.html"
    }
  ]
});
