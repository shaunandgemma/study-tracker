import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-12',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'File Gateway Object Storage in Amazon S3',
  status: 'ready',
  plainEnglish: 'When a file is written through an S3 File Gateway, the gateway converts it into an S3 object and uploads it to the configured S3 bucket. The file\'s relative path becomes the S3 object key (e.g., writing `/reports/2026/q1.pdf` creates the object key `reports/2026/q1.pdf`). File metadata such as ownership, permissions, and timestamps are stored as S3 user-metadata on the object.',
  whyItMatters: 'Understanding the file-to-object mapping is critical because S3 objects have different semantics from files. Objects are immutable (overwritten atomically), S3 does not have real directories (prefixes simulate them), and modifying an object directly in S3 can create inconsistencies with the gateway cache.',
  workplaceExample: 'A compliance team writes audit reports through an S3 File Gateway share. An S3 lifecycle policy transitions reports older than 90 days to S3 Glacier. A data-analytics Lambda function processes report objects directly from S3 using the S3 API.',
  examFocus: 'SAA-C03 File-to-Object Mapping & Lifecycle:\n- Object Key: The file path relative to the share root becomes the S3 object key.\n- Metadata: POSIX metadata (UID, GID, permissions, timestamps) stored as S3 user-metadata.\n- Lifecycle Policies: Standard S3 lifecycle rules can transition or expire objects independently of the gateway.\n- Direct S3 Access: Other AWS services (Lambda, Athena, EMR) can process objects in the bucket directly.',
  keyPoints: [
    'Each file written through the gateway becomes a single S3 object.',
    'The file path relative to the share root maps to the S3 object key.',
    'File metadata (ownership, permissions, timestamps) is stored as S3 user-metadata.',
    'S3 lifecycle policies can transition objects to cheaper storage classes automatically.',
    'Other AWS services can access and process the objects directly through the S3 API.'
  ],
  commonMistake: 'Applying an S3 lifecycle rule that moves objects to S3 Glacier and then expecting the gateway to serve those files immediately. Glacier objects require a restore operation before they can be read through the gateway.',
  example: 'File-to-Object Mapping Example:\nFile written: /mnt/gateway-share/logs/2026/app.log\nS3 object created: s3://example-bucket/logs/2026/app.log\nS3 user-metadata: x-amz-meta-file-owner=1000, x-amz-meta-file-permissions=0644',
  sources: [
    { title: 'Working with file shares on S3 File Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/GettingStartedCreateFileShare.html' }
  ]
});
