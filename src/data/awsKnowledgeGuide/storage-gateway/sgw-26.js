import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-26',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway Encryption',
  status: 'ready',
  plainEnglish: 'AWS Storage Gateway protects data in two different places. Data moving between the gateway appliance and AWS is encrypted with SSL/TLS. Data stored in AWS is encrypted at rest: Storage Gateway uses Amazon S3-managed encryption keys by default for data it stores in Amazon S3, and supported file shares, volumes, and virtual tapes can instead use a symmetric AWS KMS key. Encryption protects the data, but access still depends on correctly configured IAM policies, key policies, storage permissions, and local protocol permissions.',
  whyItMatters: 'Hybrid storage crosses a network boundary and may contain backups, files, database blocks, or virtual tapes. Engineers must protect the transfer and the cloud copy while ensuring that authorised workloads can still decrypt the data. A disabled, deleted, or inaccessible KMS key can make encrypted gateway data unavailable, so key governance is part of the recovery design.',
  workplaceExample: 'A company creates a cached Volume Gateway for finance data and selects a customer-managed symmetric KMS key. The storage team grants the gateway and recovery roles only the required permissions, monitors key changes with CloudTrail, and tests a snapshot restore before treating the design as production-ready.',
  examFocus: 'SAA-C03 encryption decisions:\n- In transit: Storage Gateway uses SSL/TLS between the appliance and AWS.\n- At rest: data stored through the gateway is encrypted; SSE-S3 is the default for data stored in S3.\n- Customer control: supported resources can use a symmetric KMS key and require the correct IAM and key-policy access.\n- Recovery risk: deleting or disabling the KMS key can prevent access to encrypted volumes, tapes, or objects.\n- Boundary: encryption does not replace file-share, iSCSI, bucket, IAM, or KMS authorisation.',
  keyPoints: [
    'Storage Gateway encrypts data transferred between the gateway appliance and AWS using SSL/TLS.',
    'Data stored by Storage Gateway in Amazon S3 uses server-side encryption, with SSE-S3 used by default.',
    'Supported file shares, cached or stored volumes, and virtual tapes can use a symmetric AWS KMS key.',
    'The KMS key selected for an existing volume or tape cannot simply be replaced in place; recovery or replacement planning is required.',
    'IAM permissions and the KMS key policy must allow the required encryption, decryption, snapshot, and restore operations.',
    'Disabling or deleting a KMS key can make dependent gateway data inaccessible even though the encrypted data still exists.'
  ],
  commonMistake: 'Assuming that choosing a KMS key automatically grants the gateway and recovery operators permission to use it. Encryption configuration and authorisation are separate, and a restrictive or deleted key can block normal access and disaster recovery.',
  example: 'A security review checks four layers separately: TLS protects traffic to AWS; the volume uses the approved symmetric KMS key; the gateway role and recovery role can use only that key; and the iSCSI initiator still requires the intended local access controls. The team then restores a test snapshot to prove that the key and permissions work.',
  sources: [
    { title: 'Data encryption using AWS KMS in Storage Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/encryption.html' },
    { title: 'Data protection in AWS Storage Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/data-protection.html' }
  ]
});
