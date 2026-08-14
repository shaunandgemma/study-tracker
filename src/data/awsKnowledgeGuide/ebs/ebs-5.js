import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-5",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Elastic Volumes (Modifying volume size, IOPS, and type dynamically)",
  "status": "ready",
  "plainEnglish": "EBS Elastic Volumes is an Amazon EBS capability that allows you to dynamically increase volume storage size, adjust provisioned IOPS and throughput, or change the volume type (such as upgrading from gp2 to gp3, or moving to io2) on a live, attached storage volume with zero downtime and without detaching the volume from your running EC2 instance.",
  "whyItMatters": "In legacy on-premises data centers, resizing or reconfiguring disk storage required scheduled maintenance windows, unmounting disks, detaching LUNs, and taking production services offline. Elastic Volumes allows storage capacity and performance to grow seamlessly on-the-fly as application demand scales.",
  "workplaceExample": "A database administrator notices that an e-commerce PostgreSQL volume (a 500 GB gp2 volume) is 90% full and running out of IOPS on Black Friday. Using Elastic Volumes, the DBA issues a single command to expand disk size to 1,000 GB and convert the volume type to gp3 with 6,000 IOPS and 300 MB/s throughput while customers continue transacting uninterrupted.",
  "examFocus": "For SAA-C03, know that EBS Elastic Volumes allows: (1) Increasing size (decreasing volume size is NEVER supported directly), (2) Changing volume type (e.g. gp2 to gp3, or gp3 to io2), and (3) Adjusting IOPS and throughput without taking the EC2 instance offline. After expanding volume size in AWS, you must extend the file system inside the OS (e.g. `resize2fs` or `xfs_growfs` in Linux, or Disk Management in Windows).",
  "keyPoints": [
    "Modifies volume size, IOPS, throughput, and volume type dynamically on live attached volumes.",
    "Zero downtime: does not require stopping the EC2 instance or unmounting/detaching the volume.",
    "Storage volume size can only be increased; decreasing volume size is NOT supported.",
    "OS file system extension (e.g. `xfs_growfs`, `resize2fs`, or `extend` in diskpart) is required after AWS volume expansion.",
    "Volume transitions through 'modifying' -> 'optimizing' states (can modify once every 6 hours per volume)."
  ],
  "commonMistake": "Thinking increasing the EBS volume size in the AWS Console immediately gives the operating system more space. AWS expands the raw block device, but you must run OS-level file system resize commands (like `xfs_growfs` or `resize2fs`) to make the new partition space usable.",
  "example": "# Modify an attached EBS volume to 500 GB and convert to gp3 with 5000 IOPS:\naws ec2 modify-volume \\\n  --volume-id vol-0123456789abcdef0 \\\n  --size 500 \\\n  --volume-type gp3 \\\n  --iops 5000 \\\n  --throughput 250",
  "sources": [
    {
      "title": "Amazon EBS Elastic Volumes",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html"
    },
    {
      "title": "Extending a Linux File System after Resizing a Volume",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html"
    }
  ]
});
