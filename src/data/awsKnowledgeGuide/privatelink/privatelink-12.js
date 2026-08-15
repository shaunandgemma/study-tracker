import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-12",
  "title": "VPC Endpoint Policies",
  "plainEnglish": "A VPC Endpoint Policy is an AWS Identity and Access Management (IAM) resource policy attached directly to a VPC Endpoint (both Gateway and Interface endpoints). It acts as an authoritative security perimeter filter that dictates which IAM principals, AWS actions, and specific resources are allowed to pass through the endpoint to the target AWS service, blocking all unauthorized requests regardless of the caller's IAM user permissions.",
  "whyItMatters": "Even if an EC2 instance or compromised employee has broad IAM permissions (like `s3:*` or `secretsmanager:*`), an attacker could use your private VPC connection to exfiltrate data to an external, attacker-controlled AWS account's S3 bucket or Secrets Manager repository. An endpoint policy enforces data perimeter protection, ensuring the endpoint can ONLY be used to access authorized internal corporate resources.",
  "workplaceExample": "A defense contractor configures an S3 Endpoint Policy on their VPC endpoint. The policy explicitly allows `s3:GetObject` and `s3:PutObject` strictly for the ARN `arn:aws:s3:::corporate-classified-data/*`. When an insider tries to use the AWS CLI from a private EC2 instance to upload classified files to their personal AWS account S3 bucket (`my-personal-bucket`), the VPC Endpoint Policy blocks the request with an HTTP 403 Access Denied error.",
  "examFocus": "Understand VPC Endpoint Policy evaluation logic: (1) Perimeter Filter: Does NOT grant permissions by itself; the calling principal must STILL have identity-based IAM permissions granted on their IAM role/user. (2) Default Policy: Newly created endpoints default to Full Access (`*` principal, `*` action, `*` resource). (3) Supported Endpoints: Supported on Gateway Endpoints (S3, DynamoDB) and many Interface Endpoints (S3, KMS, Secrets Manager, SQS, etc.). (4) Explicit Deny: An explicit deny in an endpoint policy overrides any allow.",
  "keyPoints": [
    "An IAM resource policy attached directly to a Gateway or Interface VPC Endpoint.",
    "Acts as an authorization guardrail controlling traffic flowing through the endpoint.",
    "Does not grant permissions on its own; requests must also be permitted by identity-based IAM policies.",
    "Defaults to Full Access (allowing all principals to perform all actions on all resources through the endpoint).",
    "Prevents data exfiltration by restricting access strictly to specific company-owned resource ARNs.",
    "Supports IAM Condition keys like `aws:PrincipalOrgID` to restrict endpoint usage to accounts within an AWS Organization."
  ],
  "commonMistake": "Believing that creating an Endpoint Policy eliminates the need for IAM policies on IAM roles. An endpoint policy is a filter that sets the maximum allowable boundary; if the calling IAM role lacks identity permissions for the action, the request will still be denied.",
  "example": "Attach an endpoint policy restricting S3 access strictly to accounts within a specific AWS Organization: {\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"s3:*\", \"Resource\": \"*\", \"Condition\": {\"StringEquals\": {\"aws:PrincipalOrgID\": \"o-1234567890\"}}}]}.",
  "sources": [
    {
      "title": "Controlling Access to Services with VPC Endpoints",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html"
    },
    {
      "title": "Identity and Access Management for AWS PrivateLink",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/security-iam.html"
    }
  ]
});
