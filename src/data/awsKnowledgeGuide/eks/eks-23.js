import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-23",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "IAM Roles for Service Accounts - IRSA",
  "status": "ready",
  "plainEnglish": "IAM Roles for Service Accounts (IRSA) is the modern, secure mechanism for granting AWS permissions to containerized workloads running in Amazon EKS. By federating an IAM OpenID Connect (OIDC) identity provider with the EKS cluster, Kubernetes ServiceAccounts are directly mapped to specific AWS IAM Roles. Container runtimes automatically inject AWS credentials via temporary projected service account tokens, allowing pods to call AWS APIs securely without embedding hardcoded IAM access keys or over-permissioning worker nodes.",
  "whyItMatters": "Before IRSA, applications on EKS either shared the EC2 worker node's broad IAM role or used hardcoded long-term IAM user credentials stored in Kubernetes secrets. IRSA establishes a strict security boundary, ensuring that compromised containers only possess their own scoped, short-lived STS credentials.",
  "workplaceExample": "A data engineering team runs Apache Spark jobs on EKS. Job A needs to read from the `raw-data` S3 bucket, while Job B needs to write to the `analytics-mart` DynamoDB table. Using IRSA, Job A and Job B are assigned distinct Kubernetes ServiceAccounts tied to different IAM roles, guaranteeing complete IAM permission isolation on shared compute nodes.",
  "examFocus": "For SAA-C03, know how to configure IRSA: (1) Cluster must have an IAM OIDC Identity Provider created (`eksctl utils associate-iam-oidc-provider`). (2) The IAM Role's trust policy must use `sts:AssumeRoleWithWebIdentity` matching the OIDC provider URL and the specific ServiceAccount namespace and name. (3) ServiceAccount must be annotated with `eks.amazonaws.com/role-arn: <role-arn>`.",
  "keyPoints": [
    "Maps Kubernetes ServiceAccounts directly to fine-grained AWS IAM roles.",
    "Uses `sts:AssumeRoleWithWebIdentity` via an IAM OpenID Connect (OIDC) identity provider.",
    "Provides short-lived, automatically rotated AWS STS credentials to container pods.",
    "Enforces strict least-privilege security between different microservices on shared nodes.",
    "Eliminates the need to store long-term AWS access keys in Kubernetes secrets."
  ],
  "commonMistake": "Mismatched namespace or service account name in the IAM Role Trust Policy. If the trust policy specifies `system:serviceaccount:default:my-app` and the pod is deployed in the `production` namespace, STS will reject the assume-role request with an `AccessDenied` error.",
  "example": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\n        \"Federated\": \"arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXAMPLE\"\n      },\n      \"Action\": \"sts:AssumeRoleWithWebIdentity\",\n      \"Condition\": {\n        \"StringEquals\": {\n          \"oidc.eks.us-east-1.amazonaws.com/id/EXAMPLE:sub\": \"system:serviceaccount:production:analytics-sa\"\n        }\n      }\n    }\n  ]\n}",
  "sources": [
    {
      "title": "IAM Roles for Service Accounts (IRSA)",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html"
    },
    {
      "title": "Configuring a Kubernetes Service Account to Assume an IAM Role",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html"
    }
  ]
});
