import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-30', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB vs Amazon RDS', status: 'ready',
  plainEnglish: 'DynamoDB is a serverless NoSQL key-value and document database designed around known key-based access patterns and automatic scaling. Amazon RDS provides managed relational database engines with SQL, joins, relational constraints, and familiar transaction models.',
  whyItMatters: 'The correct choice follows the data relationships, query flexibility, consistency and transaction needs, scale pattern, and operational model rather than simply choosing the newest service.',
  workplaceExample: 'A shopping cart with predictable key access and very high scale uses DynamoDB. A financial reporting system with complex ad hoc joins and relational constraints uses an RDS engine.',
  examFocus: 'Choose DynamoDB for massive scale, low-latency key access, serverless operations, flexible items, Streams, and global tables. Choose RDS for relational schemas, SQL joins, complex queries, and engine compatibility. Applications can use both for different workloads.',
  keyPoints: ['DynamoDB is NoSQL and access-pattern driven.', 'RDS provides managed relational engines.', 'DynamoDB avoids instance provisioning.', 'RDS supports joins and relational constraints.', 'Both support transactions, backups, encryption, and high-availability options in different ways.'],
  commonMistake: 'Choosing DynamoDB for an application that depends on unpredictable ad hoc joins, then recreating a relational engine in application code.',
  example: 'Store high-scale session state in DynamoDB and relational order accounting in Aurora when their access and integrity requirements differ.',
  sources: [{ title: 'Amazon DynamoDB: How it works', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.html' }, { title: 'What is Amazon RDS?', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' }, { title: 'AWS database decision guide', url: 'https://docs.aws.amazon.com/pdfs/decision-guides/latest/databases-on-aws-how-to-choose/databases-on-aws-how-to-choose.pdf' }]
});
