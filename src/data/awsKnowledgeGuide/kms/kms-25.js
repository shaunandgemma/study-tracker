import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-25',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Encryption at Rest',
  status: 'ready',
  plainEnglish: 'KMS Encryption at Rest secures data when it is written to non-volatile physical storage disks (such as SSDs, HDDs, or magnetic tapes) across AWS infrastructure. It protects stored data against physical disk theft, unauthorized hardware access, or compromised storage blocks. When data is read from disk, KMS decrypts it back into memory for authorized principals.',
  whyItMatters: 'Encryption at rest is a foundational regulatory compliance requirement (PCI-DSS, HIPAA, SOC 2). Enabling KMS Encryption at Rest guarantees that physical media removed from an AWS datacenter cannot be read by unauthorized parties.',
  workplaceExample: 'A healthcare portal stores patient medical records in Amazon S3 and Amazon DynamoDB. Both services are configured with KMS Encryption at Rest. All underlying physical storage blocks are encrypted using 256-bit AES encryption before being written to physical drives.',
  examFocus: 'SAA-C03 Encryption at Rest vs In Transit:\n- Encryption at Rest: Protects data stored on physical disks (S3, EBS, RDS, DynamoDB, EFS) using KMS keys.\n- Encryption in Transit: Protects data traveling over network interfaces (using TLS/SSL protocols).\n- Both mechanisms should be combined for end-to-end defense-in-depth protection.',
  keyPoints: [
    'Secures data stored on physical storage media (SSDs, HDDs, tapes).',
    'Protects against unauthorized physical hardware access and stolen disk drives.',
    'Satisfies HIPAA, PCI-DSS, SOC 2, and GDPR regulatory compliance standards.',
    'Combines with TLS encryption in transit for complete defense-in-depth.',
    'Transparently managed by AWS services using envelope encryption.'
  ],
  commonMistake: 'Believing KMS Encryption at Rest protects data while it is transmitted over public network cables. Encryption in transit (TLS 1.2+) is required for network protection.',
  example: 'Verifying EBS Volume Encryption at Rest Status via AWS CLI:\naws ec2 describe-volumes --volume-ids vol-0123456789abcdef0 --query "Volumes[*].Encrypted"',
  sources: [
    { title: 'AWS KMS concepts', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html' }
  ]
});
