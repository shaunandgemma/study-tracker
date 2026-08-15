import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-22',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'OpenSearch vs CloudWatch Logs Insights',
  status: 'ready',
  plainEnglish: 'Amazon OpenSearch Service and CloudWatch Logs Insights are both log analytics solutions on AWS, but they target different operational needs:\n- OpenSearch Service: Managed search engine providing sub-second full-text queries, custom inverted indexes, complex aggregations, multi-tenant security, and interactive OpenSearch Dashboards across massive log datasets.\n- CloudWatch Logs Insights: Serverless, pay-per-query interactive log analytics tool for querying CloudWatch Log Groups directly using a specialized query syntax without provisioning database clusters or managing index mappings.',
  whyItMatters: 'Choosing CloudWatch Logs Insights avoids the cost and effort of provisioning an OpenSearch domain for ad-hoc troubleshooting. Choosing OpenSearch is required when you need real-time dashboards, custom full-text search, or long-term high-speed log analytics.',
  workplaceExample: 'A DevOps engineer uses CloudWatch Logs Insights to quickly run an ad-hoc query filtering error codes during an active incident. Simultaneously, the SOC security team streams all enterprise logs into Amazon OpenSearch Service for live SIEM threat monitoring dashboards.',
  examFocus: 'SAA-C03 Decision Matrix (OpenSearch vs CloudWatch Logs Insights):\n- Infrastructure Management: OpenSearch requires cluster provisioning or Serverless collections; CloudWatch Logs Insights is 100% serverless with zero cluster setup.\n- Pricing Model: OpenSearch charges for provisioned instance/storage hours (or OCUs); CloudWatch Logs Insights charges per GB of log data scanned during queries.\n- Visualization: OpenSearch uses OpenSearch Dashboards (Kibana); CloudWatch Logs Insights uses CloudWatch built-in query results & CloudWatch Dashboards.',
  keyPoints: [
    'OpenSearch is a dedicated search cluster for high-speed indexing, search, and Dashboards.',
    'CloudWatch Logs Insights is a serverless, pay-per-query engine over CloudWatch Log Groups.',
    'Use CloudWatch Logs Insights for ad-hoc troubleshooting without cluster management.',
    'Use OpenSearch Service for live operational dashboards, full-text search, and SIEM analytics.',
    'CloudWatch Logs Insights charges per GB scanned; OpenSearch charges per cluster/storage hour.'
  ],
  commonMistake: 'Provisioning an expensive 10-node OpenSearch domain solely for running rare, weekly ad-hoc log queries that could be handled serverless for pennies using CloudWatch Logs Insights.',
  example: 'CloudWatch Logs Insights Sample Query:\nfields @timestamp, @message\n| filter @message like /Error/\n| sort @timestamp desc\n| limit 20',
  sources: [
    { title: 'Analyzing log data with CloudWatch Logs Insights', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html' }
  ]
});
