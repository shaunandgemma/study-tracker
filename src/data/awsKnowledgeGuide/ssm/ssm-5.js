import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-5",
  "title": "SSM Agent",
  "plainEnglish": "The AWS Systems Manager Agent (SSM Agent) is a lightweight, open-source background software process (daemon on Linux/macOS, Windows Service on Windows Server) that runs on your operating system to enable communication with the AWS Systems Manager service. The SSM Agent polls the Systems Manager cloud control plane over secure outbound HTTPS, receives operational instructions (like Run Command scripts, Session Manager shells, or Patch Manager scans), executes them locally on the machine, and transmits status reports and command logs back to AWS.",
  "whyItMatters": "Without the SSM Agent, AWS Systems Manager has zero execution visibility or control inside the guest operating system. The agent provides the foundational operating-system hook that enables agent-based fleet administration, configuration compliance, vulnerability scanning, and secure shell access without needing inbound SSH or remote root login credentials.",
  "workplaceExample": "An infrastructure engineer builds a custom Golden Amazon Machine Image (AMI) for an enterprise banking application. To ensure every newly launched EC2 instance automatically connects to Systems Manager, the engineer verifies that `amazon-ssm-agent` is installed, enabled at system boot (`systemctl enable amazon-ssm-agent`), and configured with automatic agent version updating via State Manager.",
  "examFocus": "Understand SSM Agent installation and operational requirements: (1) Pre-installation: Pre-installed by default on Amazon Linux 1/2/2023, Ubuntu Server (certain versions), macOS AMIs, and Windows Server AMIs provided by AWS. (2) Manual Installation: Must be manually installed on custom AMIs, Red Hat Enterprise Linux, CentOS, Debian, SUSE, or on-premises servers. (3) Outbound Polling: Agent initiates all network traffic OUTBOUND to AWS on TCP port 443; it never listens on inbound ports. (4) Auto-Update: Can be kept up-to-date automatically using Systems Manager State Manager associations.",
  "keyPoints": [
    "Open-source background software process running inside the guest operating system.",
    "Pre-installed on Amazon Linux, Amazon Linux 2023, Windows Server, and official Ubuntu AMIs.",
    "Polls Systems Manager cloud endpoints over outbound HTTPS (TCP port 443).",
    "Executes Run Command documents, Session Manager shells, Patch Manager, and Inventory scans locally.",
    "Never opens or listens on inbound network ports, eliminating firewall attack surfaces.",
    "Supports automatic version updates via Systems Manager State Manager or AWS OpsCenter."
  ],
  "commonMistake": "Opening inbound firewall rules on a corporate server thinking the AWS cloud needs to 'push' commands to the SSM Agent. The SSM Agent exclusively initiates outbound long-polling connections over HTTPS to AWS; zero inbound firewall ports are ever required.",
  "example": "Check the running status of the SSM Agent on a Linux EC2 instance: sudo systemctl status amazon-ssm-agent.",
  "sources": [
    {
      "title": "Working with SSM Agent in AWS Systems Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html"
    },
    {
      "title": "Installing and Configuring SSM Agent on Supported Operating Systems",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html"
    }
  ]
});
