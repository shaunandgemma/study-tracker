import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-13',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Cluster and Reader Endpoints',
  status: 'ready',
  plainEnglish: 'Amazon Neptune provides managed DNS Endpoint URLs to simplify application connectivity:\n- Cluster Endpoint (Primary Endpoint): Connects directly to the current Primary Writer instance. Used for graph write and read operations.\n- Reader Endpoint: Balances incoming read connections across all available Read Replicas in the cluster.\n- Instance Endpoints: Connects directly to a specific DB instance for targeted monitoring or debugging.',
  whyItMatters: 'Using managed cluster endpoints decouples application code from specific underlying EC2 instance IDs or IP addresses. If a failover occurs, the Cluster Endpoint DNS automatically points to the new Primary Writer without application configuration changes.',
  workplaceExample: 'A recommendation API uses two connection pools: `g_write` connects to `prod-cluster.cluster-c123.us-east-1.neptune.amazonaws.com` for graph inserts, while `g_read` connects to `prod-cluster.cluster-ro-c123.us-east-1.neptune.amazonaws.com` to distribute query load across 4 read replicas.',
  examFocus: 'SAA-C03 Endpoint Behavior:\n- Cluster Endpoint: Points to Primary Writer instance; updates automatically upon failover.\n- Reader Endpoint: Load balances NEW connection requests among available Read Replicas. Note: Does NOT split a single query across replicas; balances connection sessions.\n- HTTPS / WebSocket Ports: Gremlin uses WebSocket (`wss://...:8182/gremlin`), openCypher uses HTTPS/Bolt (`https://...:8182/opencypher`), SPARQL uses HTTPS (`https://...:8182/sparql`).',
  keyPoints: [
    'Cluster Endpoint (Primary) points to the current Primary Writer DB instance.',
    'Reader Endpoint load balances new connection sessions across available Read Replicas.',
    'Decouples application code from specific underlying instance identifiers.',
    'Cluster Endpoint CNAME automatically updates during failover promotion.',
    'Connects over HTTPS / WebSockets on default port 8182.'
  ],
  commonMistake: 'Assuming the Reader Endpoint splits a single Gremlin traversal or openCypher query across multiple read replicas simultaneously. The Reader Endpoint balances connection sessions, not individual query statements.',
  example: 'Neptune Endpoint Structure:\n- Cluster Endpoint (Write/Read): prod-cluster.cluster-c123.us-east-1.neptune.amazonaws.com:8182\n- Reader Endpoint (Read-Only): prod-cluster.cluster-ro-c123.us-east-1.neptune.amazonaws.com:8182',
  sources: [
    { title: 'Amazon Neptune endpoints', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/neptune-endpoints.html' }
  ]
});
