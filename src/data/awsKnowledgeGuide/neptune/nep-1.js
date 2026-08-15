import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'nep-1',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Graph Data Models: Property Graph (Gremlin) & W3C RDF (SPARQL)',
  status: 'ready',
  plainEnglish: 'Amazon Neptune supports two distinct graph data models:\n1. Property Graph Model: Represents data as Vertices (nodes) and Edges (relationships), with key-value properties on both. Queried using Apache TinkerPop Gremlin or openCypher.\n2. W3C Resource Description Framework (RDF) Model: Represents data as Subject-Predicate-Object triples (e.g. "Alice" "knows" "Bob") with optional Named Graphs. Queried using W3C SPARQL.\nEach query language is specific to its graph data model.',
  whyItMatters: 'Relational databases struggle with complex, multi-hop relationship traversals (requiring dozens of expensive SQL JOINs). Graph models represent relationships as first-class citizens, allowing sub-second query performance across highly connected datasets.',
  workplaceExample: 'A fraud detection platform uses a Property Graph in Neptune to model user accounts, IP addresses, and credit card numbers as vertices. Gremlin queries traverse 4-hop relationships in milliseconds to detect coordinated fraud rings.',
  examFocus: 'SAA-C03 Graph Model & Query Language Mapping:\n- Property Graph Model -> Queried via Apache TinkerPop Gremlin or openCypher.\n- RDF (Resource Description Framework) Model -> Queried via W3C SPARQL.\n- Rule of Thumb: Gremlin and openCypher operate on Property Graphs; SPARQL operates on RDF Graphs. Languages cannot be mixed across models.',
  keyPoints: [
    'Supports two distinct graph models: Property Graphs and W3C RDF Graphs.',
    'Property Graphs use Vertices (nodes), Edges (relationships), and Properties.',
    'Property Graphs are queried via Apache TinkerPop Gremlin or openCypher.',
    'RDF Graphs use Subject-Predicate-Object triples and are queried via W3C SPARQL.',
    'Optimized for sub-second multi-hop relationship traversals across connected data.'
  ],
  commonMistake: 'Attempting to execute a SPARQL query against a Property Graph or a Gremlin query against an RDF Graph dataset. Each query language operates exclusively on its designated graph model.',
  example: 'Property Graph Gremlin Traversal vs openCypher Query:\n// Gremlin:\ng.V().hasLabel("User").has("name", "Alice").out("knows").values("name")\n// openCypher:\nMATCH (u:User {name: "Alice"})-[:KNOWS]->(f:User) RETURN f.name',
  sources: [
    { title: 'Amazon Neptune graph models', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/graph-concepts.html' }
  ]
});
