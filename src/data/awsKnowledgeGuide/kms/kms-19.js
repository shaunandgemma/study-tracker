import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-19',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Multi-Region Keys',
  status: 'ready',
  plainEnglish: 'AWS KMS Multi-Region Keys are a specialized set of related Customer Managed Keys in different AWS Regions that share the exact same key ID and identical underlying cryptographic key material. A Multi-Region key consists of one Primary Key (created in one Region) and one or more Replica Keys (replicated into other AWS Regions).',
  whyItMatters: 'Standard KMS keys are bound to a single AWS Region. Encrypting data in `us-east-1` and replicating the ciphertext to `eu-west-1` for disaster recovery normally requires re-encrypting data under a different Regional KMS key. Multi-Region keys allow decrypting data in target Regions without re-encryption.',
  workplaceExample: 'A global enterprise uses Amazon Aurora Global Database with primary in `us-east-1` and secondary in `eu-west-1`. They use a Multi-Region KMS Key (`mrk-12345678...`). Data encrypted in `us-east-1` can be decrypted locally in `eu-west-1` using the local replica KMS key without making cross-region API calls.',
  examFocus: 'SAA-C03 Multi-Region Key Concepts:\n- Identical Key ID & Key Material: Shared across primary and replica keys (`mrk-` prefix).\n- Independent Regional Management: Each replica key has its own independent Key Policy, IAM policies, aliases, tags, and enablement state.\n- Disaster Recovery & Global Tables: Ideal for Multi-Region S3 CRR, DynamoDB Global Tables, and Aurora Global Databases.\n- Note: Multi-Region keys do NOT replicate application data automatically; they only replicate key material.',
  keyPoints: [
    'Related set of keys across AWS Regions sharing identical key ID and key material.',
    'Consists of 1 Primary Key and 1 or more Replica Keys in target Regions.',
    'Allows decrypting data locally in secondary Regions without cross-region KMS calls.',
    'Each replica key maintains independent Key Policies, aliases, and operational status.',
    'Ideal for multi-region active-active architectures and disaster recovery.'
  ],
  commonMistake: 'Assuming Multi-Region keys automatically replicate S3 objects or database tables across regions. Multi-Region keys replicate key material; application data replication must be configured separately.',
  example: 'Replicating a Primary Multi-Region Key via AWS CLI:\naws kms replicate-key --key-id mrk-123456789012abcdef --replica-region eu-west-1',
  sources: [
    { title: 'Multi-Region keys in AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html' }
  ]
});
