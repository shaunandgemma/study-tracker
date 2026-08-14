import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'doc-1',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'Decoupled Compute & Storage Architecture Replicated across 3 Availability Zones',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB (with MongoDB compatibility) features a modern, cloud-native architecture that separates (decouples) compute nodes from cluster storage. Compute nodes handle query processing and database execution, while a distributed, self-healing cluster storage volume automatically replicates 6 copies of your data across 3 Availability Zones (2 copies per AZ).',
  whyItMatters: 'Decoupling compute from storage means database storage automatically auto-expands (up to 128 TiB) without needing to resize database instances or provision storage in advance. Furthermore, losing a physical compute node or an entire Availability Zone never causes data loss.',
  workplaceExample: 'An e-commerce company uses DocumentDB for its product catalog. During peak shopping season, their database storage grows from 500 GB to 4 TB automatically without downtime. When one compute node fails, the cluster storage remains 100% available while a replacement node boots.',
  examFocus: 'SAA-C03 Architecture Details for DocumentDB:\n- Decoupled compute and storage architecture (similar to Amazon Aurora).\n- Storage automatically scales up to 128 TiB per cluster in 10 GB increments.\n- Data is replicated 6-ways across 3 Availability Zones (2 copies per AZ).\n- Storage layer withstands the loss of up to 2 copies without affecting write availability, and up to 3 copies without affecting read availability.',
  keyPoints: [
    'Decouples compute instances from the shared distributed storage volume.',
    'Storage automatically scales up to 128 TiB without manual provisioning.',
    'Replicates 6 copies of data across 3 Availability Zones (2 copies per AZ).',
    'Fault-tolerant storage volume handles loss of up to 2 data copies for writes and 3 for reads.',
    'Self-healing storage automatically repairs corrupted disk sectors in the background.'
  ],
  commonMistake: 'Assuming DocumentDB requires manually adding EBS volumes when storage reaches capacity. DocumentDB cluster storage auto-expands up to 128 TiB dynamically.',
  example: 'DocumentDB Storage Auto-Scaling:\nInitial Storage: 100 GB -> Data Load -> Current Storage: 2.5 TB (Scaled automatically without downtime or manual configuration).',
  sources: [
    { title: 'Amazon DocumentDB: How It Works', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/how-it-works.html' }
  ]
});
