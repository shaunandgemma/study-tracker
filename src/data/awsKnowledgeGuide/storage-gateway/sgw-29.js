import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-29',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway vs Snow Family',
  status: 'ready',
  plainEnglish: 'AWS Storage Gateway provides ongoing hybrid access to AWS-backed storage across a network connection. AWS Snowball Edge historically provided physical devices that could move very large datasets when network transfer was impractical and could also support local storage and compute at disconnected or constrained locations. AWS now states that Snowball Edge is no longer available for new customers to order, although existing customers are not immediately affected. Current designs must therefore check eligibility and consider AWS-recommended alternatives rather than assuming a new Snow device can be ordered.',
  whyItMatters: 'The original exam distinction remains useful: Storage Gateway is a continuing hybrid-storage interface, while a Snow device represented physical, offline or edge data movement and processing. In real architecture work, availability changes matter. Engineers must validate the current service status and select an available alternative such as DataSync for online transfers or another approved physical-transfer solution when a new Snow order is not possible.',
  workplaceExample: 'A company needs applications at its data centre to keep using an NFS share backed by AWS, so it chooses S3 File Gateway. A separate petabyte-scale migration proposal originally specified a new Snowball Edge order, but the architect checks current AWS guidance, discovers the new-customer restriction, and evaluates DataSync, AWS Data Transfer Terminal, or an AWS Partner solution based on connectivity and physical-transfer requirements.',
  examFocus: 'SAA-C03 comparison and current-service awareness:\n- Storage Gateway: ongoing hybrid access using supported file, volume, or tape interfaces over network connectivity.\n- Snowball Edge historical use: physical bulk transfer and local edge storage or compute where connectivity was constrained.\n- Current boundary: AWS states that Snow Family devices are no longer available for new customers to order.\n- Existing customers should follow current AWS guidance; new designs must evaluate the recommended alternatives.\n- Always match the solution to ongoing access, online transfer, physical transfer, edge compute, bandwidth, timing, and eligibility requirements.',
  keyPoints: [
    'Storage Gateway is designed for continuing hybrid storage access and normally depends on connectivity to AWS.',
    'Snowball Edge historically addressed bulk physical transfer and local edge storage or compute requirements.',
    'AWS states that Snow Family devices are no longer available for new customers to order.',
    'The availability change does not mean existing customer devices instantly stop working, but current AWS guidance must be followed.',
    'AWS identifies alternatives including DataSync for online transfers, AWS Data Transfer Terminal for applicable physical transfers, partner solutions, and Outposts for edge-compute requirements.',
    'A migration decision must consider data volume, available bandwidth, transfer window, continuing application access, security, and current service eligibility.'
  ],
  commonMistake: 'Automatically recommending a new Snowball Edge job from an older architecture pattern without checking current availability. The technical comparison may still appear in study material, but an implementation plan must reflect the current new-customer restriction and AWS-recommended alternatives.',
  example: 'For a continuously used on-premises SMB share backed by cloud storage, choose the appropriate Storage Gateway design. For a one-time bulk migration with usable bandwidth, evaluate DataSync. If physical transfer is essential, confirm eligibility and use a currently available AWS-recommended physical-transfer option rather than assuming Snowball Edge can be newly ordered.',
  sources: [
    { title: 'What is AWS Storage Gateway?', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html' },
    { title: 'AWS Snowball Edge availability change', url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html' },
    { title: 'Getting started with Snowball Edge for existing customers', url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/getting-started.html' }
  ]
});
