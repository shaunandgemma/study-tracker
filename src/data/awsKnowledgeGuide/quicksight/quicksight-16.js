import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-16",
  "title": "QuickSight with Redshift",
  "plainEnglish": "Amazon Redshift is a managed data warehouse, and Quick Sight can connect to it to create analytical datasets. Quick Sight can import selected warehouse results into SPICE or use direct query, while Redshift remains responsible for storing and executing queries over warehouse data.",
  "whyItMatters": "Redshift centralizes modeled business data, and Quick Sight presents that data to business users. The chosen query mode, reporting schema, database permissions, network path, and warehouse workload all affect performance and reliability.",
  "workplaceExample": "A company models orders and targets in a Redshift reporting schema. Quick Sight reaches the private cluster through a configured virtual private cloud connection, uses a read-only database identity, and imports a daily executive dataset into SPICE.",
  "examFocus": "Redshift is the warehouse; Quick Sight is the business intelligence layer. Private connectivity requires the Quick Sight virtual private cloud connection, resolvable endpoint, routes, security groups, and database authorization. Choose SPICE or direct query according to freshness and workload needs.",
  "keyPoints": [
    "Quick Sight supports Amazon Redshift as a relational data source.",
    "A Quick Sight data source stores the connection profile used to create datasets.",
    "Private Redshift access can use a Quick Sight virtual private cloud connection.",
    "Security groups and network routes must permit traffic between the Quick Sight network interface and Redshift endpoint.",
    "The database identity should receive only the schemas, tables, or views required for reporting.",
    "SPICE isolates interactive dashboard traffic; direct query sends analytical work to Redshift."
  ],
  "commonMistake": "A reachable Redshift endpoint does not prove the dataset can query its tables. Validate network rules and database-level privileges separately, and avoid using an overpowered warehouse login for a shared reporting connection.",
  "example": "Create a reporting view in Redshift, grant a dedicated read-only identity access to it, configure and validate the Quick Sight VPC connection and security groups, then test both the dataset result and the expected dashboard workload.",
  "sources": [
    {
      "title": "Authorizing connections to Amazon Redshift clusters",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/enabling-access-redshift.html"
    },
    {
      "title": "Supported VPC data sources",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/vpc-connection-supported-data-sources.html"
    }
  ]
});
