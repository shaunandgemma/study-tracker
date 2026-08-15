import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-4",
  "title": "Systems Manager Managed Nodes",
  "plainEnglish": "A Systems Manager Managed Node is any compute resource—such as an Amazon EC2 instance, on-premises physical server, edge device, or virtual machine in another cloud—that is registered with and actively controlled by AWS Systems Manager. For a server to qualify as a managed node, it must have the SSM Agent installed and running, possess outbound network connectivity to Systems Manager service endpoints, and have an attached IAM instance profile (or hybrid activation role) with required SSM permissions.",
  "whyItMatters": "Before you can run commands, patch operating systems, collect software inventory, or establish shell sessions on a machine, Systems Manager must recognize it as a healthy managed node. Managing all compute instances as unified managed nodes gives administrators a centralized control plane (Fleet Manager) across heterogeneous cloud and on-premises environments.",
  "workplaceExample": "A DevOps team provisions a fleet of 200 Amazon EC2 Linux instances across 3 Availability Zones. When reviewing Fleet Manager in the AWS Systems Manager console, the team notices 10 instances are missing from the managed node list. A quick inspection reveals those 10 instances were launched without an IAM instance profile. Once the `AmazonSSMManagedInstanceCore` role is attached, SSM Agent authenticates with AWS, and all 10 instances immediately register as active managed nodes.",
  "examFocus": "Understand the three prerequisites for a node to become a Systems Manager Managed Node: (1) SSM Agent: Must be installed, configured, and running on the OS. (2) Outbound Connectivity: Node must be able to reach AWS SSM endpoints via Internet Gateway, NAT Gateway, or VPC Interface Endpoints on port 443. (3) IAM Permissions: Must have an attached IAM role with `AmazonSSMManagedInstanceCore` policy attached (note: legacy `AmazonEC2RoleforSSM` is deprecated). (4) Hybrid Activation: Non-EC2 on-premises servers require a Hybrid Activation code and ID.",
  "keyPoints": [
    "Represents any EC2 instance, on-premises server, or hybrid VM registered with Systems Manager.",
    "Managed centrally via AWS Systems Manager Fleet Manager and Node Management tools.",
    "Requires three essentials: running SSM Agent, outbound network connectivity, and valid IAM role.",
    "Recommended IAM managed policy is `AmazonSSMManagedInstanceCore`.",
    "EC2 instances in private subnets require NAT Gateways or VPC Interface Endpoints to communicate.",
    "On-premises machines register as managed nodes using an SSM Hybrid Activation code and ID."
  ],
  "commonMistake": "Attaching the legacy, deprecated `AmazonEC2RoleforSSM` policy to new EC2 instances. AWS officially deprecated this policy; always attach `AmazonSSMManagedInstanceCore` to instance profiles for modern Systems Manager managed nodes.",
  "example": "Verify the status of managed nodes using the AWS CLI: aws ssm describe-instance-information --query 'InstanceInformationList[*].[InstanceId,PingStatus,PlatformName,AgentVersion]' --output table.",
  "sources": [
    {
      "title": "AWS Systems Manager Managed Nodes Overview",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/managed-nodes.html"
    },
    {
      "title": "Setting Up AWS Systems Manager for EC2 Instances",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-instance.html"
    }
  ]
});
