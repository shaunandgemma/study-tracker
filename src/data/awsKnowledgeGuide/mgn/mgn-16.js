import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-16',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Continuous Replication before Cutover',
  status: 'ready',
  plainEnglish: 'Continuous Replication before Cutover is the operational state in AWS MGN where initial disk block synchronization is complete, and MGN actively streams delta block changes from source servers to staging EBS volumes in real time. Maintaining continuous replication ensures that staging disk images remain in near-real-time synchronization with live production source servers.',
  whyItMatters: 'If replication is stopped days before cutover, the final cutover window will require hours of resynchronization. Continuous replication keeps data lag down to seconds, allowing production cutover to complete in minutes.',
  workplaceExample: 'A financial institution maintains continuous replication on 30 core transaction servers for 3 weeks prior to cutover. On cutover night, the replication lag is less than 2 seconds, allowing the team to stop source services, flush final blocks, and launch target EC2 instances seamlessly.',
  examFocus: 'SAA-C03 Continuous Replication Health & Monitoring:\n- Status Indicator: `Data Replication Status = Healthy` and `State = Continuous`.\n- Lag Monitoring: Track `Replication Lag` metric in MGN Console (should be seconds/minutes).\n- Resiliency: Handles temporary WAN latency or network drops gracefully without full re-sync.\n- Bandwidth Throttling: Optionally configure bandwidth limits (e.g. limit to 100 Mbps) to protect corporate network traffic.',
  keyPoints: [
    'Maintains real-time background disk block synchronization between source and staging.',
    'Keeps replication lag down to seconds/minutes prior to final cutover.',
    'Allows live production source servers to continue processing business transactions.',
    'Supports network bandwidth throttling to prevent corporate WAN saturation.',
    'Essential prerequisite for achieving minimal-downtime cutover windows.'
  ],
  commonMistake: 'Ignoring high replication lag indicators prior to cutover, leading to unexpectedly long data synchronization delays during the maintenance window.',
  example: 'Configuring Replication Bandwidth Throttling via AWS CLI:\naws mgn update-replication-configuration --source-server-id s-1234567890abcdef0 --bandwidth-throttling 100',
  sources: [
    { title: 'Monitoring data replication', url: 'https://docs.aws.amazon.com/mgn/latest/ug/monitoring-mgn.html' }
  ]
});
