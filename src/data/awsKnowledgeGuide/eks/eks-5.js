import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-5",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "Amazon EKS Managed Kubernetes",
  "status": "ready",
  "plainEnglish": "Amazon EKS Managed Kubernetes is the certified upstream Kubernetes service provided by AWS. It runs standard open-source Kubernetes software and APIs, ensuring full compatibility with existing open-source Kubernetes plugins, Helm charts, and manifest files without vendor lock-in. AWS automatically provisions, scales, backs up, and secures the Kubernetes master control plane across at least three Availability Zones in an AWS Region.",
  "whyItMatters": "Running self-managed Kubernetes requires deep systems engineering expertise to handle etcd clustering, TLS certificate rotations, zero-downtime control plane version upgrades, and API server scaling. Amazon EKS provides enterprise-grade reliability with automated scaling and zero-downtime upgrades so developers can deploy standard Kubernetes applications seamlessly.",
  "workplaceExample": "An enterprise with an on-premises Kubernetes cluster decides to adopt AWS. Because Amazon EKS is upstream-certified Kubernetes, they migrate 150 Helm charts and microservice manifests directly to EKS without rewriting any deployment YAML, preserving their developer workflows and CI/CD pipelines.",
  "examFocus": "For SAA-C03, understand that EKS provides upstream open-source Kubernetes compliance. It integrates deeply with native AWS services: IAM for authentication (`aws-auth` / EKS Access Entries), VPC for native pod networking (Amazon VPC CNI), ELB/ALB for ingress traffic (AWS Load Balancer Controller), and KMS for envelope encryption of Kubernetes Secrets.",
  "keyPoints": [
    "Certified upstream Kubernetes: runs standard open-source Kubernetes APIs and binaries.",
    "Compatible with open-source tools: Helm, Kustomize, Prometheus, Istio, and ArgoCD.",
    "Control plane automatically distributed across 3 Availability Zones for high availability.",
    "Integrates natively with AWS VPC networking, IAM authentication, and CloudWatch logging.",
    "Automates control plane version upgrades with zero application downtime."
  ],
  "commonMistake": "Thinking Amazon EKS is a proprietary fork of Kubernetes that requires proprietary AWS APIs. EKS is 100% compliant with standard upstream Kubernetes; any standard Kubernetes manifest that runs locally or on-premises will run identically on EKS.",
  "example": "# Update local kubeconfig to interact with an EKS cluster using standard kubectl:\naws eks update-kubeconfig \\\n  --region us-east-1 \\\n  --name production-cluster\n\n# Standard kubectl commands work out of the box:\nkubectl get nodes -o wide",
  "sources": [
    {
      "title": "What is Amazon EKS?",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html"
    },
    {
      "title": "Amazon EKS Cluster Architecture and Integrations",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/clusters.html"
    }
  ]
});
