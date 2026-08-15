import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-2",
  "title": "SSM Session Manager (Secure SSH-less shell access without open inbound ports or bastions)",
  "plainEnglish": "AWS Systems Manager Session Manager is a fully managed cloud service that provides secure, auditable, one-click interactive shell and browser-based CLI access to your Amazon EC2 instances and on-premises servers without opening any inbound network ports (like port 22 for SSH or port 3389 for RDP), without managing physical bastion hosts (jump boxes), and without storing SSH key pairs.",
  "whyItMatters": "Traditional bastion host architectures require opening inbound SSH ports on firewalls, generating and distributing private SSH keys, and constantly patching jump box operating systems. If an SSH key is leaked or a bastion host is compromised, the entire private network is at risk. Session Manager eliminates bastion hosts and inbound ports completely by using outbound HTTPS communication channeled over AWS IAM authentication.",
  "workplaceExample": "A financial SaaS company runs backend database worker instances in private VPC subnets with zero internet gateway access. Developers need interactive bash access to inspect container logs. The infrastructure team attaches the `AmazonSSMManagedInstanceCore` IAM policy to the EC2 instance profile and provisions VPC endpoints. Developers log in with their corporate AWS IAM Identity Center credentials and open a Session Manager shell in AWS Management Console or AWS CLI. Every command entered is logged to an encrypted Amazon S3 bucket.",
  "examFocus": "Understand Session Manager prerequisites and security mechanics for the SAA-C03 exam: (1) Inbound Ports: ZERO inbound ports required on Security Groups or NACLs (Security Groups can block all inbound traffic). (2) Communication Direction: SSM Agent on the instance initiates OUTBOUND HTTPS (TCP port 443) traffic to the Systems Manager service endpoints. (3) Bastion Elimination: Replaces bastion hosts and eliminates SSH key management. (4) Audit Logging: Session command logs can be streamed to Amazon CloudWatch Logs and encrypted S3 buckets with AWS KMS.",
  "keyPoints": [
    "Provides secure, interactive shell access without opening inbound firewall ports (no port 22 or 3389).",
    "Eliminates the operational overhead and security attack surface of traditional bastion hosts.",
    "Requires only outbound HTTPS (TCP port 443) connectivity from the managed node to AWS SSM endpoints.",
    "Access is governed strictly by AWS IAM policies rather than static SSH key pairs.",
    "Captures full terminal session command transcripts to Amazon S3 buckets and Amazon CloudWatch Logs.",
    "Works seamlessly across Linux, macOS, and Windows instances in AWS and on-premises."
  ],
  "commonMistake": "Opening inbound port 22 on an EC2 instance's security group thinking Session Manager requires it. Session Manager requires ZERO inbound ports; it communicates purely via outbound HTTPS calls made by the SSM Agent to the Systems Manager service.",
  "example": "Start an interactive bash shell session with a private EC2 instance using the AWS CLI and Session Manager plugin: aws ssm start-session --target i-0123456789abcdef0.",
  "sources": [
    {
      "title": "AWS Systems Manager Session Manager Overview",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"
    },
    {
      "title": "Getting Started with Session Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started.html"
    }
  ]
});
