import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-9",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS Self-Managed Nodes",
  "status": "ready",
  "plainEnglish": "EKS Self-Managed Nodes are standard Amazon EC2 instances that you manually provision, configure, and register with your Amazon EKS cluster's control plane using an EC2 Auto Scaling Group and custom bootstrap scripts (`/etc/eks/bootstrap.sh`). Unlike Managed Node Groups, you have 100% control over the underlying operating system (e.g. Ubuntu, Red Hat Enterprise Linux, SUSE), custom AMI builds, custom disk partitioning, and cluster joining logic.",
  "whyItMatters": "Certain heavily regulated industries or specialized applications require custom hardened Linux distributions (like CIS Benchmark RHEL), proprietary monitoring agents baked directly into the OS kernel, or custom networking configurations not supported by AWS Managed Node Groups. Self-managed nodes provide total administrative freedom.",
  "workplaceExample": "A defense contractor must run all container worker nodes on a custom-hardened Red Hat Enterprise Linux (RHEL 9) AMI with specialized FIPS-compliant cryptographic modules. They provision an EC2 Auto Scaling Group with Self-Managed Nodes and execute the EKS bootstrap script in User Data to join their custom RHEL nodes to the EKS cluster.",
  "examFocus": "For SAA-C03, compare Self-Managed Nodes with Managed Node Groups: (1) Self-Managed Nodes require you to manually write User Data scripts to run `/etc/eks/bootstrap.sh <cluster-name>`. (2) You are responsible for OS security patching, rolling upgrades, and node draining. (3) Use Self-Managed Nodes when you require custom OS distributions (RHEL, Ubuntu, CentOS) or complex non-standard AMI configurations.",
  "keyPoints": [
    "Worker nodes manually provisioned via standard EC2 Auto Scaling Groups.",
    "Provides complete control over operating systems (Ubuntu, RHEL, SUSE, custom AMIs).",
    "Requires executing the EKS bootstrap script in User Data to join the cluster.",
    "Customer is responsible for OS updates, patching, and draining during upgrades.",
    "Ideal for specialized regulatory compliance, custom kernels, or unique storage setups."
  ],
  "commonMistake": "Forgetting to include the EKS cluster name in the User Data bootstrap script. Without `/etc/eks/bootstrap.sh <cluster_name>`, the EC2 instance boots as a standard Linux VM and never discovers or registers with the EKS Kubernetes control plane.",
  "example": "#!/bin/bash\n# User Data script for Self-Managed EKS Worker Node on EC2:\nset -o xtrace\n/etc/eks/bootstrap.sh production-cluster \\\n  --kubelet-extra-args '--node-labels=workload=compliance'",
  "sources": [
    {
      "title": "Self-Managed Amazon Linux Nodes in Amazon EKS",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/worker.html"
    },
    {
      "title": "Amazon EKS Node Bootstrap Script",
      "url": "https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html"
    }
  ]
});
