import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-17',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Node-to-Node Encryption',
  status: 'ready',
  plainEnglish: 'Node-to-Node Encryption enforces Transport Layer Security (TLS 1.2+) encryption for all internal network communication between nodes in an OpenSearch domain. This includes shard replication data, cluster-manager state updates, and distributed search sub-queries sent across cluster instances.',
  whyItMatters: 'Without node-to-node encryption, data transferred internally between cluster nodes (like index shard copying) traverses internal VPC networks unencrypted, presenting a compliance violation in multi-tenant or regulated environments.',
  workplaceExample: 'A healthcare platform provisions a Multi-AZ OpenSearch domain. Node-to-node encryption guarantees that patient data replicated from Data Node 1 in `us-east-1a` to Data Node 2 in `us-east-1b` is encrypted over internal TLS links.',
  examFocus: 'SAA-C03 End-to-End Encryption Spectrum:\n- Encryption in Transit (HTTPS): Encrypts traffic between external client applications and domain endpoints.\n- Node-to-Node Encryption: Encrypts internal TLS traffic between Data Nodes and Cluster-Manager Nodes.\n- Encryption at Rest (KMS): Encrypts stored data on underlying EBS volumes and S3.\n- Must be enabled during domain creation for complete end-to-end security.',
  keyPoints: [
    'Enforces TLS 1.2+ encryption for all internal inter-node cluster communications.',
    'Protects internal shard replication, cluster state sync, and sub-query routing.',
    'Must be enabled during domain creation alongside HTTPS enforcing.',
    'Prevents eavesdropping on internal VPC network links between nodes.',
    'Required for strict regulatory compliance standards (FIPS, HIPAA, PCI-DSS).'
  ],
  commonMistake: 'Enabling HTTPS client encryption but leaving Node-to-Node encryption disabled, allowing internal shard replication traffic to cross nodes in plain text.',
  example: 'Enabling Node-to-Node Encryption via AWS CLI:\naws opensearch create-domain --domain-name secure-domain --engine-version OpenSearch_2.11 --node-to-node-encryption-options Enabled=true --domain-endpoint-options EnforceHTTPS=true,TLSSecurityPolicy=Policy-Min-TLS-1-2-2019-07',
  sources: [
    { title: 'Node-to-node encryption for Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html' }
  ]
});
