import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-13',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Windows Single-AZ Deployment',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Windows File Server Single-AZ deployment provisions a file system within a single Availability Zone. While it automatically replicates data within the same AZ to protect against component hardware failure, it does not replicate data across multiple AZs, making it a lower-cost option designed for non-production environments, dev/test workloads, or data that can be recreated.',
  whyItMatters: 'Single-AZ deployment costs significantly less than Multi-AZ deployment (roughly 50% lower file server costs). Using Single-AZ for development environments, build servers, or temporary staging workloads optimizes AWS storage spend.',
  workplaceExample: 'A software QA team provisions a 2 TB Single-AZ FSx for Windows file system in `us-east-1a` to host nightly software test builds. Since the build artifacts can easily be regenerated if an AZ fails, Single-AZ cuts their monthly storage bill in half.',
  examFocus: 'SAA-C03 Single-AZ vs Multi-AZ Comparison:\n- Single-AZ 1 & Single-AZ 2: Cost-optimized deployment within 1 Availability Zone.\n- Built-in intrasite redundancy protects against single disk/hardware failures.\n- No automatic failover across AZs if the entire AZ experiences an outage.\n- Can be backed up daily to AWS Backup for disaster recovery protection.',
  keyPoints: [
    'Deploys within a single Availability Zone to optimize storage costs.',
    'Protects against single component hardware failure within the AZ.',
    'Does NOT provide automatic failover to another AZ during a facility outage.',
    'Ideal for dev/test environments, temporary processing, and cost-sensitive workloads.',
    'Supports automated daily backups for point-in-time recovery.'
  ],
  commonMistake: 'Selecting Single-AZ deployment for a mission-critical production ERP or database file share that cannot tolerate any downtime during an Availability Zone disruption.',
  example: 'Single-AZ FSx Deployment CLI Parameter:\n`aws fsx create-file-system --file-system-type WINDOWS --storage-capacity 500 --subnet-ids subnet-dev1111 --windows-configuration DeploymentType=SINGLE_AZ_2,ThroughputCapacity=64`',
  sources: [
    { title: 'Amazon FSx for Windows File Server Deployment Types', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/high-availability-multi-az.html' }
  ]
});
