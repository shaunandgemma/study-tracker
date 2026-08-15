import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-9',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Clusters and Instances',
  status: 'ready',
  plainEnglish: 'An Amazon Neptune DB Cluster consists of a managed storage volume and compute DB Instances. A cluster contains exactly one Primary DB Instance (Writer) and zero or more Read Replica DB Instances (Readers, up to 15 max). Compute instances run the Neptune graph database engine while attaching to the shared 6-way replicated storage volume.',
  whyItMatters: 'Decoupling compute instances from storage allows you to scale read query compute independently (by adding DB instances) or scale database storage automatically up to 128 TiB without needing to resize DB instance types.',
  workplaceExample: 'A company provisions a Neptune Cluster with 1 Primary `db.r6g.xlarge` instance for graph updates and 3 Read Replica `db.r6g.xlarge` instances. During peak hours, they scale up to 6 Read Replicas to absorb read traffic without changing the Writer instance.',
  examFocus: 'SAA-C03 Cluster Topology & Sizing:\n- DB Cluster: Managed container holding 1 Writer + 0 to 15 Read Replicas + Shared Storage Volume.\n- Instance Classes: Provisioned DB Instance Classes (e.g. `db.r6g.large`, `db.r6g.xlarge`) or Neptune Serverless (`db.serverless`).\n- Failover Priority: Assign failover tiers (0 to 15) to Read Replicas to determine which instance becomes Writer during automatic failover.',
  keyPoints: [
    'Neptune Cluster composed of shared storage volume and compute DB instances.',
    'Cluster contains 1 Primary Writer instance and up to 15 Read Replica instances.',
    'Supports Provisioned DB instance classes and Neptune Serverless (`db.serverless`).',
    'Compute instances scale independently from underlying cluster storage.',
    'Failover priorities (tiers 0-15) determine replica promotion order during failover.'
  ],
  commonMistake: 'Attempting to provision a Neptune cluster with two active Writer instances. A Neptune cluster supports strictly 1 Primary Writer instance.',
  example: 'Adding a Read Replica to a Neptune Cluster via AWS CLI:\naws neptune create-db-instance --db-instance-identifier neptune-replica-1 --db-cluster-identifier prod-neptune-cluster --db-instance-class db.r6g.xlarge --engine neptune',
  sources: [
    { title: 'Neptune DB clusters and DB instances', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/neptune-endpoints.html' }
  ]
});
