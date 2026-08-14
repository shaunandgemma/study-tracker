import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-14', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Minimal Downtime Migration', status: 'ready',
  plainEnglish: 'A minimal-downtime migration copies or restores the initial dataset while the source remains active, uses CDC to keep the target synchronized, then pauses writes briefly for final replication, validation, and application redirection.',
  whyItMatters: 'Critical applications often cannot tolerate the full duration of a large database copy as an outage.',
  workplaceExample: 'Before cutover, the team lowers DNS TTL, rehearses rollback, confirms CDC lag, pauses writes, waits for zero or acceptable lag, validates critical tables, and redirects the application.',
  examFocus: 'DMS reduces downtime but does not make cutover automatic. Plan network connectivity, schema conversion, replication, validation, application configuration, DNS or endpoints, write freeze, rollback, and post-cutover monitoring.',
  keyPoints: ['Initial data moves before the outage.', 'CDC keeps the target synchronized.', 'Cutover includes a controlled source write freeze.', 'Validation and rollback criteria must be predefined.', 'Application connection changes are outside the data task itself.'],
  commonMistake: 'Declaring success when CDC starts without rehearsing the application cutover and rollback sequence.',
  example: 'Run a timed rehearsal, define maximum acceptable lag, freeze writes, drain changes, validate, switch connections, observe, and retain the source until rollback expires.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Creating tasks for ongoing replication', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html' }]
});
