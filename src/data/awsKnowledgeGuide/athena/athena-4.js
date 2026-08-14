import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-4",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena Serverless SQL Queries",
  "status": "ready",
  "plainEnglish": "Athena Serverless SQL Queries provide an on-demand SQL query engine built on open-source Trino (formerly Presto). Because Athena is serverless, you do not provision EC2 instances, manage cluster memory, or configure distributed workers. AWS automatically manages the distributed compute infrastructure behind the scenes, scaling query execution resources up or down dynamically depending on query complexity and dataset size, and charging you only for the data scanned during each execution.",
  "whyItMatters": "Traditional big data analytics engines require maintaining 24/7 Hadoop or Spark clusters, incurring steep baseline infrastructure and operational maintenance costs even when no queries are running. Athena eliminates idle infrastructure costs while providing sub-minute response times for ad-hoc analytical workloads.",
  "workplaceExample": "An engineering team needs to analyze application crash logs once a week. Instead of running a 24/7 Amazon EMR cluster costing hundreds of dollars per month, they run five ad-hoc SQL queries through Athena, paying only a few cents per query for the exact data scanned.",
  "examFocus": "For SAA-C03, remember that Athena is serverless and requires no server administration. Queries run on-demand with automatic horizontal scaling. If a scenario asks for 'run ad-hoc SQL queries on S3 data with minimal operational overhead and no server provisioning', Athena is almost always the correct answer.",
  "keyPoints": [
    "Built on open-source Trino/Presto distributed SQL query engine.",
    "Completely serverless architecture with automatic provisioning and scaling.",
    "Zero idle infrastructure costs; you pay only per query based on data scanned.",
    "Supports standard ANSI SQL syntax including complex joins, aggregations, and window functions.",
    "Integrates seamlessly with AWS IAM for fine-grained query permission control."
  ],
  "commonMistake": "Setting up an Amazon EC2 instance running a custom PostgreSQL or MySQL instance just to query log files periodically. Athena provides serverless scalability without server maintenance, disk sizing, or operating system patching.",
  "example": "SELECT http_status, count(*) as request_count FROM alb_access_logs WHERE request_timestamp >= current_timestamp - interval '24' hour GROUP BY http_status ORDER BY request_count DESC;",
  "sources": [
    {
      "title": "What is Amazon Athena?",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/what-is.html"
    },
    {
      "title": "Running SQL Queries in Amazon Athena",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/querying.html"
    }
  ]
});
