import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-4',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Property Graphs',
  status: 'ready',
  plainEnglish: 'A Property Graph in Amazon Neptune models data using Vertices (entities like Users or Products) connected by directed Edges (relationships like `PURCHASED` or `FRIEND_OF`). Both vertices and edges can store Key-Value Properties (e.g. `timestamp`, `score`). Property Graphs in Neptune are queried using Apache TinkerPop Gremlin or openCypher.',
  whyItMatters: 'Property Graphs are the most intuitive model for software developers building social networks, fraud detection engines, and recommendation systems because data structures mirror real-world objects and connections directly.',
  workplaceExample: 'A gaming platform models players and items as a Property Graph. A vertex labeled `Player` (`id: "p101"`) has an edge labeled `OWNS` (`acquired: "2026-01-15"`) pointing to a vertex labeled `Item` (`id: "i505"`). openCypher queries quickly retrieve all items owned by a player\'s friends.',
  examFocus: 'SAA-C03 Property Graph Fundamentals:\n- Components: Vertices (nodes), Edges (directed links), Labels (types), Properties (key-value pairs).\n- Directed Edges: Edges always have an explicit direction (From Vertex -> To Vertex).\n- Query Languages: Apache TinkerPop Gremlin (traversal language) or openCypher (declarative SQL-like graph language).\n- Bulk Loading: Ingested via Neptune Bulk Loader using Property Graph CSV format.',
  keyPoints: [
    'Graph model consisting of Vertices, directed Edges, and Key-Value Properties.',
    'Vertices represent entities; Edges represent relationships.',
    'Both Vertices and Edges can hold metadata properties (e.g. `created_at`).',
    'Queried using Apache TinkerPop Gremlin or openCypher.',
    'Ideal for social networks, recommendation engines, and identity resolution.'
  ],
  commonMistake: 'Attempting to query a Property Graph using W3C SPARQL. SPARQL is designed exclusively for RDF graph models.',
  example: 'openCypher Property Graph Query:\nMATCH (p:Player {id: "p101"})-[:FRIEND_OF]->(f:Player)-[:OWNS]->(item:Item)\nRETURN f.name, item.name',
  sources: [
    { title: 'Neptune Property Graph model', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-tutorial-format-gremlin.html' }
  ]
});
