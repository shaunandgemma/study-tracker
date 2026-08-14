import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-27",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Volume Resize",
  "status": "ready",
  "plainEnglish": "EBS Volume Resize is the operational workflow for expanding the capacity of an existing Amazon EBS storage volume and extending its file system. Resizing an EBS volume involves two mandatory stages: (1) Requesting an increased disk size in AWS (via AWS Console, CLI, or API) which Elastic Volumes applies dynamically without detaching the disk, and (2) Running operating-system utilities inside the EC2 instance (such as `growpart` and `resize2fs`/`xfs_growfs` on Linux, or `Extend Volume` in Windows Disk Management) to expand the partition and file system into the newly provisioned space.",
  "whyItMatters": "Applications frequently consume disk space faster than anticipated. Having a zero-downtime, predictable resize procedure prevents database out-of-disk crashes and emergency outages without taking systems offline.",
  "workplaceExample": "A production PostgreSQL database triggers a CloudWatch disk usage alarm at 85% utilization on a 200 GB volume. The systems engineer issues `aws ec2 modify-volume --volume-id vol-0123 --size 400`, then SSHs into the server and runs `growpart /dev/nvme0n1 1` and `xfs_growfs -d /data`, expanding usable storage to 400 GB in 90 seconds while the database processes live queries.",
  "examFocus": "For SAA-C03, remember the two-step resize requirement: (1) EBS Volume size can ONLY be INCREASED; decreasing size is impossible (to decrease size, you must create a smaller new volume and copy files). (2) After modifying the volume size in AWS, you MUST extend the file system inside the OS; AWS cannot automatically modify OS partitions.",
  "keyPoints": [
    "Resizing volume capacity requires both AWS-level volume expansion and OS-level file system extension.",
    "Storage volume size can ONLY be increased; shrinking/decreasing volume size is NOT supported.",
    "Zero downtime: expansion occurs online while volume remains attached to the running instance.",
    "Linux tools: `growpart` to expand partition, followed by `resize2fs` (ext4) or `xfs_growfs` (XFS).",
    "Windows tools: Disk Management GUI or PowerShell `Resize-Partition` cmdlet."
  ],
  "commonMistake": "Modifying the volume size in the AWS Management Console and expecting the disk to immediately show more free space in the OS (`df -h`). You must run file system resize commands inside the OS to recognize the new block storage.",
  "example": "# Step 1: Request EBS volume expansion in AWS CLI:\naws ec2 modify-volume --volume-id vol-0123456789abcdef0 --size 300\n\n# Step 2: In Linux OS, expand partition and XFS file system:\nsudo growpart /dev/nvme1n1 1\nsudo xfs_growfs -d /mnt/data",
  "sources": [
    {
      "title": "Requesting Modifications to Your Amazon EBS Volumes",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html"
    },
    {
      "title": "Recognizing Expanded Volume Size in Linux",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html"
    }
  ]
});
