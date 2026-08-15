import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-19',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre Scratch File Systems',
  status: 'ready',
  plainEnglish: 'FSx for Lustre Scratch File Systems are un-replicated, temporary file systems designed for short-term data processing where maximum performance is required at the lowest possible cost. Because data is not replicated across storage servers, a hardware server failure can result in loss of un-exported scratch data.',
  whyItMatters: 'For temporary batch jobs, rendering tasks, or scratchpad computations, paying for high-availability data replication is unnecessary. Scratch file systems deliver maximum IOPS and throughput per dollar for transient processing workloads.',
  workplaceExample: 'A visual effects studio runs a 4-hour 3D animation rendering job on EC2 Spot instances. They launch an FSx for Lustre Scratch_2 file system to store intermediate render frames. Once rendering completes, they export final movie files to S3 and delete the Scratch file system.',
  examFocus: 'SAA-C03 Scratch vs Persistent Deployment Types:\n- Scratch 1 & Scratch 2: Un-replicated temporary storage. Higher throughput per dollar, but data is NOT durable if a storage server fails.\n- Use Case: Short-term processing, temporary workspace, data linked to S3 (where master data lives in S3).\n- Contrast with Persistent: Replicated storage within the AZ for long-term production workloads.',
  keyPoints: [
    'Temporary, un-replicated parallel file system optimized for short-term processing.',
    'Delivers maximum performance at lower hourly costs than persistent options.',
    'Data is not replicated; hardware failure can cause loss of un-exported data.',
    'Ideal for transient batch processing, temporary scratchpads, and render farms.',
    'Frequently paired with S3 Data Repositories for master dataset safety.'
  ],
  commonMistake: 'Storing primary, non-backed-up master database files on an FSx for Lustre Scratch file system. Scratch file systems are un-replicated and intended only for temporary data.',
  example: 'Creating a Scratch_2 File System via AWS CLI:\n`aws fsx create-file-system --file-system-type LUSTRE --storage-capacity 1200 --lustre-configuration DeploymentType=SCRATCH_2,PerUnitStorageThroughput=200`',
  sources: [
    { title: 'Amazon FSx for Lustre Deployment Types', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/deployment-types.html' }
  ]
});
