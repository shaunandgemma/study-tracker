import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-10",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS with AWS Fargate",
  "status": "ready",
  "plainEnglish": "Amazon EKS with AWS Fargate allows you to run Kubernetes Pods serverlessly without managing, provisioning, patching, or scaling underlying Amazon EC2 worker node instances. Under this model, each Kubernetes Pod runs inside its own dedicated, single-tenant micro-virtual-machine with compute and memory resources sized exactly to the pod's CPU/memory requests, providing VM-level isolation and zero server management.",
  "whyItMatters": "Managing EC2 worker nodes involves capacity planning, packing pods efficiently (bin-packing), patching Linux kernels, and paying for idle EC2 head-room. EKS with Fargate eliminates server management overhead entirely; you pay only for the exact vCPU and memory consumed by each pod while it is executing.",
  "workplaceExample": "A payment processing API experiences unpredictable, spiky batch jobs that need strong PCI-DSS multi-tenant workload isolation. By running these pods on EKS with AWS Fargate, every job executes in a dedicated single-tenant micro-VM with no shared kernel or memory with other pods, and compute terminates instantly upon job completion.",
  "examFocus": "For SAA-C03, know the architecture and constraints of EKS with Fargate: (1) Serverless: no EC2 instances to manage or patch. (2) Dedicated VM per Pod: no shared kernel with other pods. (3) Constraints: No DaemonSets allowed (use sidecars instead), No Privileged containers, No hostPort/hostNetwork, No EBS volumes (Amazon EFS is supported via EFS CSI Driver), and Pods must run in private VPC subnets with NAT Gateway/VPC Endpoints.",
  "keyPoints": [
    "Serverless compute engine for running Kubernetes Pods without managing EC2 instances.",
    "VM-level isolation: Each pod runs in its own dedicated, single-tenant micro-virtual machine.",
    "Pay-as-you-go pricing based on exact vCPU and memory allocated per pod.",
    "Does not support DaemonSets, privileged containers, or Amazon EBS volumes.",
    "Supports Amazon EFS shared storage and Application Load Balancer IP-target routing.",
    "Requires pods to run in private subnets with internet or VPC endpoint connectivity."
  ],
  "commonMistake": "Attempting to attach an Amazon EBS volume to an EKS pod running on AWS Fargate. Fargate pods cannot attach EBS block storage; use Amazon EFS if persistent storage is required on Fargate.",
  "example": "# Create a Fargate Profile routing pods in the 'serverless' namespace to Fargate:\naws eks create-fargate-profile \\\n  --fargate-profile-name serverless-apps \\\n  --cluster-name production-cluster \\\n  --pod-execution-role-arn arn:aws:iam::123456789012:role/EKSFargatePodRole \\\n  --selectors namespace=serverless",
  "sources": [
    {
      "title": "AWS Fargate Considerations for Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html"
    },
    {
      "title": "AWS Fargate with Amazon EKS Overview",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/fargate.html"
    }
  ]
});
