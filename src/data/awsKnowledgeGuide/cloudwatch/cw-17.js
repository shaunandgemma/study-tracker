import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-17',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Metric Filters',
  status: 'ready',
  plainEnglish: 'A CloudWatch Logs metric filter attaches to a log group, checks each ingested event against a filter pattern, and publishes a numerical value to a CloudWatch metric when the pattern matches. The resulting metric has a namespace, metric name, and optional dimensions, so it can feed graphs and metric alarms. Logs Insights is different: it queries stored events interactively and does not by itself create a continuing alarmable metric.',
  whyItMatters: 'Metric filters convert important text or structured log signals—such as error codes or rejected logins—into low-volume numerical telemetry. Teams can then alert on patterns even when the application does not publish a native metric.',
  workplaceExample: 'A service writes structured error events. A metric filter counts events where level is ERROR, publishes App/Orders ErrorCount, and a metric alarm notifies the team when several one-minute periods breach the expected count.',
  examFocus: 'Select a metric filter when log matches must become a CloudWatch metric for dashboards or alarms. Select Logs Insights for ad hoc exploration, and a subscription filter for real-time delivery to another service. Metric filters are supported for Standard-class log groups. A default value such as zero can avoid spotty metrics when logs arrive but none match; it cannot be specified when the filter publishes dimensions.',
  keyPoints: [
    'Metric filters process events as they are ingested into a log group.',
    'A filter pattern determines which events publish metric values.',
    'The output is a custom CloudWatch metric with a namespace and name.',
    'A zero default can represent no matches when events were ingested.',
    'High-cardinality dimensions can create many custom metrics and unexpected cost.'
  ],
  commonMistake: 'Using request IDs or IP addresses as metric-filter dimensions creates a separate metric for many values. Use stable dimensions such as service or error category, and retain request-level identifiers in the log events for Logs Insights.',
  example: 'A filter pattern matching the term ERROR can publish value 1 to App/Orders ErrorCount. Choose the production log group and replace the namespace and name with your naming standard. Send a safe test event, then verify the metric appears with a recent Count data point before attaching an alarm.',
  sources: [
    { title: 'Creating metrics from log events using filters', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html' },
    { title: 'Filter pattern syntax for metric filters', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntaxForMetricFilters.html' },
    { title: 'CloudWatch Logs concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html' }
  ]
});
