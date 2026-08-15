import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-3",
  "title": "Fargate with Amazon EKS",
  "plainEnglish": "Amazon Elastic Kubernetes Service (EKS) with AWS Fargate enables organizations to run standard Kubernetes pods on serverless compute. Instead of provisioning and maintaining a fleet of EC2 worker nodes or managed node groups for your Kubernetes cluster, you define Fargate Profiles that automatically direct matching Kubernetes pods to run on serverless Fargate infrastructure.",
  "whyItMatters": "Running Kubernetes worker nodes requires patching Linux AMIs, managing Kubernetes node daemons (kubelet, kube-proxy), and continually adjusting Cluster Autoscaler or Karpenter. EKS on Fargate simplifies operations by dedicating a standalone, secure microVM to every single Kubernetes pod with zero underlying node management.",
  "workplaceExample": "A healthcare startup runs sensitive microservices in Kubernetes on Amazon EKS. To satisfy strict compliance requirements for kernel-level tenant isolation, they create EKS Fargate Profiles matching their payment and patient data namespaces, ensuring every pod executes in its own isolated microVM without sharing a host kernel with other pods.",
  "examFocus": "Know how EKS uses 'Fargate Profiles' to decide which Kubernetes pods run on Fargate based on namespace and Kubernetes label selectors. Understand key EKS Fargate constraints: each pod runs in its own 1:1 dedicated Fargate VM, DaemonSets are not supported, pods must use private subnets, and privileged containers or host networking are disallowed.",
  "keyPoints": [
    "Amazon EKS runs Kubernetes pods on AWS Fargate without provisioning or managing EC2 worker nodes.",
    "Fargate Profiles define which pods should run on Fargate by matching Kubernetes namespaces and optional label selectors.",
    "Each Kubernetes pod scheduled on Fargate runs in its own dedicated, isolated microVM (1:1 mapping between pod and VM).",
    "DaemonSets are not supported on EKS Fargate because there are no shared worker nodes on which to run background daemons.",
    "EKS pods running on Fargate must run in private VPC subnets with NAT Gateway or VPC endpoint connectivity to reach AWS APIs.",
    "Supports IAM Roles for Service Accounts (IRSA) to grant fine-grained AWS permissions to specific Kubernetes pods running on Fargate."
  ],
  "commonMistake": "Attempting to deploy Kubernetes DaemonSets (such as log shippers or monitoring agents) onto EKS Fargate pods. Because Fargate does not use shared worker nodes, DaemonSet pods will not be scheduled; you must use sidecar containers in your pod spec instead.",
  "example": "Create an EKS Fargate profile using eksctl: eksctl create fargateprofile --cluster production-eks --name fp-microservices --namespace backend-services --labels tier=backend.",
  "sources": [
    {
      "title": "AWS Fargate with Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/fargate.html"
    },
    {
      "title": "Amazon EKS Fargate Profiles",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html"
    }
  ]
});
