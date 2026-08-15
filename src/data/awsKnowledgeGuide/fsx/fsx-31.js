import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-31',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx vs EBS',
  status: 'ready',
  plainEnglish: 'Amazon FSx and Amazon EBS (Elastic Block Store) serve fundamentally different storage architecture patterns:\n- Amazon EBS: Block storage volumes attached to a single EC2 instance (like an unformatted internal hard drive). Used for OS boot volumes, databases, and single-instance local storage.\n- Amazon FSx: Fully managed SHARED FILE systems accessible concurrently by hundreds or thousands of compute instances over network file protocols (SMB, NFS, POSIX, iSCSI).',
  whyItMatters: 'If multiple application servers need concurrent read/write access to the exact same shared files and folders (e.g. shared content management, team drives, or HPC clusters), EBS block volumes cannot be shared across nodes (except Multi-Attach EBS, which requires a cluster aware file system). FSx provides managed network file sharing out of the box.',
  workplaceExample: 'An EC2 instance uses an Amazon EBS volume for its C: drive root OS operating system. For the company\'s shared department network drive accessed simultaneously by 500 employee laptops and servers, they use FSx for Windows File Server.',
  examFocus: 'SAA-C03 Decision Matrix (FSx vs EBS):\n- Single EC2 instance block volume / Database root disk -> Amazon EBS.\n- Shared network file system concurrent across many EC2 instances -> Amazon FSx or Amazon EFS.\n- High-performance parallel HPC file system -> FSx for Lustre.\n- SAN block storage over iSCSI with NetApp features -> FSx for NetApp ONTAP.',
  keyPoints: [
    'EBS provides block-level storage attached to single EC2 instances.',
    'FSx provides fully managed shared file systems accessible by hundreds of instances concurrently.',
    'EBS requires formatting a file system (e.g., ext4, NTFS) on the host EC2 instance.',
    'FSx manages the file system, network protocols (SMB/NFS/iSCSI), and backups natively.',
    'EBS is ideal for OS boot disks; FSx is ideal for multi-node shared application files.'
  ],
  commonMistake: 'Attempting to attach a standard EBS gp3 volume to 10 EC2 instances simultaneously without a clustered file system. Standard EBS volumes attach to 1 EC2 instance at a time.',
  example: 'Storage Selection Rule:\n- Boot disk for an EC2 Windows Server -> Amazon EBS (gp3/io2).\n- Shared file repository for 50 EC2 Windows web servers -> Amazon FSx for Windows File Server.',
  sources: [
    { title: 'Amazon FSx vs Amazon EBS Storage Architecture', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
