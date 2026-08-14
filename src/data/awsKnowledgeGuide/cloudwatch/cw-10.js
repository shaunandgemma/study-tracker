import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-10',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Alarms',
  status: 'ready',
  plainEnglish: 'A CloudWatch alarm repeatedly evaluates a metric or query and changes state when its rule is met. OK means the rule is not breaching, ALARM means it is breaching, and INSUFFICIENT_DATA means CloudWatch cannot yet determine the result. The period defines each aggregation window; evaluation periods define how many recent windows are considered; datapoints to alarm define how many must breach; the threshold and comparison operator define what “breach” means; and the missing-data setting defines how absent values are treated.',
  whyItMatters: 'Alarms turn telemetry into timely notification or automation. They help engineers respond before an issue grows, recover an EC2 instance, create an incident, invoke Lambda, or scale capacity without continuously watching a dashboard.',
  workplaceExample: 'An API team alarms when at least three of the last five one-minute latency values exceed its threshold. This M-out-of-N design tolerates one short spike but reacts to sustained degradation, and an SNS action pages the on-call subscriber when the state changes to ALARM.',
  examFocus: 'Distinguish an alarm, which evaluates and can act, from a dashboard, which visualizes. Read scenario wording for period, evaluation periods, datapoints to alarm, statistic, threshold, comparison operator, and missing-data treatment. Static thresholds suit known bounds; anomaly detection suits changing normal patterns. EventBridge can react to AWS and application events broadly, while a CloudWatch alarm evaluates telemetry and itself emits state-change events to EventBridge.',
  keyPoints: [
    'Alarm states are OK, ALARM, and INSUFFICIENT_DATA.',
    'Period, statistic, threshold, and comparison operator define each evaluation.',
    'Datapoints to alarm supports M-out-of-N evaluation across evaluation periods.',
    'Missing data can be treated as missing, breaching, not breaching, or ignored.',
    'Most alarm actions run on state transitions rather than continuously.'
  ],
  commonMistake: 'Treating missing telemetry as healthy can hide a stopped publisher, while treating every gap as breaching can create false alerts for sparse metrics. Choose the missing-data policy from the meaning of absence and test it by observing the alarm when publishing stops.',
  example: 'A configuration of period=60 seconds, evaluationPeriods=5, datapointsToAlarm=3, threshold=500, and GreaterThanThreshold means any three of the last five evaluated latency periods must be above 500. Select an explicit missing-data treatment and verify the alarm history shows the expected data points and state transition.',
  sources: [
    { title: 'Using Amazon CloudWatch alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html' },
    { title: 'Configuring how alarms treat missing data', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html' },
    { title: 'Alarm actions', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-actions.html' }
  ]
});
