import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-3',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB MongoDB-Compatible Document Database',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB is a fully managed document database service that is compatible with MongoDB workloads. It allows developers to store, query, and index JSON-like documents (BSON format) using standard MongoDB drivers, tools, and client code, while leveraging AWS infrastructure for automatic scaling, backups, high availability, and security.',
  whyItMatters: 'Migrating an existing self-hosted MongoDB deployment to AWS usually requires rewrite overhead if moving to a relational database. DocumentDB lets you keep your existing MongoDB application code and drivers intact while gaining enterprise AWS database management.',
  workplaceExample: 'A company running an old MongoDB 4.0 cluster on EC2 instances migrates to Amazon DocumentDB. They update their application connection string to point to DocumentDB without changing a single line of application query code.',
  examFocus: 'SAA-C03 MongoDB Compatibility details:\n- Compatible with MongoDB 3.6, 4.0, and 5.0 API specifications.\n- Supports standard MongoDB drivers, shell (`mongosh`), and tools (`mongodump`, `mongorestore`).\n- Fully managed by AWS: handles patching, backups, scaling, and Multi-AZ failover.',
  keyPoints: [
    'Fully managed JSON document database compatible with MongoDB APIs.',
    'Works natively with standard MongoDB drivers, SDKs, and CLI tools.',
    'Stores data in flexible, schema-less BSON document structures.',
    'Eliminates administrative overhead of self-managed MongoDB clusters.',
    'Integrates seamlessly with AWS KMS, CloudWatch, and VPC security.'
  ],
  commonMistake: 'Assuming DocumentDB supports every single niche MongoDB extension or plugin. DocumentDB implements the MongoDB API specification, but unsupported MongoDB features should be checked via AWS compatibility docs before migration.',
  example: 'Connecting with MongoDB Node.js Driver:\n`const { MongoClient } = require("mongodb");`\n`const client = new MongoClient("mongodb://dbuser:pass@docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017/?tls=true");`',
  sources: [
    { title: 'MongoDB API Compatibility in Amazon DocumentDB', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/compatibility.html' }
  ]
});
