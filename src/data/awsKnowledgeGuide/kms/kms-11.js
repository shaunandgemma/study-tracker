import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-11',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'Asymmetric KMS Keys',
  status: 'ready',
  plainEnglish: 'An Asymmetric KMS Key contains a mathematically linked RSA or Elliptic Curve (ECC) key pair consisting of a Public Key and a Private Key:\n- Public Key: Can be downloaded and shared freely. Anyone with the public key can encrypt data or verify digital signatures outside of AWS KMS.\n- Private Key: Stored unexportably inside AWS KMS HSMs. Only authorized KMS API calls can use the private key to decrypt data or generate digital signatures.',
  whyItMatters: 'Asymmetric keys allow external clients or third-party applications to encrypt data or verify digital signatures without needing AWS IAM credentials or calling AWS KMS APIs.',
  workplaceExample: 'A payment gateway shares an asymmetric RSA public key with vendor mobile apps. Vendor apps encrypt credit card tokens locally on client smartphones. The payment backend sends the ciphertext to AWS KMS, where the unexportable private key decrypts the token safely.',
  examFocus: 'SAA-C03 Asymmetric Key Specifications:\n- Key Pairs: RSA (RSA_2048, RSA_3072, RSA_4096) or Elliptic Curve (ECC_NIST_P256, ECC_SECG_P256K1, SM2).\n- Key Usage Types: `ENCRYPT_DECRYPT` or `SIGN_VERIFY`.\n- Public Key Export: Public key can be downloaded using `GetPublicKey` API.\n- Private Key Protection: Private key NEVER leaves KMS HSMs.\n- Note: Asymmetric KMS keys do NOT support automatic key rotation.',
  keyPoints: [
    'Contains an RSA or ECC mathematically linked Public/Private key pair.',
    'Public key can be downloaded (`GetPublicKey`) and used outside of AWS.',
    'Private key remains unexportable inside AWS KMS HSMs.',
    'Supports Encryption/Decryption or Digital Signing/Verification workloads.',
    'Does NOT support automatic key rotation (manual rotation required).'
  ],
  commonMistake: 'Attempting to enable automatic key rotation on an Asymmetric KMS key. Automatic key rotation is supported ONLY for symmetric encryption KMS keys.',
  example: 'Downloading an Asymmetric Public Key via AWS CLI:\naws kms get-public-key --key-id <ASYMMETRIC_KEY_ID> --output text --query PublicKey',
  sources: [
    { title: 'Asymmetric KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html' }
  ]
});
