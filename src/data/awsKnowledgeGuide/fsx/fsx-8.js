import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-8',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for NetApp ONTAP',
  status: 'ready',
  plainEnglish: 'Amazon FSx for NetApp ONTAP is a fully managed service that delivers NetApp\'s popular ONTAP enterprise storage management engine on AWS. It provides multi-protocol storage access (NFS, SMB, and block iSCSI), advanced data management capabilities (NetApp Snapshots, SnapMirror cross-region replication, FlexCache, Data Compression, and Deduplication), and automatic tiering between SSD storage and low-cost capacity pools.',
  whyItMatters: 'Enterprise organizations heavily reliant on NetApp ONTAP features on-premises can lift-and-shift workloads to AWS without losing existing scripts, backup workflows, or ONTAP management tools, while dramatically cutting storage costs via built-in compression and tiering.',
  workplaceExample: 'A global media company uses NetApp ONTAP on-premises for video editing. They deploy FSx for NetApp ONTAP in AWS, using NetApp SnapMirror to asynchronously replicate 200 TB of video assets to AWS for disaster recovery and cloud editing.',
  examFocus: 'SAA-C03 Core Concept for FSx for NetApp ONTAP:\n- Multi-Protocol Support: Concurrent NFS (v3, v4), SMB (1.0, 2.0, 3.0, 3.1.1), and block iSCSI access to the same storage volumes.\n- Dual Storage Tiers: Primary SSD tier (high IOPS) and Capacity Pool tier (auto-tiered, low cost S3-backed tiering).\n- Enterprise Features: Data Deduplication, Compression, NetApp Snapshots, SnapMirror replication, and FlexCache.\n- Deployment: Single-AZ or Multi-AZ with automatic failover.',
  keyPoints: [
    'Fully managed NetApp ONTAP file storage supporting NFS, SMB, and block iSCSI.',
    'Provides dual-tier storage (Primary SSD + low-cost Capacity Pool tiering).',
    'Supports NetApp Snapshots, SnapMirror cross-region replication, and FlexCache.',
    'Built-in data compression and deduplication reduce storage footprint up to 50%+.',
    'Offers Single-AZ and Multi-AZ high availability with automatic failover.'
  ],
  commonMistake: 'Believing FSx for NetApp ONTAP only supports file storage protocols (NFS/SMB). ONTAP also supports block storage via iSCSI endpoints for database volumes.',
  example: 'Creating a NetApp Storage Virtual Machine (SVM) and Volume via AWS CLI:\n`aws fsx create-volume --volume-type ONTAP --name engineering_vol --ontap-configuration JunctionPath=/engineering,SizeInMebibytes=1048576`',
  sources: [
    { title: 'What is Amazon FSx for NetApp ONTAP?', url: 'https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html' }
  ]
});
