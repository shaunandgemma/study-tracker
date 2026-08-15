import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-19",
  "title": "Import and Export Workflows",
  "plainEnglish": "AWS Snow Family Import and Export Workflows are the two standardized operational procedures for transferring bulk data physically between on-premises storage and Amazon S3. An Import Workflow copies on-premises datasets onto an unlocked Snow device on your local network and ships it to AWS for S3 ingestion. An Export Workflow instructs AWS to load objects from your specified S3 bucket and prefix onto a Snow device at the AWS facility, ship it to your data center, and allow you to copy the data onto local storage before returning the device.",
  "whyItMatters": "Whether migrating legacy NAS storage into the cloud (Import) or retrieving massive disaster recovery archives and research datasets for on-premises supercomputers (Export), having structured, reproducible physical transfer workflows ensures data integrity, compliance adherence, and smooth logistical handoffs without data corruption.",
  "workplaceExample": "A biotechnology research lab orders an S3 Export job to download 150 TB of cryo-electron microscopy image datasets from an S3 bucket in `us-east-1` to their on-premises HPC cluster. AWS loads the 150 TB onto two Snowball Edge devices and ships them via courier. The lab connects the devices, copies the files to their local Ceph storage cluster over 40 GbE in 36 hours, powers down the devices, and hands them back to UPS for return shipping to AWS.",
  "examFocus": "Distinguish Import vs Export workflow steps: (1) Import Workflow: Customer orders job -> AWS ships blank encrypted device -> Customer unlocks device, copies local data, shuts down -> Carrier returns device to AWS -> AWS ingests data into S3 -> AWS validates checksums and wipes device (NIST 800-88). (2) Export Workflow: Customer orders job specifying S3 bucket/prefix -> AWS loads S3 objects onto encrypted device -> AWS ships device to customer -> Customer unlocks device and copies files to on-prem -> Customer shuts down and ships device back -> AWS wipes device. (3) Reports: Both workflows generate Job Completion Reports and Failure Logs in S3.",
  "keyPoints": [
    "Standardized operational workflows for moving bulk data into or out of Amazon S3.",
    "Import Workflow: On-premises data is copied to the device locally and ingested into S3 by AWS.",
    "Export Workflow: S3 objects are loaded onto the device by AWS and copied to on-premises storage by the customer.",
    "Both workflows enforce 256-bit AES encryption and require Manifest and Unlock Code authentication.",
    "Generates detailed S3 Job Completion Reports, Success Logs, and Failure Logs for data reconciliation.",
    "AWS performs certified NIST 800-88 cryptographic sanitization on all returned devices."
  ],
  "commonMistake": "Assuming that an S3 Export job automatically deletes the source objects from Amazon S3 after writing them to the Snowball device. AWS never deletes source S3 objects during an export; the customer must manage object lifecycles or delete objects manually if desired.",
  "example": "Order an S3 Export job for a specific prefix using the AWS CLI: aws snowball create-job --job-type EXPORT --resources '{\"S3Resources\": [{\"BucketArn\": \"arn:aws:s3:::genomics-vault\", \"KeyRange\": {\"BeginMarker\": \"project-alpha/\", \"EndMarker\": \"project-alpha/zzz\"}}]}' --snowball-type EDGE_STORAGE_OPTIMIZED --role-arn arn:aws:iam::123456789012:role/SnowballExportRole --kms-key-arn arn:aws:kms:us-east-1:123456789012:key/snow-key.",
  "sources": [
    {
      "title": "AWS Snowball Edge Import and Export Workflows",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/import-export-workflow.html"
    },
    {
      "title": "Transferring Data with AWS Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/transfer-data-snowball.html"
    }
  ]
});
