import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-19",
  "title": "S3 Bucket Policies",
  "plainEnglish": "An S3 Bucket Policy is an AWS Identity and Access Management (IAM) resource-based policy attached directly to an Amazon S3 bucket. Written in JSON syntax, a bucket policy defines granular access rules specifying which IAM principals (users, roles, external AWS accounts, or anonymous users) can perform specific S3 actions (such as `s3:GetObject` or `s3:PutObject`) on the bucket and its objects under specific conditions (such as requiring HTTPS or restricting access to specific VPC endpoints).",
  "whyItMatters": "Bucket policies provide centralized access management attached directly to your storage data, regardless of which IAM identity or external AWS account initiates the request. They are essential for enforcing mandatory security controls—such as denying unencrypted HTTP requests, restricting access to private VPCs, and managing cross-account data sharing.",
  "workplaceExample": "A cybersecurity team attaches a security hardening bucket policy to their corporate data lake. The policy contains two statements: (1) An explicit Deny on all S3 actions if `aws:SecureTransport` is `false` (enforcing end-to-end TLS/HTTPS encryption in transit), and (2) An explicit Deny on all requests that do not originate from their corporate VPC Endpoint (`aws:sourceVpce = vpce-01234567`).",
  "examFocus": "Understand Bucket Policy structure and key conditions: (1) Resource ARNs: Bucket-level actions (e.g., `s3:ListBucket`) require `arn:aws:s3:::bucket-name`; Object-level actions (e.g., `s3:GetObject`, `s3:PutObject`) require `arn:aws:s3:::bucket-name/*`. (2) Enforcing TLS: Use `Effect: Deny`, `Principal: *`, `Action: s3:*`, `Condition: {\"Bool\": {\"aws:SecureTransport\": \"false\"}}`. (3) VPC Restriction: Use `Condition: {\"StringNotEquals\": {\"aws:sourceVpce\": \"vpce-xxxx\"}}`.",
  "keyPoints": [
    "Resource-based IAM policy attached directly to an Amazon S3 bucket.",
    "Written in standard JSON format containing Statement, Effect, Principal, Action, Resource, and Condition.",
    "Bucket-level permissions use `arn:aws:s3:::bucket`; object-level permissions use `arn:aws:s3:::bucket/*`.",
    "Enforces mandatory security controls such as denying non-HTTPS traffic (`aws:SecureTransport`).",
    "Restricts access to specific VPC endpoints (`aws:sourceVpce`) or IP ranges (`aws:SourceIp`).",
    "Grants cross-account access to external accounts without requiring IAM role assumption."
  ],
  "commonMistake": "Using `arn:aws:s3:::mybucket` for object-level actions like `s3:GetObject`. Object actions require the wildcard prefix `arn:aws:s3:::mybucket/*`; using only the bucket ARN will result in access denied errors for object downloads.",
  "example": "Attach a bucket policy enforcing HTTPS in JSON: {\"Version\": \"2012-10-17\", \"Statement\": [{\"Sid\": \"EnforceTLS\", \"Effect\": \"Deny\", \"Principal\": \"*\", \"Action\": \"s3:*\", \"Resource\": [\"arn:aws:s3:::secure-bucket\", \"arn:aws:s3:::secure-bucket/*\"], \"Condition\": {\"Bool\": {\"aws:SecureTransport\": \"false\"}}}]}.",
  "sources": [
    {
      "title": "Bucket Policies in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html"
    },
    {
      "title": "Amazon S3 Bucket Policy Examples",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html"
    }
  ]
});
