import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-10',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift RA3 Nodes and Managed Storage',
  status: 'ready',
  plainEnglish: 'RA3 Nodes with Redshift Managed Storage (RMS) is the modern node family architecture for Amazon Redshift that completely decouples compute capacity from storage capacity. Data is stored durably in high-performance Redshift Managed Storage backed by Amazon S3, while RA3 nodes use fast local NVMe SSDs to cache hot data for rapid query execution.',
  whyItMatters: 'Legacy cluster node types (like DC2) tied compute instances directly to local storage disks. If you needed more storage, you had to add expensive compute nodes. RA3 nodes allow storage to grow automatically up to petabytes per cluster without forcing you to pay for extra compute nodes.',
  workplaceExample: 'A data warehouse grows from 10 TB to 100 TB over 2 years. Using `ra3.xlplus` nodes, storage scales automatically on Redshift Managed Storage while keeping compute instance count fixed at 4 nodes, saving $50,000 annually.',
  examFocus: 'SAA-C03 RA3 Node & Managed Storage Features:\n- Decoupled Storage: Managed storage scales automatically up to petabytes per cluster on S3-backed storage.\n- Local NVMe Cache: High-speed local SSDs on RA3 nodes automatically cache hot working set data.\n- Cross-Cluster Data Sharing: RA3 nodes enable live Redshift Data Sharing across clusters without data copying.\n- Recommended Migration: AWS strongly recommends migrating legacy DC2/DS2 clusters to RA3 nodes.',
  keyPoints: [
    'Decouples compute capacity from underlying storage growth.',
    'Managed storage automatically expands on S3-backed durable storage volume.',
    'Uses fast local NVMe SSDs to cache frequently accessed hot data blocks.',
    'Enables live cross-cluster Redshift Data Sharing.',
    'Eliminates the requirement to add compute nodes merely to increase disk capacity.'
  ],
  commonMistake: 'Upgrading a legacy cluster to more compute nodes solely to gain storage space, instead of migrating to RA3 nodes with Managed Storage.',
  example: 'Creating an RA3 Cluster with Managed Storage via AWS CLI:\naws redshift create-cluster --cluster-identifier prod-ra3-cluster --node-type ra3.4xlarge --number-of-nodes 4',
  sources: [
    { title: 'Amazon Redshift RA3 node types and managed storage', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#ra3-node-types' }
  ]
});
