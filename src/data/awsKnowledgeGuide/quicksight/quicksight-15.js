import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-15",
  "title": "QuickSight with Athena",
  "plainEnglish": "Amazon Athena runs standard SQL queries against data, commonly data cataloged in Amazon Simple Storage Service (Amazon S3). Quick Sight can use Athena as a data source, then turn the query result into a prepared dataset that uses SPICE import or a supported direct-query workflow for visualization.",
  "whyItMatters": "This combination provides business intelligence over a data lake without first loading the files into a traditional database. Successful access depends on permissions for Athena, the source S3 locations, the Athena query-results bucket, and any encryption keys or Lake Formation controls involved.",
  "workplaceExample": "A security team stores partitioned application logs in S3 and catalogs them for Athena. An administrator authorizes Quick Sight for Athena and the required buckets, and an analyst builds a curated dataset and dashboard showing error trends by application.",
  "examFocus": "Athena is the serverless SQL query service; Quick Sight supplies datasets, analyses, and dashboards. For connection failures, examine AWS service authorization, S3 data and result-bucket access, encryption-key permissions, Region alignment, and Lake Formation permissions where used.",
  "keyPoints": [
    "Quick Sight connects to Athena as a data source rather than replacing Athena's SQL engine.",
    "Athena needs access to the catalog and underlying data it queries.",
    "Quick Sight also needs authorization for Athena and the relevant S3 buckets.",
    "The Athena query-results location must be accessible to the Quick Sight role.",
    "AWS Key Management Service decryption permission is required when applicable data is protected by a customer managed key.",
    "Partitioning, columnar file formats, and selective queries can reduce the amount of S3 data Athena scans."
  ],
  "commonMistake": "Granting permission only to call Athena is not enough. Include the intended source and query-results buckets, any required key access, and Lake Formation authorization where applicable, while keeping each grant limited to the reporting data.",
  "example": "Catalog curated S3 data, verify an Athena query and its result location, authorize Quick Sight for Athena and only the required buckets, grant decryption where needed, validate the connection, and build a dataset from the approved tables.",
  "sources": [
    {
      "title": "Authorizing connections to Amazon Athena",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/athena.html"
    },
    {
      "title": "Supported data sources in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/supported-data-sources.html"
    }
  ]
});
