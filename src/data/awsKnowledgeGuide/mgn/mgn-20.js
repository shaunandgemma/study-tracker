import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-20',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Monitoring and Migration Status',
  status: 'ready',
  plainEnglish: 'MGN Monitoring and Migration Status features provide real-time operational visibility into data replication health, network bandwidth utilization, replication lag, and lifecycle progress across all migrating servers. Monitoring is managed via the AWS MGN Console, Amazon CloudWatch metrics, AWS CloudTrail audit logs, and Amazon EventBridge event rules.',
  whyItMatters: 'Unmonitored migrations risk cutover failures due to hidden replication stalls, disk errors, or WAN network drops. Monitoring alerts operations teams to stalled replication states long before scheduled cutover windows.',
  workplaceExample: 'An operations engineer configures an Amazon EventBridge rule that detects when any source server replication state changes to `STALLED`. EventBridge triggers an SNS notification to the migration Slack channel for immediate investigation.',
  examFocus: 'SAA-C03 Monitoring Mechanisms:\n- MGN Console Dashboard: Displays Data Replication Status (`Healthy`, `Stalled`, `Paused`), Replication Lag, and Backlog size.\n- CloudWatch Metrics: Track replication lag and bytes replicated.\n- EventBridge Events: Trigger automated alerts on state changes (e.g. `MGN Source Server Data Replication State Change`).\n- CloudTrail Auditing: Logs all MGN API calls (`StartTest`, `StartCutover`, `FinalizeCutover`).',
  keyPoints: [
    'Provides real-time visibility into replication health, lag, and lifecycle state.',
    'Data Replication Statuses: Healthy, Stalled, Paused, Initial Syncing.',
    'Integrates with Amazon CloudWatch for metrics and dashboards.',
    'Integrates with Amazon EventBridge for automated replication alert notifications.',
    'Audits all migration operational API calls in AWS CloudTrail.'
  ],
  commonMistake: 'Failing to set up EventBridge alerts for stalled replication, leading to surprise delays on cutover night when replication lag is hours behind.',
  example: 'EventBridge Rule Pattern for MGN Replication Stalled State:\n{\n  "source": ["aws.mgn"],\n  "detail-type": ["MGN Source Server Data Replication State Change"],\n  "detail": { "state": ["STALLED"] }\n}',
  sources: [
    { title: 'Monitoring AWS Application Migration Service', url: 'https://docs.aws.amazon.com/mgn/latest/ug/monitoring-mgn.html' }
  ]
});
