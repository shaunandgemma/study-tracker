import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-36',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Hibernate',
  status: 'ready',
  plainEnglish: 'EC2 Hibernate allows you to pause an EC2 instance by saving the contents of its in-memory RAM directly to its EBS root volume before shutting down. When you restart the instance, AWS restores the RAM state from the EBS volume back into memory, allowing applications to resume from their exact previous state in seconds without undergoing a cold boot process.',
  whyItMatters: 'Applications that take a long time to boot, build caches, or load complex state into memory (such as Java enterprise applications or machine learning models) can be hibernated during off-peak hours. Resuming from hibernate saves boot time and cuts EC2 instance costs while preserving memory state.',
  workplaceExample: 'A developer uses a Java application on an EC2 instance that takes 15 minutes to initialize memory caches upon cold boot. Instead of stopping the instance, the developer hibernates it at night. In the morning, resuming the instance restores all memory caches instantly in under 10 seconds.',
  examFocus: 'SAA-C03 EC2 Hibernate rules:\n- RAM contents are saved to the EBS root volume (EBS root volume MUST be encrypted and large enough to hold RAM).\n- Instance RAM size must be less than 150 GB.\n- Supported on On-Demand and Spot Instances.\n- You do NOT pay for EC2 compute while hibernated (only for attached EBS volume storage).',
  keyPoints: [
    'Saves in-memory RAM state to the EBS root volume before shutting down.',
    'Restores RAM state on start, resuming applications instantly without a cold boot.',
    'EBS root volume must be encrypted and have sufficient capacity for RAM.',
    'Compute billing pauses while hibernated (EBS storage fees apply).',
    'Supported for Linux and Windows on C, M, R, T, and I instance families.'
  ],
  commonMistake: 'Attempting to enable Hibernate on an EC2 instance with an unencrypted EBS root volume. AWS requires the root volume to be encrypted with KMS for hibernation.',
  example: 'Stopping an EC2 Instance with Hibernate:\n`aws ec2 stop-instances --instance-ids i-0123456789abcdef0 --hibernate`',
  sources: [
    { title: 'Hibernate your On-Demand or Spot Instance', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html' }
  ]
});
