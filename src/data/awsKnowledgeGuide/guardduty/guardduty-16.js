import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-16",
  "title": "Delegated Administrator",
  "plainEnglish": "A Delegated Administrator in Amazon GuardDuty is a designated member account in an AWS Organization that is granted full administrative authority to manage GuardDuty across all member accounts. Instead of using the high-privilege AWS Organizations management (payer/root) account for everyday security operations, AWS security best practice dictates delegating GuardDuty administration to a dedicated security tooling or SecOps account.",
  "whyItMatters": "Using the AWS Organizations management account for daily security monitoring violates the security principle of least privilege and increases operational blast radius. Designating a delegated administrator isolates security operations, allows security teams to manage GuardDuty detectors and member accounts without needing access to root billing or organizational control policies, and streamlines multi-account governance.",
  "workplaceExample": "An enterprise Cloud Architecture team uses AWS Control Tower. From the AWS Organizations management account, they execute EnableOrganizationAdminAccount for GuardDuty, specifying the Account ID of their dedicated 'Security-Tooling' member account. The security engineering team logs into this Security-Tooling account daily to review findings, configure custom threat intelligence sets, and manage protection plan settings across 80 business unit accounts.",
  "examFocus": "Know that the AWS Organizations Management account designates the Delegated Administrator using the GuardDuty or Organizations API (EnableOrganizationAdminAccount / enable-organization-admin-account). Remember that delegation is Regional and must be executed in each active AWS Region. The delegated administrator can enable/disable GuardDuty on member accounts and configure S3, EKS, RDS, and Malware protection plans.",
  "keyPoints": [
    "Follows the AWS security best practice of separating security operations from the Organizations management account.",
    "The Organizations management account assigns delegation to a specific 12-digit AWS member account ID per Region.",
    "The delegated administrator account manages member account enablement, disassociation, and auto-enablement settings.",
    "Can enable and manage optional protection features (S3 Protection, EKS Protection, RDS Protection, Lambda Protection, Malware Protection, Runtime Monitoring) for all member accounts.",
    "Has centralized visibility to view and search findings generated across all organization member accounts in that Region.",
    "Manages organizational Trusted IP Lists, Threat Intelligence Sets, and finding export configurations centrally."
  ],
  "commonMistake": "Configuring the delegated administrator in only the primary Region (e.g., us-east-1) and expecting it to manage GuardDuty across other Regions. Delegated administration must be registered in every AWS Region where GuardDuty will be operated.",
  "example": "Designate a delegated administrator from the Organizations management account via AWS CLI: aws guardduty enable-organization-admin-account --admin-account-id 111122223333 --region us-east-1.",
  "sources": [
    {
      "title": "Designating a GuardDuty Delegated Administrator",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_organizations.html#guardduty_delegated_admin"
    },
    {
      "title": "Delegated Administrator Permissions in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_admin_member.html"
    }
  ]
});
