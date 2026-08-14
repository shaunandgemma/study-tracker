import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-22",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Snapshot Copy",
  "status": "ready",
  "plainEnglish": "EBS Snapshot Copy is the process of creating a duplicate copy of an existing Amazon EBS snapshot within the same AWS Region or copying it across different AWS accounts. During the copy process, you can change encryption parameters (such as encrypting an unencrypted snapshot, or re-encrypting an encrypted snapshot with a different AWS KMS customer managed key).",
  "whyItMatters": "Snapshot Copy is the standard AWS mechanism for encrypting legacy unencrypted volumes, changing KMS encryption keys, and securely migrating golden master AMIs and volume data between development, staging, and production AWS accounts.",
  "workplaceExample": "A security engineer identifies an unencrypted EBS snapshot of a legacy accounting server. To meet compliance requirements, they use Snapshot Copy to create a new copy of the snapshot while specifying a corporate KMS CMK. They then restore an encrypted EBS volume from the newly encrypted snapshot.",
  "examFocus": "For SAA-C03, remember these core Snapshot Copy patterns: (1) You can encrypt an unencrypted snapshot during the copy operation by specifying `--encrypted` and a KMS Key ID. (2) You can change the KMS key used by copying the snapshot with a new CMK. (3) To share an encrypted snapshot across accounts, the custom KMS key must also be shared via its KMS Key Policy.",
  "keyPoints": [
    "Copies an EBS snapshot within the same Region or between AWS accounts.",
    "Can encrypt an unencrypted snapshot during the copy process.",
    "Can re-encrypt an encrypted snapshot with a different KMS Customer Managed Key (CMK).",
    "Preserves all block data and metadata from the original snapshot.",
    "Essential step in modernizing and securing legacy unencrypted storage volumes."
  ],
  "commonMistake": "Attempting to share an EBS snapshot encrypted with the default AWS-managed key `aws/ebs` with another AWS account. Default AWS-managed KMS keys cannot be shared cross-account; you must re-encrypt the snapshot with a Customer Managed Key (CMK) first.",
  "example": "# Copy an unencrypted snapshot and encrypt it with a KMS key:\naws ec2 copy-snapshot \\\n  --source-region us-east-1 \\\n  --source-snapshot-id snap-0123456789abcdef0 \\\n  --encrypted \\\n  --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012 \\\n  --description \"Encrypted copy of production snapshot\"",
  "sources": [
    {
      "title": "Copying an Amazon EBS Snapshot",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-copying-snapshot.html"
    },
    {
      "title": "Encrypting a Snapshot During Copy",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-copying-snapshot.html#encryption-during-copy"
    }
  ]
});
