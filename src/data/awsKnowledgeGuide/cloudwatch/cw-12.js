import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-12',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Composite Alarms',
  status: 'ready',
  plainEnglish: 'A composite alarm evaluates a Boolean rule built from the states of other CloudWatch alarms. Boolean means a true-or-false expression using AND, OR, and NOT. Unlike an individual metric alarm, it does not directly compare metric values with a threshold. It moves between OK, ALARM, and INSUFFICIENT_DATA according to its rule and the referenced alarms.',
  whyItMatters: 'Composite alarms reduce alert noise and express operational context. Engineers can keep detailed individual alarms for diagnosis while notifying responders only when a combination indicates real customer impact or when a primary alarm is not suppressed by maintenance.',
  workplaceExample: 'A service has separate alarms for high latency and high error rate. A composite alarm pages the team only when both are in ALARM, while the individual alarms remain visible on the dashboard for investigation.',
  examFocus: 'Choose a composite alarm when a scenario asks to combine existing alarm states or reduce duplicate notifications. Choose an individual metric alarm when the requirement is to evaluate a metric threshold, metric math result, or anomaly band. Underlying alarms perform the period, threshold, evaluation-period, datapoints-to-alarm, and missing-data evaluation; the composite applies logic to their resulting states.',
  keyPoints: [
    'Composite alarms evaluate other alarm states rather than raw metric values.',
    'Alarm rules can use AND, OR, NOT, and explicit state tests.',
    'They can reduce notification noise while retaining granular underlying alarms.',
    'Referenced alarms and the composite must meet AWS placement requirements described in the alarm guide.',
    'Actions should normally be attached to the composite when it is the paging decision.'
  ],
  commonMistake: 'Attaching the same SNS paging action to every underlying alarm and the composite defeats noise reduction. Keep diagnostic alarms, but route the main notification through the composite unless separate alerts are intentionally required.',
  example: 'ALARM("HighLatency") AND ALARM("HighErrorRate") becomes true only while both named alarms are in ALARM. Replace the names with existing alarms, verify each underlying alarm first, then test that the composite history changes only when the complete rule is true.',
  sources: [
    { title: 'Composite alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-combining.html' },
    { title: 'Using Amazon CloudWatch alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html' }
  ]
});
