import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-23",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync vs Storage Gateway",
  "status": "ready",
  "plainEnglish": "AWS DataSync and AWS Storage Gateway are both hybrid cloud data services, but they serve fundamentally different operational use cases. AWS DataSync is an accelerated, online data migration and batch synchronization service designed to move large volumes of static or active data into and out of AWS storage at high speeds. AWS Storage Gateway is a hybrid storage appliance that provides on-premises applications with seamless, low-latency, local caching access to virtually unlimited AWS cloud storage (via S3 File Gateway, FSx File Gateway, Volume Gateway, or Tape Gateway).",
  "whyItMatters": "Using the wrong service creates architecture failure: using Storage Gateway to migrate 500 TB of files can be slow and awkward because it is designed for continuous file caching, not bulk data migration. Conversely, using DataSync for live, low-latency file sharing on local workstations fails because DataSync is a batch transfer tool, not a real-time local caching file gateway.",
  "workplaceExample": "A film studio uses AWS DataSync to perform a one-time migration of 2 PB of archived footage to Amazon S3 Glacier. For their day-to-day production artists who need fast local access to active video assets in London, they deploy an AWS Storage Gateway (S3 File Gateway) that locally caches hot files.",
  "examFocus": "For SAA-C03, compare the two services: Choose AWS DataSync for one-time migrations, recurring scheduled batch syncs, and moving massive datasets (NFS/SMB to S3/EFS/FSx) up to 10x faster. Choose AWS Storage Gateway when on-premises applications need seamless local storage protocols (NFS/SMB/iSCSI/VTL) with local caching and low latency to cloud-backed storage.",
  "keyPoints": [
    "DataSync: Accelerated batch data migration and scheduled synchronization tool.",
    "Storage Gateway: Hybrid caching appliance providing continuous local storage protocol access.",
    "DataSync is optimized for speed, parallelism, and bulk data movement (up to 10x faster).",
    "Storage Gateway caches frequently accessed data locally to deliver sub-millisecond read latency.",
    "Storage Gateway types: S3 File Gateway, FSx File Gateway, Volume Gateway (Cached/Stored), and Tape Gateway."
  ],
  "commonMistake": "Selecting AWS Storage Gateway for a one-time data center migration of 100 TB to Amazon EFS. Storage Gateway does not support Amazon EFS as a backend target and is not designed for bulk parallel migrations; use AWS DataSync.",
  "example": "# Use DataSync for fast bulk migrations:\naws datasync start-task-execution --task-arn arn:aws:datasync:us-east-1:123456789012:task/task-migration\n\n# Use Storage Gateway for persistent local file caching:\naws storagegateway describe-gateway-information --gateway-arn arn:aws:storagegateway:us-east-1:123456789012:gateway/sgw-12345678",
  "sources": [
    {
      "title": "What is AWS DataSync?",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
    },
    {
      "title": "What is AWS Storage Gateway?",
      "url": "https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html"
    }
  ]
});
