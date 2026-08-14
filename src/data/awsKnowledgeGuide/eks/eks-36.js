import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-36",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Public Endpoint Access",
  "status": "ready",
  "plainEnglish": "Amazon EKS Public Endpoint Access is the cluster network configuration where the Kubernetes API server endpoint is assigned a public IP address and can be reached from the public internet over HTTPS (port 443). By default, new Amazon EKS clusters have public endpoint access enabled. To secure the public endpoint against unauthorized internet traffic, administrators can configure Public Access CIDR Blocks (IP whitelists) to restrict API access strictly to designated corporate office or CI/CD IP ranges.",
  "whyItMatters": "Public endpoint access provides the simplest, lowest-friction management experience for remote developer teams and external CI/CD pipelines (such as GitHub Actions or GitLab CI) that need to run `kubectl apply` commands without requiring complex VPN tunnels or Direct Connect circuits.",
  "workplaceExample": "A distributed startup with engineers working globally leaves public endpoint access enabled on its development EKS cluster. To secure the endpoint, they configure a Public Access CIDR Whitelist containing only their corporate static NAT Gateway IP and the CI/CD runner IP blocks, blocking all random internet traffic from reaching the Kubernetes API.",
  "examFocus": "For SAA-C03, know how to secure a public EKS endpoint: (1) By default, public endpoint allows `0.0.0.0/0` (any IP). (2) To secure without disabling public access, configure `publicAccessCidrs` to restrict connections to trusted source IP CIDR ranges. (3) Best practice for production: Enable both Public and Private endpoints with CIDR whitelisting on public, so worker nodes use the fast, secure private VPC path while administrators use the whitelisted public endpoint.",
  "keyPoints": [
    "Default EKS network configuration where the Kubernetes API is reachable over the internet.",
    "Enables simple `kubectl` access for remote developers and external CI/CD runners.",
    "Can be restricted using Public Access CIDR Whitelists (`publicAccessCidrs`).",
    "Hybrid mode (Public + Private) routes worker node traffic over private VPC ENIs.",
    "All API communications are encrypted in transit using TLS on port 443."
  ],
  "commonMistake": "Leaving public endpoint access open to `0.0.0.0/0` on sensitive production clusters. While authentication still requires IAM and RBAC, exposing the API endpoint invites port scanning and brute-force attempts; always restrict CIDRs or use private endpoints for production.",
  "example": "# Restrict EKS public endpoint to specific corporate office CIDR blocks:\naws eks update-cluster-config \\\n  --region us-east-1 \\\n  --name production-cluster \\\n  --resources-vpc-config endpointPublicAccess=true,publicAccessCidrs='[\"203.0.113.50/32\",\"198.51.100.0/24\"]'",
  "sources": [
    {
      "title": "Amazon EKS Cluster Endpoint Access Control",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html"
    },
    {
      "title": "Modifying Cluster Endpoint Access",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/modify-cluster-endpoint.html"
    }
  ]
});
