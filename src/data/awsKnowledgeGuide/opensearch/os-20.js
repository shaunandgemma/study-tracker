import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-20',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'Integration with CloudWatch Logs',
  status: 'ready',
  plainEnglish: 'Integration with CloudWatch Logs allows streaming log events directly from AWS CloudWatch Log Groups into an Amazon OpenSearch Service domain in real time. This integration uses a CloudWatch Subscription Filter backed by an AWS Lambda function to parse, format, and index log events into OpenSearch time-series indices automatically.',
  whyItMatters: 'CloudWatch Logs stores log events durably, but complex full-text searches across millions of log lines can be slow. Streaming logs to OpenSearch enables sub-second full-text filtering and interactive OpenSearch Dashboards visualization.',
  workplaceExample: 'An enterprise configures a CloudWatch Subscription Filter on `/aws/lambda/order-processor` log group. All Lambda execution logs stream automatically into OpenSearch, where engineers monitor error patterns on live dashboards.',
  examFocus: 'SAA-C03 Streaming Ingestion Architecture:\n- Mechanics: CloudWatch Logs Subscription Filter -> AWS Lambda (auto-created loader function) -> OpenSearch Domain Endpoint.\n- IAM Permissions: Lambda function execution role requires `es:ESHttpPost` permissions on the target domain.\n- VPC Endpoint Routing: If OpenSearch is in a VPC, the Lambda function must be configured with VPC subnet and security group access.',
  keyPoints: [
    'Streams log events from CloudWatch Log Groups into OpenSearch in real time.',
    'Uses CloudWatch Subscription Filters and AWS Lambda loader functions.',
    'Parses unstructured text logs into structured JSON documents for indexing.',
    'Requires IAM `es:ESHttpPost` permissions on the Lambda execution role.',
    'Enables live visual log analytics on OpenSearch Dashboards.'
  ],
  commonMistake: 'Failing to configure VPC subnet access on the CloudWatch Lambda streaming function when the target OpenSearch domain is deployed inside a private VPC.',
  example: 'Creating a CloudWatch Subscription Filter to OpenSearch via AWS CLI:\naws logs put-subscription-filter --log-group-name "/aws/eks/prod-cluster" --filter-name "OpenSearchStreaming" --filter-pattern "[timestamp, id, message]" --destination-arn arn:aws:lambda:us-east-1:<ACCOUNT_ID>:function:LogsToOpenSearch_domain',
  sources: [
    { title: 'Streaming CloudWatch Logs data to Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html' }
  ]
});
