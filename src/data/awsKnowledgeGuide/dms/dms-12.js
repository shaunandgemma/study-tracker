import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-12', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Change Data Capture - CDC', status: 'ready',
  plainEnglish: 'Change data capture reads committed changes from a supported source database transaction log and applies them to the target. CDC only starts from a chosen position or time and assumes the target already contains the required starting dataset and schema.',
  whyItMatters: 'CDC keeps a migration target close to the live source so final cutover needs a much shorter write outage.',
  workplaceExample: 'A native backup restores a large Oracle database quickly, then DMS CDC applies changes made after the backup position until the target catches up.',
  examFocus: 'CDC is ongoing rather than guaranteed real-time replication. Each engine has logging, retention, privilege, and start-position requirements. Monitor both source and target latency and ensure source logs remain available long enough.',
  keyPoints: ['CDC reads engine transaction logs through native mechanisms.', 'The source must retain required change records.', 'CDC only does not create the initial dataset.', 'Source latency and target latency diagnose different bottlenecks.', 'Application cutover still requires coordination and validation.'],
  commonMistake: 'Starting CDC at an arbitrary current time that does not match the snapshot or native bulk load used to seed the target.',
  example: 'Record the exact backup log position, restore the target, start CDC from that point, and wait until target latency is acceptable before cutover.',
  sources: [{ title: 'Creating tasks for ongoing replication', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html' }, { title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }]
});
