import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-18',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx for Lustre Integration with Amazon S3',
  status: 'ready',
  plainEnglish: 'Amazon FSx for Lustre integrates seamlessly with Amazon S3 buckets using Data Repository Associations (DRA). When linked to an S3 bucket, FSx for Lustre presents your S3 objects as traditional files and directories in the Lustre file system. Data is loaded from S3 lazily on-demand when accessed by compute nodes, and modified files can be exported back to S3 with a simple command.',
  whyItMatters: 'Storing petabytes of training data in high-performance SSD storage 24/7 is extremely expensive. Linking FSx for Lustre with Amazon S3 allows keeping master datasets in low-cost S3 storage, spinning up an FSx for Lustre file system only while compute jobs run, and shutting it down afterwards.',
  workplaceExample: 'A genomics team stores 500 TB of DNA sequencing files in S3 Glacier/Standard. When starting a 6-hour analysis job, they launch an FSx for Lustre file system linked to the S3 bucket. Lustre transparently streams S3 files into high-speed memory as compute nodes read them, and exports final gene analysis results back to S3.',
  examFocus: 'SAA-C03 S3 Data Repository Association details:\n- Lazy Loading: Object metadata is imported instantly; file content is loaded transparently from S3 upon first read.\n- Automatic Export: Auto-export updates S3 object keys whenever files are created, updated, or deleted in Lustre.\n- Cost Optimization: Spin up FSx for Lustre for short HPC jobs -> Export output to S3 -> Delete FSx file system.',
  keyPoints: [
    'Seamlessly links FSx for Lustre file systems with Amazon S3 buckets.',
    'Presents S3 object keys as standard POSIX files and directories.',
    'Lazy loading imports object contents automatically on first read access.',
    'Data Repository Tasks sync modified file outputs back to Amazon S3.',
    'Allows storing master data in low-cost S3 while getting sub-millisecond HPC processing speed.'
  ],
  commonMistake: 'Leaving a massive 100 TB FSx for Lustre file system running continuously for months when the underlying data could be stored cheaply in S3 and processed on-demand.',
  example: 'Creating a Data Repository Task to Export Data to S3:\n`aws fsx create-data-repository-task --file-system-id fs-0123456789abcdef0 --type EXPORT_TO_REPOSITORY --paths output/`',
  sources: [
    { title: 'Using Data Repository Associations in FSx for Lustre', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/lustre-s3-data-repositories.html' }
  ]
});
