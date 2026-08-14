import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-17',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB vs DynamoDB',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB and Amazon DynamoDB are both Non-Relational (NoSQL) AWS databases, but they are built for different architectural patterns:\n- Amazon DocumentDB: A fully managed, MongoDB-compatible DOCUMENT database designed for complex JSON querying, secondary indexing, aggregation pipelines, and existing MongoDB app migrations.\n- Amazon DynamoDB: A serverless KEY-VALUE and DOCUMENT database designed for single-digit millisecond latency at any scale, using a primary key/partition key data model with automatic multi-region active-active replication (Global Tables).',
  whyItMatters: 'Choosing between DocumentDB and DynamoDB impacts developer productivity, query flexibility, and operational scaling. DynamoDB offers serverless scaling with key-value lookups, while DocumentDB offers rich MongoDB query power.',
  workplaceExample: 'A mobile gaming company uses DynamoDB for real-time player session lookups (`user_id` -> session data) requiring sub-10ms response times. For their complex game catalog search and content management system requiring multi-field JSON filtering, they use Amazon DocumentDB.',
  examFocus: 'SAA-C03 Decision Matrix:\n- DocumentDB: MongoDB compatibility required, complex JSON aggregation pipelines, ad-hoc indexing, cluster-based provisioned compute.\n- DynamoDB: Serverless key-value/document store, predictable single-digit millisecond latency, unlimited automatic throughput scaling, Global Tables (multi-region active-active).',
  keyPoints: [
    'DocumentDB: MongoDB-compatible, rich JSON queries, aggregation pipelines, cluster compute.',
    'DynamoDB: Serverless NoSQL, key-value/document store, sub-10ms latency at scale.',
    'DynamoDB scales throughput automatically (Provisioned or On-Demand); DocumentDB scales via instance sizes and read replicas.',
    'DynamoDB Global Tables support active-active multi-region replication.',
    'DocumentDB is the primary destination for migrating existing MongoDB workloads.'
  ],
  commonMistake: 'Selecting DocumentDB when a serverless, single-digit millisecond key-value lookup database is required (DynamoDB is the better fit for key-value performance).',
  example: 'Database Selection Guide:\n- "Migrate existing MongoDB application to AWS" -> Amazon DocumentDB.\n- "Serverless NoSQL database for shopping cart key-value store with sub-10ms response" -> Amazon DynamoDB.',
  sources: [
    { title: 'What is Amazon DocumentDB?', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html' }
  ]
});
