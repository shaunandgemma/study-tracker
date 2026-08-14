import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-9', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Replication Instances', status: 'ready',
  plainEnglish: 'A DMS replication instance is managed EC2-based compute that connects to endpoints and runs one or more replication tasks. Its CPU, memory, network bandwidth, storage, engine version, subnet group, security groups, and availability configuration affect migration performance.',
  whyItMatters: 'Undersized replication compute can slow full load, accumulate CDC changes, exhaust storage, or cause multiple tasks to compete for memory.',
  workplaceExample: 'A busy full-load-plus-CDC migration uses a memory-optimized class and increased storage because changes arrive faster than the target can apply them during the load.',
  examFocus: 'Size for table count, LOB handling, concurrent tasks, transaction volume, logging, and target speed. Multi-AZ adds standby availability but also cost and some performance overhead. DMS Serverless is an alternative for supported use cases.',
  keyPoints: ['One instance can host multiple tasks.', 'Full load uses compute, network, and memory.', 'CDC can spill cached changes from memory to disk.', 'Subnet groups place the instance in selected VPC subnets.', 'CloudWatch metrics guide sizing and troubleshooting.'],
  commonMistake: 'Choosing the smallest class for a production migration based only on database storage size.',
  example: 'Pilot a representative workload, monitor CPU, freeable memory, storage, throughput and CDC latency, then resize before production cutover.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Choosing a DMS replication instance', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Types.html' }, { title: 'Sizing a replication instance', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.SizingReplicationInstance.html' }]
});
