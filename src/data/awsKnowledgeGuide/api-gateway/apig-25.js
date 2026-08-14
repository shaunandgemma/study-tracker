import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-25',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'CloudWatch Logging and Metrics',
  status: 'ready',
  plainEnglish: 'API Gateway sends operational metrics to CloudWatch and can write request logs to CloudWatch Logs. Metrics are numerical time series such as Count, client and server errors, Latency, and IntegrationLatency. Access logs are one structured record per request using selected context fields. REST APIs can also use execution logging, which records API Gateway processing details at configured levels. Logs give request detail; metrics show trends and support alarms.',
  whyItMatters: 'Together, metrics and logs reveal whether failures originate with clients, API Gateway, authorization, or the backend. They support dashboards, alarms, incident investigation, capacity planning, and request correlation.',
  workplaceExample: 'An alarm reports rising 5XX errors. The team compares Latency with IntegrationLatency, then searches JSON access logs by request ID and status. High IntegrationLatency and backend error detail point to the service rather than API Gateway routing.',
  examFocus: 'Use CloudWatch metrics and alarms for numeric health signals, and access or execution logs for request evidence. Latency covers the full API Gateway interval, while IntegrationLatency measures the backend portion. Detailed method or route metrics can add granularity and charges. REST logging requires API Gateway permission to write logs; HTTP APIs support access logging to a selected log group. Avoid production data tracing when it could record sensitive payloads.',
  keyPoints: [
    'Count and error metrics summarize API traffic and failures.',
    'Latency includes API Gateway overhead and backend integration time.',
    'IntegrationLatency isolates the backend integration interval.',
    'Access logs should include request IDs, route or method, status, and timing context.',
    'REST execution logging and access logging serve different troubleshooting purposes.',
    'Log groups need deliberate retention and least-privilege write permissions.'
  ],
  commonMistake: 'Enabling verbose payload tracing in production can expose sensitive request or response data. Prefer structured access logs and ERROR or INFO execution logging, select only necessary fields, use retention and access controls, and temporarily increase diagnostic detail only through an approved process.',
  example: 'Create a JSON access-log format containing requestId, extendedRequestId, route or resource path, status, response length, and integration error context. Send one successful and one safe failing request; verify two searchable records, then compare their timestamps with Count and error metrics on a CloudWatch dashboard.',
  sources: [
    { title: 'Set up CloudWatch logging for REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html' },
    { title: 'Monitor REST API execution with CloudWatch metrics', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/monitoring-cloudwatch.html' },
    { title: 'Monitor CloudWatch metrics for HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-metrics.html' }
  ]
});
