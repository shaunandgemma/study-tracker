import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-23",
  "title": "S3 Block Public Access",
  "plainEnglish": "Amazon S3 Block Public Access is a powerful multi-layered security control designed to prevent accidental public exposure of your Amazon S3 buckets and data. Configurable at the AWS Account level, S3 Bucket level, or S3 Access Point level, Block Public Access provides four specific controls that block the creation of public ACLs or public bucket policies and automatically ignore any existing public permissions, ensuring your storage remains private.",
  "whyItMatters": "Public data leaks from misconfigured storage buckets expose intellectual property, customer PII, and financial records to internet scrapers and malicious actors. S3 Block Public Access acts as an infallible organizational safety net that prevents human error from making buckets publicly accessible.",
  "workplaceExample": "A cloud security architect enforces Block Public Access at the root AWS Account level for 50 AWS accounts using an AWS Organizations Service Control Policy (SCP). An intern developer inadvertently copies an open-source tutorial that attempts to attach a public `\"Principal\": \"*\"` bucket policy to a database backup bucket. S3 evaluates the account-level Block Public Access setting and immediately rejects the operation.",
  "examFocus": "Understand the 4 distinct settings in Block Public Access: (1) `BlockPublicAcls`: Prevents users from adding new public ACLs. (2) `IgnorePublicAcls`: Causes S3 to ignore all existing public ACLs on the bucket. (3) `BlockPublicPolicy`: Rejects attempts to attach new public bucket policies. (4) `RestrictPublicBuckets`: Restricts access to buckets with existing public policies to only AWS service principals and authorized account users. (5) Inheritance: Account-level settings enforce restrictions on all buckets regardless of individual bucket settings.",
  "keyPoints": [
    "Comprehensive security guardrail preventing unauthorized public internet access.",
    "Can be applied at the AWS Account level, individual Bucket level, and Access Point level.",
    "Account-level settings automatically enforce restrictions across all buckets in the account.",
    "Enabled by default on all newly created S3 general-purpose buckets.",
    "Consists of 4 settings: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets.",
    "Can be audited and enforced across an entire AWS Organization via Service Control Policies (SCPs)."
  ],
  "commonMistake": "Disabling Block Public Access on a bucket to deliver media files to web users. Instead of exposing your S3 bucket publicly, keep Block Public Access enabled and use an Amazon CloudFront distribution with Origin Access Control (OAC) to serve content securely.",
  "example": "Enable Block Public Access on an individual bucket using the AWS CLI: aws s3api put-public-access-block --bucket sensitive-finance-data --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'.",
  "sources": [
    {
      "title": "Blocking Public Access to Your Amazon S3 Storage",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    },
    {
      "title": "Configuring Block Public Access for Your S3 Buckets",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/configuring-block-public-access-bucket.html"
    }
  ]
});
