import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-23', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS vs AWS Application Migration Service', status: 'ready',
  plainEnglish: 'AWS DMS migrates and replicates database data between supported data stores. AWS Application Migration Service, commonly called MGN, replicates source servers at the block level and launches them as EC2 instances for lift-and-shift application migration.',
  whyItMatters: 'Choosing the wrong migration layer can either omit the application server or perform a much broader server migration than a database modernization requires.',
  workplaceExample: 'A company uses MGN to rehost legacy web and application servers on EC2, while DMS migrates their database separately to Amazon RDS with CDC and a short cutover.',
  examFocus: 'Choose DMS for database-engine-aware data movement, schema conversion workflows, and CDC. Choose MGN for physical or virtual server rehosting to AWS. A migration programme may use both services for different components.',
  keyPoints: ['DMS works with supported database endpoints.', 'MGN replicates server disks for EC2 launch.', 'DMS supports full load and CDC.', 'MGN is designed for rehost or lift-and-shift migration.', 'Schema conversion is a database concern, not an MGN function.'],
  commonMistake: 'Selecting DMS to migrate an entire operating system and application server, or selecting MGN specifically to convert database engines.',
  example: 'Rehost the application tier with MGN, convert and migrate Oracle data to Aurora with DMS, and coordinate the two cutovers in one runbook.',
  sources: [{ title: 'What is AWS Database Migration Service?', url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html' }, { title: 'What is AWS Application Migration Service?', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html' }, { title: 'Choosing AWS migration services and tools', url: 'https://docs.aws.amazon.com/pdfs/decision-guides/latest/migration-on-aws-how-to-choose/migration-on-aws-how-to-choose.pdf' }]
});
