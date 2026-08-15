import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-7',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'Customer Managed KMS Keys',
  status: 'ready',
  plainEnglish: 'A Customer Managed KMS Key is a KMS key created, owned, and managed by you in your AWS account. Unlike AWS Managed Keys, Customer Managed Keys give you total control over key policies, IAM access policies, key rotation settings, aliases, enabling/disabling keys, and scheduling key deletion.',
  whyItMatters: 'Enterprise compliance frameworks (such as HIPAA, PCI-DSS, and SOC 2) require strict separation of duties, custom key rotation schedules, cross-account sharing, and immediate key revocation capabilities—all of which require Customer Managed Keys.',
  workplaceExample: 'A security team creates a Customer Managed Key named `alias/finance-app-key`. They write a custom Key Policy allowing strictly the `FinanceRole` to use the key and configure automatic yearly key rotation while reserving the ability to disable the key instantly if a breach occurs.',
  examFocus: 'SAA-C03 Customer Managed Key Features:\n- Full Control: You manage key policy, IAM policies, aliases, tags, and lifecycle states (Enabled, Disabled, Pending Deletion).\n- Key Rotation: Supports automatic yearly (or customized) rotation and manual key rotation.\n- Cross-Account Sharing: Can be shared across different AWS accounts via Key Policy statements.\n- Cost: Incurs a monthly key fee ($1/month per key) plus API usage charges.',
  keyPoints: [
    'Created, owned, and fully managed by the user within their AWS account.',
    'Provides full control over Key Policies, IAM integration, aliases, and lifecycle.',
    'Supports automatic annual key rotation and manual key rotation.',
    'Allows cross-account access delegation to external AWS accounts.',
    'Ideal for regulatory compliance, custom key policies, and strict access controls.'
  ],
  commonMistake: 'Assuming AWS Managed Keys allow cross-account sharing or custom Key Policies. Cross-account sharing requires a Customer Managed Key.',
  example: 'Creating a Customer Managed Key with an Alias via AWS CLI:\naws kms create-key --description "Customer managed key for customer PII"\naws kms create-alias --alias-name alias/customer-pii-key --target-key-id <KEY_ID>',
  sources: [
    { title: 'Customer managed keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk' }
  ]
});
