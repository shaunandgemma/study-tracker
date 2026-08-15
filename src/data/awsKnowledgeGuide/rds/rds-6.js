import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-6',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Supported Relational Database Engines',
  status: 'ready',
  plainEnglish: 'Amazon RDS is a managed service that supports six major relational database engines: Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle Database, and Microsoft SQL Server (plus IBM Db2). AWS manages infrastructure provisioning, operating system security patching, automated backups, and storage auto-scaling while allowing you to choose the database engine that matches your application requirements.',
  whyItMatters: 'Self-hosting relational databases on EC2 or on-premises servers requires manually managing OS patches, database version upgrades, backup scripts, and hardware replication. Amazon RDS offloads routine database administration so developers can focus on schema design and application code.',
  workplaceExample: 'An enterprise migrates their legacy on-premises Microsoft SQL Server database to Amazon RDS for SQL Server (License Included). AWS manages OS/engine patches and Multi-AZ replication, eliminating weekend database maintenance windows.',
  examFocus: 'SAA-C03 Supported Engines & Licensing Models:\n- Supported Engines: Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server.\n- Licensing Models: License Included (AWS provides license) vs Bring Your Own License (BYOL).\n- Engine Parity: RDS runs standard database engine software (e.g. standard PostgreSQL or MySQL), ensuring 100% code and driver compatibility.',
  keyPoints: [
    'Fully managed relational database service supporting 6 main database engines.',
    'Engines include Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server.',
    'Offloads OS patching, database backups, hardware provisioning, and failover.',
    'Supports License Included and Bring Your Own License (BYOL) licensing models.',
    'Maintains 100% native database code, client driver, and SQL syntax compatibility.'
  ],
  commonMistake: 'Expecting standard Amazon RDS to grant operating system root or SSH shell access to the underlying EC2 instance host. Standard RDS manages the OS completely.',
  example: 'Creating a PostgreSQL DB Instance via AWS CLI:\naws rds create-db-instance --db-instance-identifier prod-postgres-db --db-instance-class db.m6g.xlarge --engine postgres --engine-version 15.4 --allocated-storage 100 --master-username dbadmin --master-user-password "SecurePass123!"',
  sources: [
    { title: 'Amazon RDS database engines', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' }
  ]
});
