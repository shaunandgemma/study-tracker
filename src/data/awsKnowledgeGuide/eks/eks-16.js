import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-16",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "Kubernetes Cluster High Availability",
  "status": "ready",
  "plainEnglish": "Kubernetes Cluster High Availability (HA) in Amazon EKS is the end-to-end architectural design that ensures your containerized applications continue running without interruption even during data center power failures, hardware faults, or Availability Zone outages. High availability in EKS spans two layers: (1) Control Plane HA (AWS automatically provisions and manages multi-AZ API servers and etcd quorum) and (2) Data Plane HA (distributing EC2 worker nodes and Kubernetes Pods evenly across multiple Availability Zones using topology spread constraints and multi-AZ load balancers).",
  "whyItMatters": "Running a container cluster in a single Availability Zone creates a single point of failure (SPOF). True enterprise resilience requires both the control plane and data plane to survive physical infrastructure disruptions with automated failover and zero human intervention.",
  "workplaceExample": "A banking platform deploys an EKS cluster spanning 3 AZs. They configure their Kubernetes deployments with a `topologySpreadConstraint` set to `topologyKey: topology.kubernetes.io/zone` and `maxSkew: 1`. When AZ 1 suffers an unexpected power loss, the Application Load Balancer shifts traffic to AZ 2 and AZ 3, while Kubernetes reschedules lost pods on surviving worker nodes in seconds.",
  "examFocus": "For SAA-C03, remember the rules for full EKS HA: (1) EKS control plane is inherently Multi-AZ across at least 3 AZs by default. (2) Worker nodes must be provisioned in subnets across multiple AZs. (3) Application Pods must use `topologySpreadConstraints` or `podAntiAffinity` to prevent all replicas from being scheduled on the same node or in the same AZ. (4) Use AWS Load Balancer Controller with an Application Load Balancer across multi-AZ subnets.",
  "keyPoints": [
    "End-to-end resilience covering both the EKS control plane and worker data plane.",
    "Control plane runs automatically across 3 AZs with automated etcd quorum management.",
    "Worker nodes must be placed in subnets spanning at least 2 or 3 distinct Availability Zones.",
    "Use Kubernetes `topologySpreadConstraints` to balance pods evenly across AZs.",
    "Use `PodDisruptionBudgets` (PDB) to prevent voluntary node drains from violating SLA limits."
  ],
  "commonMistake": "Deploying 10 pod replicas without topology spread constraints or anti-affinity. Kubernetes may schedule all 10 replicas onto worker nodes in the same Availability Zone, meaning an outage in that single AZ takes down the entire application.",
  "example": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ha-web-service\nspec:\n  replicas: 6\n  template:\n    spec:\n      topologySpreadConstraints:\n        - maxSkew: 1\n          topologyKey: topology.kubernetes.io/zone\n          whenUnsatisfiable: DoNotSchedule\n          labelSelector:\n            matchLabels:\n              app: ha-web-service",
  "sources": [
    {
      "title": "Amazon EKS Resilience and High Availability",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/clusters.html"
    },
    {
      "title": "Best Practices for High Availability in Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/best-practices.html"
    }
  ]
});
