import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-10",
  "title": "Map States",
  "plainEnglish": "A Map State (`\"Type\": \"Map\"`) in AWS Step Functions allows you to iterate over a dynamic array of items, running an identical sub-workflow (called an ItemProcessor) for each item in the dataset. Step Functions provides two modes of Map states: (1) Inline Map Mode (which processes up to 40 concurrent iterations in memory from an input payload <= 256 KB), and (2) Distributed Map Mode (which can process massive datasets containing millions of items directly from Amazon S3, launching up to 10,000 parallel child workflow executions).",
  "whyItMatters": "Processing large arrays of data (such as processing 10,000 PDF invoices, resizing 50,000 images, or transforming 10 million CSV rows) using traditional monolithic code or batch loops leads to timeout errors, memory exhaustion, and complex error recovery. Map states provide serverless distributed parallel processing with built-in concurrency controls, failure thresholds, and automatic result aggregation.",
  "workplaceExample": "A retail analytics platform processes daily point-of-sale transactions stored in Amazon S3 as a 10 GB CSV file with 500,000 rows. The team configures a Distributed Map state: Step Functions streams the CSV file directly from S3, splits the data into batches of 100 rows, and executes 2,000 parallel AWS Lambda functions concurrently with `MaxConcurrency: 500`. The entire 500,000-row dataset is validated and written to Amazon Redshift in under 3 minutes.",
  "examFocus": "Compare Inline Map vs Distributed Map modes on the exam: (1) Inline Map: `\"Mode\": \"INLINE\"`; processes in-memory JSON arrays up to 256 KB payload limit; maximum 40 concurrent iterations; outputs an array of results. (2) Distributed Map: `\"Mode\": \"DISTRIBUTED\"`; reads input directly from Amazon S3 (CSV, JSON, S3 Inventory, Parquet); launches up to 10,000 parallel child executions; exports results to S3. (3) Concurrency Control: Set `MaxConcurrency` to prevent overwhelming downstream databases. (4) Tolerated Failures: Configure `ToleratedFailurePercentage` or `ToleratedFailureCount` to allow the job to succeed even if a few records fail.",
  "keyPoints": [
    "Iterates over dynamic arrays and executes an ItemProcessor sub-workflow for each item.",
    "Inline Map: Processes up to 40 concurrent iterations in memory for small JSON arrays.",
    "Distributed Map: High-scale parallel processing launching up to 10,000 concurrent child executions.",
    "Distributed Map streams input directly from Amazon S3 datasets without 256 KB payload limits.",
    "Supports concurrency control (`MaxConcurrency`) to prevent overwhelming downstream services.",
    "Features `ToleratedFailurePercentage` to manage partial failures in large-scale batch processing."
  ],
  "commonMistake": "Passing a 50 MB CSV file directly into an Inline Map state via workflow execution input. Inline Map is bound by the 256 KB state input limit; large datasets must use Distributed Map with an Amazon S3 ItemReader.",
  "example": "Define a Distributed Map state processing an S3 CSV dataset in Amazon States Language: {\"Type\": \"Map\", \"ItemProcessor\": {\"ProcessorConfig\": {\"Mode\": \"DISTRIBUTED\", \"ExecutionType\": \"EXPRESS\"}, \"StartAt\": \"ProcessItem\", \"States\": {\"ProcessItem\": {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:TransformRow\", \"End\": true}}}, \"ItemReader\": {\"Resource\": \"arn:aws:states:::s3:getObject\", \"ReaderConfig\": {\"InputType\": \"CSV\"}, \"Parameters\": {\"Bucket\": \"my-data-lake\", \"Key\": \"daily-transactions.csv\"}}, \"MaxConcurrency\": 1000, \"End\": true}.",
  "sources": [
    {
      "title": "Map State in Amazon States Language",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html"
    },
    {
      "title": "Using Distributed Map to Process Large-Scale Datasets",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-asl-use-map-state-distributed.html"
    }
  ]
});
