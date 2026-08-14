import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-7', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Source Endpoints', status: 'ready',
  plainEnglish: 'A source endpoint tells DMS how to connect to and read the original data store. It identifies the engine, server, port, database, encryption mode, credentials or Secrets Manager secret, and engine-specific settings.',
  whyItMatters: 'The endpoint must be reachable from replication compute and its database identity must have exactly the privileges needed for full load and, when used, transaction-log access for CDC.',
  workplaceExample: 'A DMS instance in private subnets reaches an on-premises Oracle source over Direct Connect. The source security rules, route, DNS, TLS, and migration account are prepared before testing the endpoint.',
  examFocus: 'Test endpoint connectivity before creating the task. CDC requirements vary by engine, including redo logs, binlogs, WAL, or SQL Server replication configuration and sufficient log retention.',
  keyPoints: ['Endpoint type must be source.', 'Network paths and security rules must permit the database connection.', 'Credentials require migration-specific database privileges.', 'TLS protects data in transit.', 'Engine-specific settings control source behaviour.'],
  commonMistake: 'A successful TCP connection is not proof that the source user can read all selected tables and transaction logs.',
  example: 'Test the endpoint, verify schema discovery, run a small full-load test, and confirm CDC prerequisites before the production migration.',
  sources: [{ title: 'Creating source and target endpoints', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Endpoints.Creating.html' }, { title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }]
});
