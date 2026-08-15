import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-21',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN vs DMS',
  status: 'ready',
  plainEnglish: 'AWS MGN (Application Migration Service) and AWS DMS (Database Migration Service) serve two distinct migration purposes:\n- AWS MGN: Rehosts entire operating systems, applications, and disk volumes as-is to Amazon EC2 via block-level replication.\n- AWS DMS: Migrates and converts relational database schemas and data records (Oracle, SQL Server, MySQL, PostgreSQL) directly into managed database targets (Amazon RDS, Aurora, DynamoDB) with continuous Change Data Capture (CDC).',
  whyItMatters: 'Choosing the wrong migration tool leads to architectural friction. Use MGN when rehosting application servers or legacy custom databases as-is on EC2; use DMS when modernizing or migrating databases to managed AWS RDS engines.',
  workplaceExample: 'An enterprise migrates a 2-tier application: they use AWS MGN to lift-and-shift 4 IIS web servers to Amazon EC2, and use AWS DMS (along with Schema Conversion Tool) to migrate their on-premises Oracle database to Amazon Aurora PostgreSQL.',
  examFocus: 'SAA-C03 Decision Matrix (MGN vs DMS):\n- AWS MGN: Server-level lift-and-shift (OS + Application + Disks -> EC2).\n- AWS DMS: Database-level migration (Source DB -> Managed Target DB like RDS, Aurora, DynamoDB).\n- Database Engine Conversion: DMS supports cross-engine database conversion (e.g. Oracle to Aurora); MGN preserves original OS and database binaries on EC2.',
  keyPoints: [
    'MGN rehosts entire operating systems and disk volumes to Amazon EC2.',
    'DMS migrates database schemas and data records to managed RDS/Aurora targets.',
    'MGN operates at the disk block level; DMS operates at the database SQL/CDC level.',
    'DMS supports heterogeneous database engine conversion (e.g. SQL Server to PostgreSQL).',
    'Both services can be combined in a multi-tier enterprise migration project.'
  ],
  commonMistake: 'Using MGN to migrate an on-premises database when the stated architectural objective is to adopt managed Amazon Aurora PostgreSQL.',
  example: 'Decision Tree:\n- "Rehost 10 Windows App Servers to EC2 as-is" -> AWS MGN\n- "Migrate self-hosted SQL Server to Amazon RDS PostgreSQL with CDC" -> AWS DMS.',
  sources: [
    { title: 'AWS Application Migration Service vs AWS Database Migration Service', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html' }
  ]
});
