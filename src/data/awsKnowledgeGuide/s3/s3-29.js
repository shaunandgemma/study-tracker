import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-29",
  "title": "S3 MFA Delete",
  "plainEnglish": "Amazon S3 MFA Delete is an advanced security feature that requires a physical or virtual Multi-Factor Authentication (MFA) token code before executing two highly destructive operations on an S3 bucket: (1) Permanently deleting an object version, and (2) Changing the bucket's versioning state (such as suspending versioning). MFA Delete can only be enabled or disabled by the AWS Account Root User using the AWS CLI or S3 REST API.",
  "whyItMatters": "Compromised administrative credentials or rogue insider threats with full IAM admin permissions could theoretically delete all historical object versions and suspend versioning, destroying company backups permanently. S3 MFA Delete prevents this catastrophe by enforcing a physical second factor possessed exclusively by root security officers.",
  "workplaceExample": "A healthcare enterprise stores patient health records in an S3 bucket with Versioning enabled. The security officer enables S3 MFA Delete on the bucket using the AWS Account Root User credentials and a hardware MFA security key. Even if an attacker compromises a privileged DevOps IAM administrator role, any attempt to permanently delete past record versions is blocked because the attacker lacks the physical MFA hardware token.",
  "examFocus": "Understand MFA Delete constraints for AWS certification exams: (1) Protected Operations: Requires MFA ONLY for permanently deleting a version (`s3:DeleteObjectVersion`) and suspending/changing bucket versioning state. (2) Not Required for: Normal deletes that create delete markers or standard object uploads. (3) Configuration Method: Can ONLY be enabled/disabled using the AWS Account Root User via the AWS CLI/API; it CANNOT be enabled via the AWS Management Console. (4) Prerequisite: Requires S3 Versioning enabled.",
  "keyPoints": [
    "Adds hardware/virtual MFA security protection against destructive S3 operations.",
    "Requires MFA code for two actions: permanently deleting object versions and suspending versioning.",
    "Can only be enabled, modified, or disabled by the AWS Account Root User.",
    "Cannot be configured through the AWS Management Console; requires the AWS CLI or API.",
    "Does not require MFA for normal object uploads or standard deletes that generate delete markers.",
    "Provides extreme defense-in-depth protection against compromised IAM administrator credentials."
  ],
  "commonMistake": "Attempting to enable S3 MFA Delete in the AWS Management Console using an IAM Administrator role. MFA Delete is not configurable in the web console and must be executed by the AWS Account Root User via the AWS CLI.",
  "example": "Enable S3 Versioning with MFA Delete using the AWS CLI as the root user: aws s3api put-bucket-versioning --bucket sensitive-records --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa 'arn:aws:iam::123456789012:mfa/root-u2f-key 123456'.",
  "sources": [
    {
      "title": "Configuring MFA Delete in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mfadelete.html"
    },
    {
      "title": "Using Versioning in Amazon S3 Buckets",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html"
    }
  ]
});
