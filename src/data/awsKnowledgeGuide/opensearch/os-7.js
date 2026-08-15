import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-7',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Multi-AZ Deployment',
  status: 'ready',
  plainEnglish: 'Multi-AZ Deployment in Amazon OpenSearch Service distributes your domain\'s Data Nodes, Dedicated Cluster-Manager Nodes, and index shards across 2 or 3 Availability Zones within an AWS Region. It ensures that primary index shards and their corresponding replica shards are placed in separate AZs.',
  whyItMatters: 'If an Availability Zone experiences a facility outage, a Multi-AZ domain promotes replica shards in surviving AZs to primary shards automatically, preventing data loss and maintaining cluster query availability.',
  workplaceExample: 'A financial portal deploys a 3-AZ OpenSearch domain with 6 data nodes (2 per AZ) and 3 dedicated cluster-manager nodes. When AZ-1 undergoes network maintenance, the cluster automatically serves search traffic from nodes in AZ-2 and AZ-3 without query failure.',
  examFocus: 'SAA-C03 Multi-AZ Topology Rules:\n- 2-AZ vs 3-AZ: 3-AZ deployment is strongly recommended for production resiliency.\n- Shard Distribution: Primary and replica shards for the same index are guaranteed to be placed in different Availability Zones.\n- Dedicated Cluster-Manager Nodes: Must deploy 3 dedicated cluster-manager nodes (1 per AZ in 3-AZ mode) to maintain quorum voting during split-brain prevention.\n- Multi-AZ with Standby: Advanced feature providing automated failover with 99.99% SLA.',
  keyPoints: [
    'Distributes Data Nodes and Cluster-Manager Nodes across 2 or 3 Availability Zones.',
    'Places Primary and Replica shards in separate AZs to prevent single-AZ data loss.',
    'Requires 3 Dedicated Cluster-Manager Nodes for 3-AZ deployments to preserve quorum.',
    'Provides seamless failover and shard promotion during Availability Zone outages.',
    'Multi-AZ with Standby option delivers high-availability SLA (99.99% availability).'
  ],
  commonMistake: 'Deploying a 3-AZ cluster with only 2 Dedicated Cluster-Manager nodes, exposing the cluster to split-brain quorum failures during an AZ partition.',
  example: 'Configuring a 3-AZ OpenSearch Domain via AWS CLI:\naws opensearch create-domain --domain-name prod-search --engine-version OpenSearch_2.11 --cluster-config ZoneAwarenessEnabled=true,ZoneAwarenessConfig={AvailabilityZoneCount=3},InstanceCount=6,InstanceType=r6g.large.search,DedicatedMasterEnabled=true,DedicatedMasterType=c6g.large.search,DedicatedMasterCount=3',
  sources: [
    { title: 'Multi-AZ deployments in Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html' }
  ]
});
