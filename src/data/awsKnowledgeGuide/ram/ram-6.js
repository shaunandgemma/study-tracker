import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-6",
  "title": "Sharing Resources within AWS Organizations",
  "plainEnglish": "Sharing Resources within AWS Organizations allows a central resource owner account to share AWS resources across the entire corporate organization or targeted Organizational Units (OUs). Because AWS RAM integrates directly with AWS Organizations trusted access, permissions are granted automatically to all current and future member accounts within the targeted OU hierarchy without requiring individual account invitations or manual approvals.",
  "whyItMatters": "As enterprise cloud footprints grow to hundreds of AWS accounts, managing individual account permissions becomes impossible. Sharing at the Organizational Unit level enables automated infrastructure vending: when a new microservice account is launched in the 'Production' OU, it automatically inherits network subnets, Transit Gateways, and corporate license configurations instantly.",
  "workplaceExample": "A central cloud networking team attaches an AWS Transit Gateway and corporate Route 53 Resolver rules to an AWS RAM share. They set the principal target to `arn:aws:organizations::111122223333:ou/o-abc123456/ou-workloads`. Whenever a development team requests a new AWS account through Control Tower, the newly created account lands in `ou-workloads` and immediately possesses connectivity to the corporate network.",
  "examFocus": "Understand organization-level principal targeting: (1) Organization ARN (`arn:aws:organizations::...:organization/o-xxx`): Shares with every account in the organization. (2) Organizational Unit ARN (`arn:aws:organizations::...:ou/.../ou-xxx`): Shares with all accounts nested under that OU (including nested child OUs). (3) Inheritance: Adding an account to an OU automatically grants it access; removing an account automatically revokes access.",
  "keyPoints": [
    "Targets entire Organizations or specific Organizational Units (OUs) rather than individual 12-digit account IDs.",
    "Eliminates manual account onboarding by automatically propagating resource access to new accounts.",
    "Moving an account out of an OU automatically revokes access to all resource shares targeting that OU.",
    "Setting `allowExternalPrincipals=false` guarantees resources cannot be shared outside the organization.",
    "Supported by AWS Control Tower and Landing Zone automated account vending pipelines.",
    "Reduces administrative overhead by managing a single resource share association per OU."
  ],
  "commonMistake": "Sharing with the entire organization ARN (`o-xxx`) when resources should only be available to non-production or production environments. Always target specific Organizational Units (e.g., `ou-dev` vs `ou-prod`) to maintain strict environmental isolation.",
  "example": "Associate an Organizational Unit with an existing resource share using the AWS CLI: aws ram associate-resource-share --resource-share-arn arn:aws:ram:us-east-1:111122223333:resource-share/abcd-1234 --principals arn:aws:organizations::111122223333:ou/o-abc123456/ou-prod-12345.",
  "sources": [
    {
      "title": "Sharing Resources with AWS Organizations",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/getting-started-sharing.html#getting-started-sharing-orgs"
    },
    {
      "title": "Working with Principals in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-principals.html"
    }
  ]
});
