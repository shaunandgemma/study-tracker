import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-5',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway Hybrid Cloud Storage',
  status: 'ready',
  plainEnglish: 'AWS Storage Gateway is a hybrid cloud storage service that deploys a gateway appliance (a virtual machine or physical hardware appliance) at or near your on-premises data centre. The gateway presents standard storage protocols (NFS, SMB, or iSCSI) to local applications, while transparently moving data to and from durable AWS cloud storage services such as Amazon S3, Amazon FSx for Windows File Server, Amazon EBS, and Amazon S3 Glacier.',
  whyItMatters: 'Organisations cannot migrate every workload to the cloud overnight. Storage Gateway bridges on-premises applications with AWS storage, providing low-latency local access through familiar protocols while offloading capacity, durability, and backup to AWS.',
  workplaceExample: 'A hospital runs patient-record software that writes files over NFS. The IT team deploys an S3 File Gateway VM on their VMware cluster. The application writes files to an NFS mount backed by the gateway, and the gateway stores the files as objects in an S3 bucket in the Sydney Region.',
  examFocus: 'SAA-C03 Storage Gateway Types & Protocols:\n- S3 File Gateway: NFS/SMB file access → files stored as S3 objects.\n- FSx File Gateway: SMB file access → cached access to Amazon FSx for Windows File Server shares.\n- Volume Gateway: iSCSI block access → data in S3 with EBS snapshots (Cached or Stored modes).\n- Tape Gateway: iSCSI VTL → virtual tapes archived to S3 Glacier storage classes.',
  keyPoints: [
    'Hybrid cloud storage service bridging on-premises workloads with AWS cloud storage.',
    'Deploys as a VM appliance, hardware appliance, or EC2 instance running gateway software.',
    'Presents standard storage protocols (NFS, SMB, iSCSI) to local applications.',
    'Four gateway types: S3 File Gateway, FSx File Gateway, Volume Gateway, and Tape Gateway.',
    'Local cache provides low-latency access to frequently used data.'
  ],
  commonMistake: 'Treating Storage Gateway as a one-time data migration tool. Storage Gateway is designed for ongoing hybrid storage access, not one-off transfers (use AWS DataSync for migration tasks).',
  example: 'Gateway Type Selection Guide:\n- "On-prem apps need NFS/SMB access to S3 objects" → S3 File Gateway\n- "Windows users need low-latency access to FSx for Windows shares" → FSx File Gateway\n- "On-prem apps need iSCSI block volumes backed by AWS" → Volume Gateway\n- "Backup software needs to write to virtual tape" → Tape Gateway',
  sources: [
    { title: 'What is AWS Storage Gateway?', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html' }
  ]
});
