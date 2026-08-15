import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-12',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Test Instances',
  status: 'ready',
  plainEnglish: 'A Test Instance in AWS MGN is an Amazon EC2 instance launched from continuous replication data during the testing phase of the migration lifecycle. Launching a test instance creates a spin-off target server in your target AWS VPC, allowing application teams to perform non-disruptive OS boot validation, application functionality testing, and user acceptance testing while background replication continues uninterrupted.',
  whyItMatters: 'Attempting a production cutover without prior testing is a recipe for migration failure. Launching Test Instances validates drivers, networking, licenses, and performance safely in an isolated test environment before scheduling production cutover.',
  workplaceExample: 'One week prior to planned cutover, a migration team triggers "Launch Test Instances" for 10 application servers. MGN provisions 10 EC2 instances in an isolated test VPC subnet. The team verifies SQL database connections and web UI functionality over 48 hours without stopping live replication.',
  examFocus: 'SAA-C03 Testing Best Practices:\n- Non-Disruptive: Launching a test instance does NOT stop continuous block replication from the source server.\n- Lifecycle Requirement: A source server MUST be tested and marked "Ready for Cutover" before MGN permits production cutover launch.\n- Test Cleanup: When testing is complete, terminate the test instance using MGN "Revert to ready for testing" to clean up EC2 resources.',
  keyPoints: [
    'EC2 instance launched during testing phase to validate OS boot and app functionality.',
    'Operates without stopping background continuous block replication from source servers.',
    'Enables non-disruptive User Acceptance Testing (UAT) and network validation.',
    'Mandatory lifecycle step before marking a source server "Ready for Cutover".',
    'Terminating test instances cleans up EC2/EBS resources without affecting staging data.'
  ],
  commonMistake: 'Skipping test instance launches and proceeding directly to production cutover, resulting in un-bootable OS drivers or network misconfigurations during cutover windows.',
  example: 'Launching Test Instances via AWS CLI:\naws mgn start-test --source-server-ids s-1234567890abcdef0',
  sources: [
    { title: 'Testing source servers', url: 'https://docs.aws.amazon.com/mgn/latest/ug/testing-source-servers.html' }
  ]
});
