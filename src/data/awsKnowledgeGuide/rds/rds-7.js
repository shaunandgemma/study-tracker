import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-7',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS DB Instances',
  status: 'ready',
  plainEnglish: 'An RDS DB Instance is an isolated database compute environment running in the cloud. You select the DB Instance Class (which determines the vCPU cores, RAM memory, and network bandwidth allocated to the database) and attach dedicated storage (General Purpose SSD or Provisioned IOPS SSD). DB Instance classes can be vertically scaled up or down with minimal downtime.',
  whyItMatters: 'Relational databases require predictable CPU and RAM to prevent memory swapping and query queue bottlenecks. Selecting the appropriate instance family (Standard `db.m6g`, Memory-Optimized `db.r6g`, or Burstable `db.t4g`) ensures optimal query performance and cost efficiency.',
  workplaceExample: 'An online store runs its MySQL database on a `db.t4g.medium` instance. Before a major marketing sale, they scale the DB Instance Class up to `db.r6g.xlarge` (memory-optimized), ensuring sufficient RAM for database buffer pools and concurrent user connections.',
  examFocus: 'SAA-C03 DB Instance Classes & Sizing:\n- Instance Families: General Purpose (`db.m6g`), Memory-Optimized (`db.r6g` for large buffer pools), Burstable (`db.t4g` for dev/test).\n- Vertical Scaling: Modify instance class via console or CLI; causes a brief failover/reboot interruption.\n- Compute vs Storage: DB Instance Class controls vCPU/RAM; storage size and IOPS are configured independently.',
  keyPoints: [
    'Isolated compute environment running the selected database engine software.',
    'DB Instance Class dictates vCPU cores, RAM, and network performance.',
    'Families include Burstable (`t4g`), General Purpose (`m6g`), and Memory-Optimized (`r6g`).',
    'Compute can be scaled vertically up or down with a brief maintenance reboot.',
    'Storage capacity and IOPS are decoupled and configured separately from compute.'
  ],
  commonMistake: 'Using Burstable `db.t4g` instances for heavy production database workloads that exhaust CPU credits, leading to severe query latency throttle.',
  example: 'Modifying DB Instance Class via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --db-instance-class db.r6g.xlarge --apply-immediately',
  sources: [
    { title: 'Amazon RDS DB instance classes', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html' }
  ]
});
