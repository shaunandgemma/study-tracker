import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-rep-1',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Testing and Cutover Process',
  status: 'ready',
  plainEnglish: 'The MGN Testing and Cutover Process is the complete end-to-end operational workflow for executing a safe, minimal-downtime server migration to AWS. The process follows a strict 4-step sequence: 1) Non-Disruptive Testing -> 2) Mark as Ready for Cutover -> 3) Final Production Cutover Launch -> 4) Cutover Finalization & Resource Cleanup.',
  whyItMatters: 'A disciplined testing and cutover process ensures zero data loss, verifies application networking prior to DNS cutover, and provides clear rollback checkpoints if validation fails.',
  workplaceExample: 'During a planned 2-hour cutover window, the lead engineer verifies replication lag (< 2s), stops the on-premises web server service, triggers "Launch Cutover Instances", verifies the EC2 web application, updates Route 53 DNS records, and clicks "Finalize Cutover" once user traffic succeeds.',
  examFocus: 'SAA-C03 4-Step Testing & Cutover Sequence:\n1. Launch Test Instance: Spins up EC2 test server in test VPC; continuous replication remains active.\n2. Mark Ready for Cutover: User validates test instance and changes MGN status to Ready for Cutover.\n3. Launch Cutover Instance: Stop source application writes -> Flush final blocks -> Spin up production EC2 cutover instance.\n4. Finalize Cutover: User accepts production server -> MGN terminates staging Replication Servers and EBS volumes.',
  keyPoints: [
    'Structured 4-step workflow for safe, minimal-downtime server migration.',
    'Test instance launch allows non-disruptive UAT while continuous replication runs.',
    'Source application writes must be stopped prior to final cutover launch.',
    'Finalize Cutover terminates temporary staging Replication Servers and EBS volumes.',
    'Supports rollback by reverting cutover or test states if validation fails.'
  ],
  commonMistake: 'Forgetting to finalize cutover in the MGN Console, leaving temporary staging Replication Servers and EBS volumes running indefinitely and incurring ongoing AWS charges.',
  example: 'Complete Cutover Command Sequence via AWS CLI:\n# 1. Start Cutover Launch:\naws mgn start-cutover --source-server-ids s-1234567890abcdef0\n# 2. Validate Target EC2 -> Finalize Cutover:\naws mgn finalize-cutover --source-server-id s-1234567890abcdef0',
  sources: [
    { title: 'Testing and cutover in AWS MGN', url: 'https://docs.aws.amazon.com/mgn/latest/ug/cutover-process.html' }
  ]
});
