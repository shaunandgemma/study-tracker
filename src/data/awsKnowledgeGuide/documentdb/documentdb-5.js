import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-5',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Instances and Cluster Storage',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB separates compute DB instances from cluster storage:\n- DB Instances: Virtual database compute nodes (e.g. `db.r6g.xlarge`) that process queries, run MongoDB database engines, and execute indexes in RAM.\n- Cluster Storage: A shared, distributed virtual storage volume built specifically for cloud-native databases that automatically scales from 10 GB up to 128 TiB without manual disk management.',
  whyItMatters: 'In traditional databases, adding CPU requires migrating storage disks. In DocumentDB, scaling compute instance size or adding read replicas is decoupled from storage, allowing instant compute scaling without data copying.',
  workplaceExample: 'An analytics team needs more CPU power for complex aggregation pipeline queries. They upgrade their DocumentDB compute instance from `db.r5.large` to `db.r5.4xlarge`. The upgrade completes in minutes because no database files need to be copied.',
  examFocus: 'SAA-C03 Decoupled Storage vs Compute:\n- DB Instances perform compute and query execution (RAM/CPU).\n- Cluster Storage handles data persistence, 6-way replication, and auto-scaling up to 128 TiB.\n- You can modify DB instance size without re-provisioning or modifying cluster storage capacity.',
  keyPoints: [
    'Compute instances process queries; cluster storage handles data persistence.',
    'Cluster storage auto-expands in 10 GB increments up to 128 TiB.',
    'Compute instance scaling is independent of storage disk migration.',
    'DB Instance classes: Memory Optimized (R5, R6g) and General Purpose (T3, T4g).',
    'Shared cluster storage enables sub-10ms replica replication lag.'
  ],
  commonMistake: 'Sizing compute instances solely based on disk space requirements. DocumentDB storage scales automatically; compute instances should be sized based on active working set RAM and CPU needs.',
  example: 'Scaling a DocumentDB Instance Class:\n`aws docdb modify-db-instance --db-instance-identifier docdb-node-1 --db-instance-class db.r6g.2xlarge --apply-immediately`',
  sources: [
    { title: 'Amazon DocumentDB Instance Classes', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/db-instance-classes.html' }
  ]
});
