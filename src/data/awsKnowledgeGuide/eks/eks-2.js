import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-2",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Pod IAM Roles (IRSA - IAM Roles for Service Accounts via OIDC Provider)",
  "status": "ready",
  "plainEnglish": "IAM Roles for Service Accounts (IRSA) is an Amazon EKS security feature that associates fine-grained AWS IAM roles directly with specific Kubernetes ServiceAccounts running on your pods. By configuring an OpenID Connect (OIDC) identity provider for your EKS cluster, Kubernetes projects a temporary JSON Web Token (JWT) into the pod. The AWS SDK inside the container automatically exchanges this JWT for temporary, least-privilege IAM credentials from AWS STS (Security Token Service).",
  "whyItMatters": "Without IRSA, containers inherit the EC2 worker node's underlying IAM instance profile. This means if one pod on the node needs S3 read access and another needs full DynamoDB admin access, BOTH pods inherit both permissions—violating the principle of least privilege and introducing severe security blast-radius risks.",
  "workplaceExample": "A microservices cluster runs 50 different pods on shared EC2 nodes. Using IRSA, the `invoice-service` pod is linked to an IAM role with access ONLY to the `company-invoices` S3 bucket. If the `order-service` pod on the same physical node is compromised, the attacker cannot read the S3 bucket because credentials are isolated at the individual Pod level.",
  "examFocus": "For SAA-C03, remember the mandatory steps to configure IRSA: (1) Create and associate an IAM OpenID Connect (OIDC) provider with your EKS cluster. (2) Create an IAM Role with a Trust Policy that trusts the OIDC provider and specifies the exact Kubernetes namespace and ServiceAccount name (`system:serviceaccount:<namespace>:<service-account-name>`). (3) Annotate the Kubernetes ServiceAccount with the IAM Role ARN (`eks.amazonaws.com/role-arn`). (4) Assign the ServiceAccount to your Pod specification.",
  "keyPoints": [
    "Assigns fine-grained IAM roles directly to individual Kubernetes Pods.",
    "Implements the Principle of Least Privilege: prevents pods from sharing EC2 node IAM roles.",
    "Requires enabling an IAM OIDC Provider for the Amazon EKS cluster.",
    "IAM Role Trust Policy restricts assume-role access to specific Kubernetes ServiceAccount names.",
    "Pods receive temporary STS credentials via Projected Service Account Tokens.",
    "AWS SDKs inside containers automatically detect and refresh the temporary credentials."
  ],
  "commonMistake": "Attaching broad IAM permissions to the EC2 worker node IAM instance profile so that all pods can access AWS services. Always use IRSA to scope AWS permissions to specific Kubernetes ServiceAccounts.",
  "example": "apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: s3-reader-sa\n  namespace: default\n  annotations:\n    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/EKS-S3-Reader-Role",
  "sources": [
    {
      "title": "IAM Roles for Service Accounts (IRSA)",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html"
    },
    {
      "title": "Configuring an OpenID Connect (OIDC) Provider for EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html"
    }
  ]
});
