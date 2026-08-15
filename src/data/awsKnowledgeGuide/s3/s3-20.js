import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-20",
  "title": "S3 IAM Identity-Based Policies",
  "plainEnglish": "An S3 IAM Identity-Based Policy is a JSON permission policy attached directly to an IAM identity (an IAM User, Group, or Role) that specifies what S3 actions that identity is permitted to perform across your AWS account. Unlike Bucket Policies (which are attached to the S3 bucket itself), Identity-Based policies follow the user or application role wherever they go, granting least-privilege permissions across multiple S3 buckets.",
  "whyItMatters": "In microservice and serverless architectures, EC2 instances, Lambda functions, and developer identities require precise S3 permissions. Using IAM Identity-Based policies allows security engineers to attach tailored policies to IAM execution roles (e.g., granting a Lambda function read-only access to a specific prefix `uploads/*`) without modifying individual bucket policies.",
  "workplaceExample": "A developer deploys an AWS Lambda image-processing function. The DevOps engineer creates an IAM execution role with an Identity-Based Policy granting `s3:GetObject` on `arn:aws:s3:::raw-images-bucket/*` and `s3:PutObject` on `arn:aws:s3:::processed-images-bucket/*`. The Lambda function can read raw uploads and save thumbnails, but is prevented from deleting files or accessing other corporate buckets.",
  "examFocus": "Understand S3 Identity-Based Policy evaluation rules: (1) Same Account Evaluation: Access is granted if EITHER the Identity Policy OR the Bucket Policy allows it (as long as there is no explicit Deny). (2) Cross-Account Evaluation: Access requires BOTH the Identity Policy in the consumer account AND the Bucket Policy in the owner account to grant permission. (3) Explicit Deny: An explicit Deny in either policy always overrides all allows.",
  "keyPoints": [
    "Permission policies attached directly to IAM users, groups, or roles.",
    "Controls which S3 buckets, prefixes, and operations an identity can access.",
    "Follows the identity across different applications, instances, and workloads.",
    "Same-account access: Union of identity policy and bucket policy allows access (unless explicit Deny).",
    "Cross-account access: Requires permissions granted in BOTH identity policy and bucket policy.",
    "Essential for assigning least-privilege execution roles to AWS Lambda, ECS tasks, and EC2 instances."
  ],
  "commonMistake": "Granting a cross-account IAM role access to an S3 bucket via an Identity-Based policy, but forgetting to update the target S3 Bucket Policy in the destination account. Cross-account S3 access requires permissions in BOTH the caller's IAM identity policy and the destination bucket policy.",
  "example": "Attach an IAM policy allowing read/write access to a specific bucket prefix: {\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Action\": [\"s3:GetObject\", \"s3:PutObject\"], \"Resource\": \"arn:aws:s3:::company-data/marketing/*\"}]}.",
  "sources": [
    {
      "title": "Identity-Based Policies for Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-identity-based.html"
    },
    {
      "title": "Example IAM Identity Policies for Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-policies-s3.html"
    }
  ]
});
