import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-40',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 EBS-Backed Instances',
  status: 'ready',
  plainEnglish: 'An EBS-Backed EC2 Instance uses an Amazon Elastic Block Store (EBS) volume as its root device (where the operating system is installed). Unlike Instance Store-backed instances, data stored on an EBS-backed instance persists independently of the instance lifecycle. You can stop and restart an EBS-backed instance without losing data, take point-in-time EBS snapshots, change instance types, and detach/attach volumes freely.',
  whyItMatters: 'EBS-backed instances are the standard choice for almost all general-purpose cloud workloads, web applications, and databases because they provide persistent, durable storage with backup capabilities.',
  workplaceExample: 'An enterprise hosts its WordPress site on an EBS-backed instance. When CPU usage spikes, they stop the instance, change the instance size from `t3.medium` to `m6i.large`, and start it back up—retaining all OS configurations, files, and database records intact.',
  examFocus: 'SAA-C03 EBS-Backed vs Instance Store-Backed comparison:\n- EBS-Backed: Persistent data. Can be STOPPED and STARTED. Supports EBS Snapshots. Can change instance type dynamically.\n- Instance Store-Backed: Ephemeral data. CANNOT be stopped (only rebooted or terminated). Data lost on termination/stop.',
  keyPoints: [
    'Uses Amazon EBS as root device storage for persistent data lifecycle.',
    'Can be stopped and started without losing root volume data.',
    'Supports point-in-time EBS Snapshots saved to S3.',
    'Allows changing instance size/type by stopping and modifying settings.',
    'Root volume default is set to `DeleteOnTermination=true` (can be changed to `false`).'
  ],
  commonMistake: 'Deleting an EBS-backed instance expecting secondary EBS data volumes to persist, without verifying if `DeleteOnTermination` was set to `true` on secondary volumes.',
  example: 'Modifying EBS Root Volume `DeleteOnTermination` attribute:\n`aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 --block-device-mappings "[{\"DeviceName\": \"/dev/sda1\",\"Ebs\":{\"DeleteOnTermination\":false}}]"`',
  sources: [
    { title: 'Storage for the root device', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ComponentsAMIs.html' }
  ]
});
