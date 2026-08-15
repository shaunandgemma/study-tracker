import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-10",
  "title": "Microsoft Active Directory Integration",
  "plainEnglish": "AWS IAM Identity Center supports Microsoft Active Directory (AD) as an authoritative identity source using AWS Directory Service. Organizations can connect either an AWS Managed Microsoft AD domain in the cloud or an on-premises Active Directory domain via AD Connector, allowing corporate domain users and security groups to sign into AWS accounts using their existing Active Directory credentials.",
  "whyItMatters": "Many traditional enterprises run their core workforce directory on Microsoft Active Directory and manage permissions using AD Security Groups (e.g., 'Domain Admins', 'Finance-Users'). Connecting Active Directory to IAM Identity Center lets enterprises leverage their established on-premises AD investments, password policies, and security groups without needing to replicate users into third-party cloud directories.",
  "workplaceExample": "A manufacturing enterprise maintains an on-premises Active Directory forest. They establish an AWS Direct Connect link to their AWS VPC and deploy an AWS Directory Service AD Connector. In IAM Identity Center, they select Active Directory as the identity source. All 2,000 corporate domain users can immediately sign into AWS accounts through the access portal using their corporate Windows domain credentials.",
  "examFocus": "Know the two primary ways to connect Active Directory to IAM Identity Center: (1) AWS Managed Microsoft AD (a fully managed Active Directory running in AWS, with optional two-way trusts to on-premises AD), or (2) AD Connector (a lightweight proxy that redirects directory requests to an existing on-premises Active Directory without caching credentials in the cloud).",
  "keyPoints": [
    "Connects Microsoft Active Directory as the identity source via AWS Directory Service.",
    "Supports AWS Managed Microsoft AD (hosted in AWS) and AD Connector (proxy to on-premises Active Directory).",
    "Users sign in using their standard corporate Active Directory usernames (sAMAccountName or UPN) and passwords.",
    "Active Directory Security Groups are automatically synchronized and can be assigned directly to permission sets across AWS accounts.",
    "Enforces on-premises AD password expiration policies, account lockouts, and Kerberos/RADIUS multi-factor authentication.",
    "Eliminates the need for separate SAML federation appliances (like ADFS) for AWS account access."
  ],
  "commonMistake": "Attempting to change user attributes (like email addresses or display names) in the IAM Identity Center console when Active Directory is the identity source. When AD is connected, all user and group attribute modifications must be made directly within Active Directory.",
  "example": "Deploy an AWS Directory Service AD Connector in your VPC pointing to on-premises domain controllers, navigate to IAM Identity Center settings, change the identity source to Active Directory, and select the AD Connector directory.",
  "sources": [
    {
      "title": "Connect to Microsoft Active Directory in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-ad.html"
    },
    {
      "title": "What is AWS Directory Service?",
      "url": "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/what_is.html"
    }
  ]
});
