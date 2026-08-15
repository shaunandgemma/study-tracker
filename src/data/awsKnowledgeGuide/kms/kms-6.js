import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-6',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Keys',
  status: 'ready',
  plainEnglish: 'An AWS KMS Key (formerly referred to as a Customer Master Key or CMK) is a primary logical resource in AWS Key Management Service. A KMS key contains metadata (such as the key ID, key ARN, creation date, description, and key state) and a reference to the underlying cryptographic key material used to encrypt and decrypt data. Plaintext key material never leaves the unexportable, hardware security modules (HSMs) inside AWS KMS.',
  whyItMatters: 'Centralizing cryptographic key management inside AWS KMS eliminates the danger of managing raw encryption keys in application files. KMS controls key access through Key Policies, logs every cryptographic operation to AWS CloudTrail, and integrates seamlessly with AWS services.',
  workplaceExample: 'A security engineer creates a KMS key to protect sensitive financial records. Applications call KMS APIs to perform encryption operations without ever accessing or seeing the raw secret key material stored inside KMS.',
  examFocus: 'SAA-C03 Core Concept for KMS Keys:\n- Logical Resource: Contains key metadata, Key Policy, and pointers to unexportable HSM key material.\n- Key Types: Symmetric (AES-256), Asymmetric (RSA/ECC), and HMAC keys.\n- Regional Isolation: KMS keys are Regional resources bound to a single AWS Region (unless created as a Multi-Region key set).\n- Key Material Protection: Secret key material never leaves AWS KMS hardware security modules in plaintext.',
  keyPoints: [
    'Primary logical resource in AWS KMS storing metadata and cryptographic pointers.',
    'Cryptographic key material remains protected inside FIDO/FIPS 140-2 hardware security modules.',
    'Access is controlled via Key Policies, IAM Policies, and KMS Grants.',
    'KMS keys are Regional resources bound to the specific Region where created.',
    'Supports symmetric encryption, asymmetric encryption/signing, and HMAC operations.'
  ],
  commonMistake: 'Attempting to download or export the plaintext private key material of a standard AWS KMS key into local application code. KMS key material is unexportable by design.',
  example: 'Creating a KMS Key via AWS CLI:\naws kms create-key --description "Primary financial encryption key" --tags TagKey=Environment,TagValue=Production',
  sources: [
    { title: 'AWS KMS concepts - KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#kms-keys' }
  ]
});
