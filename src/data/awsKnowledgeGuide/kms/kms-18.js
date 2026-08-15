import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-18',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Key Aliases',
  status: 'ready',
  plainEnglish: 'A KMS Key Alias is a friendly, customizable display name associated with a specific KMS key (for example, `alias/app-production-key`). An alias acts as a pointer or alias mapping to an underlying KMS key ID (`12345678-1234-1234-1234-123456789012`). Aliases decouple application code and AWS service configurations from hardcoded GUID Key IDs.',
  whyItMatters: 'If you perform manual key rotation or recreate a key, hardcoding GUID Key IDs (`12345678-1234-...`) forces updating application code everywhere. Using a KMS Alias (`alias/app-key`) allows pointing the alias to a new target key ID without modifying application code.',
  workplaceExample: 'An engineering team configures their microservices to reference `alias/order-service-key`. When upgrading from an old KMS key to a new key, the security admin simply re-maps the alias `alias/order-service-key` to the new Key ID via `UpdateAlias`.',
  examFocus: 'SAA-C03 Alias Characteristics & Rules:\n- Format: Must start with `alias/` (e.g. `alias/finance-key`). Reserved prefix `alias/aws/` is for AWS Managed Keys.\n- Resource Scoping: Aliases are Regional resources.\n- Policy Note: Key Policies and IAM Policies MUST reference the underlying KMS Key ARN or Key ID in the `Resource` block for API actions like `Encrypt`/`Decrypt`; aliases are NOT valid Key ARNs in policy `Resource` elements (except when used with `kms:RequestAlias`).',
  keyPoints: [
    'Friendly display name pointing to an underlying KMS Key ID (must start with `alias/`).',
    'Decouples application code and configurations from hardcoded GUID Key IDs.',
    'Can be remapped (`UpdateAlias`) to point to a different target KMS key ID.',
    'Reserved prefix `alias/aws/` is strictly for AWS Managed Keys.',
    'IAM policies require the underlying Key ARN in `Resource` statements (not alias ARNs).'
  ],
  commonMistake: 'Putting an alias ARN (`arn:aws:kms:us-east-1:123456789012:alias/my-key`) into the `Resource` element of an IAM policy `kms:Decrypt` statement, causing policy evaluation to fail.',
  example: 'Creating and Updating an Alias via AWS CLI:\naws kms create-alias --alias-name alias/prod-db-key --target-key-id <KEY_ID_1>\naws kms update-alias --alias-name alias/prod-db-key --target-key-id <KEY_ID_2>',
  sources: [
    { title: 'Using aliases in AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/kms-alias.html' }
  ]
});
