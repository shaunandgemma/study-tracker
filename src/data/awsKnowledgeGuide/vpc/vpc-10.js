import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-10', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Main and Custom Route Tables', status: 'ready',
  plainEnglish: 'Every VPC has a main route table. Any subnet without an explicit route-table association uses it implicitly. Custom route tables let you give selected subnets different paths. A subnet can use only one route table at a time, while one route table can be associated with several subnets.',
  whyItMatters: 'Relying on a heavily modified main table can cause new subnets to inherit unexpected internet or hybrid routes. Explicit custom associations make tier boundaries visible and reduce accidental exposure. The main table still needs a safe design because unassociated subnets fall back to it.',
  workplaceExample: 'A platform leaves the main route table with only controlled local routes. It creates separate custom tables for public, application-private, database-isolated, and inspection subnets, then explicitly associates each subnet during provisioning.',
  examFocus: 'SAA-C03: the main table is the implicit default; it cannot simply be deleted; custom tables provide granular routing; explicit associations override the main table; multiple subnets may share a table when they need identical routes.',
  keyPoints: [
    'A VPC automatically receives a main route table.',
    'A subnet without an explicit association uses the main route table.',
    'A subnet can associate with only one route table at a time.',
    'A custom route table can serve multiple subnets with the same routing requirements.',
    'Changing which table is main affects implicitly associated and future unassociated subnets.',
    'Explicit associations make public, private, isolated, and inspection routing easier to audit.'
  ],
  commonMistake: 'Adding an internet-gateway default route to the main table for convenience, then later launching a sensitive subnet that implicitly inherits public routing.',
  example: 'Public subnets explicitly use public-rt, application subnets use app-private-rt, and database subnets use db-isolated-rt. The main table remains restrictive as a safe fallback.',
  sources: [
    { title: 'Subnet route tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html' },
    { title: 'Replace the main route table', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/replace-main-route-table.html' }
  ]
});
