import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-16",
  "title": "Hybrid and Multicloud Managed Nodes",
  "plainEnglish": "Hybrid and Multicloud Managed Nodes in AWS Systems Manager allows you to manage on-premises physical bare-metal servers, VMware/Hyper-V virtual machines, and compute instances running in other cloud providers (such as Microsoft Azure or Google Cloud) alongside your Amazon EC2 instances from a single unified AWS console. By creating a Systems Manager Hybrid Activation, installing the SSM Agent on the non-AWS machine, and registering it with the generated Activation Code and ID, the remote server becomes a registered managed node (prefixed with `mi-`).",
  "whyItMatters": "Enterprises operating hybrid and multicloud architectures traditionally have to buy, deploy, and maintain separate configuration and patching tools for on-premises data centers and external cloud providers. Systems Manager Hybrid Activations unifies server fleet administration under one pane of glass, allowing you to run identical Patch Baselines, Run Commands, and State Manager associations across AWS, on-prem, and multicloud servers.",
  "workplaceExample": "A retail bank operates 500 EC2 instances in AWS and 300 physical Linux database servers across two on-premises data centers. The infrastructure team creates an SSM Hybrid Activation with an IAM service role. On the on-premises servers, an Ansible script installs the SSM Agent and registers each node using the Activation Code and ID. The bank now patches all 800 servers (AWS + on-prem) simultaneously using a single Systems Manager Patch Baseline and Maintenance Window.",
  "examFocus": "Understand Hybrid Activation mechanics and tiers: (1) Hybrid Activation: Creates a secure Activation Code and Activation ID paired with an IAM service role (`AmazonSSMDirectoryServiceAccess` or custom role with SSM trust). (2) Node Identifier: Non-EC2 hybrid nodes receive a managed instance ID starting with `mi-` (e.g., `mi-0123456789abcdef0`), whereas EC2 instances use `i-`. (3) Tiers: Standard Tier (supports up to 1,000 hybrid instances per account/region at no charge) vs Advanced Tier (supports >1,000 instances and Session Manager interactive shell access on hybrid nodes for a small hourly fee).",
  "keyPoints": [
    "Extends AWS Systems Manager to on-premises servers, virtual machines, and other cloud providers.",
    "Requires generating an SSM Hybrid Activation (yielding an Activation Code and Activation ID).",
    "Hybrid managed nodes are assigned unique instance IDs starting with the prefix `mi-`.",
    "Enables unified Patch Manager, Run Command, Inventory, and State Manager across hybrid fleets.",
    "Standard Tier supports up to 1,000 hybrid instances at zero additional service charge.",
    "Advanced Tier enables Session Manager interactive shell access and scaling beyond 1,000 hybrid nodes."
  ],
  "commonMistake": "Storing hybrid Activation Codes and IDs in plain text scripts on unencrypted shared network drives. Activation codes provide the credentials to register servers into your AWS account; protect them like secret credentials and expire them promptly.",
  "example": "Create a hybrid activation for 50 on-premises servers valid for 24 hours using the AWS CLI: aws ssm create-activation --default-instance-name 'OnPrem-Database-Server' --iam-role 'service-role/SSMServiceRole' --registration-limit 50 --expiration-date $(date -d '+1 day' +%s).",
  "sources": [
    {
      "title": "Setting Up AWS Systems Manager for Hybrid and Multicloud Environments",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-hybrid-multicloud.html"
    },
    {
      "title": "Creating a Managed-Instance Activation for a Hybrid Environment",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-managed-instance-activation.html"
    }
  ]
});
