import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-17",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Data Volumes",
  "status": "ready",
  "plainEnglish": "An EBS Data Volume is any secondary Amazon EBS storage volume attached to an Amazon EC2 instance alongside the root boot volume. Data volumes are formatted with file systems (such as ext4, XFS, NTFS) and mounted to specific mount points (e.g. `/var/log`, `/mnt/database`, or Windows `D:\\` drive) to store application data, database files, containers, and media assets.",
  "whyItMatters": "Separating application data from the root operating system disk allows you to rebuild, replace, or upgrade the OS without touching business data. Furthermore, by default, when an EC2 instance is terminated, attached EBS Data Volumes persist (their `DeleteOnTermination` attribute defaults to `false`), preventing accidental data loss.",
  "workplaceExample": "A database team attaches a 4 TB gp3 EBS data volume mounted at `/var/lib/mysql` on an EC2 instance. When migrating to a newer Linux operating system AMI, they simply detach the data volume from the old instance and re-attach it to the new instance in seconds with zero data copying.",
  "examFocus": "For SAA-C03, remember the default termination behavior difference: (1) Root volume -> `DeleteOnTermination` defaults to `true`. (2) Additional attached Data volumes -> `DeleteOnTermination` defaults to `false` (they persist after instance termination). You can use any EBS volume type (gp3, io2, st1, sc1) for data volumes.",
  "keyPoints": [
    "Secondary storage volumes attached to EC2 instances for application and user data.",
    "Default `DeleteOnTermination` setting on additional attached data volumes is `false`.",
    "Supports all EBS volume types (gp3, gp2, io1, io2, st1, sc1).",
    "Can be detached from one instance and attached to another in the same AZ.",
    "Enables OS replacement without losing underlying application data."
  ],
  "commonMistake": "Accumulating 'orphaned' unattached EBS data volumes after terminating EC2 instances because `DeleteOnTermination` defaulted to `false`. Implement AWS Cost Explorer alerts or AWS Config rules to identify and clean up unattached EBS volumes.",
  "example": "# Attach a secondary 1 TB data volume to an EC2 instance:\naws ec2 attach-volume \\\n  --volume-id vol-0987654321fedcba0 \\\n  --instance-id i-0123456789abcdef0 \\\n  --device /dev/xvdg",
  "sources": [
    {
      "title": "Amazon EBS Volume Attachments",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html"
    },
    {
      "title": "Preserving Data Volumes on Instance Termination",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#preserving-volumes-on-termination"
    }
  ]
});
