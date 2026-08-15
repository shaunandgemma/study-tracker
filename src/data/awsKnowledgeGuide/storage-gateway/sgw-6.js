import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-6',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'S3 File Gateway',
  status: 'ready',
  plainEnglish: 'Amazon S3 File Gateway is a gateway type that presents one or more file shares (NFS or SMB) to on-premises applications. Files written through these shares are stored as individual objects in an Amazon S3 bucket. Each file maps to one S3 object, with the file path becoming the S3 object key and POSIX or Windows file metadata stored as S3 user-metadata on the object.',
  whyItMatters: 'Applications that require file-based access (read, write, list directories) cannot natively interact with the S3 REST API. S3 File Gateway translates familiar file operations into S3 object operations, giving on-premises teams access to virtually unlimited, highly durable S3 storage.',
  workplaceExample: 'A genomics research lab mounts an NFS share from an S3 File Gateway. Researchers write sequencing output files to the share. Each file appears as an S3 object in the lab\'s S3 bucket, where downstream analytics pipelines in AWS process the data directly.',
  examFocus: 'SAA-C03 S3 File Gateway Mechanics:\n- File-to-Object Mapping: Each file written through the gateway becomes one S3 object with the file path as the key.\n- Metadata Preservation: POSIX metadata (owner, permissions, timestamps) is stored as S3 user-metadata.\n- Protocol Support: NFS (v3 and v4.1) and SMB (v2 and v3) file shares.\n- S3 Storage Classes: Supports S3 Standard, S3 Standard-IA, S3 One Zone-IA, S3 Intelligent-Tiering at the file share level.',
  keyPoints: [
    'Presents NFS or SMB file shares to on-premises applications.',
    'Files written through the gateway are stored as individual S3 objects.',
    'File metadata (ownership, permissions, timestamps) is preserved as S3 user-metadata.',
    'Supports configuring an S3 storage class per file share for cost optimisation.',
    'A local disk cache stores recently accessed files for low-latency reads.'
  ],
  commonMistake: 'Modifying objects directly in S3 (outside the gateway) and expecting the changes to appear immediately on the file share. A cache refresh operation may be needed for the gateway to reflect external S3 changes.',
  example: 'Creating an NFS File Share on an S3 File Gateway via AWS CLI:\naws storagegateway create-nfs-file-share --gateway-arn "arn:aws:storagegateway:us-east-1:123456789012:gateway/sgw-12345678" --role "arn:aws:iam::123456789012:role/StorageGatewayS3Role" --location-arn "arn:aws:s3:::example-research-bucket" --default-storage-class "S3_STANDARD"',
  sources: [
    { title: 'Using Amazon S3 File Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/StorageGatewayConcepts.html' }
  ]
});
