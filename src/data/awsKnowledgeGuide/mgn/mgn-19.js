import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-19',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Migration Lifecycle',
  status: 'ready',
  plainEnglish: 'The MGN Migration Lifecycle is the defined sequence of operational states a source server progresses through during migration. The lifecycle guarantees structured, safe migration progress: 1) Agent Installation & Initial Sync -> 2) Continuous Replication -> 3) Launch Test Instance -> 4) Mark as Ready for Cutover -> 5) Launch Cutover Instance -> 6) Finalize Cutover.',
  whyItMatters: 'Enforcing a strict migration lifecycle prevents common operational disasters, such as launching production cutover instances on untested servers or forgetting to clean up staging resources after cutover.',
  workplaceExample: 'A migration PM tracks a migration wave of 15 servers. MGN enforces that servers cannot enter "Cutover in Progress" state until each server has successfully launched a Test Instance and been explicitly marked as "Ready for Cutover".',
  examFocus: 'SAA-C03 Lifecycle State Machine:\n- NOT_READY_FOR_TESTING: Initial block sync in progress.\n- READY_FOR_TESTING: Initial sync complete; continuous replication active.\n- TEST_IN_PROGRESS: Test EC2 instance launched and running.\n- READY_FOR_CUTOVER: Test verified; user marked server ready for cutover.\n- CUTOVER_IN_PROGRESS: Production cutover EC2 instance launched.\n- CUTOVER_COMPLETE / FINALIZED: Migration finalized; staging resources terminated.',
  keyPoints: [
    'Enforces a structured lifecycle sequence for safe server rehosting.',
    'Prevents production cutover launch until test instance launch is completed.',
    'States: Not Ready -> Ready for Testing -> Test in Progress -> Ready for Cutover -> Finalized.',
    'Finalize Cutover terminates temporary staging Replication Servers and EBS volumes.',
    'Integrated with AWS Migration Hub for central migration tracking.'
  ],
  commonMistake: 'Attempting to launch a cutover instance before completing test instance launch and marking the server "Ready for Cutover".',
  example: 'Finalizing Cutover via AWS CLI:\naws mgn finalize-cutover --source-server-id s-1234567890abcdef0',
  sources: [
    { title: 'Source server lifecycle', url: 'https://docs.aws.amazon.com/mgn/latest/ug/lifecycle.html' }
  ]
});
