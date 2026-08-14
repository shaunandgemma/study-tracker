import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-5",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Agents",
  "status": "ready",
  "plainEnglish": "A DataSync Agent is a software appliance provided by AWS that you deploy in your on-premises data center, virtualized environment (VMware ESXi, Microsoft Hyper-V, KVM), or Amazon EC2 instance. The agent connects to your local source storage systems (via NFS or SMB file shares, object storage, or HDFS), reads and compresses the data, encrypts it with TLS, and establishes an accelerated, parallelized network connection to the AWS DataSync service in your AWS Region.",
  "whyItMatters": "The DataSync agent offloads the compute burden of high-speed data compression, hashing, and encryption to dedicated hypervisor CPU/RAM close to your local storage, eliminating performance impacts on production application servers while maximizing network bandwidth utilization.",
  "workplaceExample": "A hospital IT team deploys a DataSync Agent virtual appliance on a VMware ESXi cluster in their private data center. They allocate 4 vCPUs and 32 GB RAM to the agent, activate it with their AWS account, and mount an on-premises PACS medical imaging NAS share over 10 Gbps LAN for migration to Amazon S3.",
  "examFocus": "For SAA-C03, know when an agent is required: An agent IS required when reading from or writing to on-premises storage (NFS, SMB, HDFS, Object Storage) or edge hardware. An agent is NOT required when transferring directly between AWS in-cloud storage services (e.g. Amazon S3 to Amazon EFS, or Amazon EFS to Amazon FSx). Agents can communicate over AWS Direct Connect, AWS Site-to-Site VPN, or the public Internet using VPC Endpoints.",
  "keyPoints": [
    "Software appliance deployed as a VM (VMware, Hyper-V, KVM) or Amazon EC2 instance.",
    "Required for on-premises storage (NFS, SMB, HDFS, Object Storage) and self-managed cloud storage.",
    "NOT required for transfers strictly between native AWS in-cloud storage services.",
    "Handles local read/write, parallel streaming, compression, and TLS encryption.",
    "Can communicate securely with AWS using AWS PrivateLink / VPC Endpoints without traversing the public internet."
  ],
  "commonMistake": "Thinking you need to deploy a DataSync agent to copy data between Amazon S3 and Amazon EFS within AWS. AWS-to-AWS native storage transfers are fully managed serverlessly by DataSync without requiring any agent deployment.",
  "example": "# Create and activate a DataSync agent with an activation key:\naws datasync create-agent \\\n  --agent-name OnPrem-DataCenter-Agent \\\n  --activation-key AAAAA-BBBBB-CCCCC-DDDDD-EEEEE \\\n  --vpc-endpoint-id vpce-0123456789abcdef0",
  "sources": [
    {
      "title": "Deploying AWS DataSync Agents",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/agent-deploy.html"
    },
    {
      "title": "Activating a DataSync Agent",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/activate-agent.html"
    }
  ]
});
