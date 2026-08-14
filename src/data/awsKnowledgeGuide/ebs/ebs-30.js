import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-30",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Delete on Termination",
  "status": "ready",
  "plainEnglish": "EBS Delete on Termination is an attribute (`DeleteOnTermination`) configured on an Amazon EC2 instance's block device mapping that controls whether an attached Amazon EBS volume is automatically deleted or preserved when the EC2 instance is terminated. If set to `true`, terminating the EC2 instance permanently deletes the EBS volume. If set to `false`, terminating the instance detaches the volume and leaves it intact in your AWS account as an independent EBS volume.",
  "whyItMatters": "This setting protects against accidental data loss while also helping maintain clean, automated infrastructure lifecycle management. For stateless Auto Scaling nodes, you want `DeleteOnTermination: true` to prevent accumulating thousands of orphaned disks. For primary stateful database instances, you want `DeleteOnTermination: false` so that terminating an instance never destroys company records.",
  "workplaceExample": "A DevOps architect configures an EC2 database instance with two block device mappings: the root volume (`/dev/xvda`) has `DeleteOnTermination: true` for clean OS teardown, while the database data volume (`/dev/sdf`) has `DeleteOnTermination: false`. When the instance is terminated during an OS upgrade, the 2 TB customer data volume remains safely available for attachment to the replacement instance.",
  "examFocus": "For SAA-C03, memorize the AWS default behaviors: (1) Root volume -> `DeleteOnTermination` is `true` by default (it is deleted upon EC2 termination). (2) Additional attached Data volumes -> `DeleteOnTermination` is `false` by default (they are preserved). (3) You can override this behavior at launch or modify it on running instances using `aws ec2 modify-instance-attribute`.",
  "keyPoints": [
    "Controls whether an EBS volume is deleted or preserved when its EC2 instance terminates.",
    "Default for Root Volumes is `true` (volume deleted upon instance termination).",
    "Default for additional attached Data Volumes is `false` (volume preserved).",
    "Can be configured during instance launch or modified on running instances via CLI/API.",
    "Preserved volumes transition to the `available` state and continue incurring storage charges."
  ],
  "commonMistake": "Assuming that terminating an EC2 instance deletes all attached EBS volumes. Secondary data volumes default to `DeleteOnTermination: false`, leaving them running and generating monthly storage charges unless manually cleaned up or explicitly configured with `DeleteOnTermination: true`.",
  "example": "# Update the root volume of a running instance to PRESERVE the volume on termination:\naws ec2 modify-instance-attribute \\\n  --instance-id i-0123456789abcdef0 \\\n  --block-device-mappings '[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"DeleteOnTermination\":false}}]'",
  "sources": [
    {
      "title": "Preserving Amazon EBS Volumes on Instance Termination",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#preserving-volumes-on-termination"
    },
    {
      "title": "Modifying Instance Block Device Mappings with AWS CLI",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html"
    }
  ]
});
