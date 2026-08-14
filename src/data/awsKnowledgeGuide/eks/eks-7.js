import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-7",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Worker Nodes",
  "status": "ready",
  "plainEnglish": "EKS Worker Nodes are the Amazon EC2 compute instances or AWS Fargate micro-VMs in your customer VPC that form the Kubernetes Data Plane. Worker nodes run essential Kubernetes node agent software (specifically `kubelet` to manage pod lifecycles, `kube-proxy` or the Amazon VPC CNI plugin to manage networking, and a container runtime like `containerd`) to execute your containerized applications.",
  "whyItMatters": "While the control plane manages cluster intelligence, worker nodes provide the actual CPU, RAM, GPU, and local NVMe storage required to run user workloads. Understanding how worker nodes join and communicate with the EKS cluster is crucial for architecting scalable, cost-effective container infrastructure.",
  "workplaceExample": "A financial data platform provisions a heterogeneous worker node fleet in EKS: general-purpose `m6i.xlarge` nodes for REST API services, compute-optimized `c6i.2xlarge` nodes for risk calculation microservices, and GPU-accelerated `g5.xlarge` nodes for machine learning inference, with Kubernetes node taints and tolerations routing each pod to its specialized node pool.",
  "examFocus": "For SAA-C03, know how worker nodes operate: (1) Run in the customer's VPC subnets. (2) Communicate with the EKS Control Plane via the Kubernetes API server endpoint (over public internet or private VPC endpoints). (3) Require an IAM Node Instance Profile with `AmazonEKSWorkerNodePolicy`, `AmazonEC2ContainerRegistryReadOnly`, and `AmazonEKS_CNI_Policy` to function and pull images.",
  "keyPoints": [
    "Form the Kubernetes Data Plane executing application container pods.",
    "Run `kubelet`, `kube-proxy` / VPC CNI, and `containerd` runtime agents.",
    "Provisioned inside the customer's VPC across private or public subnets.",
    "Require an IAM Instance Profile granting worker node and ECR pull permissions.",
    "Can be organized into specialized node pools using Kubernetes Labels, Taints, and Tolerations."
  ],
  "commonMistake": "Deploying worker nodes in private subnets without a NAT Gateway or VPC Endpoints for ECR, STS, and EKS. Worker nodes will fail to register with the control plane or pull container images because they cannot reach the required AWS API endpoints.",
  "example": "# CloudFormation IAM role required for EKS Worker Nodes:\nType: AWS::IAM::Role\nProperties:\n  AssumeRolePolicyDocument:\n    Version: '2012-10-17'\n    Statement:\n      - Effect: Allow\n        Principal:\n          Service: ec2.amazonaws.com\n        Action: sts:AssumeRole\n  ManagedPolicyArns:\n    - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy\n    - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy\n    - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  "sources": [
    {
      "title": "Amazon EKS Worker Nodes",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/worker.html"
    },
    {
      "title": "Amazon EKS Node IAM Role",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html"
    }
  ]
});
