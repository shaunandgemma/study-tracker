import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-17",
  "title": "QuickSight with RDS and Aurora",
  "plainEnglish": "Amazon Relational Database Service (RDS) and Amazon Aurora run relational databases that Quick Sight can use as sources for datasets. Quick Sight connects using the database engine's endpoint and credentials plus an allowed network path; it can then import prepared data into SPICE or query the database directly.",
  "whyItMatters": "Operational databases contain valuable current data but also serve applications. A reporting view, read-only identity, appropriate connection route, and considered SPICE strategy help analytics avoid exposing sensitive tables or competing unnecessarily with application traffic.",
  "workplaceExample": "A service stores customer orders in a private Aurora PostgreSQL cluster. The data team exposes a limited reporting view, grants a dedicated read-only account, configures a Quick Sight virtual private cloud connection, and imports hourly reporting data into SPICE.",
  "examFocus": "RDS and Aurora are database services, while Quick Sight visualizes their data. For a private instance, check endpoint name resolution, virtual private cloud connection, subnet routes, security-group rules for the engine's listening port, database credentials, and table or view privileges.",
  "keyPoints": [
    "Quick Sight supports compatible Amazon RDS engines and Amazon Aurora data sources.",
    "The endpoint entered for a manual database connection excludes the port number because the port is supplied separately.",
    "A private database commonly requires a Quick Sight virtual private cloud connection.",
    "The database security group must allow the actual engine port from the appropriate Quick Sight connection security group.",
    "Database authentication and SQL object privileges are separate from network connectivity.",
    "SPICE can protect the operational database from repeated dashboard queries, while direct query favors newer source results."
  ],
  "commonMistake": "Do not make a production database public just to make a dashboard connection work. Use supported private connectivity, narrowly scoped network rules, and a read-only reporting identity, then troubleshoot networking and database authorization as separate layers.",
  "example": "Create a least-privilege reporting user and view, select the correct engine and endpoint, configure a Quick Sight VPC connection through suitable subnets, permit only the database port in security groups, validate the source, and choose SPICE if application isolation is important.",
  "sources": [
    {
      "title": "Creating a dataset from a database",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/create-a-database-data-set.html"
    },
    {
      "title": "Supported VPC data sources",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/vpc-connection-supported-data-sources.html"
    }
  ]
});
