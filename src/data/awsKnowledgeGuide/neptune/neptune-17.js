import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-17',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Graph Use Cases - Social, Fraud and Knowledge Graphs',
  status: 'ready',
  plainEnglish: 'Amazon Neptune is engineered for workloads where data relationships are as important as the data itself. Primary enterprise use cases include:\n- Fraud Detection: Identifying synthetic identities or coordinated fraud rings across shared IP addresses and credit cards.\n- Social Graphs & Recommendations: Traversing friend networks and user preferences for real-time feed recommendations.\n- Knowledge Graphs: Mapping complex enterprise taxonomies, medical ontologies, and IT dependency networks.',
  whyItMatters: 'Attempting to model these highly connected use cases in relational databases requires deeply nested SQL `JOIN` statements that consume excessive CPU and time out as datasets scale. Neptune executes multi-hop relationship traversals in milliseconds.',
  workplaceExample: 'A bank uses Neptune for real-time fraud detection. When a user submits a wire transfer, a Gremlin query traverses 5-hop connections (User -> IP -> Device -> Card -> Recipient) in under 20 milliseconds to detect known fraud syndicates.',
  examFocus: 'SAA-C03 Architectural Selection for Neptune:\n- Fraud Detection: Rapid pattern matching across shared credentials, devices, and financial transfers.\n- Recommendation Engines: Real-time item filtering based on user purchase graph connections.\n- Identity Resolution: Linking disparate user profiles across devices and emails.\n- Knowledge Graphs: Semantic search across enterprise data catalogs and ontologies.',
  keyPoints: [
    'Optimized for highly connected data workloads requiring relationship traversal.',
    'Fraud Detection: Detects coordinated fraud rings and shared credentials in milliseconds.',
    'Social & Recommendation Engines: Real-time friend feeds and personalized item recommendations.',
    'Knowledge Graphs & IT Dependency: Maps enterprise taxonomies and infrastructure graphs.',
    'Delivers sub-second performance for multi-hop graph traversals where SQL JOINs fail.'
  ],
  commonMistake: 'Choosing Neptune for simple key-value lookups or flat transactional table storage where DynamoDB or Amazon RDS is far simpler and more cost-effective.',
  example: 'Use Case Selection Matrix:\n- "Detect synthetic fraud across 4-hop device/card connections" -> Amazon Neptune\n- "High-volume key-value shopping cart storage" -> Amazon DynamoDB\n- "Relational financial ledger with ACID SQL joins" -> Amazon Aurora PostgreSQL',
  sources: [
    { title: 'Amazon Neptune use cases', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview.html' }
  ]
});
