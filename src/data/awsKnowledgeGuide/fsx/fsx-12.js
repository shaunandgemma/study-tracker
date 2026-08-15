import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-12',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Windows Multi-AZ Deployment',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Windows File Server Multi-AZ deployment provisions active and standby file servers across two separate Availability Zones within an AWS Region. Data is continuously and synchronously replicated across AZs at the storage layer. If an Availability Zone or file server fails, FSx automatically fails over to the standby server in seconds without losing written data.',
  whyItMatters: 'Production enterprise workloads (like ERPs, critical file shares, and SQL Server databases) require continuous storage availability. Multi-AZ deployment ensures that a physical datacenter power outage or network disruption does not crash business-critical applications.',
  workplaceExample: 'An enterprise hosts its core business documents on a Multi-AZ FSx for Windows file system with primary in `us-east-1a` and standby in `us-east-1b`. When `us-east-1a` suffers a hardware outage, FSx automatically promotes the standby server in `us-east-1b` to active, and clients reconnect via DNS transparently.',
  examFocus: 'SAA-C03 Multi-AZ Deployment Details:\n- Synchronous storage replication across 2 Availability Zones.\n- Automatic failover: Promotes standby file server to active in seconds.\n- Seamless client reconnection: Uses SMB Continuous Availability and DNS CNAME updates.\n- Requires specifying a primary subnet and a standby subnet in separate AZs during creation.',
  keyPoints: [
    'Provisions active and standby file servers across 2 separate Availability Zones.',
    'Synchronous data replication guarantees zero data loss on failover (RPO = 0).',
    'Automatic failover promotes standby server in seconds (RTO < 30 seconds).',
    'Clients maintain connectivity automatically via SMB Continuous Availability.',
    'Recommended for all production business-critical Windows file shares.'
  ],
  commonMistake: 'Confusing automated daily backups with Multi-AZ high availability. Backups protect against data corruption but cannot provide instant sub-minute automatic failover during a datacenter outage.',
  example: 'Creating a Multi-AZ FSx for Windows File System:\n`aws fsx create-file-system --file-system-type WINDOWS --storage-capacity 1000 --subnet-ids subnet-primary1111 subnet-standby2222 --windows-configuration DeploymentType=MULTI_AZ_1,ThroughputCapacity=1024`',
  sources: [
    { title: 'High Availability for Amazon FSx for Windows File Server', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multi-az.html' }
  ]
});
