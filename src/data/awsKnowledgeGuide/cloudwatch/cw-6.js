import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-6',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Namespaces',
  status: 'ready',
  plainEnglish: 'A namespace is a container that separates one collection of CloudWatch metrics from another. AWS services normally use names such as AWS/EC2, while an organization might publish custom application metrics to Acme/Checkout. Metrics in different namespaces are isolated so CloudWatch does not accidentally combine statistics from unrelated systems. A complete traditional CloudWatch metric identity uses the namespace together with the metric name and its dimensions.',
  whyItMatters: 'A deliberate namespace scheme keeps monitoring discoverable and prevents an application metric from being confused with an AWS-provided metric of the same name. It also makes dashboards, alarms, automation, and IAM permissions easier to reason about.',
  workplaceExample: 'Two teams both publish a metric named FailedJobs. The data platform uses Company/DataPipeline and the payments team uses Company/Payments, so responders can find and alarm on the correct signal without renaming either business concept.',
  examFocus: 'Expect namespace clues when identifying AWS service metrics or custom metrics. AWS service namespaces commonly start with AWS/, such as AWS/EC2. There is no default namespace for PutMetricData, so a publisher must specify one. Do not assume equal metric names in different namespaces refer to the same time series.',
  keyPoints: [
    'A namespace is an isolation boundary and container for metrics.',
    'AWS service namespaces commonly follow the AWS/service naming pattern.',
    'Custom publishers must supply a namespace; CloudWatch provides no default one.',
    'Namespace, metric name, and dimensions together identify a traditional CloudWatch metric.',
    'A clear custom namespace convention helps teams find and govern application metrics.'
  ],
  commonMistake: 'Using AWS/ as the prefix for a custom namespace can make custom data look service-provided. Choose an organization-owned name, and keep production and application naming consistent without creating unnecessary namespace sprawl.',
  example: 'Company/Checkout could contain a PaymentFailures metric with Service=api. Company/Fulfilment could contain another PaymentFailures metric. The different namespaces keep those series separate even though the metric names match.',
  sources: [
    { title: 'Metrics concepts: Namespaces', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Namespace' },
    { title: 'AWS services that publish CloudWatch metrics', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html' }
  ]
});
