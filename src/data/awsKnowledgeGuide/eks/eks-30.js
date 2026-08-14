import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-30",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Auto Scaling",
  "status": "ready",
  "plainEnglish": "EKS Auto Scaling is the multi-layered scaling architecture that automatically adjusts both your application container replicas (pod-level scaling) and your underlying compute infrastructure (node-level scaling) based on live workload demand. Pod-level scaling is handled by the Horizontal Pod Autoscaler (HPA), which adds or removes pod replicas based on CPU/memory utilization or custom metrics. Node-level scaling is handled by the Kubernetes Cluster Autoscaler (which adds/removes EC2 instances in Auto Scaling Groups when pods are pending) or Karpenter (an open-source, high-performance node provisioner that bypasses ASGs to launch right-sized EC2 instances in seconds).",
  "whyItMatters": "If you scale only pods (HPA) without scaling worker nodes, newly scaled pods will get stuck in a `Pending` state with 'Insufficient CPU/Memory' errors when existing nodes fill up. Auto Scaling pairs pod scaling with automated node provisioning to deliver complete elasticity.",
  "workplaceExample": "A flash-sale retail service runs on EKS. Traffic surges by 500%. HPA detects pod CPU exceeding 70% and scales pod replicas from 10 to 80. The Cluster Autoscaler detects that existing worker nodes have run out of capacity for the 70 new pods, automatically increases the EC2 Auto Scaling Group size from 4 to 20 nodes, and reschedules all pending pods in under 3 minutes.",
  "examFocus": "For SAA-C03, know the two layers of EKS scaling: (1) `Horizontal Pod Autoscaler (HPA)`: Scales number of pod replicas based on metrics (requires Metrics Server installed in cluster). (2) `Cluster Autoscaler`: Scales the underlying EC2 Auto Scaling Group when pods cannot be scheduled due to insufficient resource capacity. (3) `Karpenter`: Modern AWS-developed provisioner that launches optimal EC2 instance types directly without ASGs.",
  "keyPoints": [
    "Two-layer scaling model: Pod-level scaling (HPA) + Node-level scaling (Cluster Autoscaler / Karpenter).",
    "Horizontal Pod Autoscaler (HPA) adjusts pod replica count based on CPU, memory, or custom metrics.",
    "Kubernetes Metrics Server is required in the cluster to provide resource metrics to HPA.",
    "Cluster Autoscaler monitors for `Pending` pods and adjusts EC2 Auto Scaling Group capacity.",
    "Karpenter launches right-sized EC2 compute directly based on specific pod resource requirements."
  ],
  "commonMistake": "Configuring HPA without installing the Kubernetes Metrics Server in the EKS cluster. Without Metrics Server, `kubectl top nodes` and HPA cannot collect CPU/memory metrics, causing HPA to fail silently.",
  "example": "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: web-app-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: web-app\n  minReplicas: 2\n  maxReplicas: 20\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 60",
  "sources": [
    {
      "title": "Horizontal Pod Autoscaler in Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html"
    },
    {
      "title": "Cluster Autoscaler for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html"
    }
  ]
});
