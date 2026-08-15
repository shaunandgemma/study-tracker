import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-21',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Integration with Kinesis Data Firehose',
  status: 'ready',
  plainEnglish: 'Amazon Data Firehose (formerly Kinesis Data Firehose) provides a fully managed, serverless delivery stream that buffers, transforms (via AWS Lambda), and ingests streaming data into Amazon OpenSearch Service domains or OpenSearch Serverless collections without writing custom ingestion pipelines.',
  whyItMatters: 'Writing custom application microservices to buffer and bulk-index high-velocity streaming data into OpenSearch requires handling batch retries, network backpressure, and S3 failure backups. Firehose automates serverless stream delivery natively.',
  workplaceExample: 'An IoT telemetry platform streams 50,000 sensor readings per second into Amazon Data Firehose. Firehose buffers records for 60 seconds, converts data to JSON, and bulk-indexes documents into OpenSearch while saving failed records to an S3 backup bucket.',
  examFocus: 'SAA-C03 Firehose Delivery Stream Destination:\n- Target Destination: Native Amazon OpenSearch Service domain or OpenSearch Serverless collection destination.\n- Buffer Hints: Configure buffer size (e.g. 5 MB) and buffer interval (e.g. 60 seconds) before executing bulk POST indexing.\n- Failure Handling: Automatically retries failed indexing calls; routes permanently failed records to an Amazon S3 error bucket.\n- IAM Role: Firehose IAM service role requires `es:ESHttpPost` and `es:ESHttpPut` permissions.',
  keyPoints: [
    'Fully managed serverless log and streaming data ingestion into OpenSearch.',
    'Buffers streaming records by volume (1-100 MB) or time interval (60-900 seconds).',
    'Supports inline JSON data transformation using AWS Lambda functions.',
    'Provides automated S3 fallback backup for un-indexable or failed records.',
    'Eliminates custom stream processing code and client-side bulk indexing logic.'
  ],
  commonMistake: 'Setting Firehose buffer interval too low (e.g. 1 second), causing thousands of small single-document HTTP indexing calls to overwhelm OpenSearch data nodes.',
  example: 'Creating a Firehose Delivery Stream to OpenSearch via AWS CLI:\naws firehose create-delivery-stream --delivery-stream-name logs-to-opensearch --delivery-stream-type DirectPut --opensearch-destination-configuration DomainARN=arn:aws:es:us-east-1:<ACCOUNT_ID>:domain/prod-domain,RoleARN=arn:aws:iam::<ACCOUNT_ID>:role/FirehoseToOpenSearchRole,IndexName=app-logs',
  sources: [
    { title: 'Amazon Data Firehose destination for OpenSearch', url: 'https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html#create-destination-opensearch' }
  ]
});
