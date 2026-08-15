import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-18',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Concurrency Scaling',
  status: 'ready',
  plainEnglish: 'Concurrency Scaling is an automated scaling feature of Amazon Redshift that dynamically adds transient cluster capacity to handle spikes in concurrent read query traffic. When query queues start backing up due to hundreds of simultaneous BI users, Redshift automatically provisions transient Concurrency Scaling clusters to process read queries with consistently fast response times.',
  whyItMatters: 'During morning business hours, hundreds of analysts run BI dashboard queries simultaneously, causing query queue delays. Concurrency Scaling handles these traffic surges automatically without forcing you to permanently size up your primary cluster.',
  workplaceExample: 'At 9:00 AM, 300 business analysts open QuickSight dashboards. Redshift detects query queuing and transparently spins up 3 transient Concurrency Scaling clusters, absorbing the query surge and shutting down when traffic normalizes.',
  examFocus: 'SAA-C03 Concurrency Scaling Mechanics:\n- Read Queries Only: Concurrency Scaling processes read-only queries (write queries like `INSERT`/`UPDATE` run on primary cluster).\n- Free Credits: Clusters earn 1 hour of free Concurrency Scaling credits for every 24 hours the primary cluster runs.\n- Workload Management (WLM): Configured per WLM queue to control which query queues can trigger concurrency bursts.',
  keyPoints: [
    'Dynamically provisions transient cluster capacity to handle concurrent read query surges.',
    'Provides virtually unlimited concurrent query capacity with consistent sub-second latency.',
    'Supports read-only queries (write operations remain on primary cluster).',
    'Earns 1 hour of free Concurrency Scaling credits for every 24 hours of cluster operation.',
    'Configured per Workload Management (WLM) query queue.'
  ],
  commonMistake: 'Expecting Concurrency Scaling to accelerate write-heavy ETL jobs (`COPY`, `UPDATE`). Concurrency Scaling exclusively routes read-only queries.',
  example: 'Enabling Concurrency Scaling in Workload Management (WLM) JSON Config:\n{\n  "query_concurrency": 5,\n  "max_execution_time": 300,\n  "concurrency_scaling_mode": "auto"\n}',
  sources: [
    { title: 'Working with Concurrency Scaling in Amazon Redshift', url: 'https://docs.aws.amazon.com/redshift/latest/dg/concurrency-scaling.html' }
  ]
});
