import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-5',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Metrics',
  status: 'ready',
  plainEnglish: 'A CloudWatch metric is a time-ordered series of numerical data points, such as CPU utilization or request count. It answers “how much?” or “how many?” over time. Logs are detailed event records, while traces follow a request through distributed services; metrics provide the compact trend that is easiest to graph and alarm on. CloudWatch interprets a metric through its namespace, metric name, and exact set of dimensions—not through the name alone. A statistic such as Average or Sum combines data within a period, and the unit describes the measurement, such as Percent, Bytes, or Count.',
  whyItMatters: 'Cloud engineers use metrics to see health and capacity trends without reading every event. Solutions architects use them to create alarms, dashboards, and scaling policies, and to choose signals that reveal customer impact, saturation, errors, or unusual behavior.',
  workplaceExample: 'An operations team graphs an Application Load Balancer request count and target response time beside EC2 CPU utilization. A latency alarm alerts the team even when CPU is normal, helping them discover a slow downstream database rather than adding web servers blindly.',
  examFocus: 'For SAA-C03 scenarios, select metrics and alarms for numerical operational thresholds, Logs or Logs Insights for event detail, and X-Ray traces when the question asks where a request spent time. Remember that many AWS services publish default metrics, while application-specific values require custom metrics or extraction from logs. Dashboards visualize; alarms evaluate and act.',
  keyPoints: [
    'A metric is identified by namespace, metric name, and zero or more dimensions.',
    'A period is the time window over which CloudWatch calculates a statistic.',
    'Common statistics include Average, Sum, Minimum, Maximum, and SampleCount.',
    'Units add meaning and metrics with different units are aggregated separately.',
    'Metrics are Regional and can feed graphs, metric math, alarms, and scaling policies.'
  ],
  commonMistake: 'A beginner may alarm on a metric name without checking its dimensions, statistic, period, and unit. That can monitor the wrong resource or aggregate the wrong values. Verify the complete metric identity and choose a statistic that matches the signal—for example, Sum for requests in a period or Average for utilization.',
  example: 'Suppose AWS/EC2, CPUUtilization, and InstanceId=i-EXAMPLE identify an instance metric. Graphing Average with a 300-second period shows the average percentage for each five-minute window. Replace i-EXAMPLE with your instance ID, then confirm the graph dimensions and unit are Percent; the expected result is one time series for that instance.',
  sources: [
    { title: 'Metrics concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html' },
    { title: 'What is Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' }
  ]
});
