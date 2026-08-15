import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-iam-identity-center",
  "topicTitle": "AWS IAM Identity Center",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "sso-16",
  "title": "Permission Sets vs Service Control Policies",
  "plainEnglish": "Permission Sets in AWS IAM Identity Center and Service Control Policies (SCPs) in AWS Organizations are complementary security mechanisms that serve completely different purposes. Permission Sets GRANT specific permissions to workforce identities when they sign into AWS accounts. Service Control Policies (SCPs) DO NOT grant permissions; instead, they define organizational guardrails that set the maximum allowable permissions across accounts, preventing any identity (even an administrator) from performing restricted actions.",
  "whyItMatters": "Confusing permission sets with SCPs can cause security vulnerabilities or unexpected access denials. If an administrator assigns a permission set granting full S3 access, but an SCP in AWS Organizations denies s3:DeleteBucket across the OU, the user CANNOT delete S3 buckets because the SCP overrides and caps all permissions in that account.",
  "workplaceExample": "An enterprise attaches an SCP to its 'Production-OU' that denies 'ec2:StopInstances' and 'ec2:TerminateInstances' unless an MFA token is present, and denies all actions in unauthorized AWS regions (e.g., ap-northeast-3). A cloud engineer with an 'AdministratorAccess' permission set logs into a production account; even with full admin rights in the permission set, the SCP prevents them from operating in unauthorized regions.",
  "examFocus": "Know the fundamental distinction: (1) Permission Sets = GRANTING permissions (identity-based policies applied to provisioned roles for workforce users). (2) Service Control Policies (SCPs) = GUARDRAILS / FILTER (organization policies that set the boundary on the maximum permissions that can ever be exercised in an account). For an action to succeed, it must be explicitly ALLOWED by the permission set/IAM policy AND NOT DENIED by any attached SCP.",
  "keyPoints": [
    "Permission Sets grant access to specific actions and resources; SCPs define maximum allowed permission boundaries.",
    "SCPs do NOT grant any permissions by themselves; they filter and restrict what IAM policies and permission sets can do.",
    "SCPs affect ALL IAM users and roles in member accounts, including the account root user and IAM Identity Center roles.",
    "An explicit Deny in an SCP overrides any Allow in a permission set or IAM policy.",
    "Permission Sets are managed in AWS IAM Identity Center; SCPs are managed in AWS Organizations.",
    "Effective access is the intersection: an action is permitted only if allowed by the Permission Set AND permitted by the SCP hierarchy."
  ],
  "commonMistake": "Thinking that an SCP can grant an employee access to an S3 bucket or DynamoDB table without an IAM policy or permission set. SCPs only set guardrails; users still need an explicit Allow in a permission set or IAM policy to perform any action.",
  "example": "Attach an SCP at the Root OU level blocking unauthorized AWS regions: {\"Effect\": \"Deny\", \"NotAction\": [\"iam:*\", \"organizations:*\", \"route53:*\", \"sts:*\"], \"Resource\": \"*\", \"Condition\": {\"StringNotEquals\": {\"aws:RequestedRegion\": [\"us-east-1\", \"us-west-2\"]}}}, then assign a Developer permission set to developers.",
  "sources": [
    {
      "title": "Service Control Policies (SCPs) in AWS Organizations",
      "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html"
    },
    {
      "title": "Permission Sets in IAM Identity Center",
      "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html"
    }
  ]
});
