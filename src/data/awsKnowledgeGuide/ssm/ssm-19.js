import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-19",
  "title": "Systems Manager without SSH or RDP",
  "plainEnglish": "Managing infrastructure with AWS Systems Manager without SSH or RDP is a modern cloud security architecture that completely eliminates open inbound management ports (such as port 22 for Linux SSH and port 3389 for Windows RDP) across all your compute instances. By relying entirely on Systems Manager capabilities—Session Manager for interactive terminal sessions, Fleet Manager for GUI-based management, and Run Command for automated script execution—you can manage your fleet securely with zero open inbound firewall ports, zero public IP addresses, and zero SSH key pairs.",
  "whyItMatters": "Open inbound ports on internet-facing servers are continuously scanned by bots and malicious threat actors attempting brute-force credential stuffing and exploiting zero-day vulnerabilities in SSH/RDP daemons. Eliminating SSH/RDP ports shrinks the external attack surface to zero, removes the operational burden of rotating and distributing static SSH private keys, and centralizes all administrative access under AWS IAM authentication and AWS CloudTrail auditing.",
  "workplaceExample": "A cybersecurity team updates corporate security baselines across 1,000 Amazon EC2 Linux and Windows instances. The team modifies all instance Security Groups to remove all inbound rules entirely (`Inbound: None`). They deploy the SSM Agent, attach `AmazonSSMManagedInstanceCore`, and configure Session Manager. Developers and sysadmins now access Linux terminal shells and Windows remote desktops directly through the AWS Management Console or AWS CLI using their single sign-on (SSO) credentials, with every session keystroke recorded to encrypted S3 logs.",
  "examFocus": "Understand the architecture of zero-inbound management: (1) Inbound Security Groups: Can have ZERO inbound rules (all inbound traffic blocked). (2) Communication Flow: SSM Agent initiates outbound HTTPS (TCP port 443) to AWS Systems Manager service endpoints. (3) Authentication: Governed by AWS IAM (IAM users, roles, SAML/SSO federated identities), replacing `.pem` SSH key files. (4) Auditability: Replaces unmonitored SSH sessions with full CloudTrail API auditing and CloudWatch/S3 session transcript logging.",
  "keyPoints": [
    "Eliminates open inbound ports (port 22 and port 3389) across all server security groups.",
    "Removes the need for public IP addresses, internet-facing bastion hosts, and SSH key management.",
    "SSM Agent communicates exclusively via outbound HTTPS (port 443) to AWS endpoints.",
    "Replaces static SSH keys with centralized AWS IAM authentication and multi-factor authentication (MFA).",
    "Provides interactive terminal access via Session Manager and GUI server management via Fleet Manager.",
    "Captures complete, tamper-evident audit trails of all user activities in AWS CloudTrail and Amazon S3."
  ],
  "commonMistake": "Leaving port 22 open 'just in case' when using Session Manager. Keeping inbound port 22 open defeats the security benefits of Session Manager; security groups should explicitly delete all inbound management rules.",
  "example": "Modify an EC2 security group to revoke all inbound SSH access on port 22 using the AWS CLI: aws ec2 revoke-security-group-ingress --group-id sg-0123456789abcdef0 --protocol tcp --port 22 --cidr 0.0.0.0/0.",
  "sources": [
    {
      "title": "AWS Systems Manager Session Manager Overview",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"
    },
    {
      "title": "Setting Up Systems Manager for Secure Instance Access",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-instance.html"
    }
  ]
});
