import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-6",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Control Plane",
  "status": "ready",
  "plainEnglish": "The Amazon EKS Control Plane is the master management tier of Kubernetes that controls scheduling, cluster state, and API requests across your cluster. AWS provisions, scales, and manages the control plane instances (including `kube-apiserver`, `etcd`, `kube-controller-manager`, and `kube-scheduler`) across at least three distinct Availability Zones in an AWS-managed VPC that is transparently connected to your own VPC via Elastic Network Interfaces (ENIs).",
  "whyItMatters": "The Kubernetes control plane is the brain of your container infrastructure. If the control plane goes down, deployments cannot be updated, failed pods cannot be rescheduled, and autoscaling halts. AWS guarantees a 99.95% uptime SLA for the EKS control plane and automatically replaces degraded master nodes behind the scenes.",
  "workplaceExample": "A high-traffic e-commerce cluster experiences thousands of deployment and pod rescheduling events during Black Friday. The EKS managed control plane automatically scales up its underlying API server capacity and etcd storage to absorb the high API request throughput without manual intervention from cluster administrators.",
  "examFocus": "For SAA-C03, know how the EKS Control Plane operates: (1) Single-tenant master instances running in an AWS-managed VPC across 3 Availability Zones. (2) Connects to your worker VPC via cross-account Elastic Network Interfaces (ENIs). (3) Cost model: Fixed hourly fee per cluster ($0.10/hour). (4) Control plane logs (API, Audit, Authenticator, ControllerManager, Scheduler) can be streamed directly to Amazon CloudWatch Logs.",
  "keyPoints": [
    "AWS-managed, single-tenant Kubernetes master nodes running across 3 Availability Zones.",
    "Runs core Kubernetes components: `kube-apiserver`, `etcd`, `kube-scheduler`, `kube-controller-manager`.",
    "Connects securely to your customer VPC via cross-account Elastic Network Interfaces (ENIs).",
    "Provides 99.95% uptime Service Level Agreement (SLA).",
    "Control plane logs can be enabled and streamed directly to Amazon CloudWatch Logs."
  ],
  "commonMistake": "Thinking you have SSH or direct host access to EKS control plane master instances. AWS manages the control plane infrastructure completely; you interact with it solely through the Kubernetes API endpoint.",
  "example": "# Enable all EKS control plane logging types to Amazon CloudWatch Logs:\naws eks update-cluster-config \\\n  --region us-east-1 \\\n  --name production-cluster \\\n  --logging '{\"clusterLogging\":[{\"types\":[\"api\",\"audit\",\"authenticator\",\"controllerManager\",\"scheduler\"],\"enabled\":true}]}'",
  "sources": [
    {
      "title": "Amazon EKS Cluster Control Plane Overview",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/clusters.html"
    },
    {
      "title": "Amazon EKS Control Plane Logging",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html"
    }
  ]
});
