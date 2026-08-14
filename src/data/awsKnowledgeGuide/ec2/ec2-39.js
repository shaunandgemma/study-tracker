import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-39',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Instance Store',
  status: 'ready',
  plainEnglish: 'An EC2 Instance Store provides temporary, high-speed block-level storage physically attached to the host computer running your EC2 instance. Instance Store drives consist of direct-attached NVMe or SATA SSDs offering ultra-high IOPS and low latency. However, Instance Store storage is EPHEMERAL: all data stored on an Instance Store volume is permanently erased when the instance is STOPPED, TERMINATED, or suffers an underlying hardware failure.',
  whyItMatters: 'Instance Store is ideal for temporary data that requires extreme read/write performance but does not require long-term persistence—such as scratch space, in-memory caches, temporary buffers, or data replicated across a cluster (e.g. Cassandra or HDFS).',
  workplaceExample: 'A video rendering pipeline uses Instance Store volumes as scratch disks to store temporary frame render buffer files. The ultra-fast local NVMe read/write speeds prevent disk bottlenecks during rendering. Final rendered MP4 files are written to S3 for permanent storage.',
  examFocus: 'SAA-C03 Instance Store rules:\n- Data is EPHEMERAL: Lost on Instance STOP, TERMINATION, or Host Hardware Failure.\n- Data is PRESERVED on instance REBOOT.\n- Cannot be detached or moved to another instance.\n- Ideal for caches, scratch space, buffers, and replicated distributed file systems (HDFS).\n- Cannot be snapshot directly to S3 (unlike EBS volumes).',
  keyPoints: [
    'Direct-attached physical block storage offering maximum IOPS and lowest latency.',
    'Ephemeral storage: Data is permanently lost when instance is STOPPED or TERMINATED.',
    'Data persists across OS reboot.',
    'No additional cost (included in instance hourly rate).',
    'Unsuitable for persistent databases without application-level replication.'
  ],
  commonMistake: 'Stopping an EC2 instance that uses Instance Store for root or data storage expecting data to remain intact. Stopping an instance store-backed instance permanently deletes all stored data.',
  example: 'Viewing Instance Store Disks inside Linux:\n`lsblk`\n`nvme0n1  257:0  0 450G 0 disk` (Local Instance Store NVMe Drive).',
  sources: [
    { title: 'Amazon EC2 instance store', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_InstanceStores.html' }
  ]
});
