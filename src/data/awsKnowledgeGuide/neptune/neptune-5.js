import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-5',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune RDF Graphs',
  status: 'ready',
  plainEnglish: 'An RDF Graph in Amazon Neptune represents data according to the W3C Resource Description Framework (RDF) standard. Data is structured as a collection of Subject-Predicate-Object statements known as "Triples" (e.g. `<http://example.org/Alice> <http://example.org/knows> <http://example.org/Bob>`), with optional Named Graph URI contexts (creating "Quads"). RDF graphs in Neptune are queried using W3C SPARQL.',
  whyItMatters: 'RDF is the international W3C standard for semantic web applications, linked open data, and enterprise knowledge graphs. It allows organizations to link disparate taxonomies and ontologies across global data standards.',
  workplaceExample: 'A pharmaceutical research firm uses an RDF Graph in Neptune to link medical research papers, drug compounds, and genetic markers. SPARQL queries navigate complex semantic ontologies across millions of RDF triples.',
  examFocus: 'SAA-C03 RDF Graph Fundamentals:\n- Triples: Subject (entity), Predicate (relationship/attribute), Object (target entity or literal value).\n- Quads: Subject, Predicate, Object, Named Graph URI (context).\n- Query Language: W3C SPARQL 1.1.\n- Formats: Turtle, N-Triples, N-Quads, RDF/XML via Neptune Bulk Loader.',
  keyPoints: [
    'W3C standard graph model structured as Subject-Predicate-Object triples.',
    'Supports Named Graphs (Quads) for managing dataset contexts.',
    'Queried exclusively using W3C SPARQL query language.',
    'Ideal for semantic web, enterprise knowledge graphs, and linked open data.',
    'Ingested via Neptune Bulk Loader using Turtle, N-Triples, or RDF/XML formats.'
  ],
  commonMistake: 'Attempting to query an RDF Graph dataset using Gremlin or openCypher. RDF graphs must be queried using SPARQL.',
  example: 'SPARQL RDF Query Example:\nPREFIX ex: <http://example.org/>\nSELECT ?friendName WHERE {\n  ex:Alice ex:knows ?friend .\n  ?friend ex:name ?friendName .\n}',
  sources: [
    { title: 'Neptune RDF graph model and SPARQL', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-sparql.html' }
  ]
});
