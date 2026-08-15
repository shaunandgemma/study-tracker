import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-6",
  "title": "Session Manager",
  "plainEnglish": "Session Manager is a core capability of AWS Systems Manager that provides secure, auditable terminal shell access and interactive remote desktop (RDP) tunneling to Amazon EC2 instances and on-premises managed nodes without opening inbound network ports, without maintaining SSH keys, and without provisioning bastion hosts. It allows engineers to manage compute instances via browser-based shells, the AWS CLI, or standard SSH/SCP client extensions while routing all traffic through encrypted AWS APIs.",
  "whyItMatters": "Managing traditional SSH key pairs and RDP credentials across hundreds of developers and thousands of servers leads to security vulnerabilities, lost private keys, and compliance audit failures. Session Manager centralizes access control using standard AWS IAM policies, logs every user keystroke and session output to CloudWatch Logs or encrypted S3 buckets, and enables port forwarding to private databases without exposing internal endpoints to the internet.",
  "workplaceExample": "A database administrator needs to securely access a private PostgreSQL RDS instance located in an isolated database subnet. Instead of spinning up a public jump box with open port 22, the DBA starts a Session Manager port-forwarding session through a private EC2 application server using the AWS CLI. The local client connects to `localhost:5432` which tunnels securely through AWS Systems Manager directly to RDS, while the security team audits the session in AWS CloudTrail.",
  "examFocus": "Understand Session Manager auditing, encryption, and tunneling: (1) Logging Options: Session transcripts can be streamed to Amazon CloudWatch Logs, Amazon S3, or both. (2) Encryption: Session data in transit is encrypted with TLS; log files stored in S3 and CloudWatch Logs can be encrypted with AWS KMS Customer Managed Keys. (3) Port Forwarding: Supports tunneling arbitrary TCP ports (e.g., SSH, RDP, HTTP, database ports) from local workstations to private remote instances. (4) RunAs Support: Can configure sessions to launch as specific local OS users (e.g., `ec2-user`, `ubuntu`, or a restricted non-root user).",
  "keyPoints": [
    "Delivers secure interactive command-line and shell access to managed nodes.",
    "Eliminates the need for open inbound ports (port 22/3389) and bastion jump hosts.",
    "Access permissions are governed strictly by AWS IAM user and role policies.",
    "Supports streaming session transcripts to Amazon CloudWatch Logs and Amazon S3.",
    "Provides end-to-end encryption of session logs using AWS Key Management Service (AWS KMS).",
    "Supports secure remote port forwarding to tunnel private databases and internal web services."
  ],
  "commonMistake": "Assuming Session Manager automatically records session contents by default. You must explicitly configure Session Manager logging preferences in the Systems Manager console to send session logs to an S3 bucket or CloudWatch Logs log group.",
  "example": "Start a remote port forwarding session tunneling local port 8080 to a remote private web server using the AWS CLI: aws ssm start-session --target i-0123456789abcdef0 --document-name AWS-StartPortForwardingSession --parameters '{\"portNumber\":[\"80\"], \"localPortNumber\":[\"8080\"]}'.",
  "sources": [
    {
      "title": "AWS Systems Manager Session Manager User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"
    },
    {
      "title": "Logging and Auditing Session Activity in Session Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html"
    }
  ]
});
