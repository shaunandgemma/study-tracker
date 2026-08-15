import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'nep-2',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Multi-AZ High Availability Architecture with 6-way storage replication',
  status: 'ready',
  plainEnglish: 'Amazon Neptune utilizes a cloud-native, decoupled storage architecture that replicates database storage volumes 6 ways across 3 Availability Zones within an AWS Region (2 copies in each of the 3 AZs). This storage cluster is shared across the Primary Writer instance and up to 15 Read Replicas.',
  whyItMatters: 'Neptune\'s 6-way storage replication tolerates the loss of up to 2 storage copies without impacting write availability, and up to 3 copies without impacting read availability, guaranteeing high durability without manual backup restores.',
  workplaceExample: 'An enterprise Neptune cluster runs in `us-east-1`. If `us-east-1a` experiences a physical facility outage, the 4 remaining storage copies in `1b` and `1c` continue handling database writes seamlessly without data corruption.',
  examFocus: 'SAA-C03 Neptune Storage Architecture:\n- 6-Way Storage Replication: 6 copies of data replicated synchronously across 3 Availability Zones.\n- Fault Tolerance: Tolerates loss of 2 storage copies without write disruption; 3 storage copies without read disruption.\n- Storage Auto-Healing: Damaged disk blocks are automatically repaired using healthy copies in other AZs.\n- Shared Storage Volume: All DB instances (Writer and Read Replicas) mount the same underlying virtual storage volume.',
  keyPoints: [
    'Cloud-native shared storage volume replicated 6 ways across 3 Availability Zones.',
    'Tolerates loss of 2 storage copies without write disruption.',
    'Tolerates loss of 3 storage copies without read disruption.',
    'Storage automatically repairs damaged disk blocks using healthy copies (auto-healing).',
    'Shared by the primary Writer and all Read Replicas in the cluster.'
  ],
  commonMistake: 'Assuming each Neptune Read Replica maintains a separate isolated copy of database storage. All instances in a Neptune cluster share the same underlying 6-way replicated storage volume.',
  example: 'Neptune Storage Fault Tolerance:\n- AZ-1 (2 copies) | AZ-2 (2 copies) | AZ-3 (2 copies)\n- Result: Complete loss of AZ-1 leaves 4 copies active, maintaining full read and write functionality.',
  sources: [
    { title: 'Amazon Neptune storage architecture', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview.html#feature-overview-storage' }
  ]
});
