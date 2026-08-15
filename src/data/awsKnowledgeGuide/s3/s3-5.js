import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-5",
  "title": "S3 Block Public Access (Account-level and Bucket-level controls)",
  "plainEnglish": "Amazon S3 Block Public Access provides four centralized security settings that act as a comprehensive guardrail to prevent unintentional public access to your S3 buckets and objects. Configurable at both the individual Bucket level and the entire AWS Account level (as well as on Access Points), Block Public Access overrides all bucket policies, access point policies, and Access Control Lists (ACLs) to ensure that private data cannot be exposed to the public internet.",
  "whyItMatters": "Accidental public exposure of S3 buckets due to misconfigured policies or legacy ACLs is one of the most common causes of enterprise data breaches. S3 Block Public Access provides an authoritative security safety net that blocks public permissions across your entire account, even if an individual developer mistakenly creates a public bucket policy.",
  "workplaceExample": "A Chief Information Security Officer (CISO) establishes an organizational compliance mandate: No S3 bucket may be accessible publicly. The cloud security team enables all four S3 Block Public Access settings at the AWS Account level using AWS Organizations SCPs. When a developer attempts to attach a public `\"Principal\": \"*\"` policy to an internal logs bucket, Amazon S3 rejects the policy update immediately.",
  "examFocus": "Understand the four distinct S3 Block Public Access settings: (1) `BlockPublicAcls`: Rejects new public ACLs on buckets/objects. (2) `IgnorePublicAcls`: Ignores all existing public ACLs on buckets/objects. (3) `BlockPublicPolicy`: Rejects new bucket/access point policies that grant public access. (4) `RestrictPublicBuckets`: Restricts access to buckets with public policies strictly to authorized AWS service principals and account owners. (5) Evaluation: An explicit Block Public Access setting at the Account level overrides bucket-level configurations.",
  "keyPoints": [
    "Authoritative security control preventing public access at both Account and Bucket levels.",
    "Enabled by default on all newly created Amazon S3 general-purpose buckets.",
    "Overrides existing and new bucket policies, access point policies, and Access Control Lists (ACLs).",
    "Consists of four granular flags: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets.",
    "Account-level settings enforce centralized governance across all existing and future buckets in the account.",
    "Can be enforced across all member accounts in an AWS Organization using Service Control Policies (SCPs)."
  ],
  "commonMistake": "Attempting to host a public static website directly from an S3 bucket while Block Public Access is fully enabled. The public bucket policy will be blocked; to host a secure website, keep Block Public Access enabled and distribute content privately via Amazon CloudFront with Origin Access Control (OAC).",
  "example": "Enable all four S3 Block Public Access settings on an entire AWS account using the AWS CLI: aws s3control put-public-access-block --account-id 123456789012 --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'.",
  "sources": [
    {
      "title": "Blocking Public Access to Your Amazon S3 Storage",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    },
    {
      "title": "Amazon S3 Block Public Access by Default",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/block-public-access-empty-buckets.html"
    }
  ]
});
