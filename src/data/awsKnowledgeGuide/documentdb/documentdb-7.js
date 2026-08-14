import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-7',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Read Scaling with Replicas',
  status: 'ready',
  plainEnglish: 'DocumentDB Read Scaling allows you to scale read throughput horizontally by adding up to 15 Read Replicas to a cluster and directing read-only queries to the Reader Endpoint or specifying MongoDB driver read preferences (`secondary` or `secondaryPreferred`). Replicas handle read queries without consuming Primary CPU resources.',
  whyItMatters: 'As user traffic grows, database read volume typically vastly exceeds write volume. Adding Read Replicas allows handling millions of concurrent read queries cost-effectively without needing a larger Primary instance.',
  workplaceExample: 'A news portal experiences a 10x traffic surge during breaking news. They scale their DocumentDB cluster from 2 to 8 Read Replicas in under 10 minutes. The MongoDB driver routes all article read requests to the Reader Endpoint, maintaining fast response times.',
  examFocus: 'SAA-C03 Read Preference settings:\n- `primary`: Default. Sends all reads to Primary (strict read-after-write consistency).\n- `secondaryPreferred`: Directs reads to Read Replicas when available, falling back to Primary if no replicas are reachable.\n- Replica reads are eventually consistent (typically sub-10ms lag).',
  keyPoints: [
    'Scales read operations horizontally up to 15 Read Replicas.',
    'Reader Endpoint automatically balances traffic across all active Read Replicas.',
    'MongoDB drivers support read preferences (`primary`, `secondaryPreferred`, `secondary`).',
    'Replicas share cluster storage, maintaining near-zero replication lag (<10ms).',
    'Primary instance remains dedicated to handling write queries.'
  ],
  commonMistake: 'Adding Read Replicas but leaving the application configured with `readPreference=primary`, causing all read traffic to hit the Primary instance instead of scaling across replicas.',
  example: 'MongoDB Connection String for Read Scaling:\n`mongodb://user:pass@docdb-cluster.node.us-east-1.docdb.amazonaws.com:27017/dbname?replicaSet=rs0&readPreference=secondaryPreferred`',
  sources: [
    { title: 'Understanding Amazon DocumentDB Endpoints', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/endpoints.html' }
  ]
});
