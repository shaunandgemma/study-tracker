import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-7',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Dimensions',
  status: 'ready',
  plainEnglish: 'A dimension is a name/value pair that identifies a characteristic of a metric, such as InstanceId=i-EXAMPLE. Dimensions are part of a traditional CloudWatch metric’s identity. The same namespace and metric name with a different dimension value is a different time series. When retrieving a custom metric, use the exact dimension combination that was published; CloudWatch does not automatically aggregate custom metrics across arbitrary dimensions.',
  whyItMatters: 'Dimensions let engineers separate a fleet-wide concept into useful resource, service, or environment views. Good dimensions enable precise alarms and troubleshooting; poor choices can create a huge number of custom time series and unnecessary cost.',
  workplaceExample: 'A checkout service publishes RequestLatency with Environment=prod and Operation=SubmitOrder. The team can compare operations and keep test traffic out of production alarms. It avoids RequestId as a dimension because every request would create a separate metric.',
  examFocus: 'When a scenario needs per-instance or per-resource monitoring, look for the correct dimension such as InstanceId. Remember that a metric name alone is not globally unique. For AWS service metrics, aggregation behavior varies by service; for custom metrics, retrieve the dimension combinations that were actually published.',
  keyPoints: [
    'A dimension is a name/value pair and is part of metric identity.',
    'Each unique dimension combination creates a separate metric time series.',
    'Queries for custom metrics must use a dimension combination that was published.',
    'AWS service metrics attach service-specific dimensions such as InstanceId.',
    'High-cardinality values such as request IDs are usually poor custom dimensions.'
  ],
  commonMistake: 'Publishing user IDs, IP addresses, or request IDs as dimensions creates many distinct custom metrics. Keep high-cardinality detail in logs or traces and use a small, stable set of dimensions for metrics.',
  example: 'App/Orders + FailedRequests + Service=checkout is different from App/Orders + FailedRequests + Service=inventory. To verify an alarm, open its metric details and confirm the namespace, metric name, and every dimension value match the intended publisher.',
  sources: [
    { title: 'Metrics concepts: Dimensions', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension' },
    { title: 'Publishing dimensions with metrics from log events', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntaxForMetricFilters.html' }
  ]
});
