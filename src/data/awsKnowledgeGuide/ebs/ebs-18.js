import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-18",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Encryption with AWS KMS",
  "status": "ready",
  "plainEnglish": "EBS Encryption with AWS Key Management Service (AWS KMS) provides seamless, transparent hardware encryption for your Amazon EBS storage volumes. When encryption is enabled on an EBS volume, AWS uses the industry-standard AES-256 algorithm to automatically encrypt: (1) Data at rest inside the volume, (2) All disk I/O data moving in transit between the EC2 host and the EBS storage server, (3) All snapshots created from the volume, and (4) All new volumes created from those snapshots.",
  "whyItMatters": "Encrypting storage is a mandatory regulatory requirement under HIPAA, PCI-DSS, GDPR, and FedRAMP. Because EBS encryption occurs directly on the EC2 host server hardware with dedicated AES-256 acceleration, encryption and decryption occur with zero performance penalty and require no application code changes.",
  "workplaceExample": "A healthcare provider deploys electronic health record (EHR) servers. They configure an AWS KMS Customer Managed Key (CMK) with annual key rotation and launch EC2 instances with encrypted EBS volumes. All patient data on disk and all EBS snapshots are automatically encrypted using their CMK.",
  "examFocus": "For SAA-C03, remember what EBS encryption covers: data at rest on the volume, data in transit between EC2 and EBS, all snapshots, and all volumes created from those snapshots. Encryption uses AWS KMS keys (AWS managed key `aws/ebs` or Customer Managed Keys). You CANNOT convert an existing unencrypted volume to encrypted directly in place; instead: (1) Snapshot unencrypted volume, (2) Copy snapshot with encryption enabled, (3) Create new volume from encrypted snapshot.",
  "keyPoints": [
    "Uses AES-256 encryption managed by AWS Key Management Service (AWS KMS).",
    "Encrypts data at rest, data in transit between EC2 and EBS, snapshots, and derived volumes.",
    "Hardware-accelerated on the EC2 host: incurs virtually zero latency or performance impact.",
    "Supports both AWS managed keys (`aws/ebs`) and Customer Managed Keys (CMKs).",
    "Unencrypted volumes cannot be converted directly: must snapshot -> copy with encryption -> restore."
  ],
  "commonMistake": "Thinking that you can simply check a box to encrypt an existing unencrypted live EBS volume in place. To encrypt an existing unencrypted volume: snapshot it, copy the snapshot while enabling KMS encryption, and create a new volume from that encrypted snapshot.",
  "example": "# Copy an unencrypted snapshot while enabling encryption with a KMS CMK:\naws ec2 copy-snapshot \\\n  --source-region us-east-1 \\\n  --source-snapshot-id snap-unencrypted12345 \\\n  --encrypted \\\n  --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012 \\\n  --description \"Encrypted copy of snapshot\"",
  "sources": [
    {
      "title": "Amazon EBS Encryption",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html"
    },
    {
      "title": "How EBS Encryption Works with AWS KMS",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html#encryption-overview"
    }
  ]
});
