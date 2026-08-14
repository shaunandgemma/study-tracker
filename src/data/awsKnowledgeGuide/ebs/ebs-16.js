import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-16",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Root Volumes",
  "status": "ready",
  "plainEnglish": "An EBS Root Volume is the primary boot storage volume containing the operating system, kernel, device drivers, and system boot files required to boot an Amazon EC2 instance (typically mounted as `/dev/xvda` or `/dev/sda1` on Linux, and `C:\\` drive on Windows). When an EC2 instance launches from an Amazon Machine Image (AMI), AWS automatically creates and attaches this root volume to boot the instance.",
  "whyItMatters": "The choice of root volume directly determines boot speeds, system patching capability, and durability. By default, EBS-backed instances can be stopped and started at will without losing operating system state, unlike legacy instance-store-backed instances.",
  "workplaceExample": "A cloud engineer launches a fleet of web servers using Amazon Linux 2023. They configure the root volume as an encrypted 30 GB gp3 SSD with `DeleteOnTermination: true`, ensuring fast OS boots and automated disk cleanup whenever Auto Scaling terminates ephemeral web nodes.",
  "examFocus": "For SAA-C03, remember these critical root volume facts: (1) Root volumes MUST be SSD types (gp2, gp3, io1, io2); HDD types (st1, sc1) CANNOT be used as root volumes. (2) By default, an EBS root volume has `DeleteOnTermination` set to `true` (it is deleted when the EC2 instance is terminated). (3) You can change `DeleteOnTermination` to `false` in block device mappings to preserve root disk data after instance termination.",
  "keyPoints": [
    "Primary boot volume containing the operating system and system files for EC2.",
    "Must use SSD-backed storage (gp2, gp3, io1, io2); HDD (st1/sc1) is unsupported for boot.",
    "Default setting for `DeleteOnTermination` on root volumes is `true`.",
    "Can be encrypted at launch using AWS KMS (even if base AMI was unencrypted).",
    "Can be resized dynamically without stopping the instance using EBS Elastic Volumes."
  ],
  "commonMistake": "Terminating an EC2 instance expecting the root volume to survive when `DeleteOnTermination` was left at its default `true` setting. To preserve root volume data on instance termination, set `DeleteOnTermination` to `false` or create periodic EBS snapshots.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: EC2 Instance with encrypted gp3 Root Volume and DeleteOnTermination false.\nResources:\n  WebInstance:\n    Type: AWS::EC2::Instance\n    Properties:\n      ImageId: ami-0c55b159cbfafe1f0\n      InstanceType: t3.medium\n      BlockDeviceMappings:\n        - DeviceName: /dev/xvda\n          Ebs:\n            VolumeType: gp3\n            VolumeSize: 50\n            DeleteOnTermination: false\n            Encrypted: true",
  "sources": [
    {
      "title": "Amazon EC2 Root Device Volume",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/RootDeviceStorage.html"
    },
    {
      "title": "Preserving Amazon EBS Volumes on Instance Termination",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#preserving-volumes-on-termination"
    }
  ]
});
