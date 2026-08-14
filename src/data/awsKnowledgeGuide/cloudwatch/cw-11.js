import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-11',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Metric Alarms',
  status: 'ready',
  plainEnglish: 'A metric alarm watches one CloudWatch metric or the result of a metric-math expression and compares its statistic with a rule. The watched time series is identified by namespace, metric name, and dimensions. The alarm aggregates values using a statistic and period, evaluates N recent periods, and enters ALARM when the configured M datapoints breach the threshold according to the comparison operator. Its missing-data setting controls how gaps influence that decision.',
  whyItMatters: 'Metric alarms provide a direct, explainable way to detect failures, saturation, and service-level symptoms. They can notify people or automate remediation while preserving history that shows why the state changed.',
  workplaceExample: 'A database team alarms on high read latency for a particular DB instance, using its exact dimension and a suitable Average statistic. It requires two of three five-minute periods to breach, reducing noise from a single delayed sample while still detecting a persistent issue.',
  examFocus: 'Metric alarm questions test selection of the correct namespace, metric, dimensions, statistic, unit, period, evaluation periods, datapoints to alarm, threshold, comparison operator, and missing-data behavior. A metric name alone is insufficient. Use metric math when a ratio or derived single time series expresses the condition better; use a composite alarm when the condition depends on other alarm states.',
  keyPoints: [
    'A metric alarm evaluates a metric or eligible metric-math expression.',
    'The metric identity must include its namespace, name, and dimensions.',
    'Evaluation periods are the N windows; datapoints to alarm are the M required breaches.',
    'The comparison operator determines which side of the threshold is breaching.',
    'Missing-data treatment must match whether absence is normal, bad, or unknown.'
  ],
  commonMistake: 'Using Sum for a percentage or Average for a request total can produce a misleading alarm. Start from what each data point means, then choose the statistic, period, and unit that preserve that meaning.',
  example: 'For AWS/EC2 CPUUtilization with InstanceId=i-EXAMPLE, Average, period 300, evaluationPeriods 3, datapointsToAlarm 2, threshold 80, and GreaterThanThreshold means two of the last three five-minute averages must exceed 80 percent. Replace i-EXAMPLE, then verify the alarm graph and history against the instance’s metric.',
  sources: [
    { title: 'Create a CloudWatch alarm based on a static threshold', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ConsoleAlarms.html' },
    { title: 'Metrics concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html' },
    { title: 'Configuring how alarms treat missing data', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html' }
  ]
});
