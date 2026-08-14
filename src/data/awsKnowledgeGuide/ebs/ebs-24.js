import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-24",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Fast Snapshot Restore",
  "status": "ready",
  "plainEnglish": "EBS Fast Snapshot Restore (FSR) is an Amazon EBS performance feature that eliminates I/O latency when creating new EBS volumes from snapshots. Under standard restore behavior, volume blocks are lazily loaded from S3 in the background on-demand, causing initial I/O latency (first-access penalty) when an application reads a block for the first time. With Fast Snapshot Restore enabled, restored EBS volumes are instantly fully initialized and deliver maximum provisioned performance from the first transaction.",
  "whyItMatters": "For high-performance databases, virtual desktop infrastructure (VDI), and rapid auto-scaling clusters, waiting for blocks to warm up or experiencing 50ms read latency spikes on first access is unacceptable. FSR enables zero-latency instant volume creation for mission-critical disaster recovery cutovers and test environment provisioning.",
  "workplaceExample": "A gaming company uses FSR on their golden 500 GB game server snapshot in `us-east-1a`. When sudden traffic spikes require launching 50 new game server instances, new volumes are restored instantly with full IOPS performance without the 15-minute disk initialization lag.",
  "examFocus": "For SAA-C03, remember these FSR details: (1) Eliminates the first-touch latency penalty on volumes restored from snapshots (blocks are pre-warmed). (2) Enabled on a per-snapshot, per-Availability Zone basis. (3) Billed per Data Services Unit (DSU) hour for each AZ where FSR is enabled. (4) Uses a credit bucket system to govern how many volumes can be restored simultaneously at peak speed.",
  "keyPoints": [
    "Instantly delivers full provisioned performance on restored EBS volumes with zero first-touch latency.",
    "Eliminates the background lazy-loading process from S3.",
    "Enabled per snapshot on specific Availability Zones (AZ-specific enablement).",
    "Uses a credit bucket system to manage concurrent fast volume restorations.",
    "Ideal for instant disaster recovery cutover, VDI pools, and rapid test/dev environment spinning."
  ],
  "commonMistake": "Enabling FSR on dozens of snapshots across all AZs without monitoring billing. FSR is billed hourly per AZ per snapshot; only enable FSR on critical golden images or active disaster recovery snapshots in the specific AZs you need.",
  "example": "# Enable Fast Snapshot Restore for a snapshot in us-east-1a:\naws ec2 enable-fast-snapshot-restores \\\n  --availability-zones us-east-1a \\\n  --source-snapshot-ids snap-0123456789abcdef0",
  "sources": [
    {
      "title": "Amazon EBS Fast Snapshot Restore",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html"
    },
    {
      "title": "Monitoring and Managing Fast Snapshot Restore Credits",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html#fsr-credits"
    }
  ]
});
