import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-10',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Full-Text Search',
  status: 'ready',
  plainEnglish: 'Full-Text Search in Amazon OpenSearch Service breaks unstructured text fields into individual tokens (words) using text analysers and stores them in an Inverted Index. When a user executes a search, OpenSearch scores matching documents based on term frequency and relevance algorithms (BM25), supporting fuzzy matching, stemming, and phrase searches.',
  whyItMatters: 'Relational database `LIKE %term%` queries perform full table scans that take seconds or minutes on large text columns. OpenSearch inverted indexes execute full-text fuzzy searches across millions of documents in milliseconds.',
  workplaceExample: 'An online library indexes book titles and abstracts. A user searches for "cloud arcitecture". OpenSearch uses fuzzy matching and stemming to instantly return documents containing "Cloud Architecture" scored by relevance.',
  examFocus: 'SAA-C03 Text Mapping vs Keyword Mapping:\n- `text` Data Type: Analyzed, tokenized, and indexed for full-text relevance search (e.g. article body, product descriptions).\n- `keyword` Data Type: Not analyzed; stored exact string for exact matching, sorting, filtering, and aggregations (e.g. product SKU, status code, user ID).\n- Inverted Index: Core data structure that maps words to the document IDs that contain them.',
  keyPoints: [
    'Uses inverted indexes to map individual tokens to document IDs.',
    '`text` data type is analyzed and tokenized for full-text relevance queries.',
    '`keyword` data type is NOT analyzed; used for exact match, sorting, and aggregations.',
    'Calculates relevance scoring using the BM25 ranking algorithm.',
    'Supports fuzzy search, wildcards, phrase matching, and auto-complete.'
  ],
  commonMistake: 'Mapping an e-commerce Product SKU or HTTP Status Code as `text` instead of `keyword`, preventing exact aggregations and increasing index overhead.',
  example: 'Executing a Full-Text Match Query via REST API:\nGET /articles/_search\n{\n  "query": {\n    "match": {\n      "title": {\n        "query": "cloud architecture",\n        "fuzziness": "AUTO"\n      }\n    }\n  }\n}',
  sources: [
    { title: 'Full-text queries in OpenSearch', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/opensearch-knn.html' }
  ]
});
