export default Object.freeze({
  id: 'aws-cloudwatch-alarm-stuck',
  examId: 'aws-saa-c03',
  order: 22,
  category: 'Amazon CloudWatch',
  title: 'Fix a CloudWatch Alarm That Never Changes State',
  difficulty: 'Intermediate',
  summary: 'Diagnose why an ALB CloudWatch alarm never receives data for the metric it should monitor.',
  scenario: 'The fa-training-alb-high-latency alarm is intended to alert when the Application Load Balancer target response time exceeds two seconds. During a controlled load test, the ALB console shows response times above four seconds for ten minutes, but the alarm remains INSUFFICIENT_DATA and never enters ALARM. The existing threshold and load balancer must remain unchanged.',
  task: 'Use the alarm configuration and metric evidence to identify why CloudWatch is evaluating no matching data, make the smallest safe correction, and verify that the alarm changes state during the same high-latency condition.',
  evidence: [
    {
      id: 'alarm-config',
      title: 'CloudWatch Alarm Configuration',
      kind: 'code',
      content: `Alarm: fa-training-alb-high-latency
State: INSUFFICIENT_DATA

Namespace: AWS/ApplicationELB
Metric: TargetResponseTime
Statistic: Average
Period: 300 seconds
Evaluation periods: 1
Threshold: GreaterThanThreshold 2.0 seconds

Dimension configured on alarm:
LoadBalancer = arn:aws:elasticloadbalancing:eu-west-2:123456789012:loadbalancer/app/fa-training-alb/50dc6c495c0c9188`
    },
    {
      id: 'available-metric',
      title: 'Published Metric Dimension',
      kind: 'code',
      content: `CloudWatch list-metrics result:

Namespace: AWS/ApplicationELB
MetricName: TargetResponseTime
Dimensions:
  LoadBalancer = app/fa-training-alb/50dc6c495c0c9188

Recent datapoints:
12:00 Average: 4.10
12:05 Average: 4.42
12:10 Average: 4.18`
    },
    {
      id: 'change-boundary',
      title: 'Monitoring Requirement',
      kind: 'text',
      content: 'The alarm must continue monitoring Average TargetResponseTime over 300-second periods with a threshold above 2.0 seconds. Do not lower the threshold merely to force an ALARM state. The alarm should monitor the existing fa-training-alb load balancer.'
    }
  ],
  successCriteria: [
    'The learner identifies the incorrect LoadBalancer dimension value as the reason the alarm receives no matching datapoints.',
    'The alarm dimension is corrected to app/fa-training-alb/50dc6c495c0c9188.',
    'The existing namespace, metric, statistic, period, and threshold remain unchanged.',
    'A final high-latency test supplies matching datapoints and the alarm enters ALARM when Average TargetResponseTime exceeds two seconds.'
  ],
  hints: [
    'Compare the exact dimension value configured on the alarm with the dimension value CloudWatch shows on the published metric.',
    'CloudWatch dimensions identify a specific metric time series; a different dimension value means the alarm is looking at a different or nonexistent series.',
    'Use the published LoadBalancer dimension value app/fa-training-alb/50dc6c495c0c9188 instead of the full load balancer ARN.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the alarm remain INSUFFICIENT_DATA during the load test?',
      options: [
        { id: 'wrong-dimension-value', text: 'The alarm uses the full ALB ARN as the LoadBalancer dimension, but the published metric uses the app/fa-training-alb/50dc6c495c0c9188 dimension value.' },
        { id: 'threshold-too-high', text: 'The two-second threshold is too high even though the published values exceed four seconds.' },
        { id: 'wrong-statistic', text: 'CloudWatch cannot alarm on the Average statistic for TargetResponseTime.' },
        { id: 'missing-permission', text: 'The ALB needs AdministratorAccess before it can publish CloudWatch metrics.' }
      ],
      correctOptionId: 'wrong-dimension-value',
      explanation: 'The metric is publishing datapoints under the ALB dimension suffix, while the alarm selects a different value using the full ARN, so its selected time series has no data.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'correct-dimension', text: 'Change the LoadBalancer dimension to app/fa-training-alb/50dc6c495c0c9188 and repeat the high-latency test.' },
        { id: 'lower-threshold', text: 'Lower the threshold to 0.01 seconds without fixing the dimension.' },
        { id: 'treat-missing-breaching', text: 'Treat all missing data as breaching so the alarm enters ALARM even without the intended metric.' },
        { id: 'new-load-balancer', text: 'Replace the healthy load balancer to make CloudWatch create a new metric.' }
      ],
      correctOptionId: 'correct-dimension',
      explanation: 'Correcting the dimension makes the alarm evaluate the existing published TargetResponseTime series while preserving the intended monitoring threshold and period.'
    }
  ],
  solution: {
    rootCause: 'The alarm selects TargetResponseTime with the full ALB ARN as its LoadBalancer dimension, but CloudWatch publishes the ALB metric with the dimension value app/fa-training-alb/50dc6c495c0c9188, so the alarm sees no datapoints and remains INSUFFICIENT_DATA.',
    fix: 'Change the alarm LoadBalancer dimension to app/fa-training-alb/50dc6c495c0c9188, keep the existing Average statistic, 300-second period and two-second threshold, and repeat the load test to verify the alarm enters ALARM.',
    prevention: 'Create alarms from discovered resource metric dimensions or infrastructure-as-code references and include a deployment check that each alarm receives recent datapoints before monitoring is considered active.'
  }
});
