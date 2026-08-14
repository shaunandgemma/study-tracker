import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-18",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Athena vs Amazon Redshift",
  "status": "ready",
  "plainEnglish": "Amazon Athena and Amazon Redshift are both AWS analytics services that support SQL queries, but they are built for fundamentally different use cases. Athena is an interactive, serverless query service designed for ad-hoc, on-demand querying directly on raw S3 data lakes with zero cluster provisioning. Amazon Redshift is a fully managed, high-performance petabyte-scale cloud data warehouse designed for enterprise business intelligence, complex multi-table joins, sub-second dashboard queries, and structured data marts.",
  "whyItMatters": "Choosing the wrong service can lead to high costs or sluggish performance. Using Redshift for occasional ad-hoc queries results in paying for a 24/7 provisioned cluster when Athena would cost pennies. Conversely, using Athena for 24/7 real-time executive dashboards with hundreds of concurrent users can become expensive and hit concurrency limits where Redshift excels.",
  "workplaceExample": "An enterprise uses Athena for data engineers exploring raw telemetry logs in S3 ad-hoc, and uses Amazon Redshift for their production Tableau dashboards where 500 business analysts run complex financial aggregation queries simultaneously.",
  "examFocus": "For SAA-C03, compare Athena and Redshift: Athena is serverless, ad-hoc queries, data stays in S3, pay per TB scanned, no cluster management, best for exploratory analytics and log analysis. Amazon Redshift is an enterprise data warehouse, high concurrency, sub-second reporting dashboards, complex OLAP aggregations; Redshift Spectrum queries S3 data from within Redshift. Redshift Serverless automatically provisions warehouse compute for variable BI workloads.",
  "keyPoints": [
    "Athena is serverless and queries S3 data directly with no data loading required.",
    "Amazon Redshift is an enterprise data warehouse designed for heavy, complex analytical workloads.",
    "Athena charges per TB of data scanned; Redshift provisioned charges per node-hour (Redshift Serverless charges per RPU-hour).",
    "Redshift provides advanced caching, indexing (sort/dist keys), and high concurrency for BI dashboards.",
    "Redshift Spectrum allows Redshift clusters to query external S3 data lakes alongside warehouse tables."
  ],
  "commonMistake": "Provisioning a multi-node Amazon Redshift cluster just to query VPC Flow Logs or CloudTrail logs once a week. Use Athena for serverless, low-cost ad-hoc log querying without cluster management.",
  "example": "-- In Athena (serverless ad-hoc query on S3):\nSELECT error_code, count(*) FROM s3_app_logs WHERE log_date = current_date GROUP BY error_code;\n\n-- In Redshift (high-performance warehouse table with distribution and sort keys):\nSELECT c.customer_segment, sum(s.sale_amount) FROM sales_fact s JOIN customer_dim c ON s.customer_id = c.customer_id GROUP BY c.customer_segment;",
  "sources": [
    {
      "title": "Analytics Options on AWS - Amazon Athena vs Amazon Redshift",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/analytics-options-on-aws/amazon-athena.html"
    },
    {
      "title": "What is Amazon Redshift?",
      "url": "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html"
    }
  ]
});
