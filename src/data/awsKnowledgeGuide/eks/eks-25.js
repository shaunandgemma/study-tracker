import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-25",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS with Application Load Balancer",
  "status": "ready",
  "plainEnglish": "Amazon EKS with Application Load Balancer (ALB) uses the AWS Load Balancer Controller to automatically provision and manage an Application Load Balancer whenever a Kubernetes `Ingress` resource is created. The controller configures the ALB to route HTTP/HTTPS traffic directly to the private IP addresses of your Kubernetes Pods (`target-type: ip`) or to NodePort services on EC2 worker nodes (`target-type: instance`).",
  "whyItMatters": "Routing ingress traffic to Kubernetes pods through traditional NodePort mode introduces extra network hops (hairpin routing through `kube-proxy` on random worker nodes). The AWS Load Balancer Controller with IP-mode routing allows the ALB to route directly to Pod ENI IPs, reducing network latency, preserving client source IP addresses, and enabling seamless integration with AWS WAF and AWS Certificate Manager (ACM).",
  "workplaceExample": "A web platform runs 12 different microservices on EKS. They install the AWS Load Balancer Controller and deploy a single Kubernetes Ingress manifest with path-based routing rules (`/api/users` -> `user-service`, `/api/orders` -> `order-service`). The controller provisions an ALB with SSL termination via ACM and routes traffic directly to individual pod IPs.",
  "examFocus": "For SAA-C03, know how ALB integrates with EKS: (1) Requires installing the `AWS Load Balancer Controller` (running as an in-cluster deployment with IRSA). (2) Triggered by Kubernetes `Ingress` resources (whereas Kubernetes `Service` of `type: LoadBalancer` with NLB annotations triggers a Network Load Balancer). (3) Supports `alb.ingress.kubernetes.io/target-type: ip` for direct-to-pod routing (mandatory for AWS Fargate pods).",
  "keyPoints": [
    "AWS Load Balancer Controller provisions and manages ALBs via Kubernetes Ingress objects.",
    "Supports IP-mode target routing (`target-type: ip`) directly to Pod private IP addresses.",
    "Mandatory for routing external HTTP/HTTPS traffic to EKS pods running on AWS Fargate.",
    "Integrates natively with AWS Certificate Manager (ACM) for TLS/SSL termination.",
    "Supports AWS WAF integration via the `alb.ingress.kubernetes.io/wafv2-acl-arn` annotation."
  ],
  "commonMistake": "Creating a Kubernetes Ingress resource without first installing the AWS Load Balancer Controller and setting up its IRSA role. Without the controller running in the cluster, the Ingress object will sit in a pending state forever without provisioning an ALB.",
  "example": "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: web-ingress\n  annotations:\n    alb.ingress.kubernetes.io/scheme: internet-facing\n    alb.ingress.kubernetes.io/target-type: ip\nspec:\n  ingressClassName: alb\n  rules:\n    - http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web-service\n                port:\n                  number: 80",
  "sources": [
    {
      "title": "Application Load Balancing on Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html"
    },
    {
      "title": "AWS Load Balancer Controller Installation and Architecture",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html"
    }
  ]
});
