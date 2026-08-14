import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-16',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Logs Insights',
  status: 'ready',
  plainEnglish: 'CloudWatch Logs Insights is an interactive query tool for finding and analyzing events already stored in CloudWatch Logs. A query selects fields, filters events, calculates statistics, sorts results, or limits output over chosen log groups and a time range. It is for investigation and ad hoc analysis. A metric filter instead examines incoming events and publishes numerical metric data that can be graphed or alarmed on continuously.',
  whyItMatters: 'Logs Insights helps an engineer move from an alert to evidence quickly: find error messages, group them by type, calculate counts over time, or locate a request ID without downloading every log file.',
  workplaceExample: 'After a latency alarm, an engineer queries the API log group for slow requests, groups results by route, and discovers one endpoint dominates the long-duration events. The engineer narrows the time range to the incident to reduce scanned data and noise.',
  examFocus: 'Choose Logs Insights when a scenario asks to search, aggregate, or troubleshoot stored logs interactively. Choose a metric filter plus alarm for ongoing threshold-based alerting, or a subscription filter when logs must stream to Lambda, Kinesis Data Streams, Firehose, or OpenSearch Service. Query permissions should allow the needed Logs Insights start/get operations without granting broad log administration.',
  keyPoints: [
    'Logs Insights queries selected log groups over a selected time range.',
    'Queries can filter, sort, limit, parse, and calculate statistics.',
    'Narrow time ranges and relevant groups reduce unnecessary data scanning.',
    'A query does not replace an ingestion-time metric filter and alarm.',
    'Structured logs make fields and aggregations easier to use.'
  ],
  commonMistake: 'Running an unbounded query across every log group wastes time and can increase query cost. Select only relevant groups and the smallest useful time range, then refine filters before expanding the search.',
  example: `This Logs Insights QL query shows the newest error messages:\n\nfields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 20\n\nSelect the application log group and incident time range before running it. Replace ERROR if your logs use another marker. Expect at most 20 matching events; verify by opening a result and confirming its timestamp and source stream.`,
  sources: [
    { title: 'Analyze log data with CloudWatch Logs Insights', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html' },
    { title: 'CloudWatch Logs Insights query language', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_LogsInsights.html' },
    { title: 'Creating metrics from log events using filters', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html' }
  ]
});
