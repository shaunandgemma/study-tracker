import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-17', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Migration Tasks', status: 'ready',
  plainEnglish: 'A replication task connects one source endpoint to one target endpoint using replication compute. Its settings define migration type, table selection and transformation rules, target table preparation, LOB handling, validation, error behaviour, control tables, and logging.',
  whyItMatters: 'The task is the executable migration plan; unsafe mappings or preparation settings can omit data, rename objects incorrectly, or overwrite target tables.',
  workplaceExample: 'A task selects only the application schemas, renames a legacy schema at the target, enables validation, and logs warnings and errors to CloudWatch.',
  examFocus: 'Choose full load, CDC only, or full load plus CDC according to the starting dataset and downtime requirement. Table mappings are JSON rules for selection and transformation. Test settings against a representative copy before production.',
  keyPoints: ['A task references source, target, and replication compute.', 'Migration type controls initial and ongoing movement.', 'Table mappings select and transform objects.', 'Task settings control loading and error behaviour.', 'Task statistics and logs reveal progress and failures.'],
  commonMistake: 'Using a wildcard selection rule without checking that audit, temporary, or unsupported tables are also included.',
  example: 'Create a small assessment task, confirm selected schemas and target preparation, run it, review table statistics, then approve the production task definition.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Creating an AWS DMS task', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.Creating.html' }]
});
