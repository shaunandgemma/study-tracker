import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-13",
  "title": "Cross-Account Secret Access",
  "plainEnglish": "Cross-account access lets an IAM role in a consuming AWS account retrieve a secret owned by another account. The owner must allow that role in the secret's resource policy, the consuming role must allow the Secrets Manager action in its identity policy, and the secret must use a customer-managed KMS key whose permissions also support the caller.",
  "whyItMatters": "Central ownership can reduce duplicate secret administration across accounts, but it crosses two account boundaries: the secret and its encryption key. Requiring explicit permission in each layer prevents a one-sided grant from silently exposing the value.",
  "workplaceExample": "A shared-services account owns a vendor credential consumed by one production role in an application account. The owner grants that exact role access to the secret and KMS key, the application account grants its role retrieval and decrypt actions, and both teams test that a development role is denied.",
  "examFocus": "For cross-account retrieval, expect an allow in the secret resource policy and in the external principal's identity policy, plus suitable customer-managed KMS key policy and identity permission. The aws/secretsmanager AWS managed key cannot be used for this cross-account pattern.",
  "keyPoints": [
    "The secret-owning account controls the resource policy attached to the secret.",
    "The consuming account controls the identity policy on its user or role.",
    "A customer-managed KMS key is required because the Secrets Manager AWS managed key cannot provide cross-account access.",
    "KMS access normally needs permission in the key policy and the external identity's policy.",
    "The secret policy should name the exact consuming principal rather than a wildcard.",
    "An explicit deny in any applicable policy can block a request that otherwise has allows."
  ],
  "commonMistake": "Adding only a secret resource policy leaves the request incomplete. Check the consuming role's identity permission and both sides of the customer-managed KMS key authorization, then test with the actual role rather than an administrator session.",
  "example": "Identify the owner account, one consuming test role, the test secret, and its customer-managed key; add narrowly scoped secret, identity, and key permissions; retrieve without printing the value; verify an unlisted role is denied; and inspect Access Analyzer for unintended reachability.",
  "sources": [
    {
      "title": "Access Secrets Manager secrets from a different account",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples_cross.html"
    },
    {
      "title": "Determine who has permissions to your secrets",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/determine-acccess_examine-iam-policies.html"
    }
  ]
});
