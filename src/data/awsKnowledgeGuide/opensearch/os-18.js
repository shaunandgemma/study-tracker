import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-18',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Fine-Grained Access Control',
  status: 'ready',
  plainEnglish: 'Fine-Grained Access Control (FGAC) provides security inside an OpenSearch domain at the document, field, and index level. Integrated with IAM or an Internal User Database, FGAC allows security administrators to grant granular permissions—such as allowing a user to query specific fields in an index while redacting sensitive fields (like SSNs) or filtering documents by tenant ID.',
  whyItMatters: 'Standard IAM Domain Access Policies grant all-or-nothing access to the domain endpoint. FGAC permits multi-tenant domains where different teams share the same OpenSearch cluster without seeing each other\'s sensitive records.',
  workplaceExample: 'A human resources system uses FGAC on an `employees` index. HR Managers can view all fields, while Team Leads can search employee names and titles but have the `salary` and `ssn` fields hidden via Field-Level Security.',
  examFocus: 'SAA-C03 Fine-Grained Access Control (FGAC) Features:\n- Internal User Database vs IAM: Authenticate using IAM Principals (SigV4) or Internal User DB with HTTP Basic Auth.\n- Document-Level Security (DLS): Restrict query results to documents matching specific field values.\n- Field-Level Security (FLS): Include or exclude specific document fields from search results.\n- OpenSearch Dashboards Multi-Tenancy: Separate dashboard spaces and visual objects by user role.',
  keyPoints: [
    'Provides document-level, field-level, and index-level access security inside OpenSearch.',
    'Document-Level Security (DLS) filters search results based on user identity or role.',
    'Field-Level Security (FLS) redacts sensitive JSON fields from search responses.',
    'Supports authentication via IAM Principals (SigV4) or Internal User Database.',
    'Enables multi-tenancy in OpenSearch Dashboards with isolated spaces per team.'
  ],
  commonMistake: 'Relying solely on IAM Domain Access Policies for multi-tenant security, which allows any authorized IAM user full query access to all indices in the domain.',
  example: 'Defining Field-Level Security in an OpenSearch Role Mapping JSON:\n{\n  "index_permissions": [{\n    "index_patterns": ["employees-*"],\n    "allowed_actions": ["read"],\n    "fls": ["~salary", "~ssn"]\n  }]\n}',
  sources: [
    { title: 'Fine-grained access control in Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html' }
  ]
});
