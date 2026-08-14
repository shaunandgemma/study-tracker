import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-11', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'Full Load Migration', status: 'ready',
  plainEnglish: 'A full-load task copies the existing rows that are present when the migration runs. DMS reads selected source tables and loads their contents into prepared target tables, often processing several tables in parallel.',
  whyItMatters: 'Full load establishes the target dataset and suits migrations where the source can be stopped or where ongoing changes are handled separately.',
  workplaceExample: 'A reporting database is taken offline for a maintenance window, copied to its new target with a full-load task, validated, and reopened against the target.',
  examFocus: 'Full load alone does not continue applying source changes after the copy. For an active production source and short downtime, use full load plus CDC or combine a native bulk load with CDC only.',
  keyPoints: ['Full load copies existing selected data.', 'Parallel table loading affects throughput and resource use.', 'Target table preparation mode must be chosen safely.', 'LOB settings can affect speed and completeness.', 'Validation should follow the load.'],
  commonMistake: 'Leaving applications writing to the source during a full-load-only migration and expecting those later changes to appear at the target.',
  example: 'Stop writes, capture a recovery point, run full load, validate counts and checksums, then switch the application only after acceptance.',
  sources: [{ title: 'Components of AWS DMS', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.Components.html' }, { title: 'Creating an AWS DMS task', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.Creating.html' }]
});
