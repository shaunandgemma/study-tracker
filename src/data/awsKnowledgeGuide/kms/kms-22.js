import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-22',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Key Deletion and Waiting Period',
  status: 'ready',
  plainEnglish: 'AWS KMS Key Deletion is an irreversible cryptographic erasure action that permanently destroys a Customer Managed KMS key and its underlying backing key material. To prevent accidental data loss, KMS enforces a mandatory waiting period (from 7 to 30 days, default 30 days) before a key is permanently deleted. During this waiting period, the key status changes to `PendingDeletion`, and all encryption/decryption requests fail.',
  whyItMatters: 'Deleting a KMS key permanently renders all data ever encrypted under that key permanently unrecoverable. The mandatory waiting period gives administrators a safety window to detect broken application workloads and cancel key deletion.',
  workplaceExample: 'An administrator schedules a key for deletion with a 14-day waiting period. Three days later, an automated batch job fails with `KMSDisabledException`. The administrator investigates, realizes the key was actively in use, and calls `CancelKeyDeletion` to restore the key to `Enabled` state.',
  examFocus: 'SAA-C03 Key Deletion Rules & Guardrails:\n- Mandatory Waiting Period: 7 days minimum up to 30 days maximum (default 30 days).\n- Status: Key enters `PendingDeletion` state; cannot be used for encryption or decryption.\n- Cancellation: Deletion can be cancelled anytime during the waiting period via `CancelKeyDeletion` API.\n- Permanent Erasure: Once the waiting period expires, key material is permanently destroyed and cannot be recovered by AWS.\n- Safety Rule: NEVER delete a KMS key as a routine troubleshooting step.',
  keyPoints: [
    'Destroys backing key material permanently, making protected data unrecoverable.',
    'Mandatory waiting period of 7 to 30 days (default 30 days) before deletion.',
    'Key enters `PendingDeletion` state during which all cryptographic operations fail.',
    'Key deletion can be cancelled anytime before the waiting period expires (`CancelKeyDeletion`).',
    'Best practice: Disable keys (`DisableKey`) to test impact before scheduling deletion.'
  ],
  commonMistake: 'Deleting a KMS key to "fix" a permission issue, resulting in permanent, unrecoverable data loss once the deletion waiting period expires.',
  example: 'Scheduling and Cancelling Key Deletion via AWS CLI:\naws kms schedule-key-deletion --key-id <KEY_ID> --pending-window-in-days 14\naws kms cancel-key-deletion --key-id <KEY_ID>',
  sources: [
    { title: 'Deleting AWS KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html' }
  ]
});
