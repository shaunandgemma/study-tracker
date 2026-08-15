import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-4",
  "title": "QuickSight Data Sources",
  "plainEnglish": "A Quick Sight data source is a saved connection to an external repository such as Amazon Athena, Amazon Redshift, Amazon Relational Database Service (RDS), Amazon S3, supported software-as-a-service systems, or an external database. It supplies raw data from which datasets are created.",
  "whyItMatters": "Connection design determines reachability, credentials, permissions, encryption, and source-query cost. Reusing governed data sources avoids embedding unmanaged connection details in every report workflow.",
  "workplaceExample": "A data team creates one approved Athena data source that uses the AWS Glue Data Catalog. Authors select curated tables through datasets instead of entering separate connection details for each dashboard.",
  "examFocus": "Do not confuse data sources and datasets. The source stores connection information; the dataset stores selected fields, transformations, joins, calculations, and the SPICE or direct-query choice. AWS sources can also require a Quick Sight service role and source permissions.",
  "keyPoints": [
    "A data source describes how Quick Sight connects to an external data repository.",
    "Supported sources include AWS analytics services, relational databases, files, and selected SaaS applications.",
    "Private databases require a supported VPC connection with working subnets, security groups, routes, and Domain Name System resolution.",
    "Creating a connection does not automatically grant permission to every table, bucket, or catalog.",
    "Credentials and IAM roles should follow least privilege and must not be exposed to dashboard viewers.",
    "One data source can support multiple prepared datasets."
  ],
  "commonMistake": "Creating a VPC connection and assuming it fixes every database timeout ignores routing, DNS, security-group rules, database listeners, and credentials. Test the complete network and authentication path.",
  "example": "For a private Aurora reporting replica, configure a supported Quick Sight VPC connection, allow its security group to reach the database port, verify DNS and routes, create the data source with protected credentials, and test before building a dataset.",
  "sources": [
    {
      "title": "Supported data sources for Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/supported-data-sources.html"
    },
    {
      "title": "Working with Amazon VPC in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/working-with-aws-vpc.html"
    }
  ]
});
