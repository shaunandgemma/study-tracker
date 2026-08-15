import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-10',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Read Replicas',
  status: 'ready',
  plainEnglish: 'Amazon Neptune Read Replicas are compute DB instances within a Neptune cluster dedicated to serving read queries (Gremlin, openCypher, or SPARQL). Because all Read Replicas mount the cluster\'s single, shared 6-way replicated storage volume, replication lag between the Writer and Read Replicas is extremely low (typically under 10 milliseconds).',
  whyItMatters: 'High-throughput graph applications receive heavy read traffic. Adding Read Replicas offloads read query compute from the Primary Writer, ensuring graph updates are not delayed by heavy reporting queries.',
  workplaceExample: 'An enterprise social network experiences 100x more read traversals than profile updates. They provision 5 Neptune Read Replicas behind the Cluster Reader Endpoint to balance graph read queries evenly across all replicas.',
  examFocus: 'SAA-C03 Neptune Read Replica Rules:\n- Capacity: Up to 15 Read Replicas per Neptune cluster.\n- Shared Storage: Read Replicas do NOT replicate storage independently; they attach to the shared cluster volume.\n- Low Lag: Replication lag is typically < 10 ms.\n- Failover Targets: Serve as automatic failover targets if the Primary Writer instance fails.\n- Read Only: Read Replicas reject write transactions.',
  keyPoints: [
    'Supports up to 15 Read Replicas per Neptune database cluster.',
    'All replicas share the underlying multi-AZ cluster storage volume.',
    'Near-instantaneous replication lag (typically under 10 milliseconds).',
    'Offloads read query compute (Gremlin/openCypher/SPARQL) from Primary Writer.',
    'Acts as automatic failover targets during primary instance outages.'
  ],
  commonMistake: 'Attempting to send write transactions (like `g.addV()`) to a Read Replica endpoint, resulting in a read-only transaction exception.',
  example: 'Connecting to Neptune Reader Endpoint via Gremlin Python:\nfrom gremlin_python.driver.driver_remote_connection import DriverRemoteConnection\ng = traversal().withRemote(DriverRemoteConnection("wss://prod-neptune-cluster.cluster-ro-c123.us-east-1.neptune.amazonaws.com:8182/gremlin", "g"))',
  sources: [
    { title: 'Neptune Read Replicas', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview-read-replicas.html' }
  ]
});
