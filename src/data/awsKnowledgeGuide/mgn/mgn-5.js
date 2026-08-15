import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-5',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Replication Agent',
  status: 'ready',
  plainEnglish: 'The AWS Replication Agent is a lightweight software program installed directly on source servers (Windows or Linux) targeted for migration. Once installed, the agent reads disk blocks directly from the source operating system kernel and securely transmits block changes over TCP port 1500 (or HTTPS 443) to AWS MGN Replication Servers in your target AWS staging subnet.',
  whyItMatters: 'Installing the AWS Replication Agent eliminates the requirement for hypervisor-level access or VMware vCenter credentials, allowing server migrations across physical bare-metal hardware, VMware, Hyper-V, and public clouds (Azure, GCP).',
  workplaceExample: 'A system administrator installs the AWS Replication Agent on an on-premises physical Windows Server 2019 instance. The agent connects outbound over TCP 1500 to the staging VPC and starts background disk block replication without restarting the server.',
  examFocus: 'SAA-C03 Agent Requirements & Ports:\n- Supported OS: Major Linux distributions (RHEL, CentOS, Ubuntu, SUSE) and Windows Server (2012 R2+).\n- Communication Ports: Outbound TCP 443 to MGN service endpoints; Outbound TCP 1500 to staging Replication Servers.\n- Non-Disruptive: Installs live without requiring a reboot of the source server.\n- IAM Credentials: Installed using short-lived installation credentials or AWS IAM roles.',
  keyPoints: [
    'Lightweight agent installed on source OS (Windows/Linux) for block-level capture.',
    'Works across physical bare-metal servers, VMware, Hyper-V, Azure, and GCP.',
    'Transmits block data outbound over TCP port 1500 to staging Replication Servers.',
    'Communicates with AWS MGN service management endpoints over HTTPS port 443.',
    'Installs live without requiring a source server reboot.'
  ],
  commonMistake: 'Blocking outbound TCP port 1500 on on-premises corporate firewalls, causing agent continuous block replication to stall or time out.',
  example: 'Verifying Agent Replication Status via AWS CLI:\naws mgn describe-source-servers --filters "sourceServerIDs=s-1234567890abcdef0" --query "items[*].dataReplicationInfo"',
  sources: [
    { title: 'AWS Replication Agent installation', url: 'https://docs.aws.amazon.com/mgn/latest/ug/agent-installation.html' }
  ]
});
