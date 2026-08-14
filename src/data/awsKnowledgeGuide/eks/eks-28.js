import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-28",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS with EFS",
  "status": "ready",
  "plainEnglish": "Amazon EKS with Amazon EFS connects your Kubernetes Pods to a fully managed, scalable Network File System (NFS) using the Amazon EFS CSI driver. Unlike Amazon EBS (which is single-AZ and attaches to one node at a time), Amazon EFS supports the `ReadWriteMany` (RWX) access mode, allowing dozens or hundreds of pods distributed across multiple Availability Zones—running on EC2 worker nodes or AWS Fargate—to read and write to the same shared file system concurrently.",
  "whyItMatters": "Many web applications (such as WordPress, Drupal, Jenkins build nodes, shared machine learning training datasets, and multi-pod file repositories) require multiple container replicas across different AZs to share access to a single common directory tree. Amazon EFS provides that shared multi-AZ file layer natively.",
  "workplaceExample": "A content publisher runs a WordPress cluster on EKS with 12 pod replicas distributed across 3 Availability Zones. All 12 WordPress pods mount a shared Amazon EFS file system at `/var/www/html/wp-content/uploads` using the EFS CSI driver. When a writer uploads an article image on one pod, it is immediately available to all other 11 pods across every AZ.",
  "examFocus": "For SAA-C03, remember key architectural traits of EFS on EKS: (1) Multi-AZ availability: EFS mount targets exist in every AZ, enabling cross-AZ shared file access. (2) Access Mode: Supports `ReadWriteMany` (RWX). (3) AWS Fargate compatibility: Amazon EFS is fully supported on AWS Fargate (unlike EBS). (4) Dynamic provisioning supports EFS Access Points to enforce POSIX user IDs and root directory isolation per pod.",
  "keyPoints": [
    "Provides shared, elastic NFS file storage across multiple Kubernetes pods.",
    "Supports `ReadWriteMany` (RWX) access mode across multiple Availability Zones.",
    "Fully supported on both EC2 worker nodes and serverless AWS Fargate pods.",
    "Uses the Amazon EFS CSI Driver (installed as an Amazon EKS Add-on).",
    "Integrates with Amazon EFS Access Points for path-level security and POSIX user isolation."
  ],
  "commonMistake": "Configuring security group rules that block NFS port 2049 between EKS worker nodes (or Fargate pods) and the EFS Mount Targets. Worker node security groups must allow inbound TCP port 2049 to the EFS mount target security group.",
  "example": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: efs-shared-pvc\nspec:\n  accessModes:\n    - ReadWriteMany\n  storageClassName: efs-sc\n  resources:\n    requests:\n      storage: 50Gi",
  "sources": [
    {
      "title": "Amazon EFS CSI Driver for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html"
    },
    {
      "title": "Configuring Amazon EFS Shared Storage on EKS and Fargate",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/efs-fargate.html"
    }
  ]
});
