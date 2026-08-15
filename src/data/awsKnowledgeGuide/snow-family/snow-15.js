import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-15",
  "title": "AWS KMS Integration",
  "plainEnglish": "AWS Key Management Service (AWS KMS) integration is the cryptographic backbone of the AWS Snow Family. When ordering a Snow device, you must select an AWS KMS Key (either an AWS managed key or a Customer Managed Key, CMK) that AWS uses to encrypt the device's Manifest file and unlocking materials. This guarantees that only authorized IAM users with permissions on that specific KMS key can download the unlocking credentials and read or write data on the physical device.",
  "whyItMatters": "Separating physical hardware possession from cryptographic authorization ensures data confidentiality. Even if an unauthorized party steals the physical Snow device in transit, they cannot unlock the device without calling AWS KMS in your AWS account to decrypt the unlocking manifest. AWS KMS provides complete key policy control and an immutable CloudTrail audit log of every unlocking attempt.",
  "workplaceExample": "A cybersecurity officer sets up an AWS Snowball Edge migration for sensitive financial data. They create a dedicated Customer Managed Key (CMK) in AWS KMS with a strict key policy granting access only to the lead cloud engineer. When ordering the Snowball Edge, the engineer attaches this KMS key ARN. The engineer's IAM identity assumes the role and calls AWS KMS to download and decrypt the job manifest. All KMS decryption requests are logged to AWS CloudTrail with timestamps and IAM ARNs.",
  "examFocus": "Understand AWS KMS integration with Snow Family: (1) Key Selection: You MUST specify an AWS KMS key ARN during job creation. (2) Customer Managed Keys (CMKs): Recommended for granular access control, automatic annual rotation, and cross-account isolation. (3) Key Policy Requirement: The KMS key policy must grant permissions (`kms:DescribeKey`, `kms:CreateGrant`, `kms:Decrypt`) to the IAM role used by the Snowball service. (4) CloudTrail Auditing: All KMS key usage is logged to AWS CloudTrail.",
  "keyPoints": [
    "Integrates with AWS Key Management Service (AWS KMS) to protect device unlocking credentials.",
    "A valid AWS KMS key ARN must be selected during the initial Snow Family job creation.",
    "Supports both AWS managed keys (`aws/snowball`) and Customer Managed Keys (CMKs).",
    "KMS key policy must grant necessary cryptographic permissions to the Snowball IAM service role.",
    "Prevents physical theft risks by requiring cloud-authenticated KMS decryption to generate unlock codes.",
    "Every manifest generation and decryption event is logged in AWS CloudTrail for security auditing."
  ],
  "commonMistake": "Deleting or disabling the AWS KMS key used to create a Snowball job while the device is in transit. If the KMS key is disabled or deleted, the manifest cannot be decrypted, the device cannot be unlocked, and the entire job will fail.",
  "example": "Specify a Customer Managed KMS Key when creating a Snowball job via the AWS CLI: aws snowball create-job --job-type IMPORT --resources '{\"S3Resources\":[{\"BucketArn\":\"arn:aws:s3:::corporate-vault\"}]}' --kms-key-arn arn:aws:kms:us-east-1:123456789012:key/snowball-master-key --role-arn arn:aws:iam::123456789012:role/SnowballServiceRole.",
  "sources": [
    {
      "title": "AWS Snowball Edge Security and Data Protection",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/security-data-protection.html"
    },
    {
      "title": "Using AWS KMS with AWS Snowball",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/using-kms.html"
    }
  ]
});
