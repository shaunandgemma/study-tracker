import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-22', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Monitoring with CloudWatch', status: 'ready',
  plainEnglish: 'DMS publishes replication-instance and task metrics to CloudWatch and can send detailed task logs to CloudWatch Logs. Operators combine task status, table statistics, events, logs, and metrics such as CDC source and target latency to understand migration health.',
  whyItMatters: 'A migration can appear running while falling further behind, exhausting storage, or repeatedly failing particular tables. Monitoring reveals these conditions before cutover.',
  workplaceExample: 'An alarm detects rising CDCLatencyTarget while source latency stays low. The team identifies slow target writes, adds capacity and tunes indexes before the migration window.',
  examFocus: 'CDCLatencySource indicates delay reading from the source; CDCLatencyTarget includes delay applying to the target. Monitor CPU, freeable memory, storage, IOPS, network throughput, task errors, and table validation. CloudTrail separately audits DMS API activity.',
  keyPoints: ['CloudWatch metrics show replication performance.', 'CloudWatch Logs stores configured task diagnostics.', 'Task and table statistics show progress and errors.', 'DMS event subscriptions can notify operational changes.', 'High-detail logging increases storage use.'],
  commonMistake: 'Watching only whether the task says Running and ignoring a steadily increasing target latency before cutover.',
  example: 'Create alarms for latency, memory and storage thresholds, retain task logs for the migration period, and review failed-table statistics daily.',
  sources: [{ title: 'Monitoring AWS DMS tasks', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Monitoring.html' }, { title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }]
});
