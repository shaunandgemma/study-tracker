import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-35",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Private Endpoint Access",
  "status": "ready",
  "plainEnglish": "Amazon EKS Private Endpoint Access is a cluster networking security configuration where the Kubernetes API server endpoint is only reachable from within your Amazon VPC or connected private networks (via AWS Direct Connect, AWS Site-to-Site VPN, or VPC Peering). With private endpoint access enabled and public access disabled, the cluster API server resolves to a private IP address within your VPC subnets, blocking all inbound traffic from the public internet.",
  "whyItMatters": "Enterprise compliance frameworks (such as FedRAMP, HIPAA, and PCI-DSS) strictly forbid exposing cluster management interfaces or API server ports (443) to the public internet. Private endpoint access ensures that `kubectl` traffic and worker node registration communication stay entirely within private, encrypted AWS network backbones.",
  "workplaceExample": "A government agency deploys an EKS cluster with `EndpointPublicAccess: false` and `EndpointPrivateAccess: true`. Developers cannot access the cluster over the public internet; instead, they connect through a corporate AWS Client VPN into the internal transit VPC to run `kubectl` commands securely.",
  "examFocus": "For SAA-C03, understand the three EKS endpoint configurations: (1) `Public only (default)`: API server accessible from internet; worker node traffic routes out of VPC to public endpoint. (2) `Public and Private`: `kubectl` connects from internet or CIDR whitelist, while worker nodes communicate with the API server privately inside the VPC. (3) `Private only`: Zero internet access to the API server; all `kubectl` and worker node traffic must originate from inside the VPC or connected VPN/Direct Connect.",
  "keyPoints": [
    "Restricts Kubernetes API server access exclusively to private VPC and connected networks.",
    "Completely eliminates internet attack surfaces for Kubernetes cluster control planes.",
    "Worker nodes and `kubectl` clients communicate with the API server via private VPC ENIs.",
    "Can be configured as Private Only, Public Only, or Hybrid (Public + Private).",
    "Requires a bastion host, AWS Client VPN, or Direct Connect for remote administrative access."
  ],
  "commonMistake": "Disabling public endpoint access without having a VPN, Direct Connect, or bastion host inside the VPC. You will immediately lock yourself out of running `kubectl` commands from your local developer machine.",
  "example": "# Update EKS cluster to enable Private Endpoint access and disable Public access:\naws eks update-cluster-config \\\n  --region us-east-1 \\\n  --name production-cluster \\\n  --resources-vpc-config endpointPrivateAccess=true,endpointPublicAccess=false",
  "sources": [
    {
      "title": "Amazon EKS Cluster Endpoint Access Control",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html"
    },
    {
      "title": "Creating a Private Amazon EKS Cluster",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/private-clusters.html"
    }
  ]
});
