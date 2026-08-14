import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-1",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Managed Control Plane & Node Groups (Managed Nodes, Self-Managed, Fargate Profiles)",
  "status": "ready",
  "plainEnglish": "Amazon Elastic Kubernetes Service (Amazon EKS) is a managed container orchestration service that runs open-source Kubernetes on AWS without requiring you to install, operate, or maintain your own Kubernetes control plane. EKS splits the architecture into two distinct components: (1) AWS-Managed Control Plane (running `kube-apiserver`, `etcd`, scheduler, and controller managers across multiple Availability Zones with automated patching and high availability) and (2) Data Plane Worker Compute, which supports three execution models: Managed Node Groups (automated EC2 lifecycle), Self-Managed Nodes (custom EC2 configurations), and Serverless AWS Fargate Profiles (zero EC2 management).",
  "whyItMatters": "Operating a self-hosted Kubernetes control plane (`etcd` clustering, master node quorum, OS upgrades, and backup routines) is notoriously complex and prone to split-brain failures. Amazon EKS offloads 100% of control plane operational toil to AWS with a 99.95% uptime SLA, allowing engineering teams to focus purely on containerized application logic.",
  "workplaceExample": "A retail company migrates its Kubernetes microservices to EKS. They use the AWS-managed multi-AZ control plane for high availability, deploy core steady-state backend services on EKS Managed Node Groups with Spot EC2 instances to reduce compute costs by 70%, and run spiky burst workloads on AWS Fargate Profiles with zero server management.",
  "examFocus": "For SAA-C03, know the three worker compute compute options in EKS: (1) `Managed Node Groups`: AWS automates EC2 provisioning, AMI updates, draining, and termination via Auto Scaling Groups. (2) `Self-Managed Nodes`: You manually configure EC2 instances, launch templates, and join scripts. (3) `AWS Fargate`: Serverless pod execution where each Pod runs in its own isolated VM with no EC2 instances or daemonsets.",
  "keyPoints": [
    "AWS manages high availability, scalability, and patching of the Kubernetes control plane.",
    "Certified Kubernetes compliant: compatible with standard `kubectl` and upstream tooling.",
    "Managed Node Groups: AWS automatically handles EC2 provisioning, updates, and node draining.",
    "Self-Managed Nodes: Full OS-level control over custom AMIs and kernel parameters.",
    "AWS Fargate Profiles: Serverless execution where each pod runs in its own isolated VM environment."
  ],
  "commonMistake": "Attempting to run Kubernetes DaemonSets on AWS Fargate in EKS. Fargate assigns dedicated virtual machines per Pod and does not allow host-level access or DaemonSets; use EC2 Managed Node Groups if you require DaemonSets (e.g. for Fluentbit or Datadog agents).",
  "example": "# Create an EKS cluster with managed EC2 node group using eksctl:\neksctl create cluster \\\n  --name production-cluster \\\n  --region us-east-1 \\\n  --version 1.30 \\\n  --nodegroup-name standard-workers \\\n  --node-type t3.medium \\\n  --nodes 3 \\\n  --nodes-min 1 \\\n  --nodes-max 6 \\\n  --managed",
  "sources": [
    {
      "title": "What is Amazon EKS?",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html"
    },
    {
      "title": "Amazon EKS Node Management Options",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html"
    }
  ]
});
