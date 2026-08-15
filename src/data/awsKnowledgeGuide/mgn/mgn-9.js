import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-9',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Source Servers',
  status: 'ready',
  plainEnglish: 'In AWS MGN, a Source Server is a physical server, virtual machine (VMware, Hyper-V), or cloud instance (Azure, GCP) registered with MGN by installing the AWS Replication Agent. Once registered, MGN tracks the source server\'s hardware metadata (CPU, RAM, disk volumes) and tracks its progress through the migration lifecycle states.',
  whyItMatters: 'Managing source servers individually or in migration waves provides complete visibility into replication progress, replication lag, storage volume mappings, and cutover readiness across enterprise server fleets.',
  workplaceExample: 'A migration team monitors 50 Source Servers in the AWS MGN Console. They track `dataReplicationInfo.dataReplicationState` to ensure all servers achieve `CONTINUOUS` replication status prior to scheduling wave 1 cutover.',
  examFocus: 'SAA-C03 Source Server Lifecycle States:\n1. Not Ready for Testing: Initial sync in progress.\n2. Ready for Testing: Initial sync complete; continuous replication active.\n3. Test in Progress: Test instance currently launched.\n4. Ready for Cutover: Testing validated; marked ready for cutover.\n5. Cutover in Progress: Production cutover instance launched.\n6. Cutover Complete / Finalized: Cutover finalized; staging resources cleaned up.',
  keyPoints: [
    'Represents an individual physical, virtual, or cloud server being migrated to AWS.',
    'Created in MGN automatically when the AWS Replication Agent is installed.',
    'Tracks hardware specs, disk volume mappings, and replication health.',
    'Moves through distinct migration lifecycle states (Syncing -> Ready for Testing -> Cutover Complete).',
    'Can be grouped into logical Migration Waves for batch cutovers.'
  ],
  commonMistake: 'Deleting the AWS Replication Agent software from a Source Server while replication is in progress, corrupting the staging EBS volume state.',
  example: 'Listing Source Servers via AWS CLI:\naws mgn describe-source-servers --query "items[*].{ID:sourceServerID,Hostname:sourceProperties.identificationHints.hostname,State:lifeCycle.state}"',
  sources: [
    { title: 'Source server details', url: 'https://docs.aws.amazon.com/mgn/latest/ug/source-server-details.html' }
  ]
});
