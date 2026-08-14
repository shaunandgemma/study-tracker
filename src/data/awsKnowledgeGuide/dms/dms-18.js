import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-18', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Premigration Assessments', status: 'ready',
  plainEnglish: 'A premigration assessment run checks a proposed DMS task for known compatibility and configuration problems before data movement begins. Applicable checks can inspect source and target engines, table mappings, data types, keys, and task settings, with results stored in Amazon S3.',
  whyItMatters: 'Finding unsupported types, missing keys, or risky settings before the migration window is cheaper and safer than discovering them during production loading.',
  workplaceExample: 'An assessment warns that selected source tables lack primary keys required for reliable CDC handling. The database team resolves the design before starting replication.',
  examFocus: 'Assessment results can pass, warn, skip, or identify issues, but they do not prove application compatibility or replace a migration rehearsal. A new task configured for assessment is started manually after review.',
  keyPoints: ['Assessments use the proposed task configuration.', 'Only applicable individual checks are offered.', 'Results can be stored as detailed JSON in S3.', 'Warnings require informed review rather than automatic dismissal.', 'Schema conversion assessment and task premigration assessment address different layers.'],
  commonMistake: 'Treating a passed premigration assessment as complete end-to-end validation of schema code, business queries, performance, and cutover.',
  example: 'Run all applicable checks, archive results, resolve warnings, rerun the assessment, and then execute a full rehearsal with representative data.',
  sources: [{ title: 'Premigration assessment runs', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.PremigrationAssessmentRuns.html' }, { title: 'Individual premigration assessments', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.AssessmentReport.Assessments.html' }]
});
