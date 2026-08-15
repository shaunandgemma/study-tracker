import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-22',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN vs DataSync',
  status: 'ready',
  plainEnglish: 'AWS MGN (Application Migration Service) and AWS DataSync are designed for fundamentally different migration workloads:\n- AWS MGN: Rehosts complete operating systems and bootable server disks to Amazon EC2 via continuous block-level replication.\n- AWS DataSync: Automated, high-performance data transfer service used specifically to transfer large volumes of file system data (NFS, SMB) or object storage to Amazon S3, EFS, or FSx.',
  whyItMatters: 'Using DataSync to copy server files does not create a bootable EC2 instance. Conversely, using MGN for shared NAS file transfers is inefficient. Using the right tool accelerates migration performance.',
  workplaceExample: 'A media company migrates its editing workflow: they use AWS MGN to rehost 5 editing application servers onto EC2, and use AWS DataSync to transfer 200 TB of shared video files from an on-premises NFS storage array to Amazon EFS.',
  examFocus: 'SAA-C03 Decision Matrix (MGN vs DataSync):\n- AWS MGN: Rehosting servers (OS, system state, root volumes -> EC2).\n- AWS DataSync: High-speed file/object data transfer (NFS/SMB/S3 -> S3, EFS, FSx for Windows / Lustre / ONTAP).\n- Acceleration: DataSync uses a custom network protocol with acceleration for large dataset transfers over Direct Connect/VPN.',
  keyPoints: [
    'MGN rehosts entire operating systems and root boot volumes to Amazon EC2.',
    'DataSync transfers file system and object data to Amazon S3, EFS, or FSx.',
    'DataSync handles NFS, SMB, HDFS, and S3 file/object protocols.',
    'MGN performs continuous block-level OS disk synchronization.',
    'DataSync accelerates large file dataset transfers using custom multi-threaded network protocols.'
  ],
  commonMistake: 'Attempting to use AWS DataSync to migrate an operating system root disk to EC2. DataSync transfers file data to EFS/S3/FSx; it does not construct bootable EC2 instances.',
  example: 'Decision Tree:\n- "Rehost 20 Linux web servers to EC2" -> AWS MGN\n- "Transfer 50 TB of shared NFS documents to Amazon EFS" -> AWS DataSync.',
  sources: [
    { title: 'AWS Application Migration Service overview', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html' }
  ]
});
