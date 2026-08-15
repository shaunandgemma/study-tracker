import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-4",
  "title": "AWS Snow Family Offline and Edge Data Transfer",
  "plainEnglish": "AWS Snow Family Offline and Edge Data Transfer is the operational process of physically capturing, storing, preprocessing, and transporting data between on-premises sites or remote edge environments and AWS cloud storage using physical Snowcone and Snowball Edge devices. This process bypasses slow or congested wide area network (WAN) connections by shipping physical storage devices back and forth via commercial shipping carriers.",
  "whyItMatters": "Organizations frequently operate in environments with zero network connectivity (such as cargo ships, mineral exploration mines, or disaster relief zones) or have massive data volumes that would saturate their corporate network for months. Snow Family offline data transfer provides predictable, secure data transport timelines governed by physical shipping rather than network bandwidth limits.",
  "workplaceExample": "A marine conservation fleet operates research ships in Antarctica mapping ocean floor topography with multi-beam sonar systems. With only costly satellite voice links available, the ship loads 60 TB of sonar surveys onto an on-board AWS Snowball Edge device over local 10 GbE NFS. When the vessel docks in Chile every 3 months, the Snowball is shipped to AWS, automatically ingesting the raw sonar data into Amazon S3.",
  "examFocus": "Understand the complete Snow Family end-to-end transfer workflow: (1) Step 1: Create an Import/Export Job in the AWS Console (specifying destination S3 bucket, KMS key, and shipping address). (2) Step 2: Receive and inspect physical device for tamper-evidence. (3) Step 3: Connect device to local LAN (RJ45/SFP+), retrieve Manifest and Unlock Code, and unlock using AWS OpsHub. (4) Step 4: Transfer files via S3-compatible interface, NFS, or AWS DataSync. (5) Step 5: Power down (E-ink shipping label automatically displays return address) and ship back to AWS. (6) Step 6: AWS ingests data into S3 and verifies checksums.",
  "keyPoints": [
    "Transfers terabytes or petabytes of data physically to and from AWS without network dependency.",
    "Ideal for bandwidth-constrained, expensive satellite, or completely air-gapped environments.",
    "E-ink shipping label automatically updates to the return AWS facility address when powered off.",
    "Managed locally using AWS OpsHub graphical application or the Snowball Edge command-line interface.",
    "Supports local Network File System (NFS) mount points and S3-compatible REST API endpoints.",
    "Provides end-to-end checksum verification, transfer logs, and automated device media sanitization."
  ],
  "commonMistake": "Attempting to tape a paper shipping label over the Snowball device casing. Snow devices feature an integrated E-ink display that automatically switches to the correct prepaid AWS return shipping label as soon as the device is powered down.",
  "example": "Monitor the physical shipping and cloud import status of an active Snow job using the AWS CLI: aws snow-device-management list-devices (or aws snowball describe-job --job-id JID12345678-abcd-1234-efgh-1234567890ab).",
  "sources": [
    {
      "title": "AWS Snow Family Data Transfer Workflows",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/how-snowball-works.html"
    },
    {
      "title": "Using AWS OpsHub to Manage Snow Family Devices",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/opshub.html"
    }
  ]
});
