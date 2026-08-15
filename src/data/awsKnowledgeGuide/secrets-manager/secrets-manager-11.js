import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-11",
  "title": "Fine-Grained IAM Access",
  "plainEnglish": "AWS Identity and Access Management (IAM) policies can limit a person or workload to specific Secrets Manager actions on specific secret Amazon Resource Names (ARNs). For example, an application that only consumes a credential usually needs GetSecretValue on that secret, not permission to update, delete, rotate, list, or change its policy.",
  "whyItMatters": "A secret is valuable only if access to it is narrow. Fine-grained permissions reduce the damage from a compromised workload and separate secret consumption from administration, rotation, and policy management.",
  "workplaceExample": "An Amazon Elastic Container Service task role can retrieve only the production orders database secret. A deployment role can update that secret but cannot read unrelated finance secrets, and the human operations group can inspect metadata without receiving the value.",
  "examFocus": "Use identity-based policies for permissions attached to users, groups, or roles, and scope actions and resources to least privilege. Remember that an explicit deny overrides an allow and that a customer-managed KMS key can add a separate permission requirement.",
  "keyPoints": [
    "IAM identities have no secret access unless an applicable policy allows it.",
    "GetSecretValue, DescribeSecret, PutSecretValue, RotateSecret, and DeleteSecret are different permissions.",
    "Resource ARNs should identify only the secrets a role actually needs.",
    "Workloads on AWS should use IAM roles and temporary credentials to call Secrets Manager.",
    "Attribute-based access control can use tags when the tagging and policy model is carefully governed.",
    "Applicable resource-policy and KMS-key decisions are evaluated in addition to the identity policy."
  ],
  "commonMistake": "Granting secretsmanager:* on * to solve an access error hides which permission is missing and exposes every present or future secret. Add the smallest required action to the exact resource and test that unrelated retrieval remains denied.",
  "example": "Create a harmless test secret, attach a workload role policy allowing only GetSecretValue on its full ARN, add required KMS access if a customer-managed key is used, retrieve without displaying the value, verify another secret is denied, and review the supported API event in CloudTrail.",
  "sources": [
    {
      "title": "Identity-based policies for AWS Secrets Manager",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_iam-policies.html"
    },
    {
      "title": "Determine who has permissions to your secrets",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/determine-acccess_examine-iam-policies.html"
    }
  ]
});
