import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-11',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Connections',
  status: 'ready',
  plainEnglish: 'An AWS Glue Connection is a Data Catalog object that stores connection properties, network routing information, and authentication credentials required for AWS Glue crawlers and ETL jobs to connect to external data stores. Glue Connections support JDBC data sources (such as Amazon RDS MySQL/PostgreSQL, Oracle, SQL Server), Amazon Redshift, Amazon DocumentDB, Kafka, and custom SaaS connectors.',
  whyItMatters: 'To extract data from a relational database inside a private VPC subnet, a Glue job requires VPC networking endpoints, subnet routing, security group ingress rules, and database credentials. A Glue Connection packages these network and credential properties into a reusable managed resource.',
  workplaceExample: 'A data engineer creates a Glue Connection named `rds-postgres-conn`. The connection specifies the private VPC subnet ID, database security group ID, and JDBC URL (`jdbc:postgresql://db.example.internal:5432/prod`). Glue ETL jobs attach this connection to securely read RDS tables without exposing credentials in code.',
  examFocus: 'SAA-C03 Glue Connections & VPC Networking:\n- Connection Types: JDBC, Amazon Redshift, Network (VPC), Kafka, MongoDB, DocumentDB.\n- Networking Requirement for Private VPC Data Sources: Glue creates Elastic Network Interfaces (ENIs) in your private subnet.\n- VPC Security Group Self-Referential Inbound Rule: The security group attached to the Glue Connection MUST have an inbound rule allowing ALL TCP traffic from ITSELF so Glue ENIs can communicate.\n- Requires NAT Gateway or VPC Endpoints for S3 access when running inside a private VPC subnet.',
  keyPoints: [
    'Stores network routing and credential properties for data stores.',
    'Supports JDBC databases (RDS, Oracle, SQL Server), Redshift, Kafka, and S3.',
    'Creates Elastic Network Interfaces (ENIs) inside your private VPC subnets.',
    'Requires a self-referential Security Group inbound rule for ENI-to-ENI communication.',
    'Protects credentials by referencing AWS Secrets Manager or KMS encryption.'
  ],
  commonMistake: 'Forgetting to add a self-referential inbound rule on the Glue Connection Security Group (allowing all TCP traffic from its own Security Group ID), causing Glue jobs to hang and fail connection timeouts.',
  example: 'Creating a Glue JDBC Connection via AWS CLI:\naws glue create-connection --connection-input "{\\"Name\\":\\"rds-conn\\",\\"ConnectionType\\":\\"JDBC\\",\\"ConnectionProperties\\":{\\"JDBC_CONNECTION_URL\\":\\"jdbc:postgresql://rds.example.internal:5432/db\\",\\"USERNAME\\":\\"dbuser\\",\\"PASSWORD\\":\\"SecretPass123\\"},\\"PhysicalConnectionRequirements\\":{\\"SubnetId\\":\\"subnet-1111\\",\\"SecurityGroupIdList\\":[\\"sg-2222\\"]}}"',
  sources: [
    { title: 'Connecting to Data in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/populate-add-connection.html' }
  ]
});
