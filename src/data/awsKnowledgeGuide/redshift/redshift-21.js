import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-21',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Federated Queries',
  status: 'ready',
  plainEnglish: 'Redshift Federated Queries allow you to execute SQL queries directly against operational relational databases (Amazon RDS PostgreSQL, Amazon Aurora PostgreSQL, and MySQL) in real time from your Amazon Redshift cluster without loading the data into Redshift tables or running custom ETL pipelines.',
  whyItMatters: 'Extracting data from transactional databases into a data warehouse via daily ETL jobs creates data latency. Federated Queries query live transactional data (like current order status) directly from RDS/Aurora and join it with historical warehouse tables in a single SQL query.',
  workplaceExample: 'A logistics platform queries 5 years of historical order data stored in Redshift, joining it live with current shipment status stored in an Aurora PostgreSQL transactional database via Redshift Federated Queries.',
  examFocus: 'SAA-C03 Federated Query Features:\n- Data Sources: Supports querying Amazon RDS for PostgreSQL, Amazon Aurora PostgreSQL, and Aurora MySQL.\n- External Schemas: Uses `CREATE EXTERNAL SCHEMA ... FROM POSTGRES` linked to AWS Secrets Manager credentials.\n- Push-Down Optimization: Pushes predicate filtering (`WHERE` clauses) and aggregation compute directly to the remote RDS/Aurora database to minimize network transmission.\n- Zero ETL Lag: Provides instant real-time query capabilities over live operational databases.',
  keyPoints: [
    'Queries live operational databases (RDS/Aurora PostgreSQL & MySQL) directly from Redshift.',
    'Eliminates data latency by avoiding traditional batch ETL extraction pipelines.',
    'Pushes filter predicates and aggregations to the target database (push-down optimization).',
    'Uses AWS Secrets Manager to store remote relational database credentials securely.',
    'Allows joining live operational tables directly with historical warehouse data in one SQL query.'
  ],
  commonMistake: 'Running heavy analytical aggregation queries via Federated Queries against small production RDS databases, accidentally saturating the transactional DB\'s CPU.',
  example: 'Creating a Federated Query External Schema in SQL:\nCREATE EXTERNAL SCHEMA rds_postgres\nFROM POSTGRES\nDATABASE "orders_db"\nSCHEMA "public"\nURI "rds-pg.c123.us-east-1.rds.amazonaws.com"\nPORT 5432\nIAM_ROLE "arn:aws:iam::123456789012:role/RedshiftFederatedRole"\nSECRET_ARN "arn:aws:secretsmanager:us-east-1:123456789012:secret:rds-db-credentials";',
  sources: [
    { title: 'Getting started with federated queries in Amazon Redshift', url: 'https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html' }
  ]
});
