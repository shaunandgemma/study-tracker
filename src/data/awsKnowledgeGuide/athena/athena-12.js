import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-12",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Query Result Locations in S3",
  "status": "ready",
  "plainEnglish": "Whenever you execute a SQL query in Amazon Athena, Athena automatically saves the query results as a CSV file (along with a .metadata file) to a designated Amazon S3 bucket location called the Query Result Location. Even if you only view results in the AWS Console, the output file is written to S3. You can configure this output location at the individual user level or enforce it centrally at the Athena Workgroup level.",
  "whyItMatters": "Saving query results to S3 ensures that query outputs are durable, exportable, and easily accessible by downstream business intelligence tools (like Amazon QuickSight, Tableau, or custom Lambda functions) without having to re-run expensive queries.",
  "workplaceExample": "A nightly reporting script triggers an Athena query. The query result is automatically written to s3://company-reports/nightly-sales/. A Python Lambda function triggers upon S3 object creation and emails the CSV report directly to executive stakeholders.",
  "examFocus": "For SAA-C03, remember that Athena requires an Amazon S3 query result location before any query can run. The IAM user or role executing the query must have s3:GetObject and s3:PutObject permissions on the specified output bucket. Understand that S3 Lifecycle policies should be configured on the output bucket to automatically delete old query result CSVs after 7 to 30 days.",
  "keyPoints": [
    "Athena saves all query outputs as CSV files in a specified S3 result location.",
    "An S3 output location must be configured (via user settings or workgroup settings) before querying.",
    "Workgroups can enforce a single, encrypted S3 output location for all group members.",
    "Requires IAM permissions (s3:PutObject, s3:GetObject, s3:GetBucketLocation) on the destination bucket.",
    "S3 Lifecycle rules should be applied to automatically purge temporary query results and save storage costs."
  ],
  "commonMistake": "Forgetting to configure an S3 Lifecycle expiration rule on the Athena query results bucket. Over months, thousands of query output files accumulate and cause unexpected ongoing S3 storage costs. Apply an S3 Lifecycle rule to expire output files after 14 or 30 days.",
  "example": "SELECT * FROM sales_summary WHERE sale_date = current_date;\n-- Results automatically saved to configured S3 path: s3://my-athena-query-results-bucket/workgroup-name/2026/08/14/query-id.csv",
  "sources": [
    {
      "title": "Specifying a Query Result Location",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/querying.html#query-results-specify-location"
    },
    {
      "title": "Working with Query Results, Output Files, and Query History",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/querying-results.html"
    }
  ]
});
