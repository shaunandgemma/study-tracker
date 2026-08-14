import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-20",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "IAM Roles for AWS Storage Access",
  "status": "ready",
  "plainEnglish": "IAM Roles for AWS Storage Access are AWS Identity and Access Management (IAM) service roles assumed by AWS DataSync to authenticate and authorize read and write operations against your target AWS storage resources (such as Amazon S3 buckets, Amazon EFS file systems, and Amazon FSx file systems). These roles grant DataSync the least-privilege permissions required to list, upload, read, and delete objects and metadata.",
  "whyItMatters": "Using dedicated IAM service roles eliminates the need to store long-term access keys or static credentials inside DataSync tasks or agents. AWS handles temporary STS credential generation and rotation automatically, following the AWS Well-Architected Security Pillar.",
  "workplaceExample": "A cloud security team creates an IAM role named `DataSyncS3AccessRole` with an IAM trust policy for `datasync.amazonaws.com`. The permission policy restricts access strictly to the `arn:aws:s3:::finance-reports-2026` bucket prefix and allows DataSync to write encrypted objects using a specific AWS KMS customer managed key (CMK).",
  "examFocus": "For SAA-C03, know that DataSync requires an IAM role to access Amazon S3 buckets. The trust relationship must specify `datasync.amazonaws.com` as the trusted service principal. For cross-account transfers, the destination S3 bucket policy must also explicitly allow the DataSync IAM role from the source account to perform `s3:PutObject`.",
  "keyPoints": [
    "AWS DataSync assumes an IAM service role to access Amazon S3, EFS, and FSx.",
    "The IAM role's trust policy must specify `datasync.amazonaws.com` as the principal.",
    "Requires permissions such as `s3:GetBucketLocation`, `s3:ListBucket`, `s3:GetObject`, and `s3:PutObject`.",
    "Eliminates hardcoded credentials and uses temporary AWS STS tokens.",
    "Supports cross-account S3 bucket access via bucket resource policies."
  ],
  "commonMistake": "Creating an IAM role for DataSync without the proper trust policy. If the trust policy does not include `datasync.amazonaws.com` in the `Principal.Service` block, DataSync will fail to assume the role and cannot access the S3 bucket.",
  "example": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\n        \"Service\": \"datasync.amazonaws.com\"\n      },\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}",
  "sources": [
    {
      "title": "IAM Roles and Permissions for AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/datasync-iam-role.html"
    },
    {
      "title": "Configuring S3 Bucket Access for DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#s3-permissions"
    }
  ]
});
