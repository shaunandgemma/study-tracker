import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-20',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Anomaly Detection',
  status: 'ready',
  plainEnglish: 'CloudWatch metric anomaly detection applies a machine-learning model to a metric’s historical values to estimate an expected upper and lower band. The model can account for trends and hourly, daily, or weekly patterns. An anomaly-detection alarm compares the current metric with that changing band instead of one fixed threshold, and can alarm above it, below it, or on either side.',
  whyItMatters: 'An adaptive band is useful when normal behavior changes predictably over time. It can reduce false alerts caused by daily traffic cycles while still exposing unusual deviations that a single static threshold would miss.',
  workplaceExample: 'An online shop normally has far more requests in the daytime than overnight. An anomaly alarm detects an unexpected daytime traffic collapse and an unusual overnight spike without requiring separate hand-tuned thresholds for each hour.',
  examFocus: 'Choose a static threshold when the boundary is absolute, such as a known maximum queue depth or error budget. Choose anomaly detection when “normal” varies with trend or seasonality. The alarm still requires a period, evaluation periods, datapoints to alarm, comparison direction, and missing-data behavior. A model needs representative data; planned deployments or unusual intervals can be excluded from training where appropriate.',
  keyPoints: [
    'Anomaly detection builds an expected-value band from metric history.',
    'The model can account for trends and common seasonal patterns.',
    'Alarms can detect values above, below, or outside both sides of the band.',
    'The band is dynamic, unlike a fixed static threshold.',
    'Ordinary alarm evaluation and missing-data choices still apply.'
  ],
  commonMistake: 'Using anomaly detection for a hard safety or capacity limit can allow the learned band to move when the requirement should not. Use a static alarm for absolute boundaries, and consider a separate anomaly alarm for unexpected behavior.',
  example: 'ANOMALY_DETECTION_BAND(m1, 2) produces upper and lower expected values around metric m1 with a band width parameter of 2. Replace m1 with the intended metric query ID. Graph the band first, confirm it matches representative history, then verify the alarm’s direction and M-out-of-N settings.',
  sources: [
    { title: 'Using CloudWatch anomaly detection', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html' },
    { title: 'Create an alarm based on anomaly detection', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html' }
  ]
});
