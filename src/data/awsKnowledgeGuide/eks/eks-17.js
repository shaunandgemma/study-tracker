import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-17",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Multi-AZ Control Plane",
  "status": "ready",
  "plainEnglish": "The Amazon EKS Multi-AZ Control Plane is the default, fully managed infrastructure architecture of the Kubernetes master tier provided by AWS. For every EKS cluster you create, AWS automatically provisions multiple API server instances and an odd-numbered distributed `etcd` database cluster spanning at least three distinct Availability Zones within the chosen AWS Region. A Network Load Balancer (NLB) sits in front of the API servers to distribute client traffic and automatically route around any degraded master node.",
  "whyItMatters": "Running a self-managed Kubernetes control plane across multiple data centers requires configuring etcd raft consensus, low-latency network interconnects, and complex load balancing. EKS delivers enterprise-grade Multi-AZ control plane redundancy automatically with zero setup or cluster topology configuration required.",
  "workplaceExample": "A telecommunications company runs a mission-critical 5G network function controller on EKS. When AWS data center maintenance temporarily restarts master node instances in Availability Zone A, the AWS Network Load Balancer routes `kubectl` commands and `kubelet` heartbeats to the surviving API server instances in AZ B and AZ C with zero disruption to active network traffic.",
  "examFocus": "For SAA-C03, know that: (1) EKS control plane is ALWAYS Multi-AZ (distributed across at least 3 AZs) by default without extra configuration. (2) When creating an EKS cluster, you must specify subnets in at least TWO distinct Availability Zones so AWS can place cross-account Elastic Network Interfaces (ENIs). (3) AWS provides a 99.95% availability SLA for the control plane.",
  "keyPoints": [
    "Control plane master instances and etcd are distributed across at least 3 Availability Zones.",
    "Managed Network Load Balancer balances API traffic across active `kube-apiserver` instances.",
    "Guarantees 99.95% control plane uptime SLA backed by AWS.",
    "Cluster creation requires specifying subnets in at least 2 distinct Availability Zones.",
    "AWS automatically handles master node scaling, etcd snapshotting, and health replacement."
  ],
  "commonMistake": "Thinking you need to deploy separate standby EKS clusters in the same Region for control plane high availability. EKS control plane is inherently Multi-AZ and fault-tolerant out of the box within the Region.",
  "example": "# CloudFormation snippet creating an EKS Cluster with Multi-AZ VPC configuration:\nType: AWS::EKS::Cluster\nProperties:\n  Name: production-cluster\n  Version: '1.30'\n  RoleArn: !GetAtt EKSClusterRole.Arn\n  ResourcesVpcConfig:\n    SubnetIds:\n      - !Ref SubnetAZ1\n      - !Ref SubnetAZ2\n      - !Ref SubnetAZ3",
  "sources": [
    {
      "title": "Amazon EKS Cluster Architecture",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/clusters.html"
    },
    {
      "title": "Creating an Amazon EKS Cluster with Multi-AZ VPC",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html"
    }
  ]
});
