import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-34",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Secrets Management",
  "status": "ready",
  "plainEnglish": "Amazon EKS Secrets Management encompasses the security practices and tools used to store, encrypt, and inject sensitive configuration data (such as database passwords, API tokens, and TLS certificates) into Kubernetes Pods. EKS supports two key native AWS security mechanisms: (1) AWS KMS Envelope Encryption (which encrypts native Kubernetes Secrets at rest in the cluster's `etcd` key-value store using an AWS KMS customer-managed key) and (2) The AWS Secrets and Configuration Provider (ASCP) for the Kubernetes Secrets Store CSI Driver, which retrieves secrets directly from AWS Secrets Manager or AWS Systems Manager Parameter Store and mounts them as read-only volume files in container pods.",
  "whyItMatters": "By default, Kubernetes Secrets in `etcd` are only Base64-encoded, not encrypted—meaning anyone with etcd disk access or cluster backup snapshots can read plaintext secrets. KMS envelope encryption ensures cryptographic protection at rest, while the Secrets Store CSI driver avoids storing static secrets in Kubernetes etcd altogether by streaming them directly from AWS Secrets Manager.",
  "workplaceExample": "A banking application on EKS retrieves database credentials from AWS Secrets Manager using the Secrets Store CSI Driver. The CSI driver uses the pod's IRSA role to authenticate, fetches the rotating database password, and mounts it into `/etc/secrets/db-pass` inside the container memory without saving the secret in etcd.",
  "examFocus": "For SAA-C03, know the two AWS solutions for EKS secrets: (1) `KMS Envelope Encryption`: Enables AWS KMS customer managed key (CMK) encryption for native Kubernetes Secrets stored in `etcd` (configured during cluster creation or update). (2) `AWS Secrets Manager / SSM Parameter Store via Secrets Store CSI Driver`: Injects secrets directly into pod volumes from AWS Secrets Manager without persisting secrets in Kubernetes etcd.",
  "keyPoints": [
    "AWS KMS Envelope Encryption encrypts Kubernetes Secrets stored in `etcd` at rest.",
    "Secrets Store CSI Driver (ASCP) mounts secrets directly from AWS Secrets Manager into pods.",
    "Eliminates the risk of Base64 plaintext exposure in Kubernetes manifests and etcd snapshots.",
    "Uses IAM Roles for Service Accounts (IRSA) for granular pod-level access control.",
    "Supports automatic secret rotation syncing from AWS Secrets Manager."
  ],
  "commonMistake": "Assuming standard Kubernetes Secrets are encrypted by default. Out-of-the-box Kubernetes Secrets are only Base64 encoded; you must enable AWS KMS envelope encryption or use AWS Secrets Manager with the CSI driver for true encryption.",
  "example": "# Enable AWS KMS envelope encryption for Kubernetes Secrets in an EKS cluster:\naws eks associate-encryption-config \\\n  --region us-east-1 \\\n  --cluster-name production-cluster \\\n  --encryption-config '[{\"resources\":[\"secrets\"],\"provider\":{\"keyArn\":\"arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012\"}}]'",
  "sources": [
    {
      "title": "Enabling KMS Secrets Encryption on an Amazon EKS Cluster",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/enable-kms.html"
    },
    {
      "title": "AWS Secrets Manager Integration with Amazon EKS",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_csi_driver.html"
    }
  ]
});
