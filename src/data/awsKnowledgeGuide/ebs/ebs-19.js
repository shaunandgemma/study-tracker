import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-19",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Encryption by Default",
  "status": "ready",
  "plainEnglish": "EBS Encryption by Default is an AWS account-level and Region-level security setting that enforces encryption on all newly created Amazon EBS volumes and EBS snapshot copies in that Region. Once enabled, whenever any user, script, CI/CD pipeline, Auto Scaling group, or CloudFormation template creates a volume or copies a snapshot, AWS automatically encrypts it using the default AWS KMS key or a specified Customer Managed Key (CMK), preventing the creation of unencrypted EBS storage.",
  "whyItMatters": "In large enterprise AWS accounts with hundreds of developers, accidental creation of unencrypted volumes poses severe compliance risks. Enabling Encryption by Default acts as an unbypassable guardrail that guarantees 100% encryption compliance without needing complex IAM restriction policies.",
  "workplaceExample": "A chief information security officer (CISO) at a financial services firm enables EBS Encryption by Default across all active AWS Regions in their AWS Organization. Now, even if an intern launches an EC2 instance without checking the 'Encrypt Volume' box in the AWS console, the root and data disks are automatically encrypted with the corporate KMS CMK.",
  "examFocus": "For SAA-C03, know that EBS Encryption by Default is a Regional and Account-level setting. Enabling it does NOT retroactively encrypt existing unencrypted volumes; it only applies to newly created volumes and snapshot copies from that point forward. You can choose either the default AWS-managed key (`aws/ebs`) or a custom KMS CMK.",
  "keyPoints": [
    "Regional and account-level setting that enforces encryption on all new EBS volumes and snapshots.",
    "Does NOT retroactively encrypt existing volumes; applies only to future volume creations.",
    "Guarantees that all Auto Scaling groups, CloudFormation stacks, and manual launches are encrypted.",
    "Can use the default AWS-managed KMS key (`aws/ebs`) or a Customer Managed Key (CMK).",
    "Enabled independently on a per-Region basis."
  ],
  "commonMistake": "Assuming that enabling Encryption by Default immediately encrypts your existing active EBS volumes. Existing unencrypted volumes remain unencrypted until you snapshot them, copy the snapshot with encryption, and replace the volume.",
  "example": "# Enable EBS encryption by default in the current Region:\naws ec2 enable-ebs-encryption-by-default\n\n# Set a default KMS customer managed key for EBS encryption:\naws ec2 modify-ebs-default-kms-key-id \\\n  --kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012",
  "sources": [
    {
      "title": "Amazon EBS Encryption by Default",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html"
    },
    {
      "title": "Enabling EBS Encryption by Default with AWS CLI",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html#enable-encryption-by-default"
    }
  ]
});
