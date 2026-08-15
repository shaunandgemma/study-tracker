import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-23',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Parameter Groups',
  status: 'ready',
  plainEnglish: 'RDS Parameter Groups act as a container for database engine configuration parameters (like `max_connections`, `work_mem`, `innodb_buffer_pool_size`, or `rds.force_ssl`). They allow customizing engine settings across one or many DB instances without needing to edit raw configuration files (`my.cnf` or `postgresql.conf`).',
  whyItMatters: 'Standard default engine settings are tuned for generic workloads. Custom Parameter Groups allow database administrators to tune memory allocation, connection limits, and logging settings for high-performance workloads.',
  workplaceExample: 'A PostgreSQL DBA creates a custom parameter group `pg15-prod-params`. They increase `max_connections` to 1000 and enable `rds.force_ssl`, attaching the parameter group to all production PostgreSQL instances.',
  examFocus: 'SAA-C03 Parameter Types & Apply Rules:\n- Static Parameters: Changes require a MANUAL REBOOT of the DB instance to take effect (e.g. `shared_buffers`).\n- Dynamic Parameters: Changes take effect IMMEDIATELY without rebooting the database (e.g. `max_connections`).\n- Default Parameter Groups: Default parameter groups CANNOT be modified; you must create a custom parameter group.\n- Pending Modifications: Static parameter changes display a status of `pending-reboot` until instance reboot.',
  keyPoints: [
    'Container for database engine configuration parameters.',
    'Dynamic parameters take effect immediately without database reboot.',
    'Static parameters require a manual database instance reboot.',
    'Default parameter groups are read-only and cannot be modified.',
    'Can be attached to multiple DB instances for consistent configuration management.'
  ],
  commonMistake: 'Modifying a static parameter in a custom parameter group and expecting it to take effect immediately without executing a DB instance reboot.',
  example: 'Modifying a Parameter Group via AWS CLI:\naws rds modify-db-parameter-group --db-parameter-group-name pg15-prod-params --parameters "ParameterName=rds.force_ssl,ParameterValue=1,ApplyMethod=immediate"',
  sources: [
    { title: 'Working with DB parameter groups in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html' }
  ]
});
