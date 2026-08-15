import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-50",
  "title": "S3 Storage Class Analysis",
  "plainEnglish": "Amazon S3 Storage Class Analysis is a built-in analytics tool that automatically evaluates the data access patterns of objects stored in your bucket or under specific prefixes to help you determine when you should transition infrequently accessed data to lower-cost storage classes like S3 Standard-IA or S3 One Zone-IA. Storage Class Analysis monitors data retrieval frequency over time, generating daily visualization graphs and exportable CSV reports to guide your S3 Lifecycle rule creation.",
  "whyItMatters": "Guessing how many days to wait before transitioning data to Standard-IA (e.g., 30 days vs 60 days vs 90 days) can be costly: transitioning too early incurs unexpected data retrieval penalties, while transitioning too late wastes money in S3 Standard. Storage Class Analysis provides empirical, access-pattern data to help you configure optimal lifecycle transition timelines.",
  "workplaceExample": "A data analytics team generates monthly reporting tables in S3. To determine the most cost-effective lifecycle policy, they enable Storage Class Analysis on the `reports/` prefix. After 30 days of observation, the analysis graph proves that 98% of queries occur within the first 45 days after creation, with almost zero access thereafter. Armed with this data, the team creates an S3 Lifecycle rule transitioning `reports/` to S3 Standard-IA at exactly day 45.",
  "examFocus": "Understand S3 Storage Class Analysis functionality: (1) Purpose: Identifies data access patterns to optimize transition timing to Standard-IA and One Zone-IA. (2) Scope: Can be configured on an entire bucket or filtered by specific Key Prefixes and Object Tags. (3) Reporting: Generates graphical access visualizations in the S3 Management Console and exports daily CSV reports to a designated S3 bucket. (4) Note: Does not analyze transitions to S3 Glacier Flexible or Glacier Deep Archive.",
  "keyPoints": [
    "Analyzes object access patterns to determine optimal lifecycle transition policies.",
    "Provides recommendations on when to transition data to S3 Standard-IA or S3 One Zone-IA.",
    "Can be scoped to an entire bucket or targeted to specific key prefixes and object tags.",
    "Exports daily analysis reports in CSV format to a specified destination S3 bucket.",
    "Renders interactive access-frequency visualization charts in the Amazon S3 console.",
    "Helps avoid premature transition retrieval penalties while maximizing storage savings."
  ],
  "commonMistake": "Expecting Storage Class Analysis to automatically move your objects between storage classes. Storage Class Analysis is strictly an advisory reporting tool that provides data; you must create an S3 Lifecycle Rule to execute the actual transitions.",
  "example": "Configure Storage Class Analysis on a bucket prefix using the AWS CLI: aws s3api put-bucket-analytics-configuration --bucket financial-data --id AnalyzeTaxReports --analytics-configuration '{\"Id\": \"AnalyzeTaxReports\", \"Filter\": {\"Prefix\": \"reports/\"}, \"StorageClassAnalysis\": {\"DataExport\": {\"OutputSchemaVersion\": \"V_1\", \"Destination\": {\"S3BucketDestination\": {\"Format\": \"CSV\", \"Bucket\": \"arn:aws:s3:::analytics-exports\"}}}}}'.",
  "sources": [
    {
      "title": "Amazon S3 Analytics – Storage Class Analysis",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/analytics-storage-class.html"
    },
    {
      "title": "Exporting Storage Class Analysis Reports in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-analysis-export.html"
    }
  ]
});
