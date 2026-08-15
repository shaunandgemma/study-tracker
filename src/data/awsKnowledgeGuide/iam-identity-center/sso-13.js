import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-13",
  "title": "Temporary AWS Account Credentials",
  "plainEnglish": "AWS IAM Identity Center provides short-term, temporary AWS security credentials (an Access Key ID, Secret Access Key, and Session Token) to workforce users for both AWS Management Console sessions and command-line (CLI) workflows. Instead of creating long-term, static IAM access keys that never expire, IAM Identity Center leverages AWS Security Token Service (STS) to generate credentials that automatically expire after a set duration.",
  "whyItMatters": "Static IAM access keys are one of the most common causes of major cloud security breaches when accidentally committed to public Git repositories or stored on unencrypted laptops. Temporary credentials drastically reduce the risk of credential exposure because even if a temporary token is intercepted, it becomes completely useless once its short lifetime expires.",
  "workplaceExample": "A software developer runs 'aws configure sso' on their local workstation to configure an SSO session named 'dev-session' pointing to their corporate access portal. When they run 'aws sso login', the AWS CLI opens their browser to authenticate with MFA. Upon approval, the CLI automatically caches short-term temporary STS credentials locally, allowing the developer to run 'aws s3 ls --profile dev-team' securely without ever seeing or handling static access keys.",
  "examFocus": "Understand how AWS CLI v2 integrates with IAM Identity Center: Run 'aws configure sso' to define the SSO start URL, SSO region, account ID, and permission set role name. Run 'aws sso login --profile <profile-name>' to authenticate via browser. Never recommend copying temporary tokens into static credentials files when native SSO session profiles are supported.",
  "keyPoints": [
    "Generates short-term temporary credentials (Access Key ID, Secret Access Key, Session Token) using AWS Security Token Service (STS).",
    "Eliminates the creation and management of long-term static IAM access keys for human workforce users.",
    "Session duration is configured on the permission set (ranging from 15 minutes to 12 hours) and enforced on every login.",
    "AWS CLI version 2 integrates natively using SSO sessions and automatic browser device authorization (OAuth 2.0 PKCE).",
    "Credentials are automatically cached in ~/.aws/sso/cache/ and automatically refreshed until the SSO session expires.",
    "AWS CloudTrail records the federated STS AssumeRoleWithSAML / SSO session identity on every API call for full auditability."
  ],
  "commonMistake": "Instructing developers to generate permanent IAM user access keys for local AWS CLI usage instead of configuring 'aws configure sso'. AWS security best practice explicitly mandates using IAM Identity Center temporary credentials for all workforce CLI access.",
  "example": "Configure an AWS CLI v2 SSO profile: run 'aws configure sso', enter the SSO session name (e.g., 'corp-sso'), SSO start URL (https://acme.awsapps.com/start), and SSO region (us-east-1). To authenticate daily, run 'aws sso login --sso-session corp-sso'.",
  "sources": [
    {
      "title": "Configuring the AWS CLI to Use AWS IAM Identity Center",
      "url": "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"
    },
    {
      "title": "Temporary Security Credentials in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/howtopermissionsets.html"
    }
  ]
});
