import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-37",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS vs ECS",
  "status": "ready",
  "plainEnglish": "Amazon Elastic Container Service (Amazon ECS) and Amazon Elastic Kubernetes Service (Amazon EKS) are AWS's two flagship managed container orchestration services. (1) Amazon ECS is an AWS-opinionated, deeply integrated, lightweight container orchestrator designed for simplicity and seamless AWS native service integration. (2) Amazon EKS is a certified open-source Kubernetes service designed for organizations requiring full Kubernetes ecosystem compatibility, advanced custom scheduling, multi-cloud portability, or migration of existing Kubernetes workloads.",
  "whyItMatters": "Choosing between ECS and EKS is one of the most critical architectural decisions for containerized cloud workloads. ECS delivers faster time-to-market and lower operational overhead for AWS-centric teams, whereas EKS provides open-source standardization and maximum architectural flexibility for Kubernetes-trained engineering teams.",
  "workplaceExample": "A company adopts both services for different use cases: their internal developer platform and core enterprise microservices run on EKS to leverage standard Helm charts and GitOps tooling (ArgoCD), while their simple web API prototypes and internal event-driven microservices run on Amazon ECS with AWS Fargate for zero-management simplicity.",
  "examFocus": "For SAA-C03, know how to decide between ECS and EKS: (1) Choose ECS when: The team wants simplicity, deep AWS-native integration, minimal operational complexity, or AWS-native Task Definitions. (2) Choose EKS when: The requirement specifies open-source Kubernetes, Helm charts, multi-cloud portability, existing Kubernetes expertise, or complex custom controllers (CRDs/Operators).",
  "keyPoints": [
    "Amazon ECS: AWS-native, highly simplified, deeply integrated with AWS ecosystem.",
    "Amazon EKS: Upstream open-source Kubernetes, ecosystem compatibility, portable across clouds.",
    "ECS uses Task Definitions and Services; EKS uses standard Kubernetes Pods and Deployments.",
    "Both support AWS Fargate for serverless container execution.",
    "EKS charges a fixed control plane fee ($0.10/hr); ECS control plane is free.",
    "EKS supports advanced Kubernetes tools: Helm, Kustomize, Istio, Prometheus, and ArgoCD."
  ],
  "commonMistake": "Choosing EKS solely for simple web applications when the engineering team has zero Kubernetes experience. EKS introduces significant Kubernetes operational complexity (RBAC, CNI, CRDs); ECS is generally the faster and simpler choice for AWS-native teams.",
  "example": "# Comparison of container definitions:\n# ECS Task Definition (AWS JSON) vs EKS Pod Spec (Standard Kubernetes YAML)\n# EKS Deployment Example:\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/web:latest",
  "sources": [
    {
      "title": "Choosing Between Amazon ECS and Amazon EKS",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/architecting-containers-aws/choosing-between-amazon-ecs-and-amazon-eks.html"
    },
    {
      "title": "Containers on AWS Overview",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html"
    }
  ]
});
