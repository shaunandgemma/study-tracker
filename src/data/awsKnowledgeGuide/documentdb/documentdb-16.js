import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-16',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Use Cases for JSON-Like Document Data',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB is optimized for storing and querying flexible, semi-structured JSON document data. Unlike relational databases (which require fixed table schemas and rigid columns), DocumentDB stores data as flexible BSON documents where each document can have unique fields, nested sub-documents, and dynamic arrays without requiring database schema migrations.',
  whyItMatters: 'Modern applications (such as user profile management, content management systems, e-commerce catalogs, and mobile app backends) deal with rapidly evolving data models. Storing flexible JSON documents allows developers to add new features without running slow database migrations.',
  workplaceExample: 'An online marketplace manages 500,000 products. A "Laptop" product has attributes like RAM and CPU, while a "Shirt" product has Size and Color. Storing products as flexible JSON documents in DocumentDB allows both products to reside in the same `products` collection effortlessly.',
  examFocus: 'SAA-C03 DocumentDB Primary Use Cases:\n- E-Commerce Catalogs: Variable product attributes and nested categories.\n- Content Management Systems (CMS): Storing articles, media metadata, and user comments.\n- User Profile & Personalization Stores: Dynamic user preferences and activity histories.\n- MongoDB Workload Migrations: Moving existing MongoDB databases to managed AWS infrastructure.',
  keyPoints: [
    'Optimized for semi-structured JSON and BSON document data.',
    'Schema-less flexible design handles evolving data models without migrations.',
    'Supports rich indexing on nested fields and arrays.',
    'Ideal for e-commerce catalogs, CMS, user profiles, and gaming backends.',
    'MongoDB API compatibility provides familiar query syntax.'
  ],
  commonMistake: 'Using a relational database (RDS MySQL/PostgreSQL) with complex 15-table JOIN queries for a dynamic product catalog, causing slow query performance and schema migration headaches.',
  example: 'Sample DocumentDB JSON Document:\n`{`\n`  "_id": "prod-101",`\n`  "title": "Wireless Headphones",`\n`  "price": 99.99,`\n`  "attributes": { "color": "black", "batteryHours": 30 },`\n`  "tags": ["audio", "bluetooth", "sale"]`\n`}`',
  sources: [
    { title: 'What is Amazon DocumentDB?', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html' }
  ]
});
