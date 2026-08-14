import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-8",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Managed Node Groups",
  "status": "ready",
  "plainEnglish": "Amazon EKS Managed Node Groups automate the provisioning, lifecycle management, and rolling upgrades of EC2 worker nodes in your EKS cluster. When you create a managed node group, Amazon EKS provisions and configures an Amazon EC2 Auto Scaling Group for you, running an AWS-optimized Amazon Linux, Bottlerocket, or Windows AMI. When it's time to upgrade Kubernetes versions, EKS automatically drains existing pods gracefully, terminates old nodes, and provisions new nodes with zero downtime.",
  "whyItMatters": "Upgrading self-managed Kubernetes nodes manually requires complex cordon-and-drain scripts, AMIs rebuilds, and risk of pod termination errors. Managed Node Groups turn full-fleet OS and Kubernetes version upgrades into a single API call or button click in the AWS console.",
  "workplaceExample": "A DevOps team needs to upgrade their EKS worker nodes from Kubernetes v1.29 to v1.30. They initiate a Managed Node Group update via the AWS CLI. EKS cordons and drains each node one at a time, allowing Kubernetes to reschedule pods onto newly launched v1.30 nodes before terminating the old instances, achieving a seamless zero-downtime rolling upgrade.",
  "examFocus": "For SAA-C03, understand Managed Node Group capabilities: (1) Provisioned and updated directly via EKS APIs / console. (2) Uses Amazon EKS-optimized AMIs (Amazon Linux 2/2023 or Bottlerocket). (3) Supports EC2 Spot instances for up to 90% cost savings. (4) Handles rolling updates with automated Kubernetes node draining (`kubectl drain`). (5) Can be configured with custom Launch Templates for advanced networking or storage options.",
  "keyPoints": [
    "AWS-managed EC2 Auto Scaling Groups designed specifically for Amazon EKS.",
    "Automates OS patching and Kubernetes version upgrades with graceful node draining.",
    "Uses Amazon EKS-optimized AMIs with pre-configured `kubelet` and container runtimes.",
    "Supports On-Demand and Spot instances across multiple instance types.",
    "Can be customized using EC2 Launch Templates for custom storage and networking."
  ],
  "commonMistake": "Manually terminating an EC2 instance in a Managed Node Group without cordoning and draining first. Always use the EKS Managed Node Group update API or `kubectl drain` so Kubernetes can safely reschedule running pods.",
  "example": "# Update an EKS Managed Node Group to the latest AMI version:\naws eks update-nodegroup-version \\\n  --region us-east-1 \\\n  --cluster-name production-cluster \\\n  --nodegroup-name standard-workers",
  "sources": [
    {
      "title": "Amazon EKS Managed Node Groups",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html"
    },
    {
      "title": "Updating a Managed Node Group",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/update-managed-node-group.html"
    }
  ]
});
