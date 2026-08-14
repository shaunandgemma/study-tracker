import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-9',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Custom Metrics',
  status: 'ready',
  plainEnglish: 'A custom metric is numerical telemetry that your application, script, CloudWatch agent, or another collector publishes to CloudWatch. It fills gaps left by service-provided metrics—for example, active shopping carts or free memory inside a server. Standard-resolution custom metrics store data with one-minute granularity. A high-resolution custom metric uses one-second storage resolution and supports sub-minute retrieval periods; it can expose short spikes but can increase ingestion and alarm charges.',
  whyItMatters: 'Custom metrics let engineers monitor what matters to the application or business instead of relying only on infrastructure signals. They can drive dashboards, alarms, and scaling decisions based on queue backlog per worker, failed checkouts, or another meaningful value.',
  workplaceExample: 'A worker service publishes JobsReady and WorkersActive, then uses metric math to calculate backlog per worker. An Auto Scaling policy responds to the workload signal more accurately than scaling on CPU alone.',
  examFocus: 'Choose custom metrics when the required value is not published by an AWS service. Standard resolution is appropriate for ordinary minute-level monitoring; use high resolution only when a scenario requires observing or alarming on sub-minute changes. A custom metric still needs a namespace, metric name, suitable dimensions, timestamp, and optional unit. It cannot be deleted manually and eventually expires when data is no longer published.',
  keyPoints: [
    'Custom metrics represent application, business, or guest-system measurements.',
    'Publishers choose the namespace, metric name, dimensions, value, and optional unit.',
    'Standard-resolution custom metrics have one-minute granularity.',
    'High-resolution custom metrics have one-second granularity and support sub-minute periods.',
    'Every unique dimension combination is a separate custom metric.'
  ],
  commonMistake: 'Publishing every request or user as a dimension creates high cardinality and cost. Aggregate numerical behavior into stable dimensions, and keep per-request detail in logs or traces. Also use consistent units so data is not split into separate streams.',
  example: 'Publish CheckoutFailures=1 to a custom App/Checkout namespace whenever a checkout fails, using a stable Service dimension. The publisher needs permission to call PutMetricData. Verify the result by locating the exact namespace, metric name, and dimensions in CloudWatch Metrics and checking for a recent Count data point.',
  sources: [
    { title: 'Publish custom metrics', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html' },
    { title: 'Metrics concepts: Resolution and retention', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html' }
  ]
});
