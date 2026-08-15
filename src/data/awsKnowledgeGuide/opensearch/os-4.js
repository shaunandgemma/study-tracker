import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-4',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'OpenSearch Domains',
  status: 'ready',
  plainEnglish: 'An OpenSearch Domain is an isolated, customer-managed hardware cluster provisioned within Amazon OpenSearch Service. A domain includes dedicated EC2 compute instances (Data Nodes and Cluster-Manager Nodes), storage volumes (EBS/UltraWarm), cluster configuration parameters, network endpoints, and fine-grained access control settings.',
  whyItMatters: 'Understanding OpenSearch domains is essential for capacity planning and network isolation. Each domain provides dedicated endpoint URIs for document indexing, REST search queries, and OpenSearch Dashboards access.',
  workplaceExample: 'A cyber security firm deploys two isolated OpenSearch domains: `siem-prod-domain` (10 nodes in private VPC subnets for security logs) and `dev-search-domain` (2 nodes for testing application search).',
  examFocus: 'SAA-C03 Domain Topology & Components:\n- Data Nodes: Hold indexed documents and process search/indexing requests.\n- Dedicated Cluster-Manager Nodes: Manage cluster state, shard routing, and node health (formerly called Master Nodes).\n- Endpoints: Unique HTTPS domain endpoint for API calls and OpenSearch Dashboards URL.\n- Access Control: Secured via IAM Domain Access Policies, Security Groups (VPC), and Fine-Grained Access Control (FGAC).',
  keyPoints: [
    'An OpenSearch Domain represents a fully configured managed OpenSearch hardware cluster.',
    'Consists of Data Nodes, optional Dedicated Cluster-Manager Nodes, and attached storage.',
    'Provides dedicated HTTPS endpoints for API calls and OpenSearch Dashboards access.',
    'Can be deployed publicly or privately within Amazon VPC subnets.',
    'Cluster configuration parameters (instance types, counts, storage) managed per domain.'
  ],
  commonMistake: 'Confusing an OpenSearch Domain with an OpenSearch Index. A Domain is the entire cluster infrastructure; an Index is a logical collection of JSON documents stored inside the domain.',
  example: 'Creating a Provisioned OpenSearch Domain via AWS CLI:\naws opensearch create-domain --domain-name analytics-domain --engine-version OpenSearch_2.11 --cluster-config InstanceType=r6g.large.search,InstanceCount=3,DedicatedMasterEnabled=true,DedicatedMasterType=c6g.large.search,DedicatedMasterCount=3',
  sources: [
    { title: 'Amazon OpenSearch Service domain configuration', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html' }
  ]
});
